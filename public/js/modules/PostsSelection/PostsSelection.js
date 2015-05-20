var SinglePostView = require('../SinglePost/SinglePost');
var Events = require('../Events/Events');
var E = require('../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../libs/Mustache/Mustache');
var Template = require('../Templates/PostsSelection.html');
var $ = jQuery;
var ev = new Events();

var PostsSelection = Backbone.View.extend({
	el: "#PostsSelectionView",
	collection: {},
	dataModel: {
		number: 0,
		title: "",
		content: "",
		date: "",
		author: "",
		ID: "",
		guid: ""
	},

	template: function() {
		if (this.model) {
			return Mustache.to_html(Template, this.model.toJSON());
		} else {
			throw new Error('model was not defined');
		}
	},

	initialize: function() {
		this.getPosts();
		this.setEvents();
	},

	render: function() {
		//main wrapper
		this.$el.html( this.template() );
		//add posts to the page
		this.appendCollection();
       	return this;
	},

	events: {},

	hide: function() {
		$(this.el).find('input:not(:checked)').each(function() {
			$(this).parent().parent().hide(0);
		});

		setTimeout(function() {
			$(this.el).addClass('off');
			//reset hide
			$(this.el).find('tr').show();
			ev.fire(E.EVENTS.DOCUMENT.POST_SELECTION.FINISHED);
		}.bind(this), 0);
	},

	getSelectedPosts: function() {
		var selected = $(this.el).find('input:checked');

		console.log('sel elems: ', selected);
	},

	instantiatePostsCollection: function() {
		//init model
		var SinglePostModel = Backbone.Model.extend(this.dataModel);
		//init Collection of posts
		var PostsCollection = Backbone.Collection.extend({
			model: SinglePostModel
		});

		this.collection = Backbone.App.Collections.postsCollection = new PostsCollection();
	},

	instantiatePostsNodesCollection: function() {
		//init model
		var SinglePostNodeModel = Backbone.Model.extend(this.dataModel);
		//init Collection of posts
		var PostNodesCollection = Backbone.Collection.extend({
			model: SinglePostNodeModel
		});

		this.postNodesCollection = Backbone.App.Collections.postNodesCollection = new PostNodesCollection();
	},

	addSinglePostToCollection: function(modelData) {
		var SinglePostModel = Backbone.Model.extend(this.dataModel);
		
		//create an instance of the model
		var singlePostModel = new SinglePostModel(modelData);

		/* add model instance to collection */
		this.collection.add(singlePostModel);
	},

	setEvents: function() {
		$('.sideNav .nextStep').on('click', function() {
			ev.fire(E.EVENTS.DOCUMENT.NEXT_STEP);
		});
	},

	appendCollection: function() {
		this.collection.each(function(model) {
			var post = new SinglePostView({
				model: model
			});

			this.$el.find('tbody').append(post.render().el);

		}, this);

		ev.fire(E.EVENTS.DOCUMENT.POST_SELECTION.RENDERED);
	},

	reset: function() {
		this.collection.reset();
	},

	addToCollection: function(postsData) {
		var dataModel = {};

		for(var post in postsData) {
			//single post
			var sp = postsData[post];

			dataModel = sp.post_data;
			dataModel.number = sp.num;

			this.addSinglePostToCollection(dataModel);
		}
		//render the data
		this.render();
	},

	getPosts: function() {
		this.instantiatePostsCollection();
		this.instantiatePostsNodesCollection();

		//get data from the server
		var data = {
			action: 'nodes',
            nodes_action: {"route": 'getNodes'}
		};

		Backbone.fetchData(data, function(postsData, feedback) {
			var posts = JSON.parse(postsData);
			this.addToCollection(posts);

			if (feedback === "success") {
				ev.fire(E.EVENTS.DOCUMENT.POST_SELECTION.LOADED);
			}
		}.bind(this));
	}
});

module.exports = PostsSelection;