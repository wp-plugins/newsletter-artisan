window.jQuery = require('jQuery');
window._ = require('_');
window.Backbone = require('Backbone');
var CodeEditor = require('./CodeEditor');
process.istest = true;

describe("A CodeEditor module initialize function", function() {
  it("should throw error if no module was passed to the view", function() {

  	var codeEditor = function() {
  		return new CodeEditor();
  	}

    expect(codeEditor).toThrowError('model was not defined');
  });
});

/*
describe("A CodeEditor module template", function() {
	var firstSnippet = '<div style="width: 100%; min-height: 100px; border: 1px solid grey; background: white"><img style="float:left; width: 50px; height: 50px;padding: 5px;" src="http://www.bakesforbreastcancer.org/wp-content/uploads/2012/03/sun.jpg"><h2>Preview</h2><p>You can see the preview to the right.</p><p>Enjoy...</p></div>';
	var codeEditor = function() {}


	//moch model
	beforeEach(function() {

		try {
			
			var CodeEditorModel = Backbone.Model.extend({});
			var test_model =  new CodeEditorModel({
				currentCode: firstSnippet
			});

			codeEditor = new CodeEditor({
				model: test_model
			});

			console.log('test ', test_model)
			
		} catch(err) {}

		return codeEditor;
	});


	it("should return template html type string", function() {

		console.log(codeEditor.template)

		expect("string").toEqual("string");
	});

});

*/