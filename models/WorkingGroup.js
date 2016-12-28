var keystone = require('keystone');
var Types = keystone.Field.Types;

var WorkingGroup = new keystone.List('WorkingGroup', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Working Group',
});

WorkingGroup.add({
	name: { type: String, required: true },
});

WorkingGroup.relationship({ ref: 'Task', refPath: 'workingGroup' });
WorkingGroup.register();
