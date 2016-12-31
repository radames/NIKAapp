// DOM element where the Timeline will be attached
var container = document.getElementById('visualization');

// Create a DataSet (allows two way data-binding)


//sprintf like
//from http://www.kisphp.com/javascript/javascript-sprintf-function
String.prototype.format = function(){
    // get function arguments
    var args = arguments;

    // replace variables in string
    return this.replace(/{(\d+)}/g, function(match, index){

        // return replaced variable
        return args[index];
    });
};
// Configuration for the Timeline
var options = {
  width: '100%',
  height: 450, // px
  orientation: {axis: 'top', item: 'top'},
  template: function (item) {
  var groupList = item.className.trim().split(' ');
  var html = '';
  var div = '<div id="{0}">{1}</div>';

  groupList.forEach((e, i) => {

      html += i > 0? div.format(e,'&nbsp;'):div.format(e, item.content);
    });
  return html;
 }
};

// Create a Timeline
var timeline = new vis.Timeline(container, items, options);
