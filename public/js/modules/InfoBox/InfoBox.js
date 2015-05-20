var Mustache = require('../../libs/Mustache/Mustache');
var Template = require('../Templates/InfoBoxTemplate.html');
var util = require('../Util/Util');
var $ = jQuery;

var InfoBox = Backbone.View.extend({
	el: '#infoBox',
	settings: {
		heading: 'Information',
		closeButton: "show"
	},

	initialize: function() {
		this.render();
		this.eventsInit();

	},
	render: function() {
       this.$el.html( this.template() );
       return this;
	},
	template: function() {
		return Mustache.to_html(Template);
	},
	actionSettings: function(opts) {
		var options = opts || {};
		var settings = { 
			heading: options.heading || this.settings.heading,
			closeButton: options.closeButton || this.settings.closeButton
		};

		//heading
		$(this.el).find('.title span').text(settings.heading);
		//close button

		$(this.el).find('.close')[settings.closeButton]();
	},

	show: function(newSettings) {
		this.actionSettings(newSettings);
		//ui animations
		util.activateFancy('bounceIn', $(this.el));
	},

	hide: function() {
		function emptyElement() {
			$(this.el).find('section').text('');
			$(this.el).find('section').empty();
		}
		//ui animations
		util.deactivateFancy('bounceOut', $(this.el), emptyElement.call(this));
	},
	addHTMLInfo: function(code, newSettings) {
		//ui animations
		this.show(newSettings);
		$(this.el).find('section').append(code);
	},
	display: function(info, newSettings) {
		this.show(newSettings);
		$(this.el).find('section').text(info);
	},
	inform: function(info) {
		this.display(info);
		setTimeout(function() {
			this.hide();
		}.bind(this), 3000);
	},
	eventsInit: function() {
		var that = this;

		$(this.el).find('.close').on('click', function() {
			that.hide();
		});
	}
});

module.exports = InfoBox;