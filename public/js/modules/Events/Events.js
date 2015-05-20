var $ = jQuery;

var Events = function() {

	this.fire = function(eventName, args) {
		$(document).trigger(eventName, args);
	};

	this.listen = function(eventName, cb) {
		$(document).on(eventName, cb);
	};

	this.destroy = function(eventName) {
		$(document).off(eventName, cb);
	};
};

module.exports = Events;