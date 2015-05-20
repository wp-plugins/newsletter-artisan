var Events = require('../Events/Events');
var E = require('../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../libs/Mustache/Mustache');
var Template = require('../Templates/SinglePostTemplate.html');
var $ = jQuery;
var ev = new Events();

var SinglePostPostsSelection = Backbone.View.extend({
	tagName: 'tr',

	initialize: function() {
		this.collection = Backbone.App.Collections.postNodesCollection;
	},

	events: {
		'click input': "selectPost"
	},
	
	selectPost: function(thisEvent) {
		var isChecked = $(thisEvent.target).prop("checked");

		//select or remove selection
		return (isChecked) ? this.addOne() : this.removeOne();
	},

	addOne: function() {
		this.collection.add(this.model, {
			sort: false
		});
		//trigger global event
		ev.fire(E.EVENTS.DOCUMENT.POST_SELECTION.ADD_ONE);
	},

	removeOne: function() {
		this.collection.remove(this.model);
		//trigger global event
		ev.fire(E.EVENTS.DOCUMENT.POST_SELECTION.REMOVE_ONE);
	},

	template: function() {
		if (this.model) {
			return Mustache.to_html(Template, this.model.toJSON());
		} else {
			throw new Error('model was not defined');
		}
	},
	render: function() {
		//main wrapper
		this.$el.html( this.template() );
       	return this;
	}
});

module.exports = SinglePostPostsSelection;