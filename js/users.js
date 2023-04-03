var gdetail='';
var gendetail ='';
var item='';
var data="";
 $(document).ready(function() {
	if ($('#user-id').is(':empty')){
		$("#searchbox").show();
		return;
	}
     var userID = $('#user-id').text();
     value = "id";
     $("input[name=type][value=" + value + "]").prop('checked', true);
     $('#text').val(userID);
     $('#sendcmd').submit();
     displayData(userID);
	return;
});

$('#sendcmd').on('submit', function(e) {
    e.preventDefault();
    var items='';
    var url = $(this).attr('action');
    $("#data_table").html(items);
    var sndData = $('#sendcmd input').serialize();
     $.ajax({
    type: $(this).attr('method'),
    url: $(this).attr('action'),
    data: sndData,
    async: false,
    dataType: "json",
    success:  function(data){
		var noe = data.data.length;
		if (typeof(noe) == 'undefined') {
			$('#results').hide();
			$('#error_action').text('Invalid Search');
			$('#error_text').html('Can not find '+data.text);
			$('#error').modal('show');
			return;
		}
        var uni= '';
        players = data.data;
		$.each(players, function(i, item) {
			if (item.steam_id64 == uni) {return true;}
			if(item.banned == 1) { 
				console.log("banned "+item.name);
				item.name_c = '<span style="text-decoration: line-through;">'+item.name_c+'</span>';
			}
			console.log(item.name);
			enc_name = item.name_c;
			var last_log = timeConverter(item.last_log_on);
			items = items+'<tr  id="'+item.steam_id64+'"><td  class="tpButton" '+'ip="'+item.real_ip+'" flag="'+item.flag+'"><a href="#">'+enc_name+'</a></td><td>'+last_log+'</td><td><a href="http://steamcommunity.com/profiles/'+item.steam_id64+'" target="_blank">'+item.steam_id64+'</a></td></tr>';
			uni = item.steam_id64;
			return data;
		});
		$("#data_table").html(items);
		if ($('#user-id').is(':empty')){
			$('#results').show();
		}
        console.log(data);
	}
	});
 });
 
$('#data_table').on('click','.tpButton', function(event) {
	console.log("clicked data table");	
	var href = $(this).closest('tr').attr("id");
	console.log(href); 
	var ip = $("#"+href).find("td:eq(0)").attr("ip");
	var user = $("#"+href).find("td:first").text();
	var login = $("#"+href).find("td:eq(0)").attr("flag");
	var url = $('#sendcmd').attr('action')+"?action=search&type=id&text="+href;
	displayData(href);
});
	
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

$( "#go_back" ).click (function() {
	// need to do a history back
	if ($('#user-id').is(':empty')){
		console.log("go back");
		$("#user-frame").attr("src","img/blank.png");
		$("#user-avatar").attr("src","img/blank.png");
		$('#editor').hide();
        $('#searchbox').show();
        $('#results').show();
		$("#gd1").empty();
		$("#gen").empty();
		gendetail="";
		gdetail="";
	}
	else {
		history.back();
	}
});	
$('#sendcmd').change(function(){
	selected_value = $("input[name='type']:checked").val();
	console.log(selected_value);
		switch(selected_value) {
			case 'fuzzy':
				$("#text").attr('placeholder','Enter User Name');
				break;
			case 'id':
				$("#text").attr('placeholder','Enter Steam ID in any format');
				break;
			default:
				$("#text").attr('placeholder','Enter IP to search for');
		}
});

