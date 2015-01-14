<div class="adestra_post" data-id="<?php echo $post_data->ID ?>">
	
	<div class="postData">
		<div class="an_num">
			<p><?php echo $num; ?>.</p>
		</div>
		<div class="an_elem check">
			<input type="checkbox">
		</div>

		<div class="an_title">
			<h3><a target="_blank" href="<?php echo $post_data->guid; ?>"><?php echo $post_data->post_title ?></a></h3>
		</div>
		<div class="an_elem postDate">
			<p><?php echo $post_data->post_date ?></p>
		</div>

	</div>
</div>