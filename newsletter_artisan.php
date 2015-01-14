<?php

    /**
     * Template Name: Newletter Artisan
     * Description: A wordpress template for Newsletter Artisan only.. Please do not use it for any other purposes...
      */

    /* helper classes */
    class view {
        function template(array $variables) {
           $this->template = new template;
           $this->template_include = $this->template->template_include($variables);
        }
    }

    class template {
        function template_include(array $variables){
            if($variables){
                extract($variables);
            }

            //find the url in options db
            $o = get_option('newsletter_artisan', array());
            if (!empty($o["plugin_dir"])) {
                include( $o["plugin_dir"] . '/newsletterController.php' );
            } else {
                trigger_error('please visit Artisan page in admin panel first!');
            }
        }
    }
    /* end helpers */

    $args = array(
    'posts_per_page'   => 120,
    'offset'           => 0,
    'category'         => '',
    'orderby'          => 'post_date',
    'order'            => 'DESC',
    'include'          => '',
    'exclude'          => '',
    'meta_key'         => '',
    'meta_value'       => '',
    'post_type'        => get_post_types(),
    'post_mime_type'   => '',
    'post_parent'      => '',
    'post_status'      => 'publish',
    'suppress_filters' => true ); 

    //get the template stored in db
    $o = get_option('newsletter_artisan');
    $posts = get_posts( $args );
    $yesterday = strtotime("yesterday");
    $marked_posts = array();

    foreach ( $posts as $post) {
        $postDate = $post->post_date;
        $postDay = substr( $postDate, 0, 10);
        $postToTime = strtotime($postDay);

        //change this condition if you want to add posts from other days too on the newsletter
        if( $postToTime >= $yesterday) {

            $meta_key = get_post_meta( $post->ID, 'newsletter_key');

            //was the post marked and submited?
            if( $meta_key[0] ) {
                array_push($marked_posts, $post);
            }
        }
    }

    //pass in the post data to newsletter Controller
    $view = new view;
    $vars = array(
        'view' => $view,
        'active_theme' => $o['themes'][$o['active_theme']],
        'marked_posts' => $marked_posts
    );
    $view->template($vars);


?>
