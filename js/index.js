function index() {
	// read data use simular to loading the index file
	if (serverCount >1) {$("#server-desc").text("API Servers");}
     $.ajax({ 
        type: 'GET', 
        url: 'ajax.php', 
        data    : { module: 'index' },
        dataType: "json", 
        success: function (data1) {
			// got data
			console.log(data1);
			$('#player_tot').text(data1.player_tot);
			$('#logins_tot').text(data1.logins_tot);
			$('#player').text(data1.players);
			$('#run_tot').text(data1.run_tot);
			$('#logins_today').text(data1.logins_today);
			$('#countries').text(data1.countries);
			$('#country_top_today').text(data1.country_top_today);
			$('#country_top').text(data1.country_top);
			$('#pop_country').text(data1.pop_country+" ("+data1.pop_time+")");
			$('#most-played').text(data1.most_played);
			$('#most-played-time').text(data1.total_time);
			playerInfo = data1.player_info;
			//console.log(playerInfo);
			for (var i in playerInfo) {
				player= playerInfo[i];
				//console.log(player);
				$("#player"+i+"-login").html(player.login);
				$("#player"+i+"-logins").html(player.logins);
				$("#player"+i+"-name").html(player.name);
				$("#player"+i+"-map").html(player.map);
				$("#player"+i+"-joined").html(player.joined);
				$("#player"+i+"-avatar1").attr("src",player.avatar);
				$("#player"+i+"-link").prop("href",player.detail_link);
			}
		},
        complete:function(data1){
			 durl = $("#disco-img").attr("src");
			$("#disco-img").removeAttr("src").attr("src", durl); // update discord
		}
    });
}

