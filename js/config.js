var localurl = "bolt://127.0.0.1"; // for dev only
var url = "bolt://165.22.206.197"; // official
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