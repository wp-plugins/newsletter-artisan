var Events = require('../../Events/Events');
var E = require('../../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../../libs/Mustache/Mustache');
var Template = require('../../Templates/HTMLNodesList.html');
//init views

var SingleHTMLNode = require('../SingleHTMLNode/SingleHTMLNode');

var $ = jQuery;
var ev = new Events();

/**
* this view is responsible for HTML nodes drawer View
* and HTML Space View at the bottom of the screen
*/

var HTMLNodesList = Backbone.View.extend({
	el: '.HTMLNodeList',

	initialize: function() {
		this.render();
		this.setEvents();

		this.getHTMLNodeCollection();
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

	events: {},

	setEvents: function() {
		var collection = this.collection = Backbone.App.Collections.HTMLNodesCollection;

		//add one HTML node
		collection.on('add', function(model) {
			this.addOneNode(model);
		}.bind(this));

		collection.on('reset', function(model) {
			this.resetCollection();
			//open list drawer
			Backbone.App.Views.htmlNodes.toggleNodePanel();
		}.bind(this));
	},

	resetCollection: function() {
		var sel = $(this.el).find('ul');
		sel.off();
		sel.empty();
	},

	addOneNode: function(model) {
		var singleHTMLNode = new SingleHTMLNode({
			model: model
		});

		$('.HTMLNodeList').find('ul').append(singleHTMLNode.render().el);
	},

	displayCollection: function(collection) {
		var Model = Backbone.Model.extend({});
		var num = 0;

		for (var data in collection) {
			var htmlNode = collection[data];
			var htmlNodeModel = new Model();

			if (typeof htmlNode === 'function') return;

			htmlNodeModel.set({
				node_name: htmlNode.node_name,
				node_code: htmlNode.node_code,
				num: num
			});

			//add node to collection
			Backbone.App.Collections.HTMLNodesCollection.add(htmlNodeModel);

			//iter
			num++;
		}
	},

	getHTMLNodeCollection: function() {
		var setting = {
			action: 'nodes',
            nodes_action: {
            	"route": 'getHTMLNodeCollection'
            }
		};

		Backbone.fetchData(setting, function(feed, repl) {
			if (repl !== 'success') throw new Error('server retured something wrong');

			var HTMLNodesCollection = JSON.parse(feed);

			this.displayCollection(HTMLNodesCollection);
		}.bind(this));
	}
});

module.exports = HTMLNodesList;