var Events = require('../Events/Events');
var E = require('../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../libs/Mustache/Mustache');

var Template = require('../Templates/NodesOrdering.html');
var SingleNodeView = require('../SingleNode/SingleNode');
var $ = jQuery;
var jqueryUI = require('../../libs/Sortable/Sortable');
var ev = new Events();

var NodesOrdering = Backbone.View.extend({
	el: '#PostsOrderingView',
	$mainList: '#mainSortableList',

	initialize: function() {
		this.render();

		this.initChildElementsCollection();
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

	setEvents: function () {
		this.listenTo(this.collection, 'add', function(node) {
			this.addOneNode.call(this, node);
			//update
			this.updateCollection();

		}.bind(this));

		ev.listen(E.EVENTS.DOCUMENT.POST_SELECTION.FINISHED, function() {
			this.updateCollection();
			this.renderSelectedElements();
		}.bind(this));

		ev.listen(E.EVENTS.DOCUMENT.STEP.ADD_HTML_CODE, function() {
			//update nodes collection
			this.updateCollection();
		}.bind(this));
	},

	//add, remove, reorder collection with nodes
	//sequence of actions
	//update DOM elements and enumerate them
	//
	updateCollection: function() {
		var ordering = [];

		$(this.$mainList).find('li').each(function(i, el) {
			var orderData = {
				id: $(el).attr('data-ID'),
				order: i,
				type: 'node-post'
			};

			$(el).attr('data-num', i);
			$(el).find('.order').text(++i + '.');

			//push data to array
			ordering.push(orderData);
		});

		this.model.set({
			"nodesCollectionOrdering": ordering
		});
	},

	//add node to a specific place inside of collection
	addOneNode: function(node) {
		var nodeView = new SingleNodeView({
			model: node
		});

		this.appendOneNode(nodeView);
	},
	appendOneNode: function(nodeView) {
		var htmlNodePosition = nodeView.model.get('position_in_collection');
		//if that's a HTML Node added to Posts
		if (!!htmlNodePosition || htmlNodePosition === 0) {

			var insertPosition = (htmlNodePosition === 0) ? 0 : htmlNodePosition-1;
			var insertIndex = $(this.el).find('#mainSortableList').find('li').eq(insertPosition);
			//add id data attr
			nodeView.addID();

			//append method
			var method = (htmlNodePosition === 0) ? 'insertBefore' : 'insertAfter';
			//method
			$(nodeView.el)[method](insertIndex);

		} else {

			$(this.el).find('#mainSortableList').append(nodeView.el);
		}
	},

	renderSelectedElements: function() {
		this.sortable();
	},

	initChildElementsCollection: function() {
		this.collection = Backbone.App.Collections.postNodesCollection;
	},

	show: function() {
		$(this.el).removeClass('off');
	},

	enableSortable: function() {
		$('#mainSortableList').sortable('enable');
	},
	disableSortable: function() {
		$('#mainSortableList').sortable('disable');
	},

	sortable: function() {
		var num = 0;

		$('#mainSortableList').sortable();
		$("#mainSortableList").disableSelection();
	}
});

module.exports = NodesOrdering;