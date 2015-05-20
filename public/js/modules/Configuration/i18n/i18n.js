var $ = jQuery;
var i18n = require('./i18nListing.json');


module.exports = function(txtId) {
	//todo set current language 
	var language = i18n.eng;

	return language[txtId];
};