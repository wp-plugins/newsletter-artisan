(function ($) {
	$(document).ready(function($) {

		/* Post Pick PANEL
		* POST FUNCTIONALITY 
		* check which posts were are to be included with the new newsletter
		*/

		var inputElems = $('.adestra_post .an_elem input'),
			inputLen = $('.adestra_post .an_elem input').length;

		function error_information( resp_string ) {
			var msg = '';

			switch (resp_string) {
				case 'select_posts':
					var msg = 'You have to select some posts for the newsletter before you click Publish.';
				break;
				case 'create_one_na_page':
					var msg = 'You have to create a wordpress page using "Newsletter Artisan" template. Remember to use the template only for ONE page. (see Readme file)';
				break;
				case 'no_active_theme':
					var msg = 'You have to create and activate a theme before you publish anything';
				break;
				default:
					var msg = 'If that message will appear again contact "dstefaniak@dcthomson.co.uk"';
			}
			$('.server_feed .err .additional_help').text( msg );
		}

		//onsubmit
		function onANSubmit () {
			/* check which posts were ticked */
			var newPosts = []
			
			$(inputElems).each(function(i) {

				if ( $(this).is(':checked') ) {
					newPosts.push( $(this).parent().parent().parent().attr('data-id') );
				}
				
				//when we finish iteration post the array to server
				if (inputLen-1 === i) {
					//post the data to the server to update post meta data
					//ajaxurl is always defined in the admin header and points to admin-ajax.php

					var data = {
				        action: 'my_action',
				        posts: newPosts
				    };

					$.post(ajaxurl, data, function(response) {
						//hide all info 
						$('.suc, .err, .link').hide();

						if (response === "true") {
							$('.suc').fadeIn(300, function() {
								setTimeout(function(){
									$('.suc').slideUp(500);
								}, 5000);
							});
							$('.link').fadeIn(800);
						} else {
							error_information( response );
							$('.err').fadeIn(800);
						}
					});
				}
			});
		};

		/* Button tick input */
		function tick ( change_prop ) {
			$('.an_elem input').each(function () {
				$(this).prop('checked', change_prop);
			})
		}

		$('#submitAN').on('click', function() {
			onANSubmit();
		});

		/* END - MAIN FUNCTIONALITY */

		/* HELP SHOW/HIDE */

		$('.help_button').on('click', function () {
			$('.help_content').slideToggle();
		});

		$('.t_input').on('click', function () {
			if ( $(this).hasClass('marked') ) {
				tick( false );
				$(this).removeClass('marked');
			} else {
				tick( true );
				$(this).addClass('marked');
			}
		});

		/* END HELP */
		/* END - Post pick panel */

		/* Theme Upload PANEL */
		/* show / hide theme Creator */
		//main panel "theme creator"
		var New_theme = function () {
			this.new_theme_name = '';
			this.process_finished = false;
			this.panel_no = 1;	

			this.fetch = function ( data, callback, scope ) {
				$.post(ajaxurl, data, function ( response ) {
					if ( !!callback ) {
						callback.call(scope, response);
					}
				});
			}

			this.on_delete = function ( sel ) {
				var that = this,
					data = {
					action: 'create_theme',
					theme_action: 'delete_theme',
					theme_name: $(sel).parent().parent().find('figcaption').text()
				};
				$.post(ajaxurl, data, function (response) {
					if (response === "deleted") {
						$('.help p').text('Theme was successfully deleted.');
						that.empty_help_text();
						$(sel).parent().parent().fadeOut(500, function () {
							$(this).remove();
						});
					} else {
						$('.help p').text('Oops something went wrong');
						that.empty_help_text();
					}
				});
			};
		};

		New_theme.prototype = {
			show_help: function () {
				$('.helpers').slideToggle()
							 .toggleClass('act');
			},
			toggleLoader: function (state) {
				switch (state) {
					case "on":
					$('.loader').slideDown();
					break;
					case "off":
					$('.loader').slideUp();
					break;
				}
			},
			sh_themCreator: function ( switch_button ) {
				(switch_button) ? $('.newTheme_ui').slideDown(200) : $('.newTheme_ui').slideUp(150);
			},
			closeCreator: function () {
				var that = this,
					_this = this.closeCreator;

				_this.return_to_first_step = function () {
					switch ( that.panel_no ) {
						case 2:
						that.changePanel( 2, 1 );
						break;

						case 3:
						that.changePanel( 3, 2 );
						that.changePanel( 2, 1 );

						break;
					}
				}
				//if the process is finished - 3rd panel
				//clear the objects
				//clear DOM and prepare for the new theme creation
				//shut down creator
				if ( this.process_finished ) {
					//clear objects
					that.new_theme_name = '';
					//slide up
					that.sh_themCreator( false );
					//clear DOM
					$('.ui_wrapper input').val('');
					$('.ui_wrapper.three textarea').val('');
					that.process_finished = false;
					_this.return_to_first_step();
					
				} else {
					//if process was not finised - 1st and 2nd panel
					if (confirm('You have not finished. Do you want to delete the theme you are creating now?')) {
						//clear DOM
						$('.ui_wrapper input').val('');

						//if you quit on the first panel
						if (that.panel_no === 1) {
							//slide up
							that.sh_themCreator( false );
							//clear objects
							that.new_theme_name = '';
							return;				
						}
						//delete the theme backend
						that.on_delete( $('.' + that.new_theme_name + ' .delete') );
						//clear objects
						that.new_theme_name = '';
						//slide up
						that.sh_themCreator( false );
						_this.return_to_first_step();
					}
				}

			},
			//3 step panel
			changePanel: function ( from, to ) {
				if (from === 1 && to === 2) {
					this.panel_no = 2;
					$('.ui_wrapper.two').show();
					$('.ui_wrapper.one').hide();
				} 

				if (from === 2 && to === 1) {
					this.panel_no = 1;
					$('.ui_wrapper.one').show();
					$('.ui_wrapper.two').hide();
				}

				if (from === 2 && to === 3) {
					this.panel_no = 3;
					$('.ui_wrapper.three').show();
					$('.ui_wrapper.two').hide();
				}

				if (from === 3 && to === 2) {
					this.panel_no = 2;
					$('.ui_wrapper.two').show();
					$('.ui_wrapper.three').hide();
				}
			},
			help: function ( text ) {
				$('.newTheme_ui .header p').text( text );
				setTimeout( function ( text ) {
					$('.newTheme_ui .header p').text( ' ' );
				}, 3000);
			},

			appendNewThemeToList: function () {
				var html = '<figure class=\"theme ' + this.new_theme_name + '\"><p class=\"active\">active</p><img src=\"\"><figcaption>' + this.new_theme_name + '</figcaption><div class=\"theme_menu\"><div class=\"activate\">activate</div><div class=\"edit\">edit</div><div class=\"delete\">delete</div> </div></figure>';
				$('.themeChange_ui').append( html );
			},
			//create directory for the theme
			createDir: function ( new_dir_name, new_theme ) {
				var that = this;

				this.toggleLoader('on');
				//create new theme
				if (!this.new_theme_name && new_theme !== this.new_theme_name) {
					var callback = function (response) {
						that.toggleLoader('off');

						if (response === "created") {
							that.help( 'New blank theme created.' );
							$('.ui_wrapper.two .button').show(300);

							that.changePanel( 1, 2 );
							that.new_theme_name = new_theme;
							that.appendNewThemeToList( );
						} else {
							that.help( response );
						}
					};
					//post data
					that.fetch( new_dir_name, callback, that );
				} else {
					var data = {
						action: "create_theme",
						theme_name: that.new_theme_name,
						theme_action: "rename_theme",
						new_name: new_theme
					},
					callback = function (response) {
						that.toggleLoader('off');

						if (response === "renamed") {
							that.help( 'Theme successfully renamed.' );
							$('.ui_wrapper.two .button').show(300);
							that.changePanel( 1, 2 );
							that.new_theme_name = new_theme;
						} else {
							that.help( response );
						}
					};
					//post data
					that.fetch( data, callback, that );
				}
			},
			uploadFile: function () {
				var that = this;
			    var file_data = $('#uploadInput').prop('files')[0],   
			    	form_data = new FormData();

			    form_data.append('file', file_data);
			    form_data.append('action', 'create_theme');
			    form_data.append('theme_action', 'upload_file');
			    form_data.append('theme_name', this.new_theme_name);
			    that.toggleLoader('on');

			    //special fetch for upload
			    $.ajax({
	                url: ajaxurl,
	                dataType: 'text',
	                cache: false,
	                contentType: false,
	                processData: false,
	                data: form_data,                         
	                type: 'post',
	                success: function(response) {
	                	that.toggleLoader('off');
	                    if (response !== "error") {
							$('.uploadButton').addClass('next').text('next');
							that.help('Thumbnail successfully uploaded.');
							that.toggleLoader('off');
							//append the thumbnail
							$('.' + that.new_theme_name + ' img').attr('src', response);
						} else {
							that.help( 'Please check the file size, it\'s type and try again.' );
						}
	                }
			     });
			},
			editTemplate: function () {
				var that = this,
					data = {
						action: "create_theme",
						theme_action: "edit_file",
						theme_name: this.new_theme_name
					},
					is_template_loaded = $('#wp-code_editor-wrap').length;

				//show loader
				this.toggleLoader('on');
				//enable closing the creator without theme deletion
				this.process_finished = true;

				if ( is_template_loaded === 0 ) {
					var callback = function (response) {
						$(response).appendTo('#code_editor')
						$('.ui_wrapper.three').addClass('active');
						that.toggleLoader('off');
					};
					//post
					that.fetch( data, callback, that );

				} else {
					$('.ui_wrapper.three').addClass('active');
					that.toggleLoader('off');					
				}
			},
			saveTemplate: function () {
				var that = this,
					data = {
						action: "create_theme",
						theme_action: "save_template",
						theme_name: this.new_theme_name,
						file_code: $('.code_editor textarea').val()
					},
					callback = function (response) {
						(response === "updated") ? that.help( 'Template successfully updated.' ) : that.help( 'Something went wrong. Try again.' );
						that.toggleLoader('off');
					};

				that.toggleLoader('on');
				//post
				that.fetch( data, callback, that );
			},
			validate_one: function ( value ) {
				var that = this;
				//dont let empty string
				if (value.length <= 0 ) {
					that.help( 'Please name your theme' );
					return false;
				} else if (value.length > 8) {
					that.help('Theme name shouldn\'t be more than 8 characters long.');
					return false;
				}
				//dont let spaces in the string
				else if ( value.indexOf(' ') !== -1 ) {
					that.help( 'Please don\'t use spaces' );
					return false;
				} else {
					return true;
				}
			},
			key_validate_one: function ( value ) {
				//dont let empty string
				if (value.length <= 0 ) {
					return false;
				} else {
					return true;
				}
			},
			empty_help_text: function () {
				setTimeout(function() {
					$('.help').find('p').text('');
				}, 4000);
			},
			on_change: function ( sel ) {
				var that = this,
					element = $(sel).parent().parent();

				if ( $(element).hasClass('active')) {
					$('.help').find('p').text('This theme has already been chosen');
					this.empty_help_text();
				} else {
					var data = {
							action: 'change_theme',
							theme: $(element).find('figcaption').text()
						},
						callback = function ( response ) {
							if (response === "true") {
								var stillAcitve = $(element).siblings('.active'),
									cut_element = $(element).find('.theme_menu');
								$(cut_element).appendTo(stillAcitve);
								//change active class
								$(stillAcitve).removeClass('active');
								$(element).addClass('active');
								//add success text
								$('.help p').text('Theme was successfully updated');
								that.empty_help_text();
							} else {
								//add err text
								$('.help p').text('Oops something went wrong. Try again.');
								that.empty_help_text();
							}
							
						};

					//pass args: data, callback, scope
					that.fetch( data, callback, that );
				}
			}
		};

		var New_editor = function () {
			this.theme_name = '';
			this.new_theme_name = '';
			this.theme_code = '';
			this.elements_to_update = ['textarea', 'title'];

			this.loader = function ( switch_button ) {
				(switch_button) ? $('.editTheme_ui .loader').slideDown(200) : $('.editTheme_ui .loader').slideUp(200);
			};
			this.show_editor = function ( switch_button, element ) {
				if (!!element)
				var theme_name = $(element).parent().parent().find('figcaption').text();
				switch (switch_button) {
					case true:
					$('.editTheme_ui').slideDown(200);
					this.openEditor( theme_name );
					break;

					case false:
					$('.editTheme_ui').slideUp(150);
					this.closeEditor();
					break;
				};
			};
			this.fetch = function ( data, callback, scope ) {
				$.post(ajaxurl, data, function ( response ) {
					if ( !!callback ) {
						callback.call(scope, response);
					}
				});
			};
		};

		New_editor.prototype = {
			openEditor: function ( theme_name ) {
				this.theme_name = theme_name;
				this.new_theme_name = theme_name;
				$('.main_ui h3').text( theme_name );
				this.loadCode();
			},
			closeEditor: function () {
				this.theme_name = '';
				
				//unbind all events
				$('.code_editor2 *').unbind();
				//clear html inside editor
				$('.code_editor2').html('');

			},
			loadCode: function () {
				var that = this,
					data = {
						action: "create_theme",
						theme_action: "edit_file",
						theme_name: this.theme_name
					};

				var callback = function (response) {
					that.theme_code = response;
					$(response).appendTo('.code_editor2')
					that.loader(false);
				};
				//post
				that.fetch( data, callback, that );
			},
			update: function () {
				//if inarray textarea
				//push code for textarea
				if ($.inArray('textarea', this.elements_to_update) !== -1) {
					this.updateCode();
				}

				//if inarray title
				//push code for title
				if ($.inArray('title', this.elements_to_update) !== -1) {
					//console.log('update title');
				}

				//if inarray thumbnail
				//push new image
				if ($.inArray('thumbnail', this.elements_to_update) !== -1) {
					//console.log('update thumbnail');
				}

			},
			updateCode: function () {
				this.theme_code = $('.code_editor2 textarea').val();

				var that = this,
					data = {
						action: "create_theme",
						theme_action: "save_template",
						theme_name: this.new_theme_name,
						file_code: this.theme_code
					},
					callback = function (response) {
						//(response === "updated") ? that.help( 'Template successfully updated.' ) : that.help( 'Something went wrong. Try again.' );
						that.loader(false);
					};

				that.loader(true);
				//post
				that.fetch( data, callback, that );
			},
			edit_name: function (name, sel) {
				$(t_sel).find('a, h3').hide();
				$('<a href="#"  style="display:none"><input type="text">_theme</a>').appendTo(t_sel);
				$(t_sel).find('input').val(theme_name).parent().fadeIn(200);
			}
		};

		/* Update the constructor object */
		New_theme.prototype.constructor = New_theme;
		New_editor.prototype.constructor = New_editor;
		/* Create the theme object */
		var theme = new New_theme();
		var editor = new New_editor();

		/* EVENTS execution */
		/* Theme change view */

		//events
		$('.themeChange_ui').on('click', '.activate', function() {
			theme.on_change( $(this) );
		});

		$('.themeChange_ui').on('click', '.delete', function() {
			if (confirm('Are you sure you want to delete this theme?') ) {
				theme.on_delete( $(this) );
			}
		});

		/* END - theme change view */

		/* theme creator view */
		//events
		$('.new_theme button').on('click', function() {
			theme.sh_themCreator( true );
		});

		$('.newTheme_ui .close').on('click', function () {
			theme.closeCreator();
		});

		$('.ui_wrapper.one button').on('click', function () {
			//send a post to create new theme
			var new_dir_name = $(this).parent().find('input').val();
			var data = {
				action: 'create_theme',
				theme_action: 'init',
				theme_name: new_dir_name + '_theme'
			};

			if ( theme.validate_one( new_dir_name ) ) {
				theme.createDir( data, new_dir_name + '_theme' );
			}
		});

		$('.ui_wrapper.one input').on('keyup', function () {
			var new_dir_name = $(this).parent().find('input').val();
			if ( theme.key_validate_one( new_dir_name ) ) {
				$('.ui_wrapper.one .button').show();
			} else {
				$('.ui_wrapper.one .button').hide();
			}
		});

		$('.ui_wrapper.two .prev').on('click', function () {
			theme.changePanel( 2, 1 );
		});

		$('.ui_wrapper.two input[type=file]').on('click', function () {
			var next_upload = $('.ui_wrapper.two .button');
			if ($(next_upload).hasClass('next')) {
				$('.button.next').removeClass('next').text('upload');
			}
		});

		$('.ui_wrapper.two .uploadButton').on('click', function () {
			if ( !$(this).hasClass('next') ) {
				theme.uploadFile();
			}
		});

		$('.ui_wrapper.two').on('click','.button', function () {
			if ($(this).hasClass('next')) {
				theme.changePanel( 2, 3 );
				theme.editTemplate();
			}
		});

		$('.ui_wrapper.three .prev').on('click', function () {
			theme.changePanel( 3, 2 );
		});

		$('.ui_wrapper.three .save').on('click', function() {
			//post the code to the server
			theme.saveTemplate();
		});

		$('.ui_wrapper.three .save_and_close').on('click', function() {
			//post the code to the server
			theme.saveTemplate();
			//close
			$('.newTheme_ui .close').trigger('click');
		});


		$('.ui_wrapper.two .upload_help').on('click', function () {
			theme.show_help();
		});
		/* End - theme creator view */

		/* Theme editor view */
		$('.themeChange_ui').on('click', '.edit', function () {
			editor.show_editor(true, $(this) );
			editor.loader(true);
		});

		$('.themeChange_ui').on('click', '.theme.active', function () {
			alert('you cannot edit active theme');
		});

		$('.editTheme_ui').on('click', '.close_edit', function () {
			editor.show_editor(false);
		});

		$('.editTheme_ui').on('click', '.save_edit', function () {
			editor.update();
		});

		$('.editTheme_ui').on('click', '.save_edit_close', function () {
			editor.update();
			editor.show_editor(false);
		});

		$('.editTheme_ui').on('click', '.title a', function () {
			var theme_name = $(this).siblings('h3').text(),
				t_sel = $(this).parent();

			editor.edit_name( theme_name, t_sel );
		});

		$('.editTheme_ui').on('focusout', '.title input', function () {
			editor.edit_name();
		});

	});

})(jQuery);