var keystone = require('keystone'),
	User = keystone.list('User'),
	async = require('async');

module.exports = function(agenda) {

	/*
	 * Welcome email
	 * */
	agenda.define('notification email', function(job, done) {
		//find user id and send notification
		User.model.findOne({ _id: job.attrs.data.userId}).exec(function(err, result) {
				if (err) return done(err);

				user.sendEmailNotification(function(err) {
					if (err) done(err);
					Console.log("call User send notification");
					done();
				});
		});
	});

}
