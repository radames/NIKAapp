var keystone = require('keystone');
var Task = keystone.list('Task');
var WorkingGroup = keystone.list('WorkingGroup');
var moment = require('moment');
var async = require('async');


/**
* List Posts
*/
exports.list = function(req, res) {
  Task.model.find(function(err, items) {

    if (err) return res.apiError('database error', err);

    res.apiResponse({
      tasks: items
    });

  });
}

/**
* get all tasks
*/

exports.tasks = function(req, res) {

  var bShowPast = (req.params.bShowPast == 'all');
  var workingGroupFilter = req.params.workingGroup;

  if(workingGroupFilter === 'all'){
    bShowPast = true;
    workingGroupFilter = '';
  }
  var tasks = {
      graph: []
  };

  // Load the current category filter


  WorkingGroup.model.findOne({ key: workingGroupFilter }).exec(function (err, result) {
    if (err) return res.apiError('database error - workinggroup filter', err);
  }).then(function (workingGroupFilterKey) {

    // Load the posts
    var q = Task.model.find();
    if(!bShowPast){
      q.find({ $or:[
        {"startOn": {"$gte": new Date()}},
        {"endOn": {"$gte": new Date()}}
      ]});
    }
    q.sort('startOn');
    q.populate('createdBy workingGroup assignedTo');
    if(workingGroupFilterKey){
      q.where('workingGroup').in([workingGroupFilterKey]);
    }
    q.exec(function (err, results) {
      if (err) return res.apiError('database error - searching tasks',  err);

      results.forEach(e => {
        var  classes = '';
        e.workingGroup.forEach(e => classes += e.key + ' ');
        tasks.graph.push({id: e._id, content: e.title, start: e.startOn, end: e.endOn, className: classes});
      });
      res.apiResponse(tasks.graph);
    });
  }).catch(error => {
    res.apiError('database error - workinggroup filter', err);
  });

}

exports.graph = function(req, res) {
  var bShowPast = (req.params.bShowPast == 'all');
  var workingGroupFilter = req.params.workingGroup;

  if(workingGroupFilter === 'all'){
    bShowPast = true;
    workingGroupFilter = '';
  }

  var workingGroups = [];
  var graphData = {
    nodes: [],
    edges:[]
  };

  WorkingGroup.model.find().sort('name').exec(function (err, results) {
    if (err) return res.apiError('database error - working group finding', err);

    workingGroups = results;

    // create Relationship between workinggroups and tasks
    async.each(workingGroups, function (wGroup, next) {

      graphData.nodes.push({id: wGroup._id, label: wGroup.name, key: wGroup.key , level: 0, fixed: true, physics:false});
      keystone.list('Task').model.find().where('workingGroup').in([wGroup._id]).exec(function (err, tasks) {
        tasks.forEach(task => {
          graphData.edges.push({from: wGroup._id, to: task._id, shape: 'image'}); //fill relations
        });
        next(err);
      });

    }, function (err) {
      if (err) return res.apiError('database error - working group async ', err);

      WorkingGroup.model.findOne({ key: workingGroupFilter }).exec(function (err, result) {
        if (err) return res.apiError('database error - workinggroup filter', err);
      }).then(function (workingGroupFilterKey) {

        var q = Task.model.find();
        if(!bShowPast){
          q.find({ $or:[
            {"startOn": {"$gte": new Date()}},
            {"endOn": {"$gte": new Date()}},
            {"regularEvent": {"$eq": true}}
          ]});
        }
    		q.sort('startOn');
    		q.populate('createdBy workingGroup assignedTo');
    		if(workingGroupFilterKey){
    			q.where('workingGroup').in([workingGroupFilterKey]);
    		}
    		q.exec(function (err, results) {
    			var numEvents = results.length;
          var level = 0;
    			results.forEach(e => {
    				var  classes = '';
    				var diff = moment(e.startOn).diff(moment(), 'days');
    				e.workingGroup.forEach(e => classes += e.key + ' '); //(e.regularEvent?-1:1+10*level/365)
    				graphData.nodes.push({id: e._id, label: e.title, level: e.regularEvent? -1: 1 + level});
            if(!e.regularEvent) level++;
    			});

          res.apiResponse(graphData);
    		});

      }).catch(error => {
        res.apiError('database error - workinggroup filter graph', err);
      });


    });
  });
}
