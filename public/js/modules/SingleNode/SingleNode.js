var Events = require('../Events/Events');
var E = require('../Configuration/Events/EventsConfiguration.json');
var AppConfig = require('../Configuration/Application/ApplicationConfiguration.json');
var Mustache = require('../../libs/Mustache/Mustache');

var Template = require('../Templates/SingleNode.html');
var $ = jQuery;
var ev = new Events();

var SingleNode = Backbone.View.extend({
	tagName: 'li',
	className: 'singleNode ui-state-default',

	events: {
		'click .remove': 'removeOneNode',
		'mousedown': 'disabledrag'
	},

	setEvents: function () {
		this.model.on('remove', function() {
			this.off();
			this.remove();
		}.bind(this));

	},

	initialize: function() {
		this.render();
		this.setEvents();

		this.collection = Backbone.App.Collections.postNodesCollection;
	},

	template: function() {
		if (this.model) {
			return Mustache.to_html(Template, this.model.toJSON());
		} else {
			throw new Error('model was not defined');
		}
	},

	render: function() {
		this.$el.html( this.template() );
		this.addID();

		return this;
	},	

	addID: function() {
		$(this.el).attr('data-ID', this.model.toJSON().ID);
	},

	addToCollectionToPosition: function(e) {
		var sel = e.target;

		this.collection.remove(this.model);
		this.collection.add(this.model, { at: $(sel).attr('data-num') });
	},

	removeOneNode: function() {
		this.off();
		this.remove();

		Backbone.App.Collections.postNodesCollection.remove(this.model);
	},

	disabledrag: function(ev) {
		//console.log(el);
		if (Backbone.App.Views.routes.model.toJSON().stage.html_snippet_modify) {
			console.log('disable: ', ev);

			Backbone.App.Views.nodesOrdering.disableSortable();

		}
	}
});

module.exports = SingleNode;