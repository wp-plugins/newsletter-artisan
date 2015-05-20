var Events = require('../../Events/Events');
var E = require('../../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../../libs/Mustache/Mustache');
var Template = require('../../Templates/SingleThemeListElement.html');
var $ = jQuery;
var ev = new Events();


var SingleThemeListElement = Backbone.View.extend({
	className: ["flex col-6 sm-col-4 md-col-3 lg-col-2 p2"],

	initialize: function() {
		this.render();
	},

	events: {
		"click .theme_header": "showMenuOptions"
	},

	render: function() {
		//append to header
		this.$el.html(this.template());

		if (this.model.toJSON().active_theme) {
			$(this.el).addClass('activated');
		}
		return this;
	},

	template: function() {
		if (this.model) {
		  return Mustache.to_html(Template, this.model.toJSON());
		} else {
		  throw new Error('model was not defined');
		}
	},
    hideThemeCreateButton: function() {
        Backbone.App.Views.themeRoutes.hideCreateThemeButton();
    },
	showMenuOptions: function(event) {
		var elemCoords = {
			x: event.target.offsetLeft,
			y: event.target.offsetTop
		};

        this.hideThemeCreateButton();

		Backbone.App.Views.editThemeSideNavigationView.showNavigation(this.model, elemCoords);
	}
});

module.exports = SingleThemeListElement;
