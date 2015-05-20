var Events = require('../Events/Events');
var E = require('../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
var Mustache = require('../../libs/Mustache/Mustache');
var Template = require('../Templates/SideNavigation.html');
var util = require('../Util/Util');
var $ = jQuery;
var ev = new Events();
var translate = require('../Configuration/i18n/i18n');

//help modules
var postCodeHelpModule = require('../InfoBox/helpModules/postCodeHelp');


var EditThemeSideNavigation = Backbone.View.extend({
	el: '.sideNavigation',
	state: "hidden",
	editState: "hidden",
	makeSureDrawer: "hidden",
	originalModelRef: {},

	dataModel: {
		theme_id: "",
		theme_name: "",
		theme_code: "",
		post_code: "",
		creation_date: "",
			active_theme: false
	},

	template: function() {
		if (this.model) {
			return Mustache.to_html(Template, this.model.toJSON());
		} else {
			throw new Error('model was not defined');
		}
	},

	events: {
		"click .closeNav": "hideNavigation",
		"click .edit": "themeEdit",
		"click .delete": "deleteThemeInit",
		"click .update": "updateTheme",
		"click .editThemeCode": "editThemeCode",
		//"focusout .editThemeName": "updateTemporaryModelWithEditorThemeName",
		"click .yesDelete": "isUserSure",
		"click .noDelete": "isUserNotSure",
		"click .deleteAllThemes": "deleteAllThemes",
		"click .editPostCode": "editPostCode",
		"click .activeTheme": "activeTheme"
	},

	setEvents: function() {
		//listen for code mirror events
		ev.listen(E.EVENTS.CODE_EDITOR.SAVE, function() {
			if (this.state !== "open") return; 

			switch (Backbone.App.Views.themeCodeEditorView.currentlyEditing) {
				case "themecode_edit":

					this.updateTemporaryModelWithEditorThemeCode();

					//close the editor
					Backbone.App.Views.themeCodeEditorView.closeEditor();

					//feedback
					Backbone.App.Views.infoBox.inform('Theme Code has been updated. Now update the theme...');
					break;
				case "postcode_edit":
					this.updateTemporaryModelWithEditorPostCode();

					//close the editor
					Backbone.App.Views.themeCodeEditorView.closeEditor();

					//feedback
					Backbone.App.Views.infoBox.inform('Post Code has been updated. Now update the theme...');
					break;
			}
		}.bind(this));

		//listen for cover ui events
		ev.listen(E.EVENTS.COVER.CLOSED_FIRED, function() {
			if(this.state === "open") {
				$(this.el).addClass('disabled');
				//clear temporary model
				this.clearTemporaryThemeModel();
				this.hideEditDrawer();
				this.closeMakeSure();
				this.showThemeCreateButton();

				this.editState = "hidden";
			}	
		}.bind(this));

		ev.listen(E.EVENTS.CODE_EDITOR.HELP.OPEN, function() {
			//check what code editor is doing
			if (Backbone.App.Views.themeCodeEditorView.currentlyEditing === "postcode_edit") {
				this.openPostEditHelp();
			}
		}.bind(this));
	},

	initialize: function() {
		this.setEvents();
		this.render();
	},

	initEdit: function(modelForManipulation) {
		//data manipulation
		this.copyToTemporaryMemory(modelForManipulation);

		this.populateDOM();
	},

	populateDOM: function() {
		var themeName = this.model.get("theme_name");
		var themeCode = this.model.get("theme_code");

		this.populateName(themeName);
		this.populateCodeEditor(themeCode);
	},

	resetDOM: function() {
		$(this.el).find('.editThemeName input').val('');
		this.resetThemeCodeEditor();
	},

	populateName: function(themeName) {
		$(this.el).find('.editThemeName input').val(themeName);
	},

	populateCodeEditor: function(themeCode) {
		Backbone.App.Views.themeCodeEditorView.injectCode(themeCode);
	},

	resetThemeCodeEditor: function() {
		Backbone.App.Views.themeCodeEditorView.injectCode("\n<p>code here</p>\n");
	},

	activeTheme: function() {
		var theme_name = this.model.get('theme_name');

		var activateData = {
			action: 'themes',
	        themes_action: {
	        	route: 'changeActiveTheme',
	        	themes_data: {
					active_theme: theme_name
	        	}
	        }
		};

		Backbone.fetchData(activateData, function(feed, resp) {
			this.hideNavigation();

			Backbone.App.Views.themesListView.resetView();
			Backbone.App.Views.themesListView.getThemes(
				Backbone.App.Views.themesListView.render
			);

			ev.fire(E.EVENTS.DOCUMENT.THEME.ACTIVATED);
		}.bind(this));
	},

	/**
	* copy the theme model to temporary model
	* after each edit the model must be cleaned
	*/
	copyToTemporaryMemory: function(modelForManipulation) {
		//copy model reference
		this.originalModelRef = modelForManipulation;

		var clone = modelForManipulation.clone();

		//copy model
		this.model.set(clone.toJSON());
		ev.fire(E.EVENTS.DOCUMENT.THEME.EDIT.CLONED);
	},

	clearTemporaryThemeModel: function() {
		this.model.set(this.dataModel);
	},

	updateOriginalThemeModel: function() {
		this.originalModelRef.set(this.model.toJSON());
	},

	updateTheme: function() {
		if (this.editState === "open") {
			this.hideEditDrawer();
			this.closeMakeSure();
			this.editState = "hidden";
		}

		this.updateTemporaryModelWithEditorThemeName();

		this.updateOriginalThemeModel();
		this.hideNavigation();
	},

	/* code mirror - editor */
	editThemeCode: function(e) {
		e.stopImmediatePropagation();
		var currentCode = this.model.get("theme_code");

		//open editor
		//the theme code should already be there
		Backbone.App.Views.themeCodeEditorView.openEditor();
		Backbone.App.Views.themeCodeEditorView.injectCode(currentCode);
		Backbone.App.Views.themeCodeEditorView.currentlyEditing = "themecode_edit";

		this.themeMarkAsUpdated();
	},


	openPostEditHelp: function() {
		var msg = postCodeHelpModule();
		var opts = {
			heading: 'Post Edit Properties'
		};
		util.displayHTML(msg, opts);
	},

	editPostCode: function(e) {
		e.stopImmediatePropagation();
		var currentCode = this.model.get("post_code");

		//open editor
		//the theme code should already be there
		Backbone.App.Views.themeCodeEditorView.openEditor();
		Backbone.App.Views.themeCodeEditorView.injectCode(currentCode);
		Backbone.App.Views.themeCodeEditorView.currentlyEditing = "postcode_edit";

		this.themeMarkAsUpdated();
	},

	updateTemporaryModelWithEditorThemeCode: function() {
		this.informAboutChanges("theme_code");

		this.model.set({
			"theme_code": Backbone.App.Views.themeCodeEditorView.getCurrentCode()
		});
	},

	updateTemporaryModelWithEditorPostCode: function() {
		this.informAboutChanges("post_code");

		this.model.set({
			"post_code": Backbone.App.Views.themeCodeEditorView.getCurrentCode()
		});
	},

	updateTemporaryModelWithEditorThemeName: function() {
		var newName = this.getEditedThemeName();
		var oldName = this.model.get('theme_name');

		if (!newName) {
			throw Error('name updated but returned undefined');
		}

		if (!this.validateName(newName)) return;

		this.model.set({
			"theme_name": newName,
			"theme_oldname": oldName
		});

		this.themeMarkAsUpdated();
		this.informAboutChanges("name");
	},

	/* end code editor */

	/* theme name edit */
	validateName: function(newName) {
		//max length from config
		var maxLength = AppConfig.Application.Theme.Name.MaxLength;
		//min length from config
		var minLength = AppConfig.Application.Theme.Name.MinLength;

		if (newName.length < minLength) {
			Backbone.App.Views.infoBox.inform('Your new name is too short. It has to be more than 5 characters.');
			return false;
		} else if (newName.length > maxLength) {
			Backbone.App.Views.infoBox.inform('Your new name is too long. It cannot be more than 25 characters.');
			return false;
		}

		return true;
	},

	//inform about what changed in the model
	//e.g. name, code
	informAboutChanges: function(change) {
		var changes = this.model.get("changed") || [];

		if (changes.indexOf(change) === -1) {
			changes.push(change);

			this.model.set({
				changed: changes
			});
		}
	},

	clearInformationAboutChanges: function() {
		this.model.set({
			changed: []
		});
	},

	//mark the theme as updated
	themeMarkAsUpdated: function() {
		this.model.set({
			updated: true
		});
	},

	getEditedThemeName: function() {
		var editedThemeName = $(this.el).find('.editThemeName input').val();
		return editedThemeName;
	},

	/* end theme edit */

	render: function() {
		//main wrapper
		this.$el.html( this.template() );

       	return this;
	},

	showEditDrawer: function() {
		$(this.el).find('.editSubNav').addClass('active');
		this.editState = "open";

		if (this.makeSureDrawer === "open") {
			this.toggleMakeSureDrawer();
		}
	},

	hideEditDrawer: function() {
		$(this.el).find('.editSubNav').removeClass('active');
	},

	themeEdit: function(e) {
		if (this.editState === "open") {
			this.hideEditDrawer();
			this.editState = "hidden";

		} else {
			this.showEditDrawer();
			this.editState = "open";
		}

		e.preventDefault();
	},

	/* delete theme */
	toggleMakeSureDrawer: function() {
		if (this.makeSureDrawer === "open") {
			this.closeMakeSure();
			this.makeSureDrawer = "hidden";
		} else {
			this.openMakeSure();
			this.makeSureDrawer = "open";
		}
	},

	openMakeSure: function() {
		$(this.el).find('.makeSure').addClass('active');
	},

	closeMakeSure: function() {
		$(this.el).find('.makeSure').removeClass('active');
	},

	toggleThemeCreateButton: function() {
		if (this.editState === "open") {
			Backbone.App.Views.themeRoutes.hideCreateThemeButton();
		} else {
			Backbone.App.Views.themeRoutes.showCreateThemeButton();
		}
	},

    showThemeCreateButton: function() {
        Backbone.App.Views.themeRoutes.showCreateThemeButton();
    },

	deleteSingleThemeFromDB: function(model, cb) {
		var tn = model.get("theme_name");

		var dataDeleted = {
			action: "themes",
			themes_action: {
			  route: "deleteSingleTheme",
			  themes_data: {
			    theme_name: tn
			  }
			}
		};

		//update server about the change
		Backbone.fetchData(dataDeleted, function(data, feed) {
			if (feed === "success" && !!cb) {
				cb();
			}
		});
	},
	/* confirm with user if he wants to delete the theme */
	isUserNotSure: function() {
		this.toggleMakeSureDrawer();
		Backbone.App.Views.infoBox.inform('The Theme ' + this.model.get("theme_name") + ' still exists...');
	},
	//delete theme
	isUserSure: function() {
		var that = this;

		this.deleteSingleThemeFromDB(this.model, hideSidebarOpts);

		//clear temporary memory
		this.clearTemporaryThemeModel();

		//delete model from collection
		Backbone.App.Collections.themesCollection.remove(this.originalModelRef);

		function hideSidebarOpts() {
			//close the side navigation
			that.hideNavigation();
			that.toggleMakeSureDrawer();
		}
	},

	deleteThemeInit: function() {
		if (this.editState === "open") {
			this.hideEditDrawer();
		}

		//make sure the user action
		this.toggleMakeSureDrawer();
	},

	showNavigation: function(modelForManipulation, elementCooridates) {
		$(this.el).removeClass('disabled');
		this.state = "open";
		Backbone.App.Views.cover.show();
		this.positionNavigation(elementCooridates);
		this.initEdit(modelForManipulation);
	},

	positionNavigation: function(coords) {
		$(this.el).css('left', coords.x + 'px');
		$(this.el).css('top', coords.y + 'px');
	},

	hideNavigation: function() {
		if (this.editState === 'open') {
			this.hideEditDrawer();
			this.closeMakeSure();
			//clear new theme button
			this.toggleThemeCreateButton();
			this.editState = "hidden";


		}

        this.showThemeCreateButton();

		$(this.el).addClass('disabled');
		this.state = "hidden";
		ev.fire(E.EVENTS.COVER.CLOSED_FIRED);

		//clear temporary model
		this.clearTemporaryThemeModel();
		//clear DOM
		this.resetDOM();

		//order to update the collection
		ev.fire(E.EVENTS.DOCUMENT.THEME.POST_UPDATE);

	},
	deleteAllThemes: function() {
		var confirmation = confirm("Do you really want to remove ALL of the themes permanently? This process is irreversible.");
		if (!confirmation) return;

		var deleteData = {
			action: "themes",
			themes_action: {
			  route: "deleteAllThemes"
			}
		};

		function cb (d, feed) {
			if (feed === "success") {
				util.throwInfo("All of the themes were deleted.");
			} else {
				util.throwInfo("Something went wrong...");
			}
		}

		Backbone.fetchData(deleteData, cb);
	}
});

module.exports = EditThemeSideNavigation;