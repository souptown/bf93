require.config(
  {
    //baseUrl: "/another/path",
    paths: {
        "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.0/jquery.min",
        "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min",
        "backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min",
        "handlebars": "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0.beta6/handlebars.min",
        "bootstrap": "//netdna.bootstrapcdn.com/twitter-bootstrap/2.1.0/js/bootstrap.min"
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