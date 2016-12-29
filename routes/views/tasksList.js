var keystone = require('keystone');
var Task = keystone.list('Task');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'tasks';

	locals.tasks = {
		data: [],
		graph: [],
	};

	// Load the posts
	view.on('init', function (next) {

		var q = Task.model.find()
						.sort('-createdAt')
						.populate('createdBy workingGroup assignedTo');

		q.exec(function (err, results) {
			locals.tasks.data = results;
			results.forEach(e => locals.tasks.graph.push({id: e._id, content: e.title, start: e.startOn, end: e.endOn}));
			next(err);
		});

	});
	// Render the view
	view.render('tasks');
};
