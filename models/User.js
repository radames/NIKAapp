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
User.schema.methods.sendEmailNotification = function(callback, data){
	var user = this;
  console.log(data.taskData);
	var Email = require('keystone-email');
	new  Email(templatePath, {
		transport: 'mailgun',
	}).send({data: data.taskData}, {
		apiKey: process.env.MAILGUN_API_KEY,
		domain: process.env.MAILGUN_DOMAIN,
		to: {
			name: this.name,
			email: this.email,
		},
		from: {
			name: process.env.EMAIL_NAME,
			email: process.env.NOREPLY_EMAIL,
		},
		subject: 'Testing the first email',
	}, function(err, result) {
		if (err) {
			console.error('🤕 Mailgun test failed with error:\n', err);
		} else {
			console.log('📬 Successfully sent Mailgun test with result:\n', result);
		}
	});
}


/**
 * Registration
 */
User.track = true;
User.defaultColumns = 'name, email, workingGroup';
User.register();
