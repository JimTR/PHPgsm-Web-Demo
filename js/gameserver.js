// gameserver.js
function get_game() {
	console.log(url);
	var offline = 0;
cmd = url+'/api.php?action=game_detail&server='+server+'&filter='+game;
console.log (cmd);
         $.ajax({
			
        type: 'GET',
        url: cmd,
        dataType: "json",
			    statusCode: {
        500: function() {
          alert("Script exhausted");
			return;
        }
      },
        success: function (data) {
            console.log('got data - game_detail');
            //alert ('success game_detail')
        },
        complete:function(data){
		if(typeof data.responseJSON.general != 'undefined') {
			var general = data.responseJSON.general;
		}
		if(typeof data.responseJSON.server != 'undefined') {
			//alert('online');
			var serverd = data.responseJSON.server;
			var people = serverd.players;
			var vdf = serverd.vdf_data;
			console.log(serverd);
			offline = 1;
		}	
			//if(typeof serverd.players != 'undefined') {
				
			//}
			
			//console.log(print_r(vdf));
			var items = '';
			//sorted=$(people).sort(sortLastNameDesc);  
			//console.log(general);
			//console.log(serverd);
			if(typeof people != 'undefined') {
			console.log(people);
				$.each(people, function(i, item) {
					items = items+'<tr id="'+item.steam_id+'"style="width:100%;"><td class="tpButton">'+item.Name+'</td><td id="'+item.ip+'"><img class="flag" '+item.flag+'/>'+item.country+'</td><td style="text-align:right;">'+item.Frags+'</td><td style="text-align:right;padding-right:2%;">'+item.TimeF+'</td></tr>';
				});
			}
if (offline == 1) {			
var players_online = serverd.Players-serverd.Bots
console.log(players_online);
}
    if(isNaN(players_online)) {
		console.log('running ??');
		$('#status').text('Offline');
		$('#mem').text("");
		$('#cpu').text("");
		$('#gametags').text("");
		$('#hostname').text("");
		$('#map').text('');
		$('#players').text('');
		$('#bots').text('');
		$('#maxplayers').text('');
		$('#items').html(items);
		$('#secure').text('');
		$('#steamid').text('');
		$('#maxplayers').text('');
		$('#start').text('');
		$('#update').text('');
		$('#build').text('');
		$('#server_id').text('');
		$('#gameid').text('');
		$('#player-tot').text(serverd.player_tot);
		// buttons 
		//$('#'+server_id+'qbutton').removeClass('btn-primary').addClass('btn-danger');
		$('#stop_server').addClass('hidden');
		$('#restart_server').addClass('hidden');
		$('#start_server').removeClass('hidden');
		$('#cvar').addClass('hidden');
		$('#join_server').addClass('hidden');
		$('#send').prop('disabled', true);
		
		
	}
	else {
			console.log ('got to html mangle');
			$('#status').text(serverd.online);
			$('#mem').text(serverd.mem+"%");
			$('#cpu').text(serverd.cpu+"%");
			$('#gametags').text(serverd.GameTags);
			$('#hostname').text(serverd.HostName);
			$('#map').text(serverd.Map);
			$('#players').text(players_online);
			$('#bots').text(serverd.Bots);
			$('#maxplayers').text(serverd.MaxPlayers);
			$('#items').html(items);
			$('#secure').text(serverd.Secure);
			$('#steamid').text(serverd.SteamID);
			$('#gameid').text(serverd.GameID);
			$('#maxplayers').text(serverd.MaxPlayers);
			$('#start').text(date_format(serverd.starttime));
			$('#update').text(date_format(serverd.server_update));
			$('#build').text(serverd.Version);
			$('#server_id').text(serverd.server_id);
			$('#player-tot').text(serverd.player_tot);
			$('#moddesc').text(serverd.ModDesc);
			//buttons
			$('#stop_server').removeClass('hidden');
			$('#restart_server').removeClass('hidden');
			$('#cvar').removeClass('hidden');
			$('#start_server').addClass('hidden');
			$('#join_server').removeClass('hidden');
			$('#send').prop('disabled', false);
		}
			$('#install_dir').text(vdf.installdir);
			$('#install_size').text(formatBytes(vdf.SizeOnDisk,1));
			$('#update').text(date_format(vdf.LastUpdated));
			console.log(serverd.disk_space);
			$('#disk_space').text(formatBytes(serverd.disk_space)); 
			$('#player-tot').text(serverd.player_tot);
		}
    });
}

