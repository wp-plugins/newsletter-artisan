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
	        include( $variables['template_path']);
	    }
	}
	/* end helpers */

	//display
	//go through all of the available templates

	$my_themes_array = get_option('newsletter_artisan');
	$themes_avail = array();

	foreach($my_themes_array['themes'] as $item) {
		array_push($themes_avail, $item);
	}

	$theme_set = get_option('newsletter_theme');

	//load in 'theme_changer.php' main theme changer view
	//pass in the post data to newsletter theme changer
	$main_theme_changer = new view;
	$vars = array(
	    'view' => $main_theme_changer,
	    'themes' => $themes_avail,
	    'active_theme' => $my_themes_array['active_theme'],
	    'template_path' => "template/theme_changer.php"
	);
	$main_theme_changer->template($vars);

	/* Theme Creator */
	//load in 'new_theme_ui.php'
	
	$new_theme_ui = new view;
	$new_var = array(
		'template_path' => "template/new_theme_ui.php"
	);
	$new_theme_ui->template($new_var);

	/* END - Theme Creator */

	/* Theme Editor */
	//load in 'edit_theme_ui.php'
	
	$edit_theme_ui = new view;
	$edit_var = array(
		'template_path' => "template/edit_theme_ui.php"
	);
	$edit_theme_ui->template($edit_var);

	/* END - Theme Editor */
?>