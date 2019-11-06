//init SimpleMarkdownEditor
var panelAddMdeChapeau = new SimpleMDE({ element: $("#panelAdd-mdeChapeau")[0] });
var panelAddMdeContenu = new SimpleMDE({ element: $("#panelAdd-mdeContenu")[0] });
        
$("#formAddNode").submit(function(e) {
    e.preventDefault();
    //get titre
    titre = $("#panelAdd-titre").val();
    //get Type
    type = $("#panelAdd-type").val();
    //get chapeau
    chapeau = panelAddMdeChapeau.value();
    //get contenu
    contenu = panelAddMdeContenu.value();
    //create node
    node2add = new Node(0, type, titre, chapeau, contenu);
    //execute query
    serviceCreateNode(node2add);
});