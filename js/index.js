function index() {
	// read data use simular to loading the index file
     $.ajax({ 
        type: 'GET', 
        url: 'ajax.php', 
        data    : { module: 'index' },
        dataType: "json", 
        success: function (data1) {
			// got data
			//console.log(data1);
			$('#player_tot').text(data1.player_tot);
			$('#logins_tot').text(data1.logins_tot);
			$('#player').text(data1.players);
			$('#run_tot').text(data1.run_tot);
			//alert (data1.players);
		},
        complete:function(data1){
			    //setTimeout(index(url),7000);
				
		}
    });
}

function game_server(url,server) {
	// get game server info
	$.ajax({ 
        type: 'GET', 
        url: url, 
        data    : { module: 'gameserver',
						 server: server},
        dataType: "json", 
        success: function (data1) {
			// got data
			//console.log(data1);
			//$('#player_tot').text(data1.player_tot);
			//$('#logins_tot').text(data1.logins_tot);
			//$('#players').text(data1.players);
			//$('#run_tot').text(data1.run_tot);
			//alert (data1.players);
		},
        complete:function(data1){
			    //setTimeout(index(url),3000);
				
		}
});
}
function online(url){
        var timer =sessionStorage.getItem(url);
        //console.log("enter online with "+url);
	 $.ajax({
		url: url,
		type: 'post',
		dataType: "json" ,
		success: function(xml,status){
			var data1 = xml;
			for (var i in data1) {
				//console.log(i);
				var fname = i; // got the base server
				if( i =='general' ) {
					var general = data1[i];
					//console.log(general);
					for (g in general) {
						if( g =='countries') {
							var country_data = general['countries'];  
							
						}
							//$('#demo').append('<p>'+g+' '+general[g]+'</p>');
					} 
				//return;
				}
				$("#country_table").empty();
				for (var j in country_data) {
					var td_title = '<tr><td title = "'+country_data[j]['country']+'"><img src="'+country_data[j]['flag']+'" style="height:18px;margin-top:-2px;"></td>';
					var td_country = '<td>'+country_data[j]['country']+'</td>';
					var td_players = '<td>'+country_data[j]['players']+'</td>';
					var td_logins = '<td>'+country_data[j]['logins']+'</td>';
					var td_ppercent = '<td>'+country_data[j]['ppercent']+'</td>';
					var td_percent =  '<td>'+country_data[j]['percent']+'</td>';
					var td_today =  '<td  style="text-align:right;padding-right:16%;">'+country_data[j]['today']+'</td>';
					var tr = td_title+td_country+td_players+td_logins+td_ppercent+td_percent+td_today+"</tr>";
					//console.log(country_data[j]['country'])
					$('#'+country_data[j]['country']+'_today').html(country_data[j]['today']);
					$('#'+country_data[j]['country']+'_players').html(country_data[j]['players']);
					$('#'+country_data[j]['country']+'_logins').html(country_data[j]['logins']);
					$('#'+country_data[j]['country']+'_ppercent').html(country_data[j]['ppercent']);
					$('#'+country_data[j]['country']+'_percent').html(country_data[j]['percent']);
					$("#country_table").append(tr);
				}
				 //$("#country_table").append("<tr><td>Test Row Append</td><td></td></tr>");
			//console.log(country_data);
			for (var j in data1[i]) {
			// we have the individal server
			if (typeof serverlength === 0) {
				//console.log('server not set');
				return;
			}   
			var server = data1[i][j]; // got server id
			var server_id = j;	
			if (server.running == 1 ) {
					var playern = server.Players;
					$('#pl'+server_id).html(playern); 
					$("#"+server_id).show();
					var start_date = timeConverter(parseFloat(server.starttime));
					var logo  =server.url+':'+server.bport+'/'+server.logo;
					if (typeof server.Players === "undefined") {
						server.Players = 0;
					}   
					$("#img"+server_id).attr("src",logo);
					$('#cmap'+server_id).html(server.Map);
					$('#host'+server_id).html(server.server_name);
					$('#gdate'+server_id).html(start_date);
					$('#gol'+server_id).html(server.Players+'/'+server.max_players);
					$('#pt'+server_id).html(server.player_tot);
						 
					if (server.Players ==0 ) {
						//console.log ('should be nowt '+server.Players);
						$("#ops"+server_id).slideUp();
						$('#op1'+server_id).css('cursor','default');  
						$('#gol'+server_id).removeClass('p_count'); 
					}
					else if (server.Players >0) {
						if (typeof server.players === "undefined") {
							console.log('players array not set '+server.server_name);
							return;
					}   
					$('#op1'+server_id).css('cursor','pointer');
					$('#gol'+server_id).addClass('p_count');	
					$("#pbody"+server_id).empty();
					var players = server.players;
					var players = players.sort((b, a) => (a.Frags > b.Frags) ? 1 : -1)
					//console.log(players);
					for (p in players) {
						newRowContent='<tr style="font-size:14px;"><td style="width:60% !important;"><i class="p_name">'+players[p].Name+'</i></td><td style="text-align:right;width:15%; !important;padding-right:14%" class="p_score">'+players[p].Frags+'</td><td style=text-align:right;padding-right:3%;width:20%" class="p_time">'+players[p].TimeF+'</td></tr>'; 
						$("#pbody"+server_id).append(newRowContent);
					}
				}
			}
			else {
				$('#'+server_id).hide(); // hide the server
			}					
			}	
	}
	    
  },
    fail: function() {
		//Something went wrong. Inform user/try again as appropriate
        alert('Failed');
        //setTimeout('Update()', 2000);
    },
	complete:function(data,data1){
		//if(timer === null){ console.log('timer not set')};
		sessionStorage.setItem(url, "value");
  }
  });
}
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
  var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var day = weekday[a.getDay()];
  var date = a.getDate();
  var hour = a.getHours();
  var timeOfDay = ( hour < 12 ) ? "am" : "pm"; 
  currentHours = ( hour > 12 ) ? hour - 12 : hour;
     // Convert an hours component of "0" to "12"
    
  //hour = ( currentHours == 0 ) ? 12 : currentHours;
 
  //var date = dateOrdinal(date);
  var d = a.getDate();
	var d1 =a.getHours();
//console.log(currentHours);
var d = ('0'+d).slice(-2);
	var m = a.getMonth()+1;
var m = ('0'+m).slice(-2);

var hour =('0'+hour).slice(-2);
        //m += 1;  // JavaScript months are 0-11
	var y = a.getFullYear();
  var min = ('0'+a.getMinutes()).slice(-2);
  var sec = a.getSeconds();

  var time = d+ '-' + m + '-' + y + ' ' + hour + ':' + min ;
  return time;
}

