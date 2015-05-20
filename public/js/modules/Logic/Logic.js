var Routes = require('../Routes/Routes');
var Network = require('../Network/Network');
var SnippetsManager = require('../SnippetsManager/SnippetsManager');
var InfoBox = require('../InfoBox/InfoBox');

var Logic = function() {

	this.initialize = function() {
		
		var RoutesModel = Backbone.Model.extend({});
		Backbone.App.Models.routesModel = new RoutesModel({
			stage: {
				"posts_select": 1,
				"posts_ordering": 0,
				"html_snippet_modify": 0,
				"publish": 0
			},
			state: {}
		});

		Backbone.App.Views.routes = new Routes({
			model: Backbone.App.Models.routesModel
		});
		Backbone.App.Views.snippetsManagerView = new SnippetsManager();
		Backbone.App.Views.infoBoxView = new InfoBox();
	};
};

module.exports = Logic;