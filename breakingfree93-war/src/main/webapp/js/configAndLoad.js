/**
 * The following comment prevents JSLint errors concerning undefined global variables.
 * It tells JSLint that these identifiers are defined elsewhere.
 */
/*jslint bitwise:true, browser:true, nomen:true, regexp:true, sloppy:true, white:true */

/**
 * The following comment is to prevent jslint errors about
 * using variables before they are defined.
 */
/*global define, require */

require.config(
  {
    //baseUrl: "/another/path",
    paths: {
        "jquery": "//code.jquery.com/jquery-1.11.0.min",
        "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min",
        "backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min",
        "handlebars": "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0.beta6/handlebars.min",
        "bootstrap": "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
        "recaptcha": "//www.google.com/recaptcha/api/js/recaptcha_ajax"
    },

    shim: {
      jquery: {
        exports: "$"
      },
      underscore: {
        exports: "_"
      },
      handlebars: {
        exports: "Handlebars"
      },
      backbone: {
        deps: ["underscore", "jquery"],
        exports: "Backbone"
      },
      bootstrap: {
        deps: ["jquery"]
      },
      recaptcha: {
        exports: "Recaptcha"
      }
    },

    waitSeconds: 15
  }
);

require(
  // Dependencies
  [
    // Main app module (app.js)
    "app"
  ],
  function (App) {
    // Dependencies are passed in as parameters in the order in which they are listed in the dependencies array
    // The "app" dependency is passed in as "App"
    App.initialize();
  }
);