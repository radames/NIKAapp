
nodes.forEach(n =>{
  //n.color = url;
  if(n.key){
    var el = document.body.appendChild(document.createElement("div"));
    el.id = n.key;
    var style = window.getComputedStyle(el);
    n.color = style.getPropertyValue('color');
    n.size = 20;
  }else{
    n.color = "#393939"
    n.size = 15;
  }
});

// create a network
var container = document.getElementById('visualization');

var data = {
  nodes: nodes,
  edges: relations
};
var options = {
  width: '100%',
  height: '450', // px
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
container.addEventListener('dblclick', function(){
  network.fit();
});
