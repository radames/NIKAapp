// DOM element where the Timeline will be attached
var container = document.getElementById('visualization');

// Create a DataSet (allows two way data-binding)

// Configuration for the Timeline
var options = {
  width: '100%',
  height: 300, // px
  orientation: {axis: 'top',
                item: 'top'}
};

// Create a Timeline
var timeline = new vis.Timeline(container, items, options);
