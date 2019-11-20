Vue.component('ad-add-slider', {
    props: ['visible'],
    template: `<div id="sliderAdd" v-bind:class="{ slider: true, visible: visible }">
        <div class="nodeAddPanel">
            <div class="row">
                <div class="col-md-1 panelMenu">
                    <!-- info -->
                    <div class="panelMenuItem menuInfo">
                        <i class="material-icons">radio_button_unchecked</i>
                    </div>
                    <!-- Fermer -->
                    <div class="panelMenuItem menuClose triggerAdd" v-on:click="hideSlider()">
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
                        <span>Le message multiligne est :</span>
                            <p style="white-space: pre-line;">{{ message }}</p>
                            <br>
                            <label for="#panelAdd-mdeChapeau">Description courte :</label>
                            <textarea
                              id="panelAdd-mdeChapeau"
                              v-model="shortDesc"
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
                                v-on:click="submission"
                                class="btn btn-outline-secondary"
                                type="submit">Ok</button>
                            <button  v-on:click="hideSlider" class="btn btn-outline-secondary">Annuler</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`,
    data: function () {
      return {
        message: "le chat",
        shortDesc: "lalala",
      };
    },
    methods: {
      hideSlider: function (event) {
        if (event) event.preventDefault();
          this.$root.$data.visiblePanel = '';
      },
      submission: function (event) {
        // `this` fait référence à l'instance de Vue à l'intérieur de `methods`
        if (event) event.preventDefault();
        alert('Bonjour maître !'+ this.shortDesc);
      },
    }
});
