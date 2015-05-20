var CodeEditorView = require('../CodeEditor/CodeEditor');
//var Routes = require('../Routes/Routes');

var SnippetsManager = Backbone.View.extend({
	initialize: function() {
		this.render();
	},

	initRoutes: function() {
		//var routes = new Routes();
	},

	runCodeEditor: function() {
		var firstSnippet = '<div style="width: 100%; min-height: 100px; border: 1px solid grey; background: white"><img style="float:left; width: 50px; height: 50px;padding: 5px;" src="http://www.bakesforbreastcancer.org/wp-content/uploads/2012/03/sun.jpg"><h2>Preview</h2><p>You can see the preview to the right.</p><p>Enjoy...</p></div>';

		//init model
		var CodeEditorModel = Backbone.Model.extend({});
		//create an instance of the model
		Backbone.App.Models.codeEditorModel = new CodeEditorModel({
			currentCode: firstSnippet
		});

		//pass mode to view
		Backbone.App.Views.codeEditorView = new CodeEditorView({
			model: Backbone.App.Models.codeEditorModel
		});


		//code editor update

		Backbone.App.Views.codeEditorView.editor.on('update', function(codeEditor) {
			var code = codeEditor.getValue();

			Backbone.App.Models.codeEditorModel.set({
				currentCode: code
			});
		});
	
	},

	render: function() {
		//this.initRoutes();
		this.runCodeEditor();
	}
});

module.exports = SnippetsManager;