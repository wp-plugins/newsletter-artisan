<?php 
	/* this controller is responsible for 
	* - recognizing which theme should be used
	* - passing the data about the marked posts to a specific newsletter template
	* - passing data for population of the template
	*/
	//get Mustache
	require_once( plugin_dir_path(__FILE__) . 'lib/Mustache/Autoloader.php');
	Mustache_Autoloader::register();

	/* helper classes */
	class new_view {
	    function template(array $variables) {
	       $this->template = new new_template;
	       $this->template_include = $this->template->template_include($variables);
	    }
	}
	class new_template {
		private $cur_date = array();

		private function current_date () {
			$fulldate = getdate();
			$mydate = array(
				"fulldate"=>$fulldate,
				"mday"=>$fulldate["mday"],
				"month"=>$fulldate["month"],
				"year"=>$fulldate["year"]
			);
			$this->cur_date = $mydate;
		}

		private function add_data_to_model () {

			foreach ( $this->template_model['marked_posts'] as $num=>$post) {
		        /* make sure that you cut the post content after the dot sign */
		        if (strlen($post->post_content) <= 150) {
		            $post->post_excerpt = substr($post->post_content, 0, strlen($post->post_content) ) ;
		        } else {
		            $post->post_excerpt = substr($post->post_content, 0, strpos($post->post_content, '.', 150) ) ;
		        }

		        /* add category information to the post */
				$the_category = get_the_category( $post->ID );
				$parent = get_category_parents( $the_category[0]->term_id, false, '/', false);
				$cat = explode('/', $parent);
				//update
				$post->parent_category = $cat[0];
				$post->category = $the_category[0]->name;

				/* add thumbnail */
				$post->thumbnail = get_the_post_thumbnail( $post->ID, array(119, 73) );

				$url = wp_get_attachment_url( get_post_thumbnail_id($post->ID) );
				$post->thumb_link = $url;

				/* add link to post */
				$post->link = get_permalink( $post->ID);
			}
		}

	    function template_include(array $variables) {
	        if ($variables) {
	            extract($variables);
	        }

			$this->template_model = $variables;
			$this->add_data_to_model();
			$this->current_date();

			$variables['date'] = $this->cur_date;
			$m = new Mustache_Engine();
			echo $m->render( str_replace('\\', '', html_entity_decode( $variables['active_theme']['template'] )) , $variables );
	    }
	}
	/* end helpers */

	//pass in the post data to newsletter theme
	$view = new new_view;
	$vars = array(
	    'view' => $view,
	    'active_theme'=>$active_theme,
	    'marked_posts' => $marked_posts
	);
	$view->template($vars);