function displayData(userID) {
	//console.clear();
	var url = $('#sendcmd').attr('action')+"?action=search&type=id&text="+userID;
	var user = ''; // $("#"+userID).find("td:first").text();
	$("#searchbox").hide();
	$("#results").hide();
	$("#user-frame").hide();
	$("#user-avatar").attr("src","img/blank.png");
	players = data.text;
	console.log(url);
	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success:function(data){
			var noe = data.data.length;
			if(typeof noe == 'undefined') {
				console.log('no history');
			}
			else {
				console.log("found "+noe+" records");
			}	
			players = data.data;
			$.each(players, function(i, item) {
				if (item.server_name == null) {
					console.log ("server no longer managed");
				}
				else {
					console.log(item.server_name+" is valid");
					var timestamp =  timeConverter(item.last_play);
					$('#dta1').append("<tr><td style='width:335px;'>"+item.server_name+"</td><td style='text-align:right;padding-right:7%;'>"+item.log_ons+"</td><td>"+timestamp+"</td><td style='padding-left:4%;'>"+item.game_time+"</td></tr>");
				}	
				man=item.name_c;
			});
			$('#dta1').append( "<tr><td  class='card-title'><h6  class='card-title' style='padding:0;'>Overall Time on Line</h6></td><td style='padding-right:6.5%;text-align:right;vertical-align:top;' colspan=3>"+data.time_on_line+"</td></tr>");
			//console.log(data);
			gen_data = players[0];
			head = data;
			user = gen_data.name_c;
			first_log_on =  timeConverter(gen_data.first_log_on);
			last_log_on =  timeConverter(gen_data.last_log_on);
			if(typeof data.data.error == 'undefined') {
				
				
				$('#dta').append("<tr><td>Steam Id</td><td>"+gen_data.steam_id2+"</td></tr>");
				$('#dta').append('<tr><td>Steam Profile</td><td><a href=http://steamcommunity.com/profiles/'+gen_data.steam_id64+' target="_blank">'+gen_data.steam_id64+'</a></td></tr>');
				$('#dta').append('<tr><td>Country</td><td>'+gen_data.country+'<img style="padding-left:5%;width:11%;"  src="'+gen_data.flag+'"></td></tr>');
				$('#dta').append("<tr><td>Last Known IP</td><td>"+gen_data.real_ip+"</td></tr>");
				$('#dta').append("<tr><td>First Log on</td><td>"+first_log_on+"</td></tr>");
				$('#dta').append("<tr><td>Latest Log on</td><td>"+last_log_on+"</td></tr>");
				aka =JSON.parse('"'+gen_data.aka+'"');
				if (aka != null){
					aka = aka.replace(/,\s*$/, "");
					$('#dta').append("<tr><td>Played as</td><td>"+aka+"</td></tr>");
				}
			}
			else {
				$('#dta').append('<tr><td>no data found for this user</td></tr>');
			}
		},
		complete:function(data){
			console.log("start user data");
			console.log(head);
			console.log("end user data");
			$('#un').html(user)
			$("#user-frame").attr("src","img/blank.png");
			$('#results').hide();	
			$('#searchbox').hide();
			get_steam_data(userID);
			//data.data;
			//gen_data = [0];
			if(typeof head.reason == 'undefined') { reason = '';} 
			else {
				if (head.admin !== undefined) {
					admin = head.admin+" on "+head.created;
				}
				else {
					admin = "console";
				}
			}
			if (head.banned == 1) {
					reason = head.reason;
					$('#dta').append('<tr><td style="width:30%;">Banned By</td><td>'+admin+'</td></tr>');
					$('#dta').append('<tr><td>Reason</td><td>'+reason+'</td></tr>');
					user =  '<span style="color:red;font-weight:bold;">'+gen_data.name_c+'</span>';
					$('#un').html(user)
			}
			else if (head.banned == 2) {
				reason = head.reason;
				$('#dta').append('<tr><td style="width:30%;">Ban Removed By</td><td>'+admin+'</td></tr>');
				$('#dta').append('<tr><td>Reason</td><td>'+reason+'</td></tr>');
				user =  '<span style="color:orange;font-weight:bold;">'+gen_data.name_c+'</span>';
				$('#un').html(user);	
			}
			else if (head.banned == 0) {
				user =	'<span style="color:green;font-weight:bold;">'+gen_data.name_c+'</span>';
			}	
			$('#editor').show();
		}
				
	});
}

function get_steam_data(user_id) {
	 var url = "steampage.php?id="+user_id;
	 $.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success:function(data){
			console.log(data);
			if (data.frame !== undefined) {
				console.log("framed image");
				$("#user-frame").attr("src",data.frame);
				$("#user-frame").show();
			}
			$("#user-avatar").attr("src",data.avatar);	
			$('#dta').append('<tr><td>Steam Status</td><td>'+data.status+'</td></tr>');
			if (data.steam_date !== undefined) {
				$('#dta').append('<tr><td>Steam Member Since</td><td>'+data.steam_date+'</td></tr>');
			}
			if (data.steam_ban !== undefined) {
				$('#dta').append('<tr><td>Steam Bans</td><td style="color:red;">'+data.steam_ban+'</td></tr>');
			}
			if (data.steam_level !== undefined) {
				level = data.steam_level;
				if (data.steam_xp !== undefined) {
				level = level+"  ("+data.steam_xp+")";
				}
				$('#dta').append('<tr><td>Steam Level</td><td>'+level+'</td></tr>');
			}
			if(data.in_game !== undefined) {
				in_game = data.in_game;
				if(data.current_host !== undefined) {
					in_game += ' ('+data.current_host+')';
				}
				$('#dta').append('<tr><td>Currently Playing</td><td>'+in_game+'</td></tr>');
			}
		},
		complete:function(data){
		}
	});
}			
