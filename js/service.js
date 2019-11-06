/* create driver and session */
var localurl = "bolt://127.0.0.1"; // for dev only
var url = "bolt://165.22.206.197"; // official
var intialquery = "MATCH (n)-[r]-(m) OPTIONAL MATCH (p) RETURN n,r,m,p";

//config
var driver = neo4j.v1.driver(url, neo4j.v1.auth.basic("neo4j", "neo4j"));
var session = driver.session();

// to check if an id is already inspected.
function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function populateDataSets(query) {
  console.log('pooulate with query: '+query);
  var inspectedEdges = []; //id of edges already created
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

function serviceReInitData() {
  query = "MATCH (n)-[r]-(m) OPTIONAL MATCH (p) RETURN n,r,m,p";
  populateDataSets(query);
}

function reloadFromNode(titre) {
  var cypherquery = `MATCH (n {titre: '${titre}'})-[r]-(m) RETURN n,r,m`;
  nodes.clear();
  edges.clear();
  populateDataSets(cypherquery);
  nodes.update();
  console.log(cypherquery);
}

/* ---------------------------------------------------------------- */
/* Run Simple Query */
function executeSimpleQuery(cypherQuery) {
  session.run(cypherQuery).subscribe({
    onNext: function () {},
    onCompleted: function () { alert("OK"); },
    onError: function (error) {  alert("not OK");}
  });
}
/* 
  Web service call to create a new Node 
  Dependency : Node.js
*/
function serviceCreateNode(node) {
  var cypherquery = `
    CREATE (n:${node.type} {
      titre:"${node.titre}", 
      chapeau:"${node.chapeau}", 
      contenu:"${node.contenu}"
    }) 
    RETURN n`;
  executeSimpleQuery(cypherquery);
}

/* /!\ TODO : Web service call to create a new Relation */
function serviceCreateEdge() {
  cypherquery = 'MATCH (a:Artist),(b:Album) WHERE a.Name = "Strapping Young Lad" AND b.Name = "Heavy as a Really Heavy Thing" CREATE (a)-[r:RELEASED]->(b) RETURN r';
  console.log(cypherquery);
}

/* Web service call to update a node */
function serviceUpdateNode(oldtitre,newtitre,chapeau,contenu) {
  var cypherquery = `MATCH (p { titre:"${oldtitre}" }) 
  SET p = { 
    titre:"${newtitre}", 
    chapeau:"${chapeau}",
    contenu:"${contenu}" 
  } 
  RETURN p;`;
  console.log(cypherquery);
}

/* Web service call to delete a node */
function serviceDeleteNode(node) {
  var cypherquery = `MATCH (n { titre: '${node.titre}' }) DETACH DELETE n`;
  console.log(cypherquery);
}