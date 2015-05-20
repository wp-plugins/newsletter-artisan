var Events = require('../Events/Events');
var E = require('../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../libs/Mustache/Mustache');
var Template = require('../Templates/ThemeRoutes.html');
var $ = jQuery;
var ev = new Events();
var ThemeCodeEditorView = require('../CodeEditor/CodeEditor');

var ThemeCreate = require('../ThemeManagement/ThemeCreate/ThemeCreate');
var ThemesList = require('../ThemeManagement/ThemesList/ThemesList');
var EditThemeSideNavigationView = require('../EditThemeSideNavigation/EditThemeSideNavigation');
var Cover = require('../Cover/Cover');
var InfoBox = require('../InfoBox/InfoBox');

var Routes = Backbone.View.extend({
	el: '#mainHeader',

	events: {
		'click .createTheme': 'createTheme'
	},

	setEvents: function() {
		ev.listen(E.EVENTS.DOCUMENT.THEME.CREATE.FINISHED, function() {
			this.showCreateThemeButton();
		}.bind(this));
	},

	createThemesList: function() {
		var ThemesListModel = Backbone.Model.extend({});

		Backbone.App.Models.themesListModel = new ThemesListModel({
			state: {}
		});

		Backbone.App.Views.themesListView = new ThemesList({
			model: Backbone.App.Models.themesListModel
		});

	},

	createTheme: function() {
		ev.fire(E.EVENTS.DOCUMENT.THEME.CREATE.LOADED);

		//disable the button
		this.hideCreateThemeButton();

		var ThemeModel = Backbone.Model.extend({});

		var themeModel = new ThemeModel({			
			state: "",
			theme_id: "",
			theme_name: "",
			theme_code: "",
			post_code: "",
			creation_date: "",
			active_theme: false
		});

		Backbone.App.Views.themeCreateView = new ThemeCreate({
			model: themeModel
		});

		Backbone.App.Collections.themesCollection.add(themeModel);
	},

	hideCreateThemeButton: function() {
		$(this.el).find('.createTheme').addClass('disabled');
	},
	showCreateThemeButton: function() {
		$(this.el).find('.createTheme').removeClass('disabled');
	},

	initInfoBox: function() {
		Backbone.App.Views.infoBox = new InfoBox();
	},

	initCover: function() {
		Backbone.App.Views.cover = new Cover();
	},

	initialize: function() {
		ev.fire(E.EVENTS.DOCUMENT.THEME.ON_LOAD);
		this.setEvents();

		this.initCover();
		this.initInfoBox();

		this.createThemesList();
		this.createCodeEditorInstance();
		this.sideNavigationInitialize();

		this.render();
	},

	sideNavigationInitialize: function() {
		var EditThemeSideNavigationModel = Backbone.Model.extend({});

		Backbone.App.Models.editThemeSideNavigationModel = new EditThemeSideNavigationModel({
			theme_id: "",
			theme_name: "",
			theme_code: "",
			post_code: "",
			creation_date: "",
			active_theme: false
		});

		Backbone.App.Views.editThemeSideNavigationView = new EditThemeSideNavigationView({
			model: Backbone.App.Models.editThemeSideNavigationModel
		});

	},

	createCodeEditorInstance: function() {
		var firstTheme = '<div style="width: 100%; min-height: 100px; border: 1px solid grey; background: white">\n<img style="float:left; width: 50px; height: 50px;padding: 5px;" src="http://www.bakesforbreastcancer.org/wp-content/uploads/2012/03/sun.jpg"><h2>Preview</h2><p>You can see the preview to the right.</p><p>Enjoy...</p>\n\n</div>';

		//init model
		var ThemeCodeEditorModel = Backbone.Model.extend({});
		//create an instance of the model
		Backbone.App.Models.themeCodeEditorModel = new ThemeCodeEditorModel({
			currentCode: firstTheme,
			theme_code: firstTheme,
			theme_id: "",
			theme_name: "",
			post_code: "",
			creation_date: "",
			active_theme: false
		});

		//pass mode to view
		Backbone.App.Views.themeCodeEditorView = new ThemeCodeEditorView({
			model: Backbone.App.Models.themeCodeEditorModel
		});

		//code editor update

		Backbone.App.Views.themeCodeEditorView.editor.on('update', function(codeEditor) {
			var code = codeEditor.getValue();

			Backbone.App.Models.themeCodeEditorModel.set({
				currentCode: code
			});
		});
	},

	template: function() {

		if (this.model) {
			return Mustache.to_html(Template, this.model.toJSON());
		} else {
			throw new Error('model was not defined');
		}
	},

	render: function() {
		//append to header
		this.$el.html(this.template());
		return this;
	}
});

module.exports = Routes;