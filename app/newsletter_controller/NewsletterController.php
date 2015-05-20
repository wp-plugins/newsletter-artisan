<?php 
	/* Newsletter display/copy */

	/* this controller is responsible for 
	* - recognizing which theme should be used
	* - passing the data about the marked posts to a specific newsletter template
	* - passing data for population of the template - from 'newsletter_artisan.php' (theme folder)
	*/
	//get Mustache
	require_once( plugin_dir_path(__FILE__) . '../../lib/Mustache/Autoloader.php');
	require_once( plugin_dir_path(__FILE__) . '../themes_management/ThemesManagement.php');
	require_once( plugin_dir_path(__FILE__) . '../posts_selection_management/PostsSelectionManagement.php');

	class Newsletter {

		public function initialize() {
			//mustache
			Mustache_Autoloader::register();
			$this->mustache = new Mustache_Engine();
			
			//init classes
			$this->themes_manager = new ThemesManagement();
			$this->posts_selection_managemer = new Posts_Selection();

			//get theme and nodes

			$this->active_theme_template = $this->themes_manager->getActiveTheme();

            //exception for old themes only
            if (!isSet($this->active_theme_template["theme_name"])) {
                echo "There should be your newsletter visible here. There are two posibilities why you see this message.<br>";
                echo "* 1. Check if you have any themes created and activated.<br>";
                echo "* 2. You may be using old theme from Newsletter Artisan version < 1.0. Please update your theme by editing the currently active theme code and posts code.";
                die();
            }

			$this->post_code_template = $this->active_theme_template["post_code"];
			//get posts and html nodes that - nodes collection
			$this->active_nodes_data = $this->posts_selection_managemer->getAllForController();

			//var_dump($this->active_nodes_data["collection"]);
		}

		private function searchMatch($nodeid) {
			$collection = $this->active_nodes_data["collection"];

			foreach($collection as $key => &$val) {
				if ((int)$nodeid === $val->ID) {
					return $val;
				}
			}

		}

		private function arrangePostsData() {
			$newCollection = array();			
			$ordering = $this->active_nodes_data["ordering"];

			foreach($ordering as $key => $val) {

				$newCollection[$key] = $this->searchMatch($val['id']);
			}

			return $newCollection;
		}

		private function getPostsDataHtml() {
			$posts_array = array();
			$collection = $this->arrangePostsData();

			foreach($collection as $single_post) {
				//this is cool piece code...

				//HTML node
				if ($single_post->post_author === 'HTML Node') {
					$single_node_code = str_replace(
						'\\', 
						'', 
						html_entity_decode( $single_post->node_code )
					);

				} else {
					//Post node
					$single_node_code = str_replace(
						'\\', 
						'', 
						html_entity_decode( $this->active_theme_template['post_code'] )
					);
				}

				$post_html = $this->mustache->render( 
					$single_node_code, 
					$single_post 
				);

				//add to array
				array_push($posts_array, $post_html);
			}

			return $posts_array;
		}

		private function buildPostsMustacheObj() {
			$postsData = $this->getPostsDataHtml();

			$posts_html = $this->mustache->render( 
				"{{#postsData}}{{.}}{{/postsData}}", 
				array('postsData'=>$postsData)
			);

			return $posts_html;
		}

		public function render() {

			$posts_html_code = array( "Posts" =>  html_entity_decode($this->buildPostsMustacheObj()) );

			$theme_code = str_replace(
				'\\', 
				'', 
				html_entity_decode( $this->active_theme_template['theme_code'] )
			);

			//this will echo code for the newsletter
			echo $this->mustache->render(
				$theme_code,
				$posts_html_code
			);
		}
	}

	$newsletter = new Newsletter();

	$newsletter->initialize();
	$newsletter->render();

?>