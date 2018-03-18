var keystone = require('keystone');
var Decision = keystone.list('Decision');
var WorkingGroup = keystone.list('WorkingGroup');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'decision';
	locals.filters = {
		workingGroup: req.params.workingGroup,
	};

	locals.workingGroupFilter = '';
	locals.workingGroups = [];
	locals.decisions = {
		data : [],
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


	// Load Decisions
	view.on('init', function (next) {

		var q = Decision.model.find();
		q.sort('decisionDate')
		q.populate('createdBy workingGroup tasksRelated');
		if(locals.workingGroupFilter){
			q.where('workingGroup').in([locals.workingGroupFilter]);
		}
		//future
		q.find();
		q.exec(function (err, results) {

			locals.decisions.data.push(results);
			next(err);
		});
	});

	// Render the view
	view.render('decisions');
};
