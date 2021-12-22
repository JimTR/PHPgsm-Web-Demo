function index(url) {
	// read data use simular to loading the index file
	 $.ajax({ 
        type: 'GET', 
        url: url, 
        data    : { module: 'index' },
        dataType: "json", 
        success: function (data1) {
			// got data
			console.log(data1);
			$('#player_tot').text(data1.player_tot);
			$('#logins_tot').text(data1.logins_tot);
			$('#players').text(data1.players);
			//alert (data1.players);
		},
        complete:function(data1){
			    setTimeout(index(url),3000);
				
		}
    });
}
