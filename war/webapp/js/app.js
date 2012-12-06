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
			attendeeTemplate: null,
			totalsTemplate: null,
			initialize: function() {
				// Load templates
				this.template = Handlebars.compile($("#registeredTemplate").html());
				this.attendeeTemplate = Handlebars.compile($("#registeredAttendeesTemplate").html());
				this.totalsTemplate = Handlebars.compile($("#registeredTotalsTemplate").html());
				// Listen for model changes
				this.model.on("change:currentActions", this.render, this);
			},
			render: function() {
				var currentActions = this.model.get("currentActions"),
					view = this;

				if (currentActions === this.actionKey)
				{
					// Load the compiled HTML into the Backbone "el"
					this.$el.html( this.template({}) );

					// Show the view
					this.$el.css("display", "");

					// Load the data
					$.getJSON("../api/classmates/registered", null, function (data) {
							var i, classmates = data.data.length, guests = 0;

							// Count guests
							$.each(data.data, function (index, value) {
								if (view.isNumber(value.guests))
								{
									guests += parseInt(value.guests, 10);
								}
							});

							// Sort data
							data.data.sort(function (a, b) {
								var aText = a.lastName.toLowerCase() + " " + (a.maidenName || "").toLowerCase() + " " + a.firstName.toLowerCase(),
									btext = b.lastName.toLowerCase() + " " + (b.maidenName || "").toLowerCase() + " " + b.firstName.toLowerCase();
								return ((aText < btext) ? -1 : ((aText > btext) ? 1 : 0));
							});

							view.$el.find(".total").html(view.totalsTemplate({ "total": guests + classmates, "classmates": classmates, "guests": guests } )).css("display", "");
							view.$el.find(".list").html(view.attendeeTemplate(data)).css("display", "");
							view.$el.find("img").css("display", "none");
						}
					);
				}
				else
				{
					// Hide the view
					this.$el.css("display", "none");
				}
			},
			isNumber: function (n) {
				return !isNaN(parseFloat(n)) && isFinite(n);
			}
		}),

		/**
		 * Instance of RegistrationView class for handling the welcome view
		 * @type {RegistrationView}
		 */
		registeredView = new RegisteredView({ el: $("#registeredContainer"), model: viewModel }),

		/**
		 * Defines a class that handles the missing missing view
		 * @type {Backbone.View}
		 */
		MissingView = Backbone.View.extend({
			actionKey: "missing", // Default
			template: null,
			missingClassmateTemplate: null,
			initialized: false,
			initialize: function() {
				// Load template
				this.template = Handlebars.compile($("#missingTemplate").html());
				this.missingClassmateTemplate = Handlebars.compile($("#missingClassmateTemplate").html());
				// Listen for model changes
				this.model.on("change:currentActions", this.render, this);
			},
			render: function() {
				var currentActions = this.model.get("currentActions"),
					view = this;

				if (currentActions === this.actionKey)
				{
					// Load the compiled HTML into the Backbone "el"
					this.$el.html( this.template({}) );

					// Show the view
					this.$el.css("display", "");

					// Load the data
					$.getJSON("../api/classmates/missing", null, function (data) {
							view.$el.find(".list").html(view.missingClassmateTemplate(data)).css("display", "");
							view.$el.find("img").css("display", "none");
						}
					);
				}
				else
				{
					// Hide the view
					this.$el.css("display", "none");
				}
			}
		}),

		/**
		 * Instance of missingView class for handling the most wanted view
		 * @type {MissingView}
		 */
		missingView = new MissingView({ el: $("#missingContainer"), model: viewModel }),

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