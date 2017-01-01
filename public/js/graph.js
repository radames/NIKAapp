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
  min: new Date(2016, 11, 1),                // lower limit of visible range
  max: new Date(2018, 11, 1),                // upper limit of visible range
  zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
  zoomMax: 1000 * 60 * 60 * 24 * 31 * 12,    // about three months in milliseconds


  template: function (item) {
    var groupList = item.className.trim().split(' ');
    var html = '<div class="row">';
    var div = '<div class="col-md-2" id="{0}">{1}</div>';

    groupList.forEach((e, i) => {

      html += i > 0?div.format(e,'&nbsp;'):div.format(e, item.content);
    });
    html+='</div>';
    return html;
  }
};

// Create a Timeline
var timeline = new vis.Timeline(container, items, options);
