/**
 * The following comment prevents JSLint errors concerning undefined global variables.
 * It tells JSLint that these identifiers are defined elsewhere.
 */
/*jslint bitwise:true, browser:true, nomen:true, regexp:true, sloppy:true, white:true */

/** The following comment is to prevent jslint errors about 
 * using variables before they are defined.
 */
/*global define, require */

define(
	// Dependencies
	[
		"jquery",
		"underscore",
		"backbone",
		"handlebars",
		"bootstrap",
		"datatables",
		"datatables.bootstrap"
	],
	function($, _, Backbone, Handlebars, datatables) {

		var AppUrlRouter = Backbone.Router.extend({
			routes: {
				"*actions": "defaultRoute"  // matches http://www.breakingfree93.com/#anything-here
			}
		}),

		// Url router
		appUrlRouter = null,

		// Used by each view to determine whether to show itself or not
		viewModel = new (Backbone.Model.extend({})),

		// Called when instantiated
		initialize = function () {

			// Set bootstrap sort classes for jquery datatables
			$.extend( $.fn.dataTableExt.oStdClasses, {
				"sWrapper": "dataTables_wrapper form-inline"
			} );

			// Define what happens when local history mdifications are made (navigate to hashtag in url)
			appUrlRouter = new AppUrlRouter;
			appUrlRouter.on("route:defaultRoute", function (actions) {
				viewModel.set("currentActions", actions);
			});
			Backbone.history.start();
			
		},

		// Defines a class that handles the nav bar view
		NavigationView = Backbone.View.extend({
			initialize: function () {
				this.model.on("change:currentActions", this.render, this);
			},
			render: function () {
				var currentActions = this.model.get("currentActions"),
					activeNav = $(".nav li[class='active']", "#navigationBar");

				activeNav.removeClass("active");
				activeNav = $(".nav li:has(>a[href='#" + currentActions + "'])", "#navigationBar");
				activeNav.addClass("active");
			}
		}),

		// Instance of NavigationView class for handling the nav bar view
		navigationView = new NavigationView({ model: viewModel }),

		// Defines a class that handles the welcome view
		WelcomeView = Backbone.View.extend({
			actionKey: "", // Default
			template: null,
			initialize: function() {
				// Load template
				this.template = Handlebars.compile($("#welcomeTemplate").html());
				// Listen for model changes
				this.model.on("change:currentActions", this.render, this);
			},
			render: function() {
				var currentActions = this.model.get("currentActions");
				if (currentActions === this.actionKey)
				{
					// Load the compiled HTML into the Backbone "el"
					this.$el.html( this.template({}) );

					// Show the view
					this.$el.css("display", "");
				}
				else
				{
					// Hide the view
					this.$el.css("display", "none");
				}
			}
		}),

		// Instance of WelcomeView class for handling the welcome view
		welcomeView = new WelcomeView({ el: $("#welcomeContainer"), model: viewModel }),

		// Defines a class that handles the most wanted view
		MostWantedView = Backbone.View.extend({
			actionKey: "mostwanted", // Default
			template: null,
			initialize: function() {
				// Load template
				this.template = Handlebars.compile($("#mostWantedTemplate").html());
				// Listen for model changes
				this.model.on("change:currentActions", this.render, this);
			},
			render: function() {
				var currentActions = this.model.get("currentActions");
				if (currentActions === this.actionKey)
				{
					// Load the compiled HTML into the Backbone "el"
					this.$el.html( this.template({}) );

					// Turn the html table into a jquery datatable
					$('#mostWantedTable').dataTable({
						"sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
						"sPaginationType": "bootstrap",
						"bProcessing": true,
						"sAjaxSource": '../classmates/mostwanted'
					});

					// Show the view
					this.$el.css("display", "");
				}
				else
				{
					// Hide the view
					this.$el.css("display", "none");
				}
			}
		}),

		// Instance of MostWantedView class for handling the most wanted view
		mostWantedView = new MostWantedView({ el: $("#mostWantedContainer"), model: viewModel });

		return {
			initialize: initialize
		};
	}
);