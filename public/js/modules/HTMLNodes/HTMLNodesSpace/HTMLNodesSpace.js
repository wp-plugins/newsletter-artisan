var Events = require('../../Events/Events');
var E = require('../../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../../libs/Mustache/Mustache');
var Template = require('../../Templates/HTMLNodesSpace.html');

var $ = jQuery;
var ev = new Events();

/**
* this view is responsible for HTML nodes drawer View
* and HTML Space View at the bottom of the screen
*/

var HTMLSpaceNodes = Backbone.View.extend({
	el: '.HTMLNodesSpace',
	drawerState: "hidden",

	initialize: function() {
		this.render();
		this.setEvents();
	},

	render: function() {
		//main wrapper
		this.$el.find('ul').html( this.template() );
       	return this;
	},

	template: function() {
		if (this.model) {
			return Mustache.to_html(Template, this.model.toJSON());
		} else {
			throw new Error('model was not defined');
		}
	},

	events: {},

	setEvents: function() {},

	//open space at the bottom of the screen
	toggleSpaceDrawerForNodes: function(state) {
		//open drawer only if there are places defined in theme
		//for first release that's going to be ommited
		if (this.checkForPlaceholdersInTheme()) return;


		if (state === 'open') {
			$(this.el).addClass('active');
		} else {
			$(this.el).removeClass('active');
		}
	},
	checkForPlaceholdersInTheme: function() {
		//check the active theme for placeholders for Html Nodes
		return true;
	}
});

module.exports = HTMLSpaceNodes;