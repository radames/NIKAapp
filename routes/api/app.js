var async = require('async');
var keystone = require('keystone');

var Task = keystone.list('Task');

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
