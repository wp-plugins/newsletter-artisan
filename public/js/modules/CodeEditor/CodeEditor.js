var CodeMirror = require('../../libs/CodeMirror/CodeMirror.js');
var overlay = require('../../libs/CodeMirror/overlay');
var xml = require('../../libs/CodeMirror/xml');
var Events = require('../Events/Events');
var E = require('../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../libs/Mustache/Mustache');
var Template = require('../Templates/CodeEditor.html');
var $ = jQuery;
var ev = new Events();
var util = require('../Util/Util');

var CodeEditor = Backbone.View.extend({
	el: '#CodeEdit',
	editor: {},
	currentlyEditing: "",
	currentPreviewMode: "hidden",
	modelInFactory: {},

	template: function() {
		if (this.model) {
			return Mustache.to_html(Template, this.model.toJSON());
		} else {
			throw new Error('model was not defined');
		}
	},

	initialize: function() {
		var isTest = process.istest || false;

		this.render();

		//break the test
		if(isTest) return;
		this.configure();
		this.setEvents();
	},

	codeTextChanged: function() {
		//this init preview

		//stuff that has to change on text change
		var htmlSnippet = this.model.toJSON();
		this.updatePreview( htmlSnippet );
	},

	/* preview element */
	updatePreview: function(htmlSnippet) {
		$(this.el).find('.snippetHTML').html(htmlSnippet.currentCode);
	},

	changePreviewMode: function() {
		var editWrap = $(this.el).find('.flex'),
			modes = AppConfig.Application.CodeEditor.previewModes;

		switch (this.currentPreviewMode) {
			case "hidden":
				this.currentPreviewMode = modes.default;
				ev.fire(E.EVENTS.CODE_EDITOR.PREVIEW.MODE.DEFAULT);
				break;
			case "open":
				this.currentPreviewMode = modes.hidden;
				ev.fire(E.EVENTS.CODE_EDITOR.PREVIEW.MODE.HIDDEN);
				break;
			default:
				this.currentPreviewMode = modes.open;
				ev.fire(E.EVENTS.CODE_EDITOR.PREVIEW.MODE.OPEN);
		}

		$(editWrap).attr('data-mode', this.currentPreviewMode);
	},

	render: function() {
       this.$el.html( this.template() );
       return this;
	},

	events: {
		'click .close': 'closeEditor',
		'click .add': 'fireSave'
	},

	setEvents: function() {
		var that = this;

		//preview
		$(this.el).find('.settings .preview').on('click', function(){
			//show full preview
			that.changePreviewMode();
		});

		//
		$(this.el).find('.settings .help').on('click', function() {
			//Backbone.App.Views.infoBoxView.display('hello info');
			ev.fire(E.EVENTS.CODE_EDITOR.HELP.OPEN);

		});

		$(this.el).find('.settings .check').on('click', function() {
			that.reviewSnippet();
		});
	},

	injectCode: function(template) {
		this.editor.doc.setValue(template);
	},

	//this will only apply for HTML nodes code edit
	injectModel: function(model) {
		this.modelInFactory = model;
		//get code from node
		var code = this.modelInFactory.get('node_code');

		this.injectCode(code);
	},

	resetEditor: function() {
		this.injectCode(" ");
	},

	refresh: function() {
		this.editor.refresh();
	},

	reviewSnippet: function() {
		var code = this.getCurrentCode();

		Backbone.App.Views.infoBoxView.display('The code syntax check is not active yet.');
	},

	getCurrentCode: function() {
		return this.editor.doc.getValue();
	},

	configure: function() {
		var mustacheOverlay = {
			token: function(stream, state) {
			  var ch;
			  if (stream.match("{{")) {
			    while ((ch = stream.next()) != null)
			      if (ch == "}" && stream.next() == "}") {
			        stream.eat("}");
			        return "mustache";
			      }
			  }
			  while (stream.next() != null && !stream.match("{{", false)) {}
			  return null;
			}
		};

		CodeMirror.defineMode("mustache", function(config, parserConfig) {
		  return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), mustacheOverlay);
		});
		//editor is available for further manipulation
		this.editor = CodeMirror.fromTextArea(
			document.getElementById("code"), 
			AppConfig.Application.CodeEditor.init
		);

		this.fireLoad();
	},
	closeEditor: function() {
		if ($(this.el).hasClass('active') ) {

			util.deactivateFancy('zoomOut', $(this.el));
		}
	},
	openEditor: function() {
		if (!$(this.el).hasClass('active') ) {
			util.activateFancy('zoomIn', $(this.el));

			this.refresh();
		}
	},

	updateHTMLNodeModel: function() {
		var currentCode = this.editor.doc.getValue();
		return this.modelInFactory.set('node_code', currentCode);
	},
	getCurrentModel: function() {
		this.updateHTMLNodeModel();
		//return model for Node HTML
		return this.modelInFactory;
	},

	fireLoad: function() {
		ev.fire(E.EVENTS.CODE_EDITOR.ON_LOAD);
	},
	fireClose: function() {
		ev.fire(E.EVENTS.CODE_EDITOR.OFF);
	},
	fireOpen: function() {
		ev.fire(E.EVENTS.CODE_EDITOR.ON);
	},
	fireSave: function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();

		ev.fire(E.EVENTS.CODE_EDITOR.SAVE);
	}
});

module.exports = CodeEditor;