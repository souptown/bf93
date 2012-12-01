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

		/**
		 * Called once the class has been instantiated
		 * @return {undefined}
		 */
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

		/**
		 * Defines a class that handles the nav bar view
		 * @type {Backbone.View}
		 */
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

		/**
		 * Instance of NavigationView class for handling the nav bar view
		 * @type {NavigationView}
		 */
		navigationView = new NavigationView({ model: viewModel }),

		PageLoadingView = Backbone.View.extend({
			initialize: function () {
				this.model.on("change:currentActions", this.render, this);
			},
			render: function () {
				$("#pageLoading").css("display", "none");
			}
		}),

		/**
		 * Instance of NavigationView class for handling the page loading view
		 * @type {PageLoadingView}
		 */
		pageLoadingView = new PageLoadingView({ model: viewModel }),

		/**
		 * Defines a class that handles the welcome view
		 * @type {Backbone.View}
		 */
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

		/**
		 * Instance of WelcomeView class for handling the welcome view
		 * @type {WelcomeView}
		 */
		welcomeView = new WelcomeView({ el: $("#welcomeContainer"), model: viewModel }),

		/**
		 * Defines a class that handles the Registration view
		 * @type {Backbone.View}
		 */
		RegistrationView = Backbone.View.extend({
			actionKeys: {
				"registration": true,
				"paypalcancel": { "message": "<p>Registration payment was canceled. No payment has been made.</p>" },
				"paypalsuccess": { "message": "<p>Thank you for registering! Your transaction has been completed, and a receipt for your purchase has been emailed to you. You may log into your account at <a href=\"http://www.paypal.com/us\" title=\"Paypal Website\" target=\"_blank\">http://www.paypal.com/us</a> to view details of this transaction. We will add your name to the list of Registered Attendees the next time we update it if you chose to allow that.</p>" +
					"<p><strong>IF YOU DID NOT GIVE US YOUR NAME</strong>, then you will need to provide proof of payment when you come to the reunion. A print-out of your Paypal confirmation email will work for this.</p>" +
					"<p>Can't wait to see you!</p>" }
			},
			template: null,
			initialize: function() {
				// Load template
				this.template = Handlebars.compile($("#registrationTemplate").html());
				// Listen for model changes
				this.model.on("change:currentActions", this.render, this);
			},
			render: function() {
				var currentActions = this.model.get("currentActions");
				if (typeof(this.actionKeys[currentActions]) !== "undefined")
				{
					// Load the compiled HTML into the Backbone "el"
					this.$el.html( this.template({}) );

					if (currentActions === "paypalcancel" || currentActions === "paypalsuccess")
					{
						this.$el.find(".paypalMessageContainer").css("display", "block");
						this.$el.find(".paypalMessage").html(this.actionKeys[currentActions].message);
					}

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

		/**
		 * Instance of RegistrationView class for handling the welcome view
		 * @type {RegistrationView}
		 */
		registrationView = new RegistrationView({ el: $("#registrationContainer"), model: viewModel }),

		/**
		 * Defines a class that handles the Registered Attendees view
		 * @type {Backbone.View}
		 */
		RegisteredView = Backbone.View.extend({
			actionKey: "registered",
			template: null,
			initialize: function() {
				// Load template
				this.template = Handlebars.compile($("#registeredTemplate").html());
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

		/**
		 * Instance of RegistrationView class for handling the welcome view
		 * @type {RegistrationView}
		 */
		registeredView = new RegisteredView({ el: $("#registeredContainer"), model: viewModel }),

		/**
		 * Defines a class that handles the missing classmates view
		 * @type {Backbone.View}
		 */
		ClassmatesView = Backbone.View.extend({
			actionKey: "classmates", // Default
			template: null,
			initialized: false,
			initialize: function() {
				// Load template
				this.template = Handlebars.compile($("#classmatesTemplate").html());
				// Listen for model changes
				this.model.on("change:currentActions", this.render, this);
			},
			render: function() {
				var currentActions = this.model.get("currentActions");
				if (currentActions === this.actionKey)
				{
					if (!this.initialized)
					{
						// Load the compiled HTML into the Backbone "el"
						this.$el.html( this.template({}) );

						// // Turn the html table into a jquery datatable
						// $('#classmatesTable').dataTable({
						// 	"sDom": "<'row'<'span4'l><'span4'f>r>t<'row'<'span4'i><'span4'p>>",
						// 	//"sPaginationType": "full_numbers",
						// 	"sPaginationType": "bootstrap",
						// 	"bProcessing": true,
						// 	"sAjaxSource": '../api/classmates',
						// 	iDisplayLength: 100,
						// 	sScrollY: 400,
						// 	"aoColumns": [
						// 		{ "sWidth": "80%" },
						// 		{ "sWidth": "20%" }
						//     ]
						// });
						this.initialized = true;
					}

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

		/**
		 * Instance of classmatesView class for handling the most wanted view
		 * @type {ClassmatesView}
		 */
		classmatesView = new ClassmatesView({ el: $("#classmatesContainer"), model: viewModel }),

		/**
		 * Defines a class that handles the memories view
		 * @type {Backbone.View}
		 */
		MemoriesView = Backbone.View.extend({
			actionKey: "memories", // Default
			template: null,
			initialized: false,
			initialize: function() {
				// Load template
				this.template = Handlebars.compile($("#memoriesTemplate").html());
				// Listen for model changes
				this.model.on("change:currentActions", this.render, this);
			},
			render: function() {
				var currentActions = this.model.get("currentActions");
				if (currentActions === this.actionKey)
				{
					if (!this.initialized)
					{
						// Load the compiled HTML into the Backbone "el"
						this.$el.html( this.template({}) );

						this.initialized = true;
					}

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

		/**
		 * Instance of memoriesView class for handling the most wanted view
		 * @type {MemoriesView}
		 */
		memoriesView = new MemoriesView({ el: $("#memoriesContainer"), model: viewModel }),

		/**
		 * Defines a class that handles the contact view
		 * @type {Backbone.View}
		 */
		ContactView = Backbone.View.extend({
			actionKey: "contact", // Default
			template: null,
			initialized: false,
			initialize: function() {
				// Load template
				this.template = Handlebars.compile($("#contactTemplate").html());
				// Listen for model changes
				this.model.on("change:currentActions", this.render, this);
			},
			render: function() {
				var currentActions = this.model.get("currentActions");
				if (currentActions === this.actionKey)
				{
					if (!this.initialized)
					{
						// Load the compiled HTML into the Backbone "el"
						this.$el.html( this.template({}) );

						this.initialized = true;
					}

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

		/**
		 * Instance of contactView class for handling the most wanted view
		 * @type {ContactView}
		 */
		contactView = new ContactView({ el: $("#contactContainer"), model: viewModel });

		return {
			initialize: initialize
		};
	}
);