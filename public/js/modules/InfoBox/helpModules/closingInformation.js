var t = require('../../Configuration/i18n/i18n');

module.exports = function(url) {

	return ('<div>' +
		'<p>' + t("closinginformation") + url + '</p></div>');
};