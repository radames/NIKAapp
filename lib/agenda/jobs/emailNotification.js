var keystone = require('keystone');
var User = keystone.list('User');

module.exports = function(agenda) {
	agenda.define('notification email', function(job, done) {
		//find user id and send notification
		User.model.findOne({_id:job.attrs.data.userId}, function(err, user) {
				if (err) return done(err);
				user.sendEmailNotification(job.attrs.data.taskId, function(err) {
					if (err) done(err);
					done();
				});
		});
	});
}
