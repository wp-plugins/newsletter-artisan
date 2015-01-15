<?php

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
	        include('template/admin_post.php');
	    }
	}
	/* end helpers */

	//get Posts
	$args = array(
	'posts_per_page'   => 200,
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

	$posts_array = get_posts( $args );

	/* get the link to the newsletter page 
	* search for the url for the page where the 'newsletter_artisan was used
	*/
	$archive_pages_args = array(
	    'meta_key' => '_wp_page_template',
	    'meta_value' => 'newsletter_artisan.php'
	);
	$archive_pages = get_pages( $archive_pages_args );

?>

<div class="header_adestra">
	<h2>Newsletter Artisan</h2>
	<button id="submitAN" class="button action" value="submit">Publish</button>
	<div class="help_button">how it works</div>
</div>

<div class="adestra_ui">
	<div class="help">
		
		<div class="help_content">
			<h3>Step by step guide</h3>
			<h4>How it works</h4>
			<p>The newsletter builder creates newsletter page HTML structure populated by selected posts. You can choose the theme and make some theme customizations in the 'theme' menu.</p>
			<h4>How to start</h4>
			<ul>
				<li>Choose the articles you want to display - articles from 2 days are available by default (this should be added to options soon).</li>
				<li>Click 'publish' if you are sure about the content of your newsletter.</li>
				<li>After successful update copy newsletter link to clipboard and go to your newsletter project in Adestra.</li>
				<li>Use 'Load URL' option e.g. in Adestra panel to copy the newsletter HTML code to the platform.</li>
				<li>Remember that Adestra copies the newsletter HTML structure not reference to it. If you use 'Load URL' to create a project and then go to wordpress newsletter plugin to make ammendments they won't be visible in you Adestra project until you use 'Load URL' to update the project again.</li>
			</ul>
			<h4>Support</h4>
			<p>If you have got any doubts, questions, or suggestions how to improve the plugin please contact - damianstefaniak1987@gmail.com</p>
	</div>
	<div class="server_feed">
		<div class="feedback">
			<p class="suc">Your newsletter is ready for you. Click the link to preview or copy the link below and go to Adestra. Use the 'Load URL' option.</p>
			<p class="err">Ooops something went wrong. <br><span class="additional_help"></span></p>
		</div>
		<div class="link"><a target="_blank" href="<?php echo $archive_pages[0]->guid; ?>"><?php echo $archive_pages[0]->guid; ?></a></div>
	</div>
</div>

<div class="table_head">
	<div class="t_num">
		<p>no.</p>
	</div>
	<div class="t_input">
		<p>input</p>
	</div>
	<div class="t_title">
		<p>title</p>
	</div>
	<div class="t_date">
		<p>date</p>
	</div>
</div>

<div class="wp-editor-container">

<?php
	//change this variable if you want to get posts from other days too on the newsletter
	$yesterday = strtotime("yesterday");
	$num = 0;

	//display each post in admin panel
	//matching the dates

	foreach ( $posts_array as $post) {
		$postDate = $post->post_date;
		$postDay = substr( $postDate, 0, 10);
		$postToTime = strtotime($postDay);
		$num += 1;

		//change this condition if you want to add posts from other days too on the newsletter
		if( $postToTime >= $yesterday) {
			//pass in the post data to post admin view
			$view = new view;
			$vars = array(
			    'view' => $view,
			    'num' => $num,
			    'post_data' => $post
			);
			$view->template($vars);
		}
	}
?>

</div>