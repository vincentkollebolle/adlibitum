
var options = {
    interaction: {
        hover:true,
        navigationButtons: true,
        keyboard: true
    },
    physics: { stabilization: false},
    autoResize: true,
    nodes : {
      shape: 'dot',
        font:'16px proxima-nova white',
    },
    edges : { color: 'white'}
}


function createNode(v) {
  var node = {};
  node.id = v.identity.toInt();
  node.name = v.properties.titre;
  node.label = v.properties.titre;
  if(v.labels[0] == "Personne") {
    node.color = 'rgb(242,161,39)';
    node.size = 10;
  } else if(v.labels[0] == "Ressource") {
    node.color="rgb(170,143,0)";
    node.size = 20;
  } else if(v.labels[0] == "Evenement") {
    node.color="rgb(255,215,0)";
    node.size = 30;
  }
  node.titre = v.properties.titre;
  node.chapeau = v.properties.chapeau;
  node.contenu = v.properties.contenu;
  node.image1 = "images/" + v.properties.image1;
  node.image2 = "images/" + v.properties.image2;
  node.image3 = "images/" + v.properties.image3;
  return node;
}

function createEdge(v) {
  var edge = {};
  edge.id = v.identity.toInt();
  edge.from = v.start.toInt();
  edge.to = v.end.toInt();
  edge.title = '';
  return edge;
}

function redrawGraph() {
  nodes.clear();
  edges.clear();
  nodes.update();
}

/* R&D */
//vibration
function battement() {
  var toUp = true;
  var size2update = 10;
  if (toUp == true) {
    size2update = size2update + 15;
      nodes.update([{id:124,size:size2update}]);
      toUp = false;
  } else {
      size2update = size2update - 15;
      nodes.update([{id:124,size:size2update}]);
      toUp = true;
  }
  setTimeout(battement,1500);
}


/* start */
var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);
populateDataSets(intialquery);

var container = document.getElementById('mynetwork');
var network = new vis.Network(container, {nodes: nodes,edges: edges}, options);
var selectedNode = null;

/*
* click sur le graphe
* https://github.com/almende/vis/issues/1820
*/
network.on("selectNode", function (params) {
  //get clicked node
  selectedNode = nodes.get(params.nodes[0]);

  //populate slider content
  initPanel(selectedNode.titre);

  //open slider content
  sliderAdd.slideReveal("hide");
  sliderContent.slideReveal("hide");
  sliderContent.slideReveal("show");
});
