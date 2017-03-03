
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
  layout: { hierarchical: { sortMethod: 'directed', direction: 'LR' }
},
interaction:{
  hover: true
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
container.addEventListener('dblclick', function(){
  network.fit();
});




network.on("blurNode", function(params){
  mouseEvent('out', params);
  container.removeEventListener('mousemove', function(event){
    mouseEvent('mousemove', event)
  });
});
network.on("hoverNode", function(params){
  mouseEvent('in', params);
  container.addEventListener('mousemove', function(event){
    mouseEvent('mousemove', event)
  });
});
network.on( 'click', function(params) {
    //redirect to edit tak
    var nodeID = params.nodes[0];
    var el = document.getElementById(nodeID);
    //check if is a workinggroup node
    if(!el.getAttribute("data")){
      window.location.href = window.location.origin + "/admin/tasks/" + nodeID;
    }
});

var actualNode;
function mouseEvent(e, event) {
  switch(e){
  case 'in':
    actualNode = document.getElementById(event.node);
    actualNode.classList.add('active');
    break;
  case 'out':
    actualNode = document.getElementById(event.node);
    actualNode.classList.remove('active');
    break;
  case 'mousemove':
    var x = event.clientX;
    var y = event.clientY;
    actualNode.style.top = (y + 5) + 'px';
    actualNode.style.left = (x + 5) + 'px';
    break;
  }
};
