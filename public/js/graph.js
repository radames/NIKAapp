
// create a network
var container = document.getElementById('visualization');
var data = {
  nodes: nodes,
  edges: relations
};
var options = {
  width: '100%',
  height: '450', // px
  layout: {
    hierarchical: {  sortMethod: 'directed' }
  },
  nodes: {
    shape: 'dot',
    size: 20,
    font: {
      size: 17
    },
    borderWidth: 2,
    shadow:true
  },
  edges: {
    width: 2,
    shadow:true
  }
};
var network = new vis.Network(container, data, options);
