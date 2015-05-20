<?php
/* Network module - Themes */

	$baseAppPath = dirname(__FILE__) . '/../../';
	require_once($baseAppPath . 'util/util.php');
	require_once($baseAppPath . 'themes_management/SingleThemeManagement.php');
	require_once($baseAppPath . 'themes_management/ThemesManagement.php');


	/**
	* ThemesNetwork class
	* API
	*/
	/*
	* usage example on client
		var $ = jQuery;				
		var that = this,
			data = {
			action: 'themes',
	        themes_action: {'route': 'getThemes'}
		};
		$.post(ajaxurl, data, function (resp) {
			console.log(resp);
		});
		
		var data = {
			action: 'themes',
            themes_action: {'route': 'getThemes'}
		};	
	*/

	class ThemesNetwork {

		public function route($do) {
			$themes = new ThemesManagement();
			$theme = new SingleThemeManagement();

			switch ($do["route"]) {

				case 'getThemes':
					$themes->getThemes();

					break;

				case 'changeName':
					$data = $do["themes_data"];
					$old_name = $data["theme_oldname"];
					$new_name = $data["theme_name"];
					
					$theme->renameTheme($old_name, $new_name);

					break;

				case 'changeActiveTheme':
					$data = $do["themes_data"];
					$theme_to_activate = $data["active_theme"];
					
					$theme->activateNewTheme($theme_to_activate);

					break;

				case 'changeCode':
					$data = $do["themes_data"];
					$theme_name = $data["theme_name"];
					$theme_code = $data["theme_code"];

					$theme->saveTemplate($theme_name, $theme_code);

					break;

				case 'deleteSingleTheme':
					$data = $do["themes_data"];
					$theme_name = $data["theme_name"];

					$theme->deleteSingleTheme($theme_name);
					break;

				case 'deleteAllThemes':
					$themes->deleteAllThemes();
					break;

				case 'createSingleTheme':
					$data = $do["themes_data"];
					$theme_name = $data["theme_name"];
					$theme_code = $data["theme_code"];
					$post_code = $data["post_code"];

					$theme->createSingleTheme($theme_name, $theme_code, $post_code);
					break;

				case 'editPostCode':
					$data = $do["themes_data"];
					$theme_name = $data["theme_name"];
					$post_code = $data["post_code"];

					$theme->savePostTemplate($theme_name, $post_code);
					break;
				
				default:
					throwServerError('Task to handle not defined in nodesNetwork.php.');
					break;
			}
		}
	}

	function respThemesNetwork() {
		//check
		check_if_admin();

		//set
		$traffic = new ThemesNetwork();
		$set_traffic = array($traffic, 'route');

		//run
		$themes_data = array("themes_action");
		handleAction($themes_data, $set_traffic);

		//finish
		die();
	}

?>