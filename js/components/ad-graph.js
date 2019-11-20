Vue.component('ad-graph', {
    template: `<div id="mynetwork"></div>`,

    data: function () {
        return {
            nodes: new vis.DataSet(),
            edges: new vis.DataSet(),
            options: {
                interaction: {
                    hover: true,
                    navigationButtons: true,
                    keyboard: true,
                },
                physics: { stabilization: false },
                autoResize: true,
                nodes : {
                    shape: 'dot',
                    font: '16px proxima-nova white',
                },
                edges : { color: 'white' },
            },
        };
    },

    created: function () {
        this.fetchData();
    },

    mounted: function () {
        this.container = document.getElementById('mynetwork');
        this.network = new vis.Network(this.container, { nodes: this.nodes, edges: this.edges }, this.options);
        this.network.on('selectNode', this.selectNode);
    },

    methods: {
        fetchData: function () {
            const nodes = [];
            const edges = [];

            session
            .run(intialquery, { limit: 3000 })
            .subscribe({
                onNext: record => {
                    const data = record.toObject();
                    Object.values(data).map(item => {
                        if (item instanceof neo4j.v1.types.Node) {
                            nodes.push(createNode(item));
                        }
                        else if (item instanceof neo4j.v1.types.Relationship) {
                            edges.push(createEdge(item));
                        }
                    });
                },
                onCompleted: () => {
                    nodes.forEach(n => {
                        try {
                            this.nodes.add(n)
                        }
                        catch (exc) {}
                    });
                    edges.forEach(e => {
                        try {
                            this.edges.add(e)
                        }
                        catch (exc) {}
                    });
                    session.close();
                },
                onError: (error) => {
                    console.error(error);
                },
            });
        },
        selectNode: function (params) {
            selectedNode = this.nodes.get(params.nodes[0]);
            this.$root.$data.visiblePanel = 'edit';
            this.$root.$data.selectedNode = selectedNode;
            console.log(selectedNode);
        },
    },
});
