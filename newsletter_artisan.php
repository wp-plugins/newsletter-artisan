<?php
define( 'DISALLOW_FILE_EDIT', true );
   /*
   *Plugin Name: Newsletter Artisan
   *Description: Newsletter Artisan is a dynamic newsletter builder. It was created to allow you to build a showcase of newsletters with dynamic content.
   *Version: 1.0.0
   *Author: Damian Stefaniak
   *Author URI: http://www.dcthomson.co.uk and http://dstefaniak.co.uk
   */

   	/* App configuration and util */
	require_once('app/util/util.php');
	$config = require_once('app/configuration/configuration.php');

	/* REST api */
	require_once('app/network/nodes_network/NodesNetwork.php');
	require_once('app/network/theme_network/ThemeNetwork.php');

	/* set internal plugin configuration defaults */
	$GLOBALS['NA_configuration'] = $config;

    //add styles for the admin ui
    function enqueue_admin_scripts() {
    	//add styles and scripts for the admin ui
    	$js_deps = array( 'backbone', 'jquery' );

	    if (is_admin()) {
		    wp_enqueue_style( 'main', plugins_url('public/dist/assets/css/main.css', __FILE__), false, "1.0.0", "screen");
		    wp_enqueue_script( 'app', plugins_url('public/dist/assets/js/app.js', __FILE__), $js_deps);
		}
		get_cust_plugin_dir(plugin_dir_path(__FILE__));
	}

    function artisan_activation() {
    	//create NA db
        //check if the old themes are available and create new themes out of theme
        //next remove the old themes

    }
    function artisan_deactivation() {
    	//temporary state don't remove any NA data from db
    }

    function artisan_uninstall() {
        //update_option('newsletter_artisan', array());
        delete_option('newsletter_artisan');
    }

    /* UI build 
    * those two functions will get two modules responsible passing data to client
    * data will consist of themes and posts information
    */
	function manage_newsletter_posts() {
		check_if_kill('You do not have sufficient permissions to access this page.');
		enqueue_admin_scripts();
		require_once('app/templates/admin_post.php');
	}

	function manage_na_theme() {
		check_if_kill('You do not have sufficient permissions to access this page.');
		enqueue_admin_scripts();
		require_once('app/templates/theme_changer.php');
	}

	/* END - UI build */
	function na_init() {
		//add styles and scripts
		add_menu_page( 'adestra_newsletter', 'Artisan', 'manage_options', 'adestra_newsletter_id', 'manage_newsletter_posts', plugins_url('public/img/newsletter_icon.png', __FILE__) );
		add_submenu_page( 'adestra_newsletter_id', 'sub', 'Theme change', 'manage_options', 'theme_adestra_pick', 'manage_na_theme');
	}

	/* ACTION add and activation hooks */
	add_action( 'wp_enqueue_scripts', 'enqueue_admin_scripts' );

	//other actions
	add_action( 'admin_menu', 'na_init' );
	//actions for Ajax Posts
	add_action( 'wp_ajax_themes', 'respThemesNetwork' );

	//add_action( 'wp_ajax_my_action', 'select_posts' );
	add_action( 'wp_ajax_create_theme', 'action_theme_directory');

	add_action( 'wp_ajax_nodes', 'respNodesNetwork');
	

	/* END -REPOSD TO EVENTS */

	register_activation_hook( __FILE__, 'artisan_activation' );
	register_deactivation_hook( __FILE__, 'artisan_deactivation' );
    register_uninstall_hook( __FILE__, 'artisan_uninstall');