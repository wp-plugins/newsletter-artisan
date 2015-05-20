var Events = require('../Events/Events');
var E = require('../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../libs/Mustache/Mustache');
var Template = require('../Templates/HTMLNodes.html');
//init views
var SingleNodeView = require('../SingleNode/SingleNode');
var HTMLNodesSpaceView = require('./HTMLNodesSpace/HTMLNodesSpace');
var HTMLNodesNavigationView = require('./HTMLNodesNavigation/HTMLNodesNavigation');
var HTMLNodesListView = require('./HTMLNodesList/HTMLNodesList');

var $ = jQuery;
var ev = new Events();

/**
* this view is responsible for HTML nodes drawer View
* and HTML Space View at the bottom of the screen
*/

var HTMLNodes = Backbone.View.extend({
	el: '#HTMLNodesNav',
	drawerState: "hidden",
	nodePanel: "list",

	initialize: function() {
		this.render();
		this.setEvents();
		//init child views
		this.initChildren();
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
		'click .nlist': 'toggleNodePanel',
		'click .cnode': 'toggleNodePanel'
	},

	setEvents: function() {},

	initChildren: function() {

		//HTML Nodes Space
		var ViewModel = Backbone.Model.extend({
			state: {}
		});

		Backbone.App.Models.HTMLNodesSpace = new ViewModel();

		Backbone.App.Views.HTMLNodesSpace = new HTMLNodesSpaceView({
			model: Backbone.App.Models.HTMLNodesSpace
		});

		//HTML Nodes Create Panel
		var HTMLNodesNavigationModel = Backbone.Model.extend({
			state: {},
			node_name: '',
			node_code: ''
		});

		//create HTML Nodes Collection
		var HTMLNodesCollection = Backbone.Collection.extend({
			model: HTMLNodesNavigationModel
		});

		Backbone.App.Collections.HTMLNodesCollection = new HTMLNodesCollection();
	
		Backbone.App.Models.HTMLNodesNavigationModel = new HTMLNodesNavigationModel();

		Backbone.App.Views.HTMLNodesNavigationView = new HTMLNodesNavigationView({
			model: Backbone.App.Models.HTMLNodesNavigationModel
		});

		//HTML Nodes List

		var ListViewModel = Backbone.Model.extend({
			state: {}
		});

		Backbone.App.Models.HTMLNodesList = new ListViewModel();

		Backbone.App.Views.HTMLNodesList = new HTMLNodesListView({
			model: Backbone.App.Models.HTMLNodesList
		});
	},

	toggleNodePanel: function(e) {
		function toggleButtons(target) {
			$(target).addClass('disabled');
			$(target).siblings('span').removeClass('disabled');
		}

		if (this.nodePanel === "list") {

			toggleButtons('.cnode');
			this.nodePanel = "create";
			//update panel
			$(this.el).find('.createSingleHTMLNode').addClass('active');
			$(this.el).find('.HTMLNodeList').removeClass('active');
		} else if (this.nodePanel === "create") {

			toggleButtons('.nlist');
			this.nodePanel = "list";
			//update panel
			$(this.el).find('.HTMLNodeList').addClass('active');
			$(this.el).find('.createSingleHTMLNode').removeClass('active');
		}
	},

	toggleDrawer: function(forceState) {
		this.drawerState = forceState || this.drawerState;

		function hideDrawer() {
			$(this.el).removeClass('active');
			this.drawerState = "hidden";
			//toggle bottom screen node space
			Backbone.App.Views.HTMLNodesSpace.toggleSpaceDrawerForNodes('hide');
		}

		function showDrawer() {
			$(this.el).addClass('active');
			this.drawerState = "open";
			//toggle bottom screen node space
			Backbone.App.Views.HTMLNodesSpace.toggleSpaceDrawerForNodes('open');
		}

		return (this.drawerState === "open") ? hideDrawer.call(this) : showDrawer.call(this);
	},

	getHTMLNodes: function() {
		//render nodes
	}
});

module.exports = HTMLNodes;