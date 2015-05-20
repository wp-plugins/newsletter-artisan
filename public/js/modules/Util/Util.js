var $ = jQuery;

module.exports = {
	"throwInfo": function(msg) {
		console.log('err', msg, Backbone.App.Views.infoBoxView);

		Backbone.App.Views.infoBoxView.inform(msg);
	},
	display: function(msg, opts) {
		Backbone.App.Views.infoBoxView.display(msg, opts);
	},
	displayHTML: function(code, opts) {
		Backbone.App.Views.infoBoxView.addHTMLInfo(code, opts);
	},
	activateFancy: function(effect, selec) {
			$(selec).addClass('active');
	},
	deactivateFancy: function(effect, selec, cb) {
		$(selec).removeClass('active');
	}
};