function game_server(url,server) {
	// get game server info
	$.ajax({ 
        type: 'GET', 
        url: url, 
        data    : { module: 'gameserver', server: server},
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
			var ptot= 0;
			var online_has_players = {};
			var ps = '';
			var data1 = xml;
			for (var i in data1) {
				var fname = i; // got the base server
				//console.log(fname);
				
				if( i =='general' ) {
					var general = data1[i];
					//console.log(general);
					var serverid = general.server_id;
					href="<a href='baseserver.php?server="+serverid+"'>"+serverid+"</a>";
					$("#"+serverid+"-p-name").html(href);
					$("#"+serverid+"-up-time").html(general.uptime);
					cpu = general.cpu_info;
					//console.log(cpu);
					if(cpu.reboot  == "Yes") { 
						title = "this server needs a reboot";
						cpu.reboot = "<img src ='img/offline.png' title='"+title+"'></img>";
						
					}
					else{ 
						if(parseInt(cpu.load_1_min_pc) >80 ) {
							title = "this server is using a lot of cpu";
							cpu.reboot = "<img src ='img/offline1.png' title='"+title+"'></img>";
						}
						else{	
							title = "this server is running normally";
							cpu.reboot = "<img src ='img/online.png' title='"+title+"'></img>";
						}
					}
					$("#"+serverid+"-reboot").html(cpu.reboot);
					$("#"+serverid+"-load").html(cpu.load_pc);
					for (g in general) {
						if( g =='countries') {
							var country_data = general['countries'];  
						}
					} 
				}
				if (i =='top_players') {var top_players=data1[i];}
				//console.log(country_data);
				for (var j in country_data) {
					var td_title = '<tr id="country_'+j+'"><td id="country_row_'+j+'" title = "'+country_data[j]['country']+'"><img src="'+country_data[j]['flag']+'" style="height:18px;margin-top:-2px;"></td>';
					var td_country = '<td>'+country_data[j]['country']+'</td>';
					var td_players = '<td>'+country_data[j]['players']+'</td>';
					var td_logins = '<td>'+country_data[j]['logins']+'</td>';
					var td_ppercent = '<td>'+country_data[j]['ppercent']+'</td>';
					var td_percent =  '<td>'+country_data[j]['percent']+'</td>';
					var td_today =  '<td  style="text-align:right;padding-right:16%;">'+country_data[j]['today']+'</td>';
					var tr = td_title+td_country+td_players+td_logins+td_ppercent+td_percent+td_today+"</tr>";
					//console.log(tr);
					//console.log(country_data[j]['country'])
					$("td#country_row_"+j).parent().replaceWith(tr);   
				}
				for (var j in  top_players) {
					// read in players
					var td_title = '<tr id="playerrow_'+j+'" title ="'+top_players[j]['country']+'"><td id="player_row_'+j+'"><img src="'+top_players[j]['flag']+'" style ="width:5%;vertical-align: middle;">&nbsp;&nbsp;'+top_players[j]['name']+'</td>';
					var td_first_logon = '<td>'+top_players[j]['first_log_on']+'</td>';
					var td_logons = '<td>'+top_players[j]['log_ons']+'</td>';
					var td_last_logon = '<td>'+top_players[j]['last_log_on']+'</td></tr>';
					var tr = td_title+td_first_logon+td_logons+td_last_logon;
					$("td#player_row_"+j).parent().replaceWith(tr);   
					//console.log(tr);
				}
			for (var j in data1[i]) {
				// we have the individal server
				if (typeof serverlength === 0) {
					//console.log('server not set');
					return;
				}   
				var server = data1[i][j]; // got server id
				var server_id = j;	
				if (server.running == 1 ) {
				} 
			}
			//console.log(player_tots);
			if(typeof player_tots != 'undefined'){
				$('#player_tot').text(player_tots.player_tot);
				$('#tplayers').text(data1.general.total_players);
				$('#logins_tot').text(player_tots.tot_logins);
				$('#tcountries').text(player_tots.countries);
				$('#tinstalled').text(player_tots.game_tot);
				$('#run_tot').text(player_tots.run_tot);
			}
			
			for (var j in data1[i]) {
				if (typeof serverlength === 0) {return;}   
				var server = data1[i][j]; // got server id
				
				var server_id = j;	
				if (server.running == 1 ) {
					var playern = server.Players;
					
					$('#pl'+server_id).html(playern); 
					$("#"+server_id).show();
					var logo  =server.url+':'+server.bport+'/'+server.logo;
					if (typeof server.Players === "undefined") {server.Players = 0;}   
					$("#img"+server_id).attr("src",logo);
					$('#cmap'+server_id).html(server.Map);
					 esc = server.server_name.replace("\\", "");
					 server.server_name= esc;
					$('#host'+server_id).html(server.server_name);
					$('#gdate'+server_id).html(server.r_time);
					real_players = server.Players-server.Bots;
					if(real_players >0) {
						key = server.HostName;
						online_has_players[key] = real_players+","+server.host_name;
					}
					ptot +=real_players;
					
					$('#gol'+server_id).html(real_players+'/'+server.max_players);
					$('#pt'+server_id).html(server.player_tot);
					if (server.Players ==0 ) {
						//console.log ('should be nowt '+server.Players);
						$("#"+server_id+"-secret").slideUp();
						$('#'+server_id+"-secret").css('cursor','default');  
						
						$('#gol'+server_id).removeClass("p_count").addClass("map-title");
					}
					else if (server.Players >0) {
						if (typeof server.players === "undefined") {
							console.log('no need players array not set '+server.server_name);
							return;
						}   
						$('#op1'+server_id).css('cursor','pointer');
						$('#gol'+server_id).removeClass("map-title").addClass('p_count');
						$("#"+server_id+"-playerbody").empty();
						var players = $.map(server.players, function(value, index) { return [value]; });
						//var players = players.sort((b, a) => (a.Frags > b.Frags) ? 1 : -1)
						
						for (p in players) {
							newRowContent='<tr style="font-size:14px;" class="p-name"><td style="width:50% !important;"><i >'+players[p].Name+'</i></td><td style="text-align:right;width:15%;" >'+players[p].Frags+'</td><td style=text-align:right;padding-right:3%;width:20%" class="p_time">'+players[p].TimeF+'</td></tr>'; 
							$("#"+server_id+"-playerbody").append(newRowContent);
						}
					}
					
				}
				else {
					$('#'+server_id).hide(); // hide the server
				}					
			}
			online_servers= "";
			var rowCount = $('#xy tr').length;
			var count = $('#'+serverid).children('tr').length;
			if (ptot >0 ) {
				//key = jQuery.parse( '"'+key+'"' );
				$.each( online_has_players, function( key, value ) {
					ServerData = value.split(",");
					sname = $("#"+ServerData[1]+"-name").text();
					console.log(sname+"  should be "+ServerData[1]+" key = "+key);
					online_servers += "<tr class='"+ServerData[1]+"'><td><a href='console.php?server="+ServerData[1]+"'>"+sname+"</a></td><td style='text-align:center;'>"+ServerData[0]+"</td></tr>"; 
				});
				$("#dormant").hide();
				$("#active-load").hide();
				$("#a"+serverid).html(online_servers);
			}
			else {
				$("#a"+serverid).empty();
				$("#active-load").hide();
				rowCount = $('#xy tr').length;
				console.log("server Count = "+serverCount+" row count = "+rowCount);
				if(rowCount == 2  ) {$("#dormant").show();}
			}
		}
  },
    fail: function() {
		 alert('Failed');
    },
	complete:function(data,data1){
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
	var d = a.getDate();
	var d1 =a.getHours();
	var d = ('0'+d).slice(-2);
	var m = a.getMonth()+1;
	var m = ('0'+m).slice(-2);
	var hour =('0'+hour).slice(-2);
    var y = a.getFullYear();
	var min = ('0'+a.getMinutes()).slice(-2);
	var sec = a.getSeconds();
	var time = d+ '-' + m + '-' + y + ' ' + hour + ':' + min ;
	return time;
}

function timeDifference(current, previous) {
	var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;
    if (elapsed < msPerMinute) {
		return Math.round(elapsed/1000) + ' seconds ago';   
    }
    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }
    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }
    else if (elapsed < msPerMonth) {
         return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }
    else if (elapsed < msPerYear) {
         return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }
    else {
         return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function imgError(image) {
    image.onerror = "";
    image.src = "img/unknown.png";
    return true;
}
	 


$(document).on('click', '.p_count', function(){
		game = this.id.substr(3);
		game = "#"+game;
		title = $(game+"-name").text();
        $(game+"-secret").slideToggle()
    });
$("div").click(function() {
	
	if(this.className == 'secret') {
		$("#"+this.id).slideToggle();
	}
});