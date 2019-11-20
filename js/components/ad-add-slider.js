Vue.component('ad-add-slider', {
    template: `<div id="sliderAdd" v-bind:class="{ slider: true, visible: visible }">
        <div class="nodeAddPanel">
            <div class="row">
                <div class="col-md-1 panelMenu">
                    <!-- info -->
                    <div class="panelMenuItem menuInfo">
                        <i class="material-icons">radio_button_unchecked</i>
                    </div>
                    <!-- Fermer -->
                    <div class="panelMenuItem menuClose triggerAdd">
                        <i class="material-icons">close</i>
                    </div>
                </div>
                <div class="col-md-11 panelContent">
                    <h1 class="panelTitre">Ajouter un noeud</h1>
                    <form id="formAddNode">
                        <div class="form-group">
                            <label for="slider-titre-form">Titre</label>
                            <input class="form-control" id="panelAdd-titre" type="text" value="" />
                        </div>
                        <div class="form-group">
                            <label for="panelAdd-type">Type</label>
                            <select class="form-control" id="panelAdd-type">
                                <option value="Ressource">Ressource</option>
                                <option value="Personne">Personne</option>
                                <option value="Evenement">Événement</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="#panelAdd-mdeChapeau">Description courte :</label>
                            <textarea
                            id="panelAdd-mdeChapeau"
                            rows="3"
                            class="form-control" ></textarea>
                        </div>
                        <div class="form-group">
                            <label for="#panelAdd-mdeContenu">Description longue :</label>
                            <textarea
                            id="panelAdd-mdeContenu"
                            rows="4"
                            class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <button
                                class="btn btn-outline-secondary"
                                type="submit">Ok</button>
                            <button disabled="disabled" class="btn btn-outline-secondary">Annuler</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`,

    data: function() {
        return {
            visible: false,
        };
    },
});
