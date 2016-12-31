var keystone = require('keystone');
var Task = keystone.list('Task');
var WorkingGroup = keystone.list('WorkingGroup');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'tasks';
	locals.filters = {
		workingGroup: req.params.workingGroup,
	};

	locals.workingGroup = '';
	locals.tasks = {
		data: [],
		graph: [],
	};

	// Load the current category filter
	view.on('init', function (next) {
		if (req.params.workingGroup) {
			WorkingGroup.model.findOne({ key: locals.filters.workingGroup }).exec(function (err, result) {
				locals.workingGroup = result;
				next(err);
			});
		} else {
			next();
		}
	});


	// Load the posts
	view.on('init', function (next) {

		var q = Task.model.find()
		.sort('-createdAt')
		.populate('createdBy workingGroup assignedTo');
		if(locals.workingGroup){
			q.where('workingGroup').in([locals.workingGroup]);
		}
		q.exec(function (err, results) {
			locals.tasks.data = results;
			results.forEach(e => {
				var  classes = '';
				e.workingGroup.forEach(e => classes += e.key + ' '); 
				console.log(classes);
				locals.tasks.graph.push({id: e._id, content: e.title, start: e.startOn, end: e.endOn, className: classes});
			});
			next(err);
		});

	});
	// Render the view
	view.render('tasks');
};
