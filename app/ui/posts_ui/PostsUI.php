<?php
/* This Module will repond with data necessary to build UI on client */
$baseAppPath = dirname(__FILE__) . '/../../';
require_once($baseAppPath . 'util/util.php');
require_once('IpostsUI.php');

class PostsUI implements IpostsUI {
    public $allPosts = array();
    public $newsletterLink = "";
    private $postsToShare = array();

    private function getNewsletterLink() {
        $archive_pages_args = array(
            'meta_key' => '_wp_page_template',
            'meta_value' => 'newsletter_artisan.php'
        );
        $this->newsletterLink = get_pages( $archive_pages_args );
    }

    private function getPostsFromDate() {
        $period = show_posts_from();

        $args = array(
            'date_query' => array(
                array(
                    'column' => 'post_date_gmt',
                    'after'  => $period,
                )
            ),

            'posts_per_page'   => 200,
            'offset'           => 0,
            'category'         => '',
            'orderby'          => 'post_date',
            'order'            => 'DESC',
            'include'          => '',
            'exclude'          => '',
            'meta_key'         => '',
            'meta_value'       => '',
            'post_type'        => array_values(get_post_types()),
            'post_mime_type'   => '',
            'post_parent'      => '',
            'post_status'      => 'publish',
            'suppress_filters' => true
        );
        $query = new WP_Query( $args );
        $this->modifyPostsData($query->posts);
    }

    private function modifySinglePostData($post, $num) {
        $postData = array(
            "num"=>$num + 1,
            "post_data"=>$post
        );

        return $postData;
    }

    private function modifyPostsData($posts) {
        $modifiedPosts = array();
        $modifiedSinglePost = array();

        foreach($posts as $key=>$val) {
            $modifiedSinglePost = $this->modifySinglePostData($val, $key);
            array_push($modifiedPosts, $modifiedSinglePost);
        }

        $this->postsToShare = $modifiedPosts;
    }

    public function displayData() {
        //return the data to client
        echo makeJSON($this->postsToShare);
    }

    public function __construct() {
        if (isNotUnitTest()) {
            $this->getNewsletterLink();
            $this->getPostsFromDate();
        }
    }
}
?>