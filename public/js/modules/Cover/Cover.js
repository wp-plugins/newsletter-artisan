var Events = require('../Events/Events');
var E = require('../Configuration/Events/EventsConfiguration.json');
var $ = jQuery;
var ev = new Events();


var Cover = Backbone.View.extend({
	el: '.cover',

	initialize: function() {
		this.setEvents();
	},

	events: {
		"click": "fireHideEvent"
	},

	show: function() {
		$(this.el).addClass('active');
		ev.fire(E.EVENTS.COVER.OPEN);
	},

	hideNav: function() {
		$(this.el).removeClass('active');
	},
	setEvents: function() {
		ev.listen(E.EVENTS.COVER.CLOSED_FIRED, function() {
			this.hideNav();
		}.bind(this));
	},
	fireHideEvent: function() {
		ev.fire(E.EVENTS.COVER.CLOSED_FIRED);
	}
});

module.exports = Cover;