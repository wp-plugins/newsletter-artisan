<?php

	$baseAppPath = dirname(__FILE__) . '/../';
	require_once($baseAppPath . 'util/util.php');
	require_once($baseAppPath . 'nodes/Posts_Nodes.php');

	class PostsSelectionManagement extends Posts_Nodes {

		private function createNode($post) {
			//function present in Nodes_Abstract.php
			$this->add($post);
		}

		/* RESPOND TO EVENTS */
		/* add ajax respond 
		* after user submits the changes update metadata of posts
		*/
		
		private function mark_posts ($marked) {
			/* mark only posts checked and submited by the user
			* unmark the unchecked posts
			*/
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
			$period = show_posts_from();
			$timelimit = strtotime($period);

			foreach ( $posts_array as $post) {

				$postDate = $post->post_date;
				$postDay = substr( $postDate, 0, 10);
				$postToTime = strtotime($postDay);

				//if the post is not older than 2 days
				if( $postToTime >= $timelimit) {

					if ( in_array($post->ID, $marked) ) {

						$this->createNode($post);
						//update_post_meta( $post->ID, 'newsletter_key', true );
					} else {
						update_post_meta( $post->ID, 'newsletter_key', false );
					}
					
				}
			}
		}
		
		public function select_posts ($posts_selected = array()) {
			$na_active_theme = (function_exists("get_option")) ? get_option('newsletter_artisan')['active_theme'] : NULL;
			/* validate select posts page 
			* and feedback client about errors and additional steps that have to be done
			* - check if a theme is activated - you have to activate it as soon as you install the plugin
			* - check if there is a wordpress page using 'newsletter_artisan' template already created - it's needed to display the newsletter
			* - check if any posts were selected when submit
			*/

			if ( is_null( $na_active_theme ) ) {
				throwClientError("no_active_theme");
				throwServerError("No theme was activated yet - function error in postsSelectionManagement.php");
			}

			if ( !is_WP_NA_theme_moved() ) {
				throwClientError('create_one_na_page');
				throwServerError('NA theme file was not moved to active WP theme - function error in postsSelectionManagement.php');
			}

			if ( empty( $posts_selected ) ) {
				throwClientError("select_posts");
				throwServerError('No posts were selected and passed as argument to select_posts function in postsSelectionManagement.php');
			}

			//if all is well mark the posts
			if (is_admin()) {
				//clear the db
				$this->reset();
				//mark the posts
				$this->mark_posts( $posts_selected );
				echo "true";
			}
			
			die();		
		}
	}
?>