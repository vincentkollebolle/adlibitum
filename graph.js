 //initialize slider
 var slider = $('#slider').slideReveal({
    trigger: $("#trigger"),
    position: "right",
    push: false,
    overlay: true
  });

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

//neo4jDriver.v1.types.Date
var options = {};
var query = "MATCH (n)-[r]-(m) OPTIONAL MATCH (p) RETURN n,r,m,p";
var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);

function populateDataSets(query) {
  var driver = neo4j.v1.driver("bolt://165.22.206.197", neo4j.v1.auth.basic("neo4j", "neo4j"));
  var session = driver.session();
  session
    .run(query, {limit: 3000})
    .subscribe({
      onNext: (record) => {
      //construction dataPromise
      const dataPromises = Object.values(record.toObject()).map(
        async (v) => {
          //neo4j.v1.types.Node
          if (v instanceof neo4j.v1.types.Node) {
            try {
              node = createNode(v);
              nodes.add(node);
            } catch (e) {
              //console.log(e);
            }

          } else if (v instanceof neo4j.v1.types.Relationship) {
            edge = createEdge(v);
            edges.add(edge);
          }  else if (v instanceof Neo4j.types.Path) {
            var startNode = createNode(v.start);
            var endNode = createNode(v.end);

            nodes.add(startNode);
            nodes.add(endNode);

            for (let obj of v.segments) {
              nodes.add(createNode(obj.start));
              nodes.add(createNode(obj.end));
              edges.add(createEdge(obj.relationship));
            }

          } else if (v instanceof Array) {
            for (let obj of v) {
              if (obj instanceof Neo4j.types.Node) {
                var node = createNode(obj);
                nodes.add(node);

              } else if (obj instanceof Neo4j.types.Relationship) {
                var edge = createEdge(obj);
                edges.add(edge);
              }
            }
          }
        }
      );
  },
      onCompleted: function () {
        //vibration du noeud actu
        //battement();
        session.close();
      
      },
      onError: function (error) {
        console.log(error);
      }
    });
  }

//populate Data Sets with Neo4j
populateDataSets(query);

// create a network
var options = {
    interaction: {
      hover:true,
        navigationButtons: true,
      keyboard: true
    },
    physics: {
          stabilization: false
        },
    autoResize: true,
    nodes : {
      shape: 'dot',
      font:'16px proxima-nova white',
    },
    edges : {
      color: 'white'

    }

  }
var container = document.getElementById('mynetwork');
var network = new vis.Network(container, {nodes: nodes,edges: edges}, options);


//click sur le graphe
network.on("selectNode", function (params) {
    
    var currentNode = nodes.get(params.nodes[0]);
    var newquery = "MATCH (n {titre: '"+currentNode.titre+"'})-[r]-(m) RETURN n,r,m";
    console.log(newquery);
    nodes.clear();
    edges.clear();
    populateDataSets(newquery);
    //populate slider
    $(".slider-titre").html(currentNode.titre);
    $(".slider-chapeau").html(currentNode.chapeau);
    $(".slider-contenu").html(currentNode.contenu);
    slider.slideReveal("show");
    nodes.update();
});

var toUp = true;
var size2update = 10;

function back2graph() {
    //console.log("old query:"+query);
    query = "MATCH (n)-[r]-(m) OPTIONAL MATCH (p) RETURN n,r,m,p";
    populateDataSets(query);
    nodes.clear();
    edges.clear();
    nodes.update();
}
//vibration 
function battement() {
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