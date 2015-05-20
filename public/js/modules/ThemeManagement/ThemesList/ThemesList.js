var Events = require('../../Events/Events');
var E = require('../../Configuration/Events/EventsConfiguration.json');
//application configuration
var AppConfiguration = require('../../Configuration/Application/configuration');
var AppConfig = AppConfiguration();
//template
var Mustache = require('../../../libs/Mustache/Mustache');
var Template = require('../../Templates/ThemesList.html');
var $ = jQuery;
var ev = new Events();

var ThemeListElement = require('../ThemeListElement/ThemeListElement');

var ThemesList = Backbone.View.extend({
  dataModel: {
    theme_id: "",
    theme_name: "",
    theme_code: "",
    post_code: "",
    theme_thumbnail: "",
    creation_date: "",
    active_theme: false
  },

  el: "#ThemeList",

  initialize: function() {
    this.instantiateThemesElementsCollection();
    this.getThemes( this.render );
  },

  setEvents: function() {
    var that = this; 

    this.collection.on('remove', function() {
      that.render();
    });

    this.collection.on('change', function(col) {

      this.push(col);

      $(that.el).children().remove();
      that.render();
    });

    //POST UPDATE
    ev.listen(E.EVENTS.DOCUMENT.THEME.POST_UPDATE, function() {
      this.serverUpdate();
    }.bind(this));
  },

  render: function() {
    this.setEvents();

    //append to header
    this.$el.html(this.template());
    this.appendCollection();

    return this;
  },

  template: function() {
    if (this.model) {
      return Mustache.to_html(Template, this.model.toJSON());
    } else {
      throw new Error('model was not defined');
    }
  },

  resetView: function() {
    this.collection.reset();
    this.off();
    $(this.el).empty();
  },

  appendCollection: function() {
    this.collection.each(function(model) {
      var theme = new ThemeListElement({
        model: model
      });

      this.$el.find('.flex.flex-wrap').append(theme.render().el);

    }, this);

    ev.fire(E.EVENTS.DOCUMENT.THEME.RENDERED);
  },

  instantiateThemesElementsCollection: function() {
    //init model
    var SingleThemeListElementModel = Backbone.Model.extend(this.dataModel);
    //init Collection of posts
    var ThemesCollection = Backbone.Collection.extend({
      model: SingleThemeListElementModel
    });

    this.collection = Backbone.App.Collections.themesCollection = new ThemesCollection();
  },

  addThemeListElement: function(modelData) {
    var SingleThemeListElementModel = Backbone.Model.extend(this.dataModel);
    
    //create an instance of the model
    var singleThemeElementModel = new SingleThemeListElementModel(modelData);

    /* add model instance to collection */
    this.collection.add(singleThemeElementModel);
  },

  serverUpdate: function() {

    var needsUpdate = this.collection.where({
      "updated": true
    });

    _.map(needsUpdate, function(model) {
      this.updateApropriateInformationAboutTheme(model);
    }.bind(this));
  },

  removeUpdateNeedInformation: function(modifyInfo, model) {
    var changes = model.get("changed");

    changes.remove(modifyInfo);

    model.set({
      changed: changes
    });
  },

  updateServerThemeCode: function(model, cb) {
      var codeData = {
        action: "themes",
        themes_action: {
        route: "changeCode",
          themes_data: {
            theme_name: model.get("theme_name"),
            theme_code: model.get("theme_code")
          }
        }
      };

      Backbone.fetchData(codeData, function(feed) {
        if (feed === "updated" && !!cb) {
          cb(model);
        }
      });
  },

  updateServerPostCode: function(model, cb) {
      var codeData = {
        action: "themes",
        themes_action: {
        route: "editPostCode",
          themes_data: {
            theme_name: model.get("theme_name"),
            post_code: model.get("post_code")
          }
        }
      };

      Backbone.fetchData(codeData, function(feed) {
        if (feed === "post code updated" && !!cb) {
          cb(model);
        }
      });
  },

  updateServerThemeName: function(model, cb) {
    var old_name = model.get("theme_oldname");
    var new_name = model.get("theme_name");

      var nameData = {
        action: "themes",
        themes_action: {
          route: "changeName",
          themes_data: {
            theme_oldname: old_name,
            theme_name: new_name
          }
        }
      };

      if (old_name === new_name) cb();


      Backbone.fetchData(nameData, function(feed) {
        if (feed === "renamed" && !!cb) {
          cb();
        }
      });
  },

  updateApropriateInformationAboutTheme: function(model) {
    //this could be written better... :/

    var that = this;
    var changes = model.get("changed") || [];

    if (changes.length <= 0) {
      throw new Error("model was not carrying any data about the changes made");
    }

    /* this should be done all in one post 
    * update name first
    * next theme code
    * last post code
    */

    function restOfUpdate() {
      that.updateServerThemeCode(model, that.updateServerPostCode);
    }

    that.updateServerThemeName(model, restOfUpdate);

  },

  getThemes: function(cb) {

    var settings = {
      action: 'themes',
      themes_action: {'route': 'getThemes'}
    };

      function handleNewTheme(t) {
          var theme = {
              theme_name: t.theme_name,
              theme_code: t.theme_code,
              post_code: t.post_code,
              theme_thumbnail: t.theme_thumbnail,
              active_theme: t.active_theme,
              updated: false
          };

          return theme;
      }

      function handleOldTheme(t) {
          var theme = {
              theme_name: t.name,
              theme_code: t.template,
              post_code: t.post_code || "",
              theme_thumbnail: t.theme_thumbnail || "",
              active_theme: t.active_theme,
              updated: false
          };

          return theme;
      }

    Backbone.fetchData(settings, function(data, resp) {

        _.map(JSON.parse(data), function(t) {

            var theme = (t.name) ? handleOldTheme(t) : handleNewTheme(t);

            console.log(theme);

            this.addThemeListElement(theme);

        }.bind(this));

        if (!!cb) {
        //update the ui
        cb.call(this);
        }

    }.bind(this));
  }
});

module.exports = ThemesList;