var Events = require('../../Events/Events');
var E = require('../../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../../libs/Mustache/Mustache');
var Template = require('../../Templates/CreateHTMLNodes.html');
//init views

var $ = jQuery;
var ev = new Events();
var util = require('../../Util/Util');

/**
* this view is responsible for HTML nodes drawer View
* and HTML Space View at the bottom of the screen
*/

var CreateHTMLNodes = Backbone.View.extend({
	el: '.createSingleHTMLNode',
	state: {
		nameInput: 'hidden',
		nameIsAdded: false,
		addCodeInit: true,
		codeEditorOpen: false,
		codeEdited: false
	},

	initialize: function() {
		this.render();
		this.setEvents();
	},

	render: function() {
		//main wrapper
		this.$el.html( this.template() );
       	return this;
	},

	template: function() {
		if (this.model) {
			return Mustache.to_html(Template, this.model.toJSON());
		} else {
			throw new Error('model was not defined');
		}
	},

	events: {
		'click .addHTMLNodeName': 'openAddName',
		'focusout input': 'addName',
		'click .addHTMLNodeCode': 'addCode',
		'click .addHTMLNode': 'addHTMLNode',
		'click .deleteAllHTMLNodes': 'deleteAllHTMLNodes',
		'click .cancelNode': 'cancelNode'
	},

	setEvents: function() {
		//on code save
		ev.listen(E.EVENTS.CODE_EDITOR.SAVE, function() {
			if (!this.state.codeEditorOpen) return;

			this.saveCodeInModel(this.model);
			this.state.codeEdited = true;

			util.throwInfo('Your code was added.');
			//this.closeCodeEditor();

		}.bind(this));

		//on code editor close
		ev.listen(E.EVENTS.CODE_EDITOR.CLOSE, function() {
			if (!this.state.codeEditorOpen) return;
			this.state.codeEditorOpen = false;

		}.bind(this));
	},

	resetModel: function() {
		this.model.set({
			node_name: '',
			node_code: ''
		});
	},

	cancelNode: function() {
		//clear validation
		var $validation = $(this.el).find('.validation');
		$validation.attr('class', 'validation');
		//clear input
		$(this.el).find('input').val('');
		//reset code editor
		this.resetCodeEditor();
		//hide name input
		this.toggleNameInput();
	},

	deleteAllHTMLNodes: function() {
		if (!confirm('Are you sure? This will delete the HTML Nodes permanently.')) return;
		//delete the collection
		Backbone.App.Collections.HTMLNodesCollection.reset();
		//update collection on the server
		this.resetHTMLNodesCollectionOnServer();
	},

	resetHTMLNodesCollectionOnServer: function() {
		//sync with server
		var setting = {
			action: 'nodes',
            nodes_action: {
            	"route": 'resetHTMLNodesCollectionOnServer'
            }
		};
	},

	updateHTMLNodesCollectionOnServer: function() {
		//sync with server
		var setting = {
			action: 'nodes',
            nodes_action: {
            	"route": 'addHTMLNodeCollection',
            	"nodes_data": {
					"collection": Backbone.App.Collections.HTMLNodesCollection.toJSON()
            	}
            }
		};

		Backbone.fetchData(setting, function(feed, resp) {
			this.resetCodeEditor();
		}.bind(this));
	},

	addHTMLNode: function() {
		//validate
		if (!this.state.nameIsAdded &&
			!this.state.codeEdited) {
			util.throwInfo('Please make sure you added name and code.');
			return;
		}
		//add to collection
		Backbone.App.Collections.HTMLNodesCollection.add(this.model.clone());

		//open list drawer
		Backbone.App.Views.htmlNodes.toggleNodePanel();

		//update on server
		this.updateHTMLNodesCollectionOnServer();

		//clear html noce creator
		this.cancelNode();

	},

	//code editor
	closeCodeEditor: function() {
		Backbone.App.Views.codeEditorView.closeEditor();
	},
	resetCodeEditor: function() {
		Backbone.App.Views.codeEditorView.resetEditor();
	},

	openCodeEditor: function() {
		ev.fire(E.EVENTS.CODE_EDITOR.ON);
		Backbone.App.Views.codeEditorView.openEditor();
	},

	saveCodeInModel: function(model) {
		var code = Backbone.App.Views.codeEditorView.getCurrentCode();
		return this.model.set({
			node_code: code
		});
	},

	toggleNameInput: function() {
		var sel = $(this.el).find('input');

		if (this.state.nameInput === 'hidden') {
			$(sel).removeClass('disabled');
			this.state.nameInput = 'visible';
		} else {
			$(sel).addClass('disabled');
			this.state.nameInput = 'hidden';
		}
	},

	openAddName: function() {
		//show input
		this.toggleNameInput();
	},

	showFailValidation: function(elem) {
		$(elem).removeClass('correct');
		$(elem).addClass('notcorrect');
	},

	showApproveValidation: function(elem) {
		$(elem).removeClass('notcorrect');
		$(elem).addClass('correct');
	},

	validateName: function(name) {
		$addNodeName = $(this.el).find('.addHTMLNodeName .validation');

		var maxLength = 10;
		var minLength = 3;

		//check the length
		if (name.length < minLength) {
			util.throwInfo('Your new name is too short. It has to be more than ' + minLength + '  characters.');
			this.showFailValidation($addNodeName);
			this.nameIsAdded = false;
			return true;
		} else if (name.length > maxLength) {
			util.throwInfo('Your new name is too long. It cannot be more than ' + maxLength + ' characters.');
			this.showFailValidation($addNodeName);
			this.nameIsAdded = false;
			return true;
		}

		//update state
		this.state.nameIsAdded = true;
		this.showApproveValidation($addNodeName);
		return false;
	},

	addName: function() {
		//get name from the input
		var newName = $(this.el).find('input').val();
		//to do validate

		if (this.validateName(newName)) return;

		//update model
		this.model.set({
			node_name: newName
		});
	},

	addCode: function() {
		var $addNodeCode = $(this.el).find('.addHTMLNodeCode .validation');

		if (this.state.addCodeInit) {
			this.resetCodeEditor();
			this.state.addCodeInit = false;
		}
		//open editor
		this.openCodeEditor();
		this.state.codeEditorOpen = true;

		this.showApproveValidation($addNodeCode);
	}
});

module.exports = CreateHTMLNodes;