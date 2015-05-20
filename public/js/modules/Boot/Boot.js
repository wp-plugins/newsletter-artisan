var $ = jQuery;
var Logic = ($('#NAThemeChanger').length === 1) ? require('../Logic/ThemeLogic') : require('../Logic/Logic');

var Boot = function() {

	this.globalHelpers = function() {
		Array.prototype.remove = function() {
		    var what, a = arguments, L = a.length, ax;
		    while (L && this.length) {
		        what = a[--L];
		        while ((ax = this.indexOf(what)) !== -1) {
		            this.splice(ax, 1);
		        }
		    }
		    return this;
		};
	};

	this.configureBackbone = function() {
		Backbone.fetchData = function(data, cb) {
			$.post(ajaxurl, data, cb);			
		};

		//this is initialize only once
		Backbone.App = {
			Views: {},
			Collections: {},
			Models: {}
		};

		Backbone.Collection.prototype.removeAt = function(options) {
		  if (options.at) {
		    this.remove(this.at(options.at));
		  }
		};
	};

	/* Application init */
	this.initialize = function() {
		//add methods and objects for application use in Backbone
		this.configureBackbone();
		//create globa helper methods
		this.globalHelpers();

		/**
		* Initialize Posts Selection Management
		* and 
		* Themes Management independently
		*/
		//init application logic
		Backbone.App.Views.logicinit = new Logic();
		Backbone.App.Views.logicinit.initialize();

	};
};

module.exports = Boot;