function fetchlog() {
	//alert(url+"  "+id);
	rows = 100;
	cmd = url+'/api.php?action=console&server='+id+'&rows='+rows+'&output=json';
	//alert (cmd);
	var items='';
         console.log(cmd);
          $.ajax({
			
        type: 'GET',
        url: cmd,
        dataType: "json",
			    statusCode: {
        500: function() {
          alert("Script exhausted");
			return;
        }
      },
        success: function (data) {
                        console.log('got data - fetchlog');
						//console.log(data);

        },
        complete:function(data){
                         //console.log(data);
                        
$.each(data.responseJSON, function(i, item) {
    //alert(item);
items = items+item;
});
			//setInterval(fetchlog(port,id,url), 5000);
			var element = document.getElementById("log");
			if (element.scrollHeight - element.scrollTop === element.clientHeight)
    		{
				var bottom = true;
			}
			else {
				var bottom =false;
			}
$("#log").html(items);
			       if (bottom == true) {
     				element.scrollTop = element.scrollHeight;
					//console.log('top = '+element.scrollTop);
				   }
                }
    });

}

function players() {
	 //get player functions
	//alert ('Players ! '+url+' '+id);
	//return;
        var items='';
		var cerror=false;
	cmd = url+'/api.php?action=viewserver&server='+id;
	//alert(cmd);
         console.log(cmd);
          $.ajax({
		
		type: 'GET',
        url: cmd,
        dataType: "json",
        success: function (data) {
                       console.log('got data - viewplayers');
                      // console.log(data);
					 //info = data.responseJSON.info;
             		//console.log('current data - '+info);	

        },
        complete:function(data){
                       // console.log(data);
						//setInterval(players(port,id,url), 5000);
					if(typeof data.responseJSON == 'undefined') {
                        
                        console.log ('no info');
                        return;
					}
					//else {
					    info = data.responseJSON.info;
                        player = data.responseJSON.players;
					//}
			             if(typeof(info.Map) == 'undefined') {
				  			console.log('no map !');
				  			return 0;
			  			}
						else {
							$('#player_title').html(info.Map);
						}
						if(typeof(player) == "null") { 
							console.log('returning empty from players function');
   							 return 0;
						} 
						//pno = player.length;
						
                       
			
$.each(player, function(i, item) {
    //alert(item);
items = items+'<tr id="'+item.steam_id+'"style="width:100%;"><td class="tpButton">'+item.Name+'</td><td title="'+item.country+'" id="'+item.ip+'"><img class="flag" '+item.flag+'/></td><td style="text-align:right;">'+item.Frags+'</td><td style="text-align:right;padding-right:2%;">'+item.TimeF+'</td></tr>';
});

$("#pbody").html(items);
items='<div style="width:100%;position:relative;text-align:center;top:5;">Current Rule Set</div><br>';
			items='';
			 rules = data.responseJSON.rules;
$.each(rules, function(i, item2) {
    //alert(item);
items = items+'<div style="clear:both;padding:5px;"><div style="padding-right:10px;width:30%;text-align:left;float:left;">'+i+'</div><div style="width:60%;clear:none;text-align:right;float:left;">'+item2+'</div></div>';
});
$("#rule").html(items);
                }
    });

}

function date_format( timestamp) {
	//format date time
	var timestampInMilliSeconds = timestamp*1000;
	var date = new Date(timestampInMilliSeconds);
	var formatted_date = date.format('d-m-Y \\a\\t h:i a');
	return (formatted_date);
}
function start_server() {
	//starts the server
	cmd = url+'/api.php?action=exe_tmux&server='+id+'&cmd=s';
	console.log(cmd);
	//alert(cmd);
	
	$.get(cmd, function(data, status){
		//alert("Data: " + data + "\nStatus: " + status);
		if(status == "success" ) {
			//$("#"+id).blur();
			console.log(data);
		 }
	});
}

function stop_server() {
	//starts the server
	cmd = url+'/api.php?action=exe_tmux&server='+id+'&cmd=q';
	console.log(cmd);
	$.get(cmd, function(data, status){
		//alert("Data: " + data + "\nStatus: " + status);
		if(status == "success" ) {
			//$("#"+id).blur();
			console.log(data);
		 }
	});
}
function restart_server() {
	//starts the server
	cmd = url+'/api.php?action=exe_tmux&server='+id+'&cmd=r';
	alert(cmd);
	$.get(cmd, function(data, status){
		//alert("Data: " + data + "\nStatus: " + status);
		if(status == "success" ) {
			//$("#"+id).blur();
			console.log(data);
		 }
	});
}
function print_r(o){
	return JSON.stringify(o,null,'\t');
}
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
