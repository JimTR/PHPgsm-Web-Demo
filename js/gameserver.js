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
		$('#player-tot').text('');
		// buttons 
		//$('#'+server_id+'qbutton').removeClass('btn-primary').addClass('btn-danger');
		$('#stop_server').addClass('hidden');
		$('#restart_server').addClass('hidden');
		$('#start_server').removeClass('hidden');
		$('#cvar').addClass('hidden');
		$('#join_server').addClass('hidden');
		$('#console').addClass('hidden');
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
			$('#console1').removeClass('hidden');
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
	cmd = url+'/api.php?action=exe_tmux&server='+id+'&cmd=q';
	console.log(cmd);
	$.get(cmd, function(data, status){
		if(status == "success" ) {
			console.log(data);
		 }
	});
}

function restart_server() {
	//starts the server
	cmd = url+'/api.php?action=exe_tmux&server='+id+'&cmd=r';
	//alert(cmd);
	$.get(cmd, function(data, status){
		if(status == "success" ) {
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

function copyDivToClipboard() {
	var range = document.createRange();
	range.selectNode(document.getElementById("vcmd"));
	window.getSelection().removeAllRanges(); // clear current selection
	window.getSelection().addRange(range); // to select text
	document.execCommand("copy");
	window.getSelection().removeAllRanges();// to deselect
}
	
$("input[type='checkbox']").change(function() {
	expression = ($(this).attr('id'));
	if ($( "input[name^='map']" )) {return;}
	switch(expression) {
		case 'disable-server':
		case 'delete-server':
			chkvalue = $(this).val();
				if(this.checked) {
					$(this).val("0");
					$("#dis-text").val("0");
				}
				else {
					$(this).val("1");
					$("#dis-text").val("1");
				}
				return;
				break
		default:
			if(this.checked) {
				//Do stuff
			}
			else {
				cmd =$("#scmd").val();
				original = $(this).attr("orig");
				original = $.trim(original);
				cmd = cmd.replace(original+" ","");
				$("#vcmd").text(cmd);
				$(this).closest('tr').remove();
				$("#scmd").val(cmd);
			}
	}
});

$("input[type='text']").change(function() {
    expression = ($(this).attr('id'));
    cmd = $("#scmd").val();
    newopt = $(this).attr("option")+" "+$(this).val();
    original = $(this).attr("orig");
	original = $.trim(original);
	option = $(this).attr('option');
	change = $("#changes").val();
    switch(expression) {
		case 'scmd':
		case 'onew':
			return;
		case 'ohostname':
			alert ("host name change");
			if ($(this).val() === "") {
				$(this).attr("orig","not set");
				cmd = cmd.replace(" "+original,"");
				$("#scmd").val(cmd);
				newline = cmd.replace(newopt,'"'+newopt+'"'); 
				$("#vcmd").text(newline);
				return;
			}	
	    		
			if (original === "not set") {
				cmd = cmd.replace("+map",newopt+" +map");
			}
			else {
				cmd = cmd.replace(original,newopt);
			}
			
			$(this).attr("orig",newopt)
			$("#scmd").val(cmd);
			newline = cmd.replace($(this).val(),'"'+$(this).val()+'"'); 
			$("#vcmd").text(newline);
			if($("#changes").val() =='nothing') {
				$("#changes").val(option);
			}
			else {
				added = change.replace(option,'');
				added = $.trim(added);
				added = added+','+option;
				chr =added.charAt(0); // check for comma 
				if (chr == ",") {
					added = added.substring(1, added.length);
				}
				$("#changes").val(added);
			}	
		break;
		
		default:
		// code block
		if($(this).val() == '') {
			// remove the option
			cmd = cmd.replace(original+" ","");
			$("#vcmd").text(cmd);
			$("#scmd").val(cmd);
			added = change.replace(option,'');
			chr =added.charAt(0);
			if (chr == ",") {
				added = added.substring(1, added.length);
			}
			$("#changes").val(added);
			$(this).closest('tr').remove();
			
		}
		else {
			// update the option
			cmd = cmd.replace(original+" ",newopt+" ");
			$(this).attr("orig",newopt)
			$("#scmd").val(cmd);
			$("#vcmd").text(cmd);
			if($("#changes").val() =='nothing') {
				$("#changes").val(option);
			}	
			else {
				added = change.replace(option,'');
				added = $.trim(added);
				added = added+','+option;
				chr =added.charAt(0); // check for comma 
				if (chr == ",") {
					added = added.substring(1, added.length);
				}
				$("#changes").val(added);
			}
		}
	}
});

$("#mod_settings").on("hidden.bs.modal", function () {
    location.reload();
});
	
 $('#file-list').change (function ()
    {
		
		flist="";
		szt=0;
        for (var i = 0; i < this.files.length; i++)
        {
			sz = formatBytes(this.files[i].size)
            //alert(sz);
            szt +=this.files[i].size;
            flist +="<tr><td>"+ this.files[i].name+"</td><td style='text-align:right;'>"+sz+"</td></tr>";
        }
        if(flist !== "") {
			sztf = formatBytes(szt);
			flist = "<h6 class='card-title'>Files to upload</h6><table>"+flist;
			flist += "<tr><td class='card-title'>Total size of upload</td><td class='card-title' style='text-align:right;'>"+sztf+"</td></tr>";
			flist += "<tr><td colspan=2>	Add to all available servers ? <input name='all_servers' type='checkbox' id='all-servers'></td></tr>";
			flist+= "<tr><td colspan=2>"+sztf+ " used out of  "+ maxFilesize+"</td></tr>"
			flist += '<tr><td><button class="btn btn-primary" style="margin-top:7%;" type ="submit "><i class="fa fa-cloud-upload"></i> Upload Map Files</button></td></tr></table>';
		}
		
        $("#f-list").html(flist);
        
    });
    
$('#fileview').change(function(){
   console.log ("fileview changed");
   alert ($('#fileview').val());
});

$('#sendcmd').on('submit', function(e) {
	e.preventDefault();
	$.ajax({
		type: $(this).attr('method'),
		url: $(this).attr('action'),
		data: $(this).serialize(),
		success: function(data) {
			$('#ajax-response').html(data);
			$("#ajax-response").show();
			$('#text').val(""); 
			$("#send").blur(); 
			$('#ajax-response').delay(3000).fadeOut('slow');
		}
	});
});
  	
$('#quit').click(function() {
	cmd = url+'/ajaxv2.php?action=version';
	 $('#quit_game').modal('hide');
	 stop_server(); 
});
	
$('#files').change(function(){
	selected_value = $('#files').val()
	console.log("triggerd change");
	var sendurl = url+"/api.php?action=get_file&cmd=view&n="+selected_value;
	$.ajax({
		type: 'GET',
		url: sendurl,
		dataType: 'text',
		success: function(data) {
			$("#fileview").val(data);
			var $textarea = $('#fileview');
			$textarea.scrollTop(0);    
		}
	});
});

$('#startcmd').on('submit', function(e) {
	e.preventDefault();
	console.log(url);
	url +="/"+$(this).attr('action');
	var formValues = $(this).serialize();
	$.ajax({
		type: $(this).attr('method'),
		url: url,
		data: formValues,
		success: function(data) {
		}
	});
});

$('#showlog').click(function() {
	$('#log').toggle();
	$('#log').scrollTop($('#log')[0].scrollHeight);
});
	
$('#toggle').click(function() {
	$('#gameservers').toggleClass('collapsed');
	$('#gameservers-nav').toggleClass('show');
});

$('input[name=gridRadios]').change, function() {
	alert($(this).val());
}

$("#cnew").click(function() {
	cmd =$("#scmd").val();
	cmd = $.trim(cmd);
	orig = $("#onew").val();
	prefix = orig.charAt(0) ;
	if ((prefix !== "+" ) && (prefix !== "-"))  {
		alert("all options must start with either a + or - sign\n - for command line otions + for CVARS")
		return;
	}
	var [option, value] = orig.split(" ");
	optionid = option.substring(1, option.length);
	if(typeof value != 'undefined'){
		html = "<tr><td>"+optionid+"</td><td></td><td><input type='text' id='o"+optionid+"' option='"+option+"' orig='"+option+"' value='"+value+"'>'</td><td></td><td>no help</td></tr>";
		cmd = cmd+" "+option+" "+value;
		$("#vcmd").text(cmd);
	}
	else{
		html = "<tr><td>"+optionid+"</td><td></td><td><input type='checkbox' id='o"+optionid+"' option='"+option+"' orig='"+option+"' checked>'</td><td></td><td>no help</td></tr>";
		value=""; // stop undefined later
		cmd = cmd+" "+option;
	}
	$("#scmd").val(cmd);
	if ($("#ohostname").val()) {
		hoption = $("#ohostname").val();
		newhopt = '"'+hoption+'"';
		test = cmd.replace(hoption,newhopt)
		$("#vcmd").text(test);
	}
	else {
		$("#vcmd").text(cmd);
	}
	var row = $(this).closest('tr');
	var row_index = $(row).index();
	$('#options-table > tbody > tr').eq(row_index).before(html); //adds new row
	$("#onew").val('');
	$("#changes").val = $("#changes").val+','+option;
});  

$('#disable-server').submit(function(e) {
	alert("we are here");
	e.preventDefault();
	url +="/"+$(this).attr('action');
	var formValues = $(this).serialize();
	console.log( $(this).attr('action'));
	$.ajax({
		type: $(this).attr('method'),
		url: url,
		data: formValues,
		dataType: 'json',
		success: function(data) {
			console.clear();
			console.log (data); 
			alert (data[0]);   
			$('#disable-response').html(data[0]);
			$("#disable-response").show();
			$('#disable-response').delay(3000).fadeOut('slow');
		}
	});
});

$('select').on('change', function() {
	option = $(this).attr("option");
	newid = option.substring(1, option.length);
	newopt = $(this).val();
	newopt = option+" "+newopt;
	full = $(this).attr('orig');
	cmd = $("#scmd").val();
	vcmd = $("#vcmd").text();
	switch (option){
		case "+map":
			full = $(this).attr("option");
			full = full+" "+$("#o"+newid).val();
			cmd = cmd.replace(full,newopt);
			vcmd = vcmd.replace(full,newopt);
			$("#o"+newid).val($(this).val());
			break;
		default:
			cmd = cmd.replace(full,newopt);
			vcmd = vcmd.replace(full,newopt);
			alert ("vcmd = "+vcmd);
			$(this).attr("orig",newopt);
	}
	$("#scmd").val(cmd);
	$("#vcmd").text(vcmd);
});

$('#save-file').click(function() {
	console.log("saving file");
	selected_value = $('#files').val();
	console.log(selected_value);
	var sendurl = url+"/api.php";
	file = $('#fileview').html();
	console.log(sendurl);
    $.ajax({
		type: 'POST',
		url: sendurl,
		dataType: 'text',
		data: { 'import': file,
		'action': 'get_file' ,
		'cmd': 'save' ,
		'n': selected_value },
		success: function(data) {
			console.log(data);
			alert("data back"+data);
			$("#fileview").html(data);
			var $textarea = $('#fileview');
			$textarea.scrollTop(0);
			sendurl='';    
		}
	});
}); 

$('#map-update').on('submit', function(e) {
	e.preventDefault();
	murl = $(this).attr('action');
	var formValues = $(this).serialize();
	$.ajax({
		type: $(this).attr('method'),
		url: murl,
		dataType: "json",
		data: formValues,
		success: function(data) {
			 nc =  $("table input[type=checkbox]:checked").length-1;
			 $("#cycle-count").html(nc);;
			$("#map-response").html(data);
			$("#map-response").show();
			$('#map-response').delay(3000).fadeOut(1000); 

		}
	});
});

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

 function checkTotalCheckedBoxes(){
	   var checked = 0;
$("#table-wrapper" ).each(function( ) {
  if(this.children.length === 3){ 

	$(this.children).each(function() {
        this.checked ? checked++ : null;      
        $("input[name="+this.name+"]").parent().siblings().closest('.totalchecked')[0].innerText = (checked) + " selected"; 

  	    });
  }
});
return checked;
}     