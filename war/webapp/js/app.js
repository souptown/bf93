define(
  // Dependencies
  [
    "jquery",
    "underscore",
    "backbone",
    "handlebars",
    "bootstrap"
  ],
  function($, _, Backbone, Handlebars) {

    var initialize = function () {

      // Remove the following lines and start writing your own app
      $(document.body).append("jquery " + $().jquery);
      $(document.body).append("<br/>underscore " + _.VERSION);
      $(document.body).append("<br/>backbone " + Backbone.VERSION);
      $(document.body).append("<br/>handlebars " + Handlebars.VERSION);

    };

    return {
      initialize: initialize
    };
  }
);