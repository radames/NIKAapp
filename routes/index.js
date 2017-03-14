/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware


keystone.pre('routes', function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Timeline', key: 'tasks', href: '/timeline' },
		{ label: 'Task Map', key: 'task-map', href: '/task-map' },
		{ label: 'Owncloud', key: 'owncloud', href: '/owncloud' }
	];
	res.locals.user = req.user;
	next();
});

keystone.pre('render', middleware.flashMessages);

keystone.set('404', function (req, res, next) {
	res.status(404).render('errors/404');
});
keystone.set('500', function (req, res, next) {
	res.status(500).render('errors/500');
});



// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/timeline/', middleware.requireUser, routes.views.tasksList);
	app.get('/timeline/:workingGroup', middleware.requireUser, routes.views.tasksList);

	app.get('/task-map/', middleware.requireUser, routes.views.graph);
	app.get('/task-map/:workingGroup', middleware.requireUser, routes.views.graph);

	app.get('/owncloud/', middleware.requireUser, routes.views.owncloud);

	app.get('/api/list', [middleware.requireUser,keystone.middleware.api], routes.api.app.list);

	app.get('/api/tasks/', [middleware.requireUser,keystone.middleware.api], routes.api.app.tasks);
	app.get('/api/tasks/:workingGroup', [middleware.requireUser,keystone.middleware.api], routes.api.app.tasks);
	app.get('/api/tasks/:workingGroup/:bShowPast', [middleware.requireUser,keystone.middleware.api], routes.api.app.tasks);

	app.get('/api/graph/', [middleware.requireUser,keystone.middleware.api], routes.api.app.graph);
	app.get('/api/graph/:workingGroup', [middleware.requireUser,keystone.middleware.api], routes.api.app.graph);
	app.get('/api/graph/:workingGroup/:bShowPast', [middleware.requireUser,keystone.middleware.api], routes.api.app.graph);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
