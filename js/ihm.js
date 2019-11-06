/* Construction de l'interface, gestion des boutons, 
* des volets et autres formulaires d'ajout. */

/*  initialisation des MDE */
//AddNode
var mdeChapeau = new SimpleMDE({ element: $("#chapeauArea")[0] });
var mdeAddNodeContenu = new SimpleMDE({ element: $("#mdeAddNodeContenuArea")[0] });
//AddEdge
//EditNode
var mdeEditNodeChapeau = new SimpleMDE({ element: $("#mdeEditNodeChapeauArea")[0] });
var mdeEditNodeContenu = new SimpleMDE({ element: $("#mdeEditNodeContenuArea")[0] });

/* close sliders */
function closeSliders() {
	slider.slideReveal("hide");
	$("#nodeEditForm").hide();
}

/* open edit slider */
function openSliderEdit() {
	closeSliders();
	slider.slideReveal("show");
}

/* Gestion des messages d'alertes */
$(".closeAlert").click(function() {
  $("#alertMessage").hide();
});


/* formulaire ajout planete */
$("#addNodeFormButton").click(function(event) {
  event.preventDefault();
  var titre = $("#titreField").val();
  var type =  $("#planeteType").val();
  var chapeau = mdeChapeau.value();
  var contenu = $("#contenuArea").val();
  serviceCreateNode(type, titre, chapeau,contenu);

});

/* formulaire ajout relation */
$("#addEdgeFormButton").click(function() { 
	nodes.forEach((item, index) => {
      	console.log(item) //value
      	$('#fromSelect').append($('<option>', {
        	value: item.titre,
        	text: item.titre
    	}));
    });
	
    type = $("#planeteType");
    from = $("#from");
    to = $("#to");
    serviceCreateEdge();
});


/* Edit button */
$(".nodeEditButton").click(function() {
  $("#nodeContent").hide();
  $(".nodeEditButton").hide();
  $("#nodeEditForm").show();
});

/* back2graphButton */
$("#back2graphButton").click(function () {

  	closeSliders();
  	serviceReInitData();
  	redrawGraph();
});


$("#nodeEditSubmitButton").click(function(e) {
  e.preventDefault();
  //populate slide form
  var oldtitre =  $(".slider-titre").html();
  var newtitre =  $("#slider-titre-form").val();
  var chapeau = mdeEditNodeChapeau.value();
  var contenu = mdeEditNodeContenu.value();
  serviceUpdateNode(oldtitre,newtitre,chapeau,contenu);

  $("#nodeContent").show();
  $(".nodeEditButton").show();
  openSliderEdit();
});

/*
* Delete a node 
*/
$(".nodeDeleteButton").click(function(e) {
	e.preventDefault();
	if ( confirm( "Supprimer réellement cette planète ? " ) ) {
		serviceDeleteNode(selectedNode);
    } 
});

function populateSlider() {
	$(".slider-id").html(selectedNode.id);
	$(".slider-titre").html(selectedNode.titre);
    $(".slider-chapeau").html(mdeEditNodeChapeau.options.previewRender(selectedNode.chapeau));
    $(".slider-contenu").html(mdeEditNodeChapeau.options.previewRender(selectedNode.contenu));
}

function populateFormSlider() {
	$("#slider-titre-form").val(selectedNode.titre);
	mdeEditNodeChapeau.value(selectedNode.chapeau);
    mdeEditNodeContenu.value(selectedNode.contenu)
}
/*
* click sur le graphe
* https://github.com/almende/vis/issues/1820
*/
network.on("selectNode", function (params) {
	//get clicked node 
	selectedNode = nodes.get(params.nodes[0]);
	//populate slide form
    populateFormSlider();
	//populate slider
    populateSlider();
    //openSlider
    openSliderEdit();
    //reload graph from the current node.
    nodes.clear();
	edges.clear();
    reloadFromNode(selectedNode.titre);    
});



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