var Events = require('../Events/Events');
var E = require('../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../libs/Mustache/Mustache');
var Template = require('../Templates/Routes.html');
var util = require('../Util/Util');

var $ = jQuery;
var ev = new Events();

var CodeEditorView = require('../CodeEditor/CodeEditor');
var Network = require('../network/network');
var PostsSelectionView = require('../PostsSelection/PostsSelection');
var NodesOrderingView = require('../NodesOrdering/NodesOrdering');
var HTMLNodesView = require('../HTMLNodes/HTMLNodes');
var closingInformation = require('../InfoBox/helpModules/closingInformation.js');

var Routes = Backbone.View.extend({
	el: '#mainHeader',

	initialize: function() {
		this.render();

		this.networkModule = new Network();

		this.createCodeEditorInstance();
		this.initSelectPosts();
		this.initNodesOrdering();
		this.setEvents();
		this.initHtmlNodesNav();
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
	},

	events: {
		'click .nextStep': 'nextStep'
	},

	setEvents: function() {
		this.model.on('change', function(m) {
			//console.log('route model changed: ', m);
		});
	},

	validateAppState: function(stages) {
		//if posts select stage and no posts are selected
		if (!!stages.posts_select && 
			Backbone.App.Collections.postNodesCollection.length === 0) {

			util.throwInfo("You should select at least one post.");
			return true;
		} else if (!!stages.publish) {

			return true;
		}

		return false;
	},

	updateStep: function(stages) {
		for(var stage in stages) {
			if (stages[stage]) {
				stages[stage] = 0;

				switch (stage) {
					case "posts_select":
					this.selectPostsToSortOrder();
					stages.posts_ordering = 1;
					break;

					case "posts_ordering":
					this.addHTMLNodes();
					stages.html_snippet_modify = 1;
					break;

					case "html_snippet_modify":
					this.publishNewsletter();
					stages.publish = 1;
					break;

					case "publish":
					this.finishProcess();
					stages.finish = 1;
					break;
				}

				return;
			}
		}
	},

	nextStep: function() {
		ev.fire(E.EVENTS.DOCUMENT.NEXT_STEP);
		ev.fire(E.EVENTS.ANIMATION.STARTED);

		var stages = this.model.toJSON().stage;

		if (this.validateAppState(stages)) return;

		this.updateStep(stages);
	},

	/* start sections (steps) */
	finishProcess: function() {
		console.log('finish!...');
		//show url screen
	},

	publishNewsletter: function() {
		var d = JSON.stringify(Backbone.App.Collections.postNodesCollection);
		var ordering = Backbone.App.Models.nodesOrderingModel.get('nodesCollectionOrdering');

		var nodesToPost = {
			action: 'nodes',
            nodes_action: {
            	route: 'AddNodesCollection',
            	nodes_data: {
					collection: d,
					nodesOrdering: ordering
            	}
			}
		};

		//animate route in header
		this.animateRouteInHeader('.publish');

		//HIDE drawer
		Backbone.App.Views.htmlNodes.toggleDrawer("open");

		//publish
		//send the data to the server
		Backbone.fetchData(nodesToPost, function(newsletter_url, resp) {
			if (resp !== "success") throw new Error('server returned error');
			util.displayHTML(closingInformation(newsletter_url), {
				heading: "Newsletter created!",
				closeButton: "hide"
			});
		});

		//fire ev
		ev.fire(E.EVENTS.DOCUMENT.STEP.PUBLISH);
	},

	addHTMLNodes: function() {
		//console.log('add html step..');
		//fire ev
		ev.fire(E.EVENTS.DOCUMENT.STEP.ADD_HTML_CODE);

		//open drawer
		Backbone.App.Views.htmlNodes.toggleDrawer();

		//animate route in header
		this.animateRouteInHeader('.stepThree');

		//get HTML nodes already created
		Backbone.App.Views.htmlNodes.getHTMLNodes();
	},

	getSelectedPostsIds: function() {
		var postsIds = [];

		Backbone.App.Collections.postNodesCollection.each(function(model, i) {
			postsIds.push(model.toJSON().ID);
		});

		return postsIds;
	},

	getAdditionalPostsData: function(cb) {
		var setting = {
			action: 'nodes',
            nodes_action: {
            	"route": 'getAdditionalPostsData',
            	"nodes_data": {
					"postsIDs": this.getSelectedPostsIds()
            	}
            }
		};

		Backbone.fetchData(setting, function(feed, resp) {
			if (resp !== "success") throw new Error('error in Routes.js after ajax call.');

			//add thumbnail links
			this.addServerDataToCollection(JSON.parse(feed));

			this.addPostExcerptToCollection();

			//callback
			if(!!cb) cb();
		}.bind(this));
	},

	addServerDataToCollection: function(freshdata) {
		for(var model in freshdata) {
			var modelReference = Backbone.App.Collections.postNodesCollection.findWhere({
				ID: Number(model)
			});

			modelReference.set({
				post_thumbnail: freshdata[model].post_thumbnail
			});
		}
	},

	addPostExcerptToCollection: function() {
		var excerptLength = AppConfig.Application.Post.excerpt_length;

		Backbone.App.Collections.postNodesCollection.each(function(model, i) {
			var content = model.get("post_content");
			//cut excerpt
			var partofcontent = content.slice(0, excerptLength);
			var lastspace = partofcontent.lastIndexOf(' ');
			var excerpt = partofcontent.slice(0, lastspace) + '...';

			model.set({
				'post_excerpt': excerpt
			});
		});
	},

	selectPostsToSortOrder: function() {
		function afterDataAdded() {
			//show new window
			this.showNodesOrderingWindow();

			//animate route in header
			this.animateRouteInHeader('.stepTwo');
			
			//fire ev
			//at this point Sortable.js is init
			ev.fire(E.EVENTS.DOCUMENT.STEP.SORT_POSTS);
		}

		//hide previous window
		this.hideSelectPostsScreen();

		//get thumb img link
		this.getAdditionalPostsData(afterDataAdded.call(this));
	},

	/* end sections */

	hideSelectPostsScreen: function() {
		//hide unchecked posts
		Backbone.App.Views.postsSelectionView.hide();
	},

	showNodesOrderingWindow: function() {
		Backbone.App.Views.nodesOrdering.show();
	},

	animateRouteInHeader: function(elemString) {
		$(this.el).find(elemString).removeClass('disabled');
	},

	initHtmlNodesNav: function() {
		var HTMLNodesModel = Backbone.Model.extend({
			node_name: "",
			node_code: ""
		});

		Backbone.App.Models.htmlNodesNavigation = new HTMLNodesModel();

		Backbone.App.Views.htmlNodes = new HTMLNodesView({
			model: Backbone.App.Models.htmlNodesNavigation
		});

		Backbone.App.Collections.htmlNodes = Backbone.Collection.extend({
			model: HTMLNodesModel
		});
	},

	initNodesOrdering: function() {
		var NodesOrderingModel = Backbone.Model.extend({});
		Backbone.App.Models.nodesOrderingModel = new NodesOrderingModel({
			state: {},
			nodesCollectionOrdering: []
		});

		Backbone.App.Views.nodesOrdering = new NodesOrderingView({
			model: Backbone.App.Models.nodesOrderingModel
		});
	},

	initSelectPosts: function() {
		/* select posts as the first step in the route */
		//one wrapper View - SelectPosts
		//one child View with Collection - SinglePost

		//init model - only once
		var SelectPostsModel = Backbone.Model.extend({});
		//create an instance of the model
		Backbone.App.Models.selectPostsModel = new SelectPostsModel({
			PostsList: {}
		});

		Backbone.App.Views.postsSelectionView = new PostsSelectionView({
			model: Backbone.App.Models.selectPostsModel
		});
	},

	createCodeEditorInstance: function() {
		var initCode = '<div>code</div>';

		//init model
		var CodeEditorModel = Backbone.Model.extend({});
		//create an instance of the model
		Backbone.App.Models.codeEditorModel = new CodeEditorModel({
			currentCode: initCode
		});

		//pass mode to view
		Backbone.App.Views.codeEditorView = new CodeEditorView({
			model: Backbone.App.Models.codeEditorModel
		});

		//code editor update
		Backbone.App.Views.codeEditorView.editor.on('update', function(codeEditor) {
			var code = codeEditor.getValue();

			Backbone.App.Models.codeEditorModel.set({
				currentCode: code
			});
		});
	}
});

module.exports = Routes;