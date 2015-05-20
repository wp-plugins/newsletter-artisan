<?php
	/**
	* Warning - these methods used all over the app
	*/

	/*
	* Get Customizable Plugin Directory
	* helper function to store plugin directory data
	* initiated at start of the plugin
	* @param type String
	*/
	function get_cust_plugin_dir($dir) {
		$o = get_option('newsletter_artisan', array());

		$o["plugin_dir"] = $dir;
		update_option('newsletter_artisan', $o);
	}

	function get_na_data() {
		return get_option('newsletter_artisan', array());
	}

	function check_if_kill($text) {
    	if ( !current_user_can( 'manage_options' ) )  {
			wp_die( __($text) );
		}
    }

    //http://php.net/manual/en/function.stripslashes.php
    function removeslashes($string){
	    $string=implode("",explode("\\",$string));
	    return stripslashes(trim($string));
	}

    /* Check if the user is an administrator */
    function check_if_admin() {
    	if (!is_admin()) {
			trigger_error('You are not an admin.', E_USER_ERROR);
		}
    }

    function throwServerError($message) {
		throw new ErrorException($message, 10);
		die();
    }

    function throwClientError($message) {
    	$error_data = array(
    		"type"=>"error",
    		"data"=>$message
    	);
    	echo makeJSON($error_data);
    }

    function app_error($message) {
    	throwClientError($message);
		throwServerError($message);
    }

    function informClient($message) {
    	$confirm_data = array(
    		"type"=>"confirm",
    		"data"=>$message
    	);
    	echo makeJSON($confirm_data);
    }

    /*
	* Enable Communication
	* utility function for ajax calls
	* @param $postName type array
	* @param $callback type function
	* 
    */
    function handleAction($postName = array(), $callback) {    			
    	//make sure all permissions are met and callback is there
		if (!is_admin()) {
			throwServerError('You are not an admin.');
		} elseif (!!empty($callback)) {
			throwServerError('php method for ajax callback not defined.');
			die();
		} elseif (!!empty($postName)) {
			throwServerError('no postName defined in util.php');
		} elseif (sizeof($postName) > 5) {
			throwServerError('too many calls from client.');
		}

		foreach($postName as $key) {
			$act = (!empty($_POST[$key])) ? $_POST[$key] : NULL;

			//validation
			if (!is_string($act["route"])) {
				throwServerError("wrong type in handleAction function");
			}

			call_user_func($callback, $act);
		}

		die();
    }

    /*
	* convert array to JSON for JavaScript on client
    */
    function makeJSON($arrayData) {
    	return json_encode($arrayData, JSON_FORCE_OBJECT);
    }

    function isNotUnitTest() {
    	return function_exists('get_posts');
    }

    //check if the admin moved the theme file to the active theme folder
    function is_WP_NA_theme_moved() {
		$archive_pages_args = array(
		    'meta_key' => '_wp_page_template',
		    'meta_value' => 'newsletter_artisan.php'
		);
		$archive_pages = get_pages( $archive_pages_args );

		return count( $archive_pages ) === 1;
	}

	/**
	* Get the date from DB or default set in configuration
	*/
	function show_posts_from() {
		//todo settings tab in admin
		//to change default configuration
		return $GLOBALS['NA_configuration']['show_posts_from'];
	}

	//recursive array search by tony -> http://php.net/manual/en/function.array-search.php
	function recursive_array_search($needle, $haystack) {
	    foreach($haystack as $key=>$value) {
	        $current_key=$key;
	        if($needle===$value OR (is_array($value) && recursive_array_search($needle,$value) !== false)) {
	            return $current_key;
	        }
	    }
	    return false;
	}

?>