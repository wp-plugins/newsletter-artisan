<?php
   /*
   *Plugin Name: Newsletter Artisan
   *Description: Newsletter Artisan is a dynamic newsletter builder. It was created to allow you to build a showcase of newsletters with dynamic content.
   *Version: 0.8.12
   *Author: Damian Stefaniak
   *Author URI: http://www.dcthomson.co.uk and htttp://dstefaniak.co.uk
   */



   /*
	* in this file you'll see division into 
	* newsletter_admin - posts checkbox view initialization
	* theme_change_admin view initialization
	* Ajax Post action and logic
   */

    //add styles for the admin ui
    function enqueue_admin_scripts() {
    	//add styles and scripts for the admin ui
    	$js_deps = array( 'backbone', 'jquery' );

	    if (is_admin()) {
		    wp_enqueue_style( 'anewsletter', plugins_url('admin/res/anewsletter.css', __FILE__) );
		    wp_enqueue_script( 'anscript', plugins_url('admin/res/anscript.js', __FILE__), $js_deps );
		}

		get_cust_plugin_dir();
	}

    function artisan_activation() {}
    function artisan_deactivation() {}

	function newsletter_posts_pick() {
		//check if the user is allowed to create the newsletter
		//for now we are going to allow most of the users

		if ( !current_user_can( 'manage_options' ) )  {
			wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
		}

		//include the admin ui
		include('admin/newsletter_admin.php');
	}

	function theme_change() {
		//check if the user is allowed to create the newsletter
		//for now we are going to allow most of the users
		if ( !current_user_can( 'manage_options' ) )  {
			wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
		}

		//include admin ui for theme modification/upload
		include('admin/theme_change_admin.php');
	}

	function get_cust_plugin_dir() {
		$dir = plugin_dir_path(__FILE__);
		$o = get_option('newsletter_artisan', array());

		//if (empty($o["plugin_dir"])) {
		$o["plugin_dir"] = $dir;
		update_option('newsletter_artisan', $o);
		//}
	}

	function na_init() {
		//add styles and scripts
		enqueue_admin_scripts();

		add_menu_page( 'adestra_newsletter', 'Artisan', 'manage_options', 'adestra_newsletter_id', 'newsletter_posts_pick', plugins_url('admin/res/newsletter_icon.png', __FILE__) );
		add_submenu_page( 'adestra_newsletter_id', 'sub', 'Theme change', 'manage_options', 'theme_adestra_pick', 'theme_change');
	}

	/* RESPOND TO EVENTS */
	/* add ajax respond 
	* after user submits the changes update metadata of posts
	*/
	
	function mark_posts ( $marked ) {
		/* mark only posts checked and submited by the user
		* unmark the unchecked posts
		*/
		//get Posts Data

		$args = array(
		'posts_per_page'   => 120,
		'offset'           => 0,
		'category'         => '',
		'category_name'    => '',
		'orderby'          => 'post_date',
		'order'            => 'DESC',
		'include'          => '',
		'exclude'          => '',
		'meta_key'         => '',
		'meta_value'       => '',
		'post_type'        => 'post',
		'post_mime_type'   => '',
		'post_parent'      => '',
		'post_status'      => 'publish',
		'suppress_filters' => true );

		$posts_array = get_posts( $args );
		$yesterday = strtotime("yesterday");

		foreach ( $posts_array as $post) {

			$postDate = $post->post_date;
			$postDay = substr( $postDate, 0, 10);
			$postToTime = strtotime($postDay);

			//if the post is not older than 2 days
			if( $postToTime >= $yesterday) {

				if ( in_array($post->ID, $marked) ) {
					update_post_meta( $post->ID, 'newsletter_key', true );
				} else {
					update_post_meta( $post->ID, 'newsletter_key', false );
				}
				
			}
		}
	}

	/* POSTS ajax */

	//update theme
	function change_theme() {
		$my_new_theme = $_POST['theme'];
		$theme_opts = get_option('newsletter_artisan');

		//check the post
		if ( is_admin() && strlen($my_new_theme) < 15 ) {
			$theme_opts['active_theme'] = $my_new_theme;
			update_option('newsletter_artisan', $theme_opts);

			echo "true";
		} else {
			echo "you are either not an admin or the theme name is too long";
		}
		die();
	}

	//posts selected for newsletter
	function select_posts () {
		global $wpdb;
		$my_data = $_POST['posts'];
		$na_opts = get_option('newsletter_artisan');

		/* get the link to the newsletter page 
		* search for the url for the page where the 'newsletter_artisan was used
		*/
		$archive_pages_args = array(
		    'meta_key' => '_wp_page_template',
		    'meta_value' => 'newsletter_artisan.php'
		);
		$archive_pages = get_pages( $archive_pages_args );

		if (is_admin() &&  is_array( $my_data ) && !is_null( $na_opts['active_theme'] ) && count( $archive_pages ) === 1 ) {
			mark_posts( $my_data );
			echo "true";

		}
		/* validate select posts page
		* - check if a theme is activated - you have to activate it as soon as you install the plugin
		* - check if there is a wordpress page using 'newsletter_artisan' template already created - it's needed to display the newsletter
		* - check if any posts were selected when submit
		*/
		elseif ( is_null( $na_opts['active_theme'] ) ) {
			echo "no_active_theme";
		} elseif ( count( $archive_pages ) !== 1 ) {
			echo 'create_one_na_page';
		} elseif ( !is_array( $my_data ) ) {
			echo "select_posts";
		} else {
			echo "Something went wrong";
		}
		die();		
	}

	function removeslashes($string) {
	    $string=implode("",explode("\\",$string));
	    return stripslashes(trim($string));
	}

	/* Creat a Theme */
	class Theme {
		private $theme_name = "";
		private $template_html = "start building your mustache template now!";

		private function createDir ( $new_dir ) {

			$o = get_option('newsletter_artisan', array());
			$theme_details = array(
				"name"=> $new_dir,
				"template"=>$this->template_html,
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


			//var_dump('new theme name chosen: ', $o, $new_dir);
		}

		public function renameTheme ( $name, $new_theme ) {
			$o = get_option('newsletter_artisan');

			if ( isset( $o['themes'][$name] ) && !isset( $o['themes'][$new_theme]  ) ) {
				//rename
				$o['themes'][$new_theme] = $o['themes'][$name];

				unset($o['themes'][$name]);
				echo "renamed";
			} else {
				//server validation - client side validation shouldn't allow 
				//this condition
				echo "This theme does not exist - client validation error";
			}
		}

		public function editTemplate ( $theme_name ) {
			$o = get_option('newsletter_artisan');
			$code = $o['themes'][$theme_name]['template'];

 			wp_editor($code, 'code_editor', 
 				array(
 					'media_buttons' => false ,
 					'quicktags'=>false, 
 					'textarea_name' => 'content'
 				));
		}

		public function saveTemplate($theme_name, $text) {
			/* due to restrications in the produciton use db to store templates */

			if ( !empty( $theme_name ) && !empty( $text )) {

				$o = get_option('newsletter_artisan');

				$o['themes'][$theme_name]['template'] = removeslashes( $text );

				update_option("newsletter_artisan", $o);
			}
			echo "updated";
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

		public function deleteDir ( $dir_name ) {
			$o = get_option('newsletter_artisan');
			if ( array_key_exists( $dir_name, $o['themes'] ) ) {
				//remove the theme from db
				unset( $o['themes'][$dir_name] );
				update_option('newsletter_artisan', $o );
				echo 'deleted';
			} else {
				echo "something went wrong...";
			}
		}

		public function init ( $new_dir ) {
			$this->createDir( $new_dir );
		}
	}

	function action_theme_directory() {
		global $wpdb;

		$new_theme = new Theme;

		$action = (!empty($_POST['theme_action'])) ? $_POST['theme_action'] : NULL;
		$name = (!empty($_POST['theme_name'])) ? $_POST['theme_name'] : NULL;
		$file_code = (!empty($_POST['file_code'])) ? $_POST['file_code'] : NULL;
		$new_name = (!empty($_POST['new_name'])) ? $_POST['new_name'] : NULL;

		//my migration if sth goes wrong
		//update_option('newsletter_artisan', array( "active_theme" => "basic_theme", "themes" => array() ));
		if ( !is_admin() ) {
			echo "you are not an administrator!";
			die();
		}

		switch ($action) {
			case "init":
			$new_theme->init( $name );
			break;

			case "delete_theme":
			$new_theme->deleteDir( $name );
			break;

			case "upload_file":
			$new_theme->uploadImage( $name );
			break;

			case "edit_file":
			$new_theme->editTemplate( $name );
			break;

			case "save_template":
			$new_theme->saveTemplate( $name, $file_code );
			break;

			case "rename_theme":
			$new_theme->renameTheme($name, $new_name);
			break;
		}
		die();
	}

//var_dump( dirname(__FILE__), ABSPATH );

//delete_option('newsletter_artisan');

	/* END - Create theme */
	//other actions
	add_action( 'admin_menu', 'na_init' );
	//actions for Ajax Posts
	add_action( 'wp_ajax_change_theme', 'change_theme' );
	add_action( 'wp_ajax_my_action', 'select_posts' );
	add_action( 'wp_ajax_create_theme', 'action_theme_directory');


	/* END -REPOSD TO EVENTS */

	register_activation_hook( __FILE__, 'artisan_activation' );
	register_deactivation_hook( __FILE__, 'artisan_deactivation' );