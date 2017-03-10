var keystone = require('keystone');
var Task = keystone.list('Task');
var WorkingGroup = keystone.list('WorkingGroup');
var async = require('async');
var moment = require('moment');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'graph';
	locals.filters = {
		workingGroup: req.params.workingGroup,
	};

	locals.workingGroupFilter = '';
	locals.workingGroups = [];
	locals.tasks = {
		data: []
	};


	//select all working group names
	view.on('init', function (next) {
		WorkingGroup.model.find().sort('name').exec(function (err, results) {
			if (err || !results.length) {
				return next(err);
			};
			locals.workingGroups = results;
			next();
		});
	});

	// Load the current category filter
	view.on('init', function (next) {
		if (req.params.workingGroup) {
			WorkingGroup.model.findOne({ key: locals.filters.workingGroup }).exec(function (err, result) {
				locals.workingGroupFilter = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load filtered tasks
	view.on('init', function (next) {

		var q = Task.model.find()
		.sort('startOn')
		.populate('createdBy workingGroup assignedTo');
		if(locals.workingGroupFilter){
			q.where('workingGroup').in([locals.workingGroupFilter]);
		}
		q.exec(function (err, results) {
			locals.tasks.data = results;
			next(err);
		});

	});
	// Render the view
	view.render('graph');
};
