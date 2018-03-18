var keystone = require('keystone');
var Types = keystone.Field.Types;

var Decision = new keystone.List('Decision',{
  track: true,
  autokey: { from: 'title', path: 'slug', unique: true },
  map: { name: 'title' },
  defaultSort:'-createdAt', // sorted by createdAt
  label : 'Beschlossen',
  singular: 'Beschlossen',
  plural: 'Beschlossen',
  hidden: false
});
Decision.add({
  title: { type: String, initial: true, default: '', required: true ,  label:'Decision Name' ,},
  description: { type: Types.Markdown, wysiwyg: true,  height: 200 , label:'Decision Description',},
  decisionDate: { type: Types.Datetime, default: Date.now, label: 'Decision Date (HH:MM:SS am/pm)'},
  workingGroup: { type: Types.Relationship, ref: 'WorkingGroup', index: true, many: true, label:'Working Group',},
  tasksRelated: { type: Types.Relationship, ref: 'Task', index: true, many: true, label:'Related Tasks',},
});
Decision.defaultColumns = 'title, workingGroup, decisionDate';
Decision.register();
