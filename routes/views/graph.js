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
	locals.graphData = {
		data: [],
		nodes: [],
		relations:[]
	};

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

			// create Relationship between workinggroups and tasks
			async.each(locals.workingGroups, function (wGroup, next) {

				locals.graphData.nodes.push({id: wGroup._id, label: wGroup.name, key: wGroup.key , level: 0});
				keystone.list('Task').model.find().where('workingGroup').in([wGroup._id]).exec(function (err, tasks) {
					tasks.forEach(task => {
						locals.graphData.relations.push({from: wGroup._id, to: task._id, shape: 'image'}); //fill relations
					});
					next(err);
				});

			}, function (err) {
				next(err);
			});


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
			locals.graphData.data = results;
			locals.tasks.data = results;
			var numEvents = results.length;
			results.forEach(e => {
				var  classes = '';
				var level = moment(e.startOn).diff(moment(), 'days');
				console.log(numEvents, Math.sign(level)*numEvents);
				e.workingGroup.forEach(e => classes += e.key + ' '); //(e.regularEvent?-1:1+10*level/365)
				locals.graphData.nodes.push({id: e._id, label: e.title, level:Math.sign(level)*numEvents});
				numEvents = Math.sign(level) + numEvents;
			});
			next(err);
		});

	});
	// Render the view
	view.render('graph');
};
