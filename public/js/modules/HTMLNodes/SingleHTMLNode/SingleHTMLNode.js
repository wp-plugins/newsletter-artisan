var Events = require('../../Events/Events');
var E = require('../../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../../libs/Mustache/Mustache');
var Template = require('../../Templates/SingleHTMLNode.html');
//init views

var jqueryUI = require('../../../libs/Sortable/Sortable');
var $ = jQuery;
var ev = new Events();

/**
* this view is responsible for HTML nodes drawer View
* and HTML Space View at the bottom of the screen
*/

var SingleHTMLNode = Backbone.View.extend({
	tagName: 'li',
	className: 'html-node block button-transparent',
	viewState: {
		editorOpen: false
	},

	initialize: function() {
		this.render();
		this.addNum();

		this.addUniqueId();
	},

	render: function() {
		//main wrapper
		this.$el.html( this.template() );

		this.setEvents();
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
		'destroy': 'removeNode',
		'click': 'manageSortable',
		'click .editHTMLNode': 'editCode',
		'click .removeHTMLNode': 'removeSingleNode'
	},

	setEvents: function() {
		//draggable
		$( this.el ).draggable({
			connectToSortable: "#mainSortableList",
			helper: "clone",
			revert: "invalid",

			stop: function(e, elData) {
				var parent = elData.helper.parent();
				var indexEl = $(parent[0]).find('li').index($(elData.helper));

				//remove dragged element
				elData.helper.remove();

				//pass in the model and position information
				ev.fire(E.EVENTS.DOCUMENT.SORTABLE.UPDATE, {
					selector: elData.helper,
					position: indexEl
				});
			}
		});

		//code edit 
		ev.listen(E.EVENTS.CODE_EDITOR.SAVE, function() {
			if ( this.viewState.editorOpen && !this.compareModels() ) return;

			//update server
			Backbone.App.Views.HTMLNodesNavigationView.updateHTMLNodesCollectionOnServer();
			
			this.viewState.editorOpen = false;

		}.bind(this));

		//on code editor close
		ev.listen(E.EVENTS.CODE_EDITOR.CLOSE, function() {
			if (!this.viewState.editorOpen) return;

			this.editorReset();

			this.viewState.editorOpen = false;

		}.bind(this));

		//sortable update
		ev.listen(E.EVENTS.DOCUMENT.SORTABLE.UPDATE, function(e, data) {
			//compare the two elements from the event fired
			//SORTABLE.UPDATE event is fired for all the elements in HTML nodes list
			//on every update - distinuish the right one
			var elOne = $(data.selector).attr('data-num');
			var elTwo = $(this.el).attr('data-num');

			if (elOne === elTwo) {

				this.addHTMLNodeToPosts(this.model, data.position);
				ev.fire(E.EVENTS.DOCUMENT.HTML_NODES.ADDED_TO_POSTS, this.model);
			}

		}.bind(this));
	},

	editorReset: function() {
		Backbone.App.Views.codeEditorView.resetEditor();
	},

	compareModels: function() {
		var currentlyEditedModel = Backbone.App.Views.codeEditorView.getCurrentModel();

		console.log('compare models: ', currentlyEditedModel, !!currentlyEditedModel);

		if (!!currentlyEditedModel && this.model.cid === currentlyEditedModel.cid) {
			//this should be the same View/Model
			return true;
		} else {
			return false;
		}
	},

	editCode: function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();

		this.viewState.editorOpen = true;

		Backbone.App.Views.codeEditorView.injectModel( this.model );
		Backbone.App.Views.codeEditorView.refresh();

		this.openCodeEditor();

		return false;
	},

	openCodeEditor: function() {
		ev.fire(E.EVENTS.CODE_EDITOR.ON);
		Backbone.App.Views.codeEditorView.openEditor();
	},

	manageSortable: function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();

		Backbone.App.Views.nodesOrdering.enableSortable();

		return false;
	},

	getUniqueId: function() {
		//create id
		var idCreator = function() {
			return Math.ceil(Math.random() * 1000);
		};
		var freshId = idCreator();

		//check if id like that already exists
		Backbone.App.Collections.HTMLNodesCollection.each(function(m) {
			var modelId = m.get('ID');

			//if there is no id already in the model
			//or id
			if (!modelId || freshId !== modelId) {
				return true;
			} else {
				//there was an id like that
				return false;
			}
		}.bind(this));

		return freshId;
	},

	addUniqueId: function() {
		var freshId = this.getUniqueId();

		this.model.set({
			'ID': freshId
		});
	},

	removeSingleNode: function() {
		var text = 'Are you sure you want to remove the HTML Node?';

		if(confirm(text)) {
			this.off();
			this.remove();
			Backbone.App.Collections.HTMLNodesCollection.remove(this.model);
			Backbone.App.Views.HTMLNodesNavigationView.updateHTMLNodesCollectionOnServer();
		}
	},

	addNum: function() {
		$(this.el).attr('data-num', this.model.get('num'));
	},

	//add HTML Node to collection of displayed elements
	addHTMLNodeToPosts: function(model, pos) {
		model.set({
			post_author: 'HTML Node',
			post_title: model.get('node_name'),
			position_in_collection: pos
		});

		Backbone.App.Collections.postNodesCollection.add(model, {at: pos});
	}

});

module.exports = SingleHTMLNode;