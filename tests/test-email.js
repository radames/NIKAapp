// test-email.js
require('dotenv').config();
var Email = require('keystone-email');

new Email('test-email.jade', {
	transport: 'mailgun',
}).send({data:{
	title: 'Title',
	subtitle: 'Subtitle',
	body: 'lslslslslslsllslsls ls lslslssl sl slslsls',

}}, {
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.MAILGUN_DOMAIN,
	to: 'radamajna@gmail.com',
	from: {
		name: 'NIKAApp',
		email: 'hello@nika.haus',
	},
	subject: 'Testing the first email',
}, function(err, result) {
	if (err) {
		console.error('🤕 Mailgun test failed with error:\n', err);
	} else {
		console.log('📬 Successfully sent Mailgun test with result:\n', result);
	}
});
