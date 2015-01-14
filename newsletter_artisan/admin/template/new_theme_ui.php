
<div class="newTheme_ui">
	<div class="close">X</div>
	<div class="header">
		<h2>3 Steps Theme Creator</h2>
		<p></p>
		<div class="loader">
			<img src="<?php echo plugins_url() . '/newsletter_artisan/admin/res/loader.gif' ?>">
		</div>
	</div>
	<div class="ui_wrapper one">
		<div class="num">1</div>
		<p>Name your new theme:</p>
		<input type="text"><span>_theme</span>
		<button class="action button">next</button>
	</div>

	<div class="ui_wrapper two">
		<div class="num">2</div>
		<p>Upload your thumbnail</p>

		<input id="uploadInput" type="file">
		<p class="upload_help">thumbnail size</p>
		<div class="helpers">
			<p><span class="left_help">Maximum Size:</span> <span class="right_help">50kb</span></p>
			<p><span class="left_help">Best dimensions: </span><span class="right_help">170x145</span></p>
			<p><span class="left_help">File type:</span> <span class="right_help">jpg</span></p>
		</div>
		<div class="dragSurface"></div>
		<div class="buttons_action">
			<button class="action button prev">previous</button>
			<button class="action button uploadButton">Upload</button>
		</div>
	</div>

	<div class="ui_wrapper three">
		<div class="edit_head">
			<div class="num">3</div>
			<p>Paste in or edit your code for the newsletter template.</p>
			<div class="code_editor" id="code_editor"></div>
			<div class="buttons_action">
				<button class="action button prev">previous</button>
				<button class="action button save">save</button>
				<button class="action button save_and_close">save and close</button>
			</div>
		</div>
	</div>
</div>