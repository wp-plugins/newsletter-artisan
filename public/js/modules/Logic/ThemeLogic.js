var ThemeRoutes = require('../Routes/ThemeRoutes');
//var ThemeNetwork = require('../Network/ThemeNetwork');
//var SnippetsManager = require('../SnippetsManager/SnippetsManager');
var InfoBox = require('../InfoBox/InfoBox');

var ThemeLogic = function() {

	this.initialize = function() {
		
		var ThemeRoutesModel = Backbone.Model.extend({});
		Backbone.App.Models.themeRoutesModel = new ThemeRoutesModel({
			route: {
				"create": 0,
				"edit": 0
			},
			stage: {},
			state: {}
		});

		Backbone.App.Views.themeRoutes = new ThemeRoutes({
			model: Backbone.App.Models.themeRoutesModel
		});

		Backbone.App.Views.infoBoxView = new InfoBox();
		
	};
};

module.exports = ThemeLogic;