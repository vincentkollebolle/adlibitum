 //initialize sliderContent
 var slider = $('#sliderContent').slideReveal({
    trigger: $("#trigger"),
    position: "right",
    push: false,
    overlay: false,
    autoEscape: false,
  });

// initialize sliderAddNode
 var sliderAddNode = $('#sliderAddNode').slideReveal({
    trigger: $("#AddNodeButton"),
    position: "right",
    push: false,
    overlay: false,
    autoEscape: false,
  });

 //initialize sliderAddEdge
 var sliderAddEdge = $('#sliderAddEdge').slideReveal({
    trigger: $("#AddEdgeButton"),
    position: "right",
    push: false,
    overlay: false,
    autoEscape: false,
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
var localurl = "bolt://127.0.0.1"; // for dev only
var url = "bolt://165.22.206.197"; // official
var intialquery = "MATCH (n)-[r]-(m) OPTIONAL MATCH (p) RETURN n,r,m,p";
var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);

function populateDataSets(query) {
  var driver = neo4j.v1.driver(url, neo4j.v1.auth.basic("neo4j", "neo4j"));
  var session = driver.session();
  var inspectedEdges = []; //id of edges already created
    // to check if an id is already inspected.
  function isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

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
              //get node id 
              currentId = v.identity.toInt();
              //check if edge already added
              if(!isInArray(currentId,inspectedEdges)) {
                edge = createEdge(v);
                edges.add(edge);
                inspectedEdges.push(currentId);
              }

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
        inspectedEdges = [];
        session.close();
      
      },
      onError: function (error) {
        console.log(error);
      }
    });
  }

//populate Data Sets with Neo4j
populateDataSets(intialquery);

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
//https://github.com/almende/vis/issues/1820
network.on("selectNode", function (params) {
    
    var currentNode = nodes.get(params.nodes[0]);
    var newquery = "MATCH (n {titre: '"+currentNode.titre+"'})-[r]-(m) RETURN n,r,m";
    console.log(newquery);
    //populate slider
    $(".slider-titre").html(currentNode.titre);
    $(".slider-chapeau").html(currentNode.chapeau);
    $(".slider-contenu").html(currentNode.contenu);
    //populate slide form
    $("#slider-titre-form").val(currentNode.titre);
    $("#slider-chapeau-form").val(currentNode.chapeau);
    $("#slider-contenu-form").val(currentNode.contenu);

    slider.slideReveal("show");
    nodes.clear();
    edges.clear();
    populateDataSets(newquery);
    nodes.update();
});


function updateGraphAndSlider() {

}

var toUp = true;
var size2update = 10;

$("#back2graphButton").click(function () {
  //console.log("old query:"+query);
  slider.slideReveal("hide");
  query = "MATCH (n)-[r]-(m) OPTIONAL MATCH (p) RETURN n,r,m,p";
  populateDataSets(query);
  nodes.clear();
  edges.clear();
  nodes.update();
});



$(".nodeEditButton").click(function() {
  $("#nodeContent").hide();
  $(".nodeEditButton").hide();
  $("#nodeEditForm").show();
});

//close slider
$(".closeSlider").click(function(e) {
  slider.slideReveal("hide");
  sliderAddNode.slideReveal("hide");
  sliderAddEdge.slideReveal("hide");
});

$("#nodeEditSubmitButton").click(function(e) {
  e.preventDefault();
 
  //populate slide form
  var oldtitre =  $(".slider-titre").html();
  var newtitre =  $("#slider-titre-form").val();
  var chapeau = $("#slider-chapeau-form").val();
  var contenu = $("#slider-contenu-form").val();
  var query4update = 'MATCH (p { titre:"'+oldtitre+'" }) SET p = { titre:"'+newtitre+'", chapeau:"'+chapeau+'",contenu:"'+contenu+'" } RETURN p;';
  $("#alertMessage .message").html(query4update);  
  $("#alertMessage").show();
  $("#nodeContent").show();
  $(".nodeEditButton").show();
  $("#nodeEditForm").hide();
  slider.slideReveal("hide");
  //execute query on session.
  //populate alert message
  //back2graph
});

$(".closeAlert").click(function() {
  $("#alertMessage").hide();
});

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