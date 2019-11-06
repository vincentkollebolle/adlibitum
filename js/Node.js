class Node {

	constructor(id, type, titre, chapeau, contenu) {
		this.relations = new Array();
		this.id = id;
		this.type = type;
    	this.titre = titre;
    	this.chapeau = chapeau;
    	this.contenu = contenu;
  	}

  	addRelation(type, titre) {
  		this.relations.push({type,titre});
  	}
}