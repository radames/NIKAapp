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
//start window
var startWindowX = new Date();
var endWindowX =  new Date();
endWindowX.setDate(endWindowX.getDate() + 30); //30 days from now

var options = {
  width: '100%',
  height: 450, // px
  orientation: {axis: 'top', item: 'top'},
  min: new Date(2016, 11, 1),                // lower limit of visible range
  zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
  zoomMax: 1000 * 60 * 60 * 24 * 31 * 12,    // about three months in milliseconds
  showCurrentTime: true,
  start: startWindowX,
  end: endWindowX,

  template: function (item) {
    var groupList = item.className.trim().split(' ');
    var row = '<div class="row"><div><a href="/admin/tasks/{0}">{1}</a></div>{2}</div>';
    var div = '<div id="{0}">{1}</div>';
    var divs ='';
    groupList.forEach((e, i) => {
      divs += div.format(e,'&nbsp;');
    });
    var html = row.format(item.id, item.content, divs);
    return html;
  }
};

// Create a Timeline

var timeline = new vis.Timeline(container, items, options);


container.addEventListener('mouseover', mouseEvent);
container.addEventListener('mousemove', mouseEvent);
container.addEventListener('mouseout', mouseEvent);
container.addEventListener('dblclick', function(){
  timeline.setWindow(startWindowX, endWindowX);
});

function mouseEvent(e) {
  var properties = timeline.getEventProperties(e);
  if(properties.what === 'item'){

    var tooltipSpan = document.getElementById(properties.item);
    switch(e.type){
    case 'mouseover':
      tooltipSpan.classList.add('active');
      break;
    case 'mouseout':
      tooltipSpan.classList.remove('active');
      break;
    case 'mousemove':
      var x = e.clientX;
      var y = e.clientY;
      tooltipSpan.style.top = (y + 5) + 'px';
      tooltipSpan.style.left = (x + 5) + 'px';
      break;
    }
  }
};
