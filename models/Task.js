var keystone = require('keystone');
var Types = keystone.Field.Types;

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
},'Email Notifications',
  { emailNotificaionsOn: { type: Types.Boolean, label: "Enable Email Notifications" },
    notificationPeriods: { label: "Notifications Period", type: Types.TextArray, dependsOn : {emailNotificaionsOn: true}, default: ["1 Week", "1 Day"]}
});
Task.defaultColumns = 'title, subtitle, workingGroup, startOn, endOn, createdBy';

Task.schema.methods.isSchedulerOn = function() {
	return this.emailNotificaionsOn;
}
Task.schema.pre('save', function(next) {
  if(this.emailNotificaionsOn){
    if(!this.notificationPeriods.length){
      var err = new Error('You need to insert at least one notification period');
      this.emailNotificaionsOn = false;
      next(err);
    }
    keystone.debug(this.notificationPeriods);
    var filtered = [];
    this.notificationPeriods.forEach(function(item) {
      item = item.toLowerCase();
      var regPeriod = /(\d+ week|\d+ day|\d+ hour|\d+ second)/;
      var s = item.trim().split(" ");
      var num = s[0];
      var timePeriod = s[1];
      if(!regPeriod.test(item) || !Number.isInteger(parseFloat(num))){
        //test for a digit and the periods
        var err = new Error('The only valid Time units are integers units of, Hours, Days and Weeks --> ' + item);
        next(err);
      }
      filtered.push([num,timePeriod].join(' '));
    });
    keystone.debug(filtered + " filtered time periods");
    this.notificationPeriods = filtered;
  }
	next();
});
Task.schema.post('save', function(next) {
  keystone.debug( this.isSchedulerOn(), this.startOn, this.endOn);
  if(this.isSchedulerOn()){
    this.taskNotification();
  }
});

//Sends the user a welcome email
var templatePath = './templates/emails/taskNotification.jade';
Task.schema.methods.taskNotification = function(callback) {
  var _task = this;
  keystone.debug("Task assigned to -> " + _task.assignedTo)
	if (_task.isSchedulerOn) {
		//first cancel all other notifications for this specific tasks
		keystone.agenda.cancel({ "data.taskId": _task._id }, function(err, jobs) {
			if (err) {
        debug('error deleting old jobs');
        var err = new Error('error deleting old jobs');
        callback(err);
      }
			keystone.debug('Removing old jobs');
			_task.assignedTo.forEach(function(_userid) {
        keystone.debug('Scheduling new job');
				keystone.agenda.schedule('in 10 seconds', 'notification email', {
					userId: _userid,
					taskId: _task._id
				});
			});
		});
		//if enable schedule, then schedule email for all users
	}
};


Task.register();
