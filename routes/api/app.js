var async = require('async');
var keystone = require('keystone');

var Task = keystone.list('Task');
var WorkingGroup = keystone.list('WorkingGroup');

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

  var workingGroupFilter = req.params.workingGroup;
  var workingGroupFilterKey;
  var tasks = {
    graph: []
  };

  // Load the current category filter


  WorkingGroup.model.findOne({ key: workingGroupFilter }).exec(function (err, result) {
    if (err) return res.apiError('database error - workinggroup filter', err);
  }).then(function (workingGroupFilterKey) {

    // Load the posts
    var q = Task.model.find()
    .sort('startOn')
    .populate('createdBy workingGroup assignedTo');
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
