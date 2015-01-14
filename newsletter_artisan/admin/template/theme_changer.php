<div class="themeChange_ui">
	<div class="header">
		<h2>Artisan Newsletter theme changer</h2>
		<div class="new_theme">
			<!-- still not available for this version -->
			<button class="action button">New Theme</button>
		</div>
		<div class="help"><p></p></div>

	</div>

	<?php
		foreach( $themes as $theme) {
			if ($theme['name'] == $active_theme) {
			?>
				<figure class="theme active <?php echo $theme; ?>">
					<p class="active">active</p>
					<img src="<?php echo $theme['thumbnail_url']; ?>">
					<figcaption><?php echo $theme['name']; ?></figcaption>
				</figure>
				
			<?php
			} else {
			?>
				<figure class="theme <?php echo $theme; ?>">
					<p class="active">active</p>
					<img src="<?php echo $theme['thumbnail_url']; ?>">
					<figcaption><?php echo  $theme['name']; ?></figcaption>

					<div class="theme_menu">
						<div class="activate">activate</div>
						<!-- still not available for this version-->
							<div class="edit">edit</div>
						<div class="delete">delete</div> 
					</div>
				</figure>
			
			<?php
			}
		}
	?>
</div>
