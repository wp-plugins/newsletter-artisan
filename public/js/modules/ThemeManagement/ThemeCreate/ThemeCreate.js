var Events = require('../../Events/Events');
var E = require('../../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../../libs/Mustache/Mustache');
var Template = require('../../Templates/ThemeCreate.html');
var util = require('../../Util/Util');
var $ = jQuery;
var ev = new Events();
var i18n = require('../../Configuration/i18n/i18n');

var ThemeCreate = Backbone.View.extend({
	el: '.createForm',
	state: "hidden",

	codeEditorState: "hidden",
	codeIsAdded: false,
	nameIsAdded: false,
	postCodeIsAdded: false,

	dataModel: {
		theme_id: "",
		theme_name: "",
		theme_code: "",
		creation_date: "",
		post_code: "",
		active_theme: false
	},
	initialize: function() {
		this.render();
		this.setEvents();
		this.showPanel();
		this.saveCurrentThemeCode();
		this.resetCodeEditor();
	},

	events: {
		'click .cancelTheme': 'cancelThemeCreate',
		'click .addTheme': 'addTheme',
		'click .addThemeName': 'addThemeNameDrawer',
		'focusout input': 'addThemeNameToModel',
		'click .addThemeCode': 'addThemeCode',
		'click .addPostCode': 'addPostCode'
	},

	setEvents: function() {
		var that = this;
		this.model.bind('change', this.changeState, that);

		//close if clicked on cover
		ev.listen(E.EVENTS.COVER.CLOSED_FIRED, function() {
			if(this.state === "open") {
				this.cancelThemeCreate();
			}
		}.bind(this));

		ev.listen(E.EVENTS.CODE_EDITOR.SAVE, function() {
			if (this.state !== "open") return;

			switch (Backbone.App.Views.themeCodeEditorView.currentlyEditing) {
				case "themecode":
					this.saveCurrentThemeCode();
					Backbone.App.Views.themeCodeEditorView.closeEditor();
					this.codeEditorState = "hidden";
					this.codeApprove();
					Backbone.App.Views.themeCodeEditorView.currentlyEditing = "";
					break;
				case "postcode":
					this.saveCurrentPostCode();
					Backbone.App.Views.themeCodeEditorView.closeEditor();
					this.codeEditorState = "hidden";
					this.postCodeApprove();
					Backbone.App.Views.themeCodeEditorView.currentlyEditing = "";

					break;
			}

		}.bind(this));
	},

	saveCurrentThemeCode: function() {
		var code = Backbone.App.Views.themeCodeEditorView.getCurrentCode();

		this.model.set({
			theme_code: code
		});
	},

	saveCurrentPostCode: function() {
		var code = Backbone.App.Views.themeCodeEditorView.getCurrentCode();

		this.model.set({
			post_code: code
		});
	},

	codeApprove: function() {
		var $codeButton = $(this.el).find('.addThemeCode .validation');
		this.codeIsAdded = true;
		this.showApproveValidation($codeButton);
	},

	postCodeApprove: function() {
		var $codeButton = $(this.el).find('.addPostCode .validation');
		this.postCodeIsAdded = true;
		this.showApproveValidation($codeButton);
	},

	addThemeCode: function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		var currentThemeCode = this.model.get("theme_code");

		this.codeEditorState = "open";

		ev.fire(E.EVENTS.CODE_EDITOR.ON);

		Backbone.App.Views.themeCodeEditorView.openEditor();
		Backbone.App.Views.themeCodeEditorView.currentlyEditing = "themecode";
		Backbone.App.Views.themeCodeEditorView.injectCode(currentThemeCode);
	},

	openPostHelp: function() {
		var msg = translate(postCodeHelp);
		util.display(msg);
	},

	addPostCode: function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		var currentPostCode = this.model.get("post_code");

		this.codeEditorState = "open";

		ev.fire(E.EVENTS.CODE_EDITOR.ON);

		Backbone.App.Views.themeCodeEditorView.openEditor();
		Backbone.App.Views.themeCodeEditorView.currentlyEditing = "postcode";
		Backbone.App.Views.themeCodeEditorView.injectCode(currentPostCode);
	},

	render: function() {
		//append to header
		this.$el.html(this.template());
		return this;
	},

	addThemeNameDrawer: function() {
		$(this.el).find('input').removeClass('disabled');
	},

	showFailValidation: function(elem) {
		$(elem).removeClass('correct');
		$(elem).addClass('notcorrect');
	},

	showApproveValidation: function(elem) {
		$(elem).removeClass('notcorrect');
		$(elem).addClass('correct');
	},

	isThemeNameNotValid: function() {
		//get the name
		var $addThemeName = $(this.el).find('.addThemeName .validation');
		var $input = $(this.el).find('input');
		var val = $(this.el).find('input').val();
		//max length from config
		var maxLength = AppConfig.Application.Theme.Name.MaxLength;
		//min length from config
		var minLength = AppConfig.Application.Theme.Name.MinLength;

		var nameExistCheck = Backbone.App.Collections.themesCollection.findWhere({
			"theme_name": val
		});

		//check the length
		if (val.length < minLength) {
			util.throwInfo('Your new name is too short. It has to be more than ' + minLength + '  characters.');
			this.showFailValidation($addThemeName);
			this.nameIsAdded = false;
			return true;
		} else if (val.length > maxLength) {
			util.throwInfo('Your new name is too long. It cannot be more than ' + maxLength + ' characters.');
			this.showFailValidation($addThemeName);
			this.nameIsAdded = false;
			return true;
		} else if (!!nameExistCheck) {
			util.throwInfo('A theme with this name already exists. Please change the name.');
			this.showFailValidation($addThemeName);
			this.nameIsAdded = false;
			return true;
		}

		//combine with existing names from theme collection
		this.showApproveValidation($addThemeName);
		//update info in model
		this.nameIsAdded = true;
		return false;
	},

	addThemeNameToModel: function() {
		var name = $(this.el).find('input.block').val();

		if (this.isThemeNameNotValid()) return;

		this.model.set({
			theme_name: name
		});
	},

	addTheme: function() {
		var $addCodeButton = $(this.el).find('.addThemeCode .validation');
		var $addThemeName = $(this.el).find('.addThemeName .validation');
		var $addPostCodeButton = $(this.el).find('.addPostCode .validation');

		//validate
		if (!this.codeIsAdded) {
			util.throwInfo('You still have to add Code to your new theme.');
			this.showFailValidation($addCodeButton);
			return;
		} else if (!this.nameIsAdded) {
			util.throwInfo('You still have to add Name to your new theme.');
			this.showFailValidation($addThemeName);
			return;
		} else if (!this.postCodeIsAdded) {
			util.throwInfo('You still have to add Post Code to your new theme.');
			this.showFailValidation($addPostCodeButton);
			return;
		}
		//end validation
		
		ev.fire(E.EVENTS.DOCUMENT.THEME.CREATE.FINISHED);
		this.softThemeCancel();
		this.hidePanel();

		//update server
		this.updateDBWithNewTheme();
	},

	updateDBWithNewTheme: function(cb) {
		var dataTheme = {
			action: "themes",
			themes_action: {
			  route: "createSingleTheme",
			  themes_data: {
			    theme_name: this.model.get("theme_name"),
			    theme_code: this.model.get("theme_code"),
			    post_code: this.model.get("post_code")
			  }
			}
		};

		//update server about the change
		Backbone.fetchData(dataTheme, function(data, feed) {
			if (feed === "success" && !!cb) {
				cb();
			}
		});
	},

	removeThisThemeFromCollection: function() {
		Backbone.App.Collections.themesCollection.remove(this.model);
	},

	remove: function() {
      this.$el.empty().off(); /* off to unbind the events */
      this.stopListening();
      
      return this;
	},

	resetCodeEditor: function() {
		Backbone.App.Views.themeCodeEditorView.injectCode( "\n<p>code here</p>\n");
	},

	softThemeCancel: function() {
		this.resetCodeEditor();
		this.state = "hidden";
		this.remove();
	},

	cancelThemeCreate: function(e) {
		this.resetCodeEditor();

		if(e) e.preventDefault();

		//remove any memory of the view
		this.hidePanel();
		this.state = "hidden";
		this.remove();
		this.removeThisThemeFromCollection();
		ev.fire(E.EVENTS.DOCUMENT.THEME.CREATE.FINISHED);
	},

	showPanel: function() {
		this.state = "open";
		$(this.el).addClass('active');
		Backbone.App.Views.cover.show();
	},
	hidePanel: function() {
		$(this.el).removeClass('active');
		Backbone.App.Views.cover.hideNav();
		this.state = "hidden";
	},

	template: function() {
		if (this.model) {
			return Mustache.to_html(Template, this.model.toJSON());
		} else {
			throw new Error('model was not defined');
		}
	}
});

module.exports = ThemeCreate;