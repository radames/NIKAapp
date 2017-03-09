var keystone = require('keystone');
var Types = keystone.Field.Types;;

var Task = new keystone.List('Task',{
  track: true,
  autokey: { from: 'title', path: 'slug', unique: true },
  searchFields: 'description', //search fields in the UI
  map: { name: 'title' },
  defaultSort:'-createdAt', // sorted by createdAt
  label : 'Task',
  singular: 'Task',
  plural: 'Tasks'
});

Task.add({
  title: { type: String, initial: true, default: '', required: true ,  label:'Task Title' ,},
  subtitle: { type: String, initial: true, default: '', required: true ,  label:'Task Subtitle' ,},
  description: { type: Types.Markdown, wysiwyg: true,  height: 200 , label:'Task Description',},
  assignedTo: { type: Types.Relationship, ref: 'User', index: true, many: true, label:'Assigned To'},
  workingGroup: { type: Types.Relationship, ref: 'WorkingGroup', index: true, many: true, label:'Working Group',},
  startOn: { type: Types.Datetime, default: Date.now, label: 'Task starts on (HH:MM:SS am/pm)'},
  endOn: { type: Types.Datetime, default: Date.now, label: 'Task ends on (HH:MM:SS am/pm)' },
  regularEvent: { type: Types.Boolean, label: 'Regular Event' }
});
Task.defaultColumns = 'title, subtitle, workingGroup, startOn, endOn, createdBy';
Task.register();
