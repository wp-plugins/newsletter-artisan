var t = require('../../Configuration/i18n/i18n');

module.exports = function() {
	return ('<div>' +
		'<p>' + t("postCodeHelp-expl") + '</p>' +
		'<ul>' + 
		'<li>' + t("postCodeHelp-id") + '</li>' +
		'<li>' + t("postCodeHelp-thumb") + '</li>' +
		'<li>' + t("postCodeHelp-author") + '</li>' +
		'<li>' + t("postCodeHelp-title") + '</li>' +
		'<li>' + t("postCodeHelp-post_date") + '</li>' +
		'<li>' + t("postCodeHelp-post_date_gmt") + '</li>' +
		'<li>' + t("postCodeHelp-post_content") + '</li>' +
		'<li>' + t("postCodeHelp-excerpt") + '</li>' +
		'<li>' + t("postCodeHelp-status") + '</li>' +
		'<li>' + t("postCodeHelp-comment-status") + '</li>' +
		'<li>' + t("postCodeHelp-ping_status") + '</li>' +
		'<li>' + t("postCodeHelp-comment-status") + '</li>' +
		'<li>' + t("postCodeHelp-post_name") + '</li>' +
		'<li>' + t("postCodeHelp-post_modified_gmt") + '</li>' +
		'<li>' + t("postCodeHelp-post_content_filtered") + '</li>' +
		'<li>' + t("postCodeHelp-post_parent") + '</li>' +
		'<li>' + t("postCodeHelp-guid") + '</li>' +
		'<li>' + t("postCodeHelp-menu_order") + '</li>' +
		'<li>' + t("postCodeHelp-post_type") + '</li>' +
		'<li>' + t("postCodeHelp-post_mime_type") + '</li>' +
		'<li>' + t("postCodeHelp-comment_count") + '</li>' +
		'<li>' + t("postCodeHelp-filter") + '</li>' +
		'<li>' + t("postCodeHelp-number") + '</li>' + 
		'</ul></div>');
};