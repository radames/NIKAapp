var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	workingGroup: { type: Types.Relationship, initial: true, required: true, ref: 'WorkingGroup', index: true, many: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.schema.methods.wasActive = function () {
	this.lastActiveOn = new Date();
	return this;
}

var templatePath = './templates/emails/taskNotification.jade';
User.schema.methods.sendEmailNotification = function(taskId, callback) {
	var user = this;
	var Task = keystone.list('Task');

	Task.model.findOne({_id: taskId})
		.populate('workingGroup assignedTo createdBy name')
		.exec(function(err, task) {
		//Lookup Task and fill up notification email
		keystone.debug('Writing Email to ' +  user.name + ' ' + user.email);
		var Email = require('keystone-email');

		// debug email render
		// new Email(templatePath, {}).render({task:task}, function (err, email){
		// 	keystone.debug(email);
		// 	callback();
		// });
		new Email(templatePath, {
				transport: 'mailgun',
			})
			.send({
				task: task
			}, {
				apiKey: process.env.MAILGUN_API_KEY,
				domain: process.env.MAILGUN_DOMAIN,
				'o:tracking': false,
				to: {
					name: user.name,
					email: user.email,
				},
				from: {
					name: process.env.EMAIL_NAME,
					email: process.env.NOREPLY_EMAIL,
				},
				subject: process.env.EMAIL_SUBJECT + ' ' + task.title,
			}, callback);
	});
}


/**
 * Registration
 */
User.track = true;
User.defaultColumns = 'name, email, workingGroup';
User.register();
