<?php

$baseAppPath = dirname(__FILE__) . '/../';
require_once($baseAppPath . 'util/util.php');

/* Creat a Theme */
	class SingleThemeManagement {
		private $theme_name = "";
		private $template_html = "start building your mustache template now!";
		private $post_code = "post code";

		public function createSingleTheme ($name, $template_html, $post_code) {
			$o = get_option('newsletter_artisan', array());
			$theme_details = array(
				"theme_name"=> $name,
				"theme_code"=>removeslashes($template_html),
				"post_code"=>removeslashes($post_code),
				"theme_thumbnail"=>"",
				"active_theme"=>false
			);

			//create new table in db if doesn't exist
			if ( !isset($o['themes']) ) {
				add_option('newsletter_artisan', array('themes'=> array() ) );
			}

			//check if the theme name already exists
			if ( !in_array($name, $o['themes'] ) ) {

				$o['themes'][$name] = $theme_details;
				update_option('newsletter_artisan', $o);
				echo "created";

			} else {
				app_error("This theme already exist. Please change the name.");
			}
		}

		public function activateNewTheme ($theme_name) {
			$o = get_option('newsletter_artisan', array());

			foreach($o["themes"] as &$theme) {
				//deactivate themes
				$theme["active_theme"] = false;
			}

			//activate only one theme
			$o["themes"][$theme_name]["active_theme"] = true;
			update_option('newsletter_artisan', $o);

			//resp to client
			echo "theme was activated";
		}

		//depricated
		private function createDir ( $new_dir ) {

			$o = get_option('newsletter_artisan', array());
			$theme_details = array(
				"theme_name"=> $new_dir,
				"theme_code"=>$this->template_html,
				"post_code"=>$this->post_code,
				"thumbnail_url"=>""
				);

			//create new table in db if doesn't exist
			if ( !isset($o['themes']) ) {
				add_option('newsletter_artisan', array('themes'=> array() ) );
			}

			//check if the theme name already exists
			if ( !in_array($new_dir, $o['themes'] ) ) {

				$o['themes'][$new_dir] = $theme_details;
				update_option('newsletter_artisan', $o);
				echo "created";

			} else {
				echo "This name already exist";
			}
		}

		public function renameTheme ( $name, $new_theme ) {
			$o = get_option('newsletter_artisan');

			if ( isset( $o['themes'][$name] ) && !isset( $o['themes'][$new_theme]  ) ) {
				//rename
				$o['themes'][$new_theme] = $o['themes'][$name];
				$o['themes'][$new_theme]['theme_name'] = $new_theme;

				unset($o['themes'][$name]);

				update_option('newsletter_artisan', $o);

				//echo json_encode($o['themes']);
				echo "renamed";
			} else {
				//server validation - client side validation shouldn't allow 
				//this condition
				echo "This theme does not exist - client validation error";
			}
		}

		public function editTemplate ( $theme_name ) {
			$o = get_option('newsletter_artisan');
			$code = $o['themes'][$theme_name]['theme_code'];

 			wp_editor($code, 'code_editor', 
 				array(
 					'media_buttons' => false ,
 					'quicktags'=>false, 
 					'textarea_name' => 'content'
 				));
		}

		public function saveTemplate($theme_name, $template) {
			/* due to restrications in the produciton use db to store templates */

			if ( !empty( $theme_name ) && !empty( $template )) {

				$o = get_option('newsletter_artisan');

				$o['themes'][$theme_name]['theme_code'] = removeslashes($template);

				update_option("newsletter_artisan", $o);
			}
			echo "updated";
		}

		public function savePostTemplate($theme_name, $post_code) {
			/* due to restrications in the produciton use db to store templates */

			if ( !empty( $theme_name ) && !empty( $post_code )) {

				$o = get_option('newsletter_artisan');

				$o['themes'][$theme_name]['post_code'] = removeslashes($post_code);

				update_option("newsletter_artisan", $o);
			}
			echo "post code updated";
		}

		public function uploadImage ( $t_name ) {
			$o = get_option('newsletter_artisan');

			$this->new_name = $t_name;
			$uploaded_file = $_FILES['file'];
			$upload_overrides = array( 'test_form' => false );
			$movefile = wp_handle_upload( $uploaded_file, $upload_overrides );

			if ( $movefile ) {
				$o['themes'][$t_name]['thumbnail_url'] = $movefile['url'];
				update_option('newsletter_artisan', $o );
				echo $movefile['url'];
				
			} else {
				echo "error";
			}
		}

		public function deleteSingleTheme ( $theme_name ) {
			$o = get_option('newsletter_artisan');

			if ( array_key_exists( $theme_name, $o['themes'] ) ) {
				//remove the theme from db
				unset( $o['themes'][$theme_name] );
				update_option('newsletter_artisan', $o );
				echo 'deleted';
			} else {
				echo "something went wrong with the delete... " . $theme_name;
			}
		}

		public function init ( $new_dir ) {
			$this->createDir( $new_dir );
		}
	}


?>