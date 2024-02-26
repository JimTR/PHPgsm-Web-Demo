var a_href=0;
var url='';
var id='';
var path='';
var type='Source';
var host= '';
var server='';
$(document).ready(function() {
	pagereferrer = document.referrer;
	//console.log('hit that '+pagereferrer);
	$('#ifrm').attr("online",1);
});
	
$( "#buttonr" ).click(function() {
	$("#buttonr").blur();   
	$("#rules").toggle();
});

$("#quick").click(function() {
	$("#extended").toggle();
});

$("#extended_close").click(function() {
	$("#extended").toggle();
});

$("#rules").click(function() {
	$("#rules").toggle();
});	

$("#servers").change(function(){
	$("#cmd_buttons").show();	
	if(!typeof(logi) == 'undefined') {	
		clearInterval(logi); // stop old stuff
		clearInterval(playi);
	}
	url = this.value;
	id = $(this).children(":selected").attr("id");
	if(id === ''){ 
		$("#log").empty();
		$("#pbody").empty();
		$("#cmd_buttons").hide();
		ClearAllIntervals();
		setInterval('updateClock()', 1000);
		$('#player_title').html('Choose Game');
		$("#servers").blur(); 
		return;
	};	
	path = $(this).children(":selected").attr("path");
	host = $(this).children(":selected").attr("host");
	port =$(this).children(":selected").attr("port");	
	fetchlog(port,id,url);
	logi = setInterval(fetchlog, 5000);
	players(port,id,url);	
	playi = setInterval(players, 7000);	
	var element = document.getElementById("log");
	element.scrollTop = element.scrollHeight;
	var currentId = url;
	//console.log(url);
	$('#sendcmd').attr('action',url+ '/api.php');
	$('#server').attr('value',id);
	var element = document.getElementById("log");
	element.scrollTop = element.scrollHeight;
	$("#servers").blur(); 
});

$( "#close" ).click(function() {
	$("#rules").toggle();
});
		
function fetchlog() {
	rows = 200;
	cmd = url+'/api.php?action=console&server='+id ;//+'&rows='+rows;
	//console.log(cmd);
	var items='';
    $.ajax({
		type: 'GET',
        url: cmd,
        dataType: "json",
		statusCode: {
			500: function() {
			alert("Script exhausted",true);
				return;
			}
		},
        success: function (data) {
		
        },
        complete:function(data){
			$.each(data.responseJSON, function(i, item) {
			items = items+item;
		});
		element = document.getElementById("log");
		if (element.scrollHeight - element.scrollTop === element.clientHeight){var bottom = true;}
		else {var bottom = false;}
		hidden_items = $("#hidden-log").text();
		items_len = items.length;
		hidden_len = hidden_items.length;
		if(hidden_len ==0) {$("#hidden-log").text(items);} 
		if (hidden_len == items_len) { return;}
		console.log("changing items");
		$("#log").html(items); // log the new entries
			$("#hidden-log").text(items); // update the hidden text
		if (bottom == true) {element.scrollTop = element.scrollHeight;}
		}
    });

};
function players() {
	 //get player functions
	//alert ('Players ! '+url+' '+id);
	var items='';
	var cerror=false;
	cmd = url+'/api.php?action=viewserver&server='+id;
	//console.log(cmd);
	$.ajax({
		//statusCode: {
			//500: function() {
				//console.log("Script exhausted");
			//}
		//},
		url: cmd,
		type: 'post',
        dataType: "json",
        success: function (data) {
			//data1 = data;
			//JSON.parse(data1)
			//console.log(data1+"success");
        },
        complete:function(data){
			info = data.responseJSON.info;
			player = data.responseJSON.players;
			realplayers = info.real_players;
			if(typeof(info.Map) == 'undefined') {
				console.log('no map !');
				return 0;
			}
			else {$('#player_title').html('Current Map&nbsp;'+info.Map);}
			
			if (realplayers == 0) {
				//console.log("no Current players (x)");
				$("#no-players").show();
				$("#offline-map").html(info.Map);
				if($("#server-select").is(":hidden")){
					//$("#no-players").css('PaddingTop', '10px');​
					$( "#no-players" ).css( "padding", "1%" );
					$( "#log" ).css( "margin-top", "0%" );
					
				}
				else {
					$( "#log" ).css( "margin-top", "0%" );
				}
				if ($("#player").is(":visible")) {
					$("#player").hide();
					$("#log-wrapper").addClass('col-lg-12').removeClass('col-lg-6');
				}
				return 0;
				}
			//console.log("players on line (x)");
			if ($("#player").is(":hidden")){
				$("#player").show();
				$("#no-players").hide();
				$("#log-wrapper").addClass('col-lg-6').removeClass('col-lg-12');
			}
			$.each(player, function(i, item) {
				items = items+'<tr id="'+item.steam_id+'" style="width:100%;"><td style="width:50%;overflow:hidden;white-space: nowrap;vertical-align:middle;" title="'+item.Name+' ('+item.steam_id+')" class="tpButton" log="'+item.logons+'">'+item.Name+'</td><td  class="span-show" style="text-align:center;" title="'+item.country+'" id="'+item.ip+'"><img class="flag" '+item.flag+'/></td><td  style="text-align:center;">'+item.Frags+'</td><td class="span-show" style="text-align:right;padding-right:4%;">'+item.TimeF+'</td></tr>';
			});
			$("#pbody").html(items);
			items='';
			rules = data.responseJSON.rules;
			$.each(rules, function(i, item2) {
				items = items+'<div style="clear:both;padding:5px;"><div style="padding-right:10px;width:30%;text-align:left;float:left;">'+i+'</div><div style="width:60%;clear:none;text-align:right;float:left;">'+item2+'</div></div>';
			});
			$("#rule").html(items);
		}
    });
};

$('#sendcmd').on('submit', function(e) {
	e.preventDefault();
	console.log( $(this).attr('action'));
	 var text = $("#sendcmd input[name=text]").val();
	 var hasSpace = $("#sendcmd input[name=text]").val().indexOf(' ')>=0;
	 if(hasSpace){
		//console.log("has space");
		j =  unserialize($(this).serialize());
		j.text = "%22"+j.text+"%22";
		items='';
		$.each(j, function(i, item) {
			items = items+i+"="+item+"&";
		});
		sndData = items.replace(/&\s*$/, "");
	}
	else {
		sndData = $(this).serialize();
	}
	console.log("data to send "+sndData);
	$.ajax({
		type: $(this).attr('method'),
		url: $(this).attr('action'),
		data: sndData,
		success: function(data) {
			$('#ajax-response').html(data);
			$("#ajax-response").show();
			$('#text').val(""); 
			$("#send").blur(); 
			$('#ajax-response').delay(3000).fadeOut('slow');
		},
		error: function(xhr, status, error) {
		//var err = eval("(" + xhr.responseText + ")");
		alert(xhr.responseText,true);
}
	});
});

$('#player').on('click','.tpButton', function(event) {				
	var href = $(this).closest('tr').attr("id");
	var ip = $("#"+href).find("td:eq(1)").attr("id");
	var user = $("#"+href).find("td:first").text();
	var login = $("#"+href).find("td:eq(0)").attr("log");
	loadIframe("ifrm", "frame.php?frame=user_frame&id="+href);	
	if(href) {
		if(href == 'undefined') {
			$('#error_action').text('Invalid User');
			$('#error_text').html('You can not view an unknown user<br>This maybe a bot or a user that is curently unknown');
			$('#error').modal('show');
			return ;
		}
		$('#name').attr('value',user)
		$('#ip').attr('value',ip)
		$('#logins').attr('value',login)
		$('#steam_id').attr('value',href)
		$("#steam_id").prop("href", "http://steamcommunity.com/profiles/"+href)
		$("#steam_id").text(href);
		$('#ipb').attr('value',ip)
		$('#steam_idb').attr('value',href);
		$('#frame-title', parent.document).html('Details For '+user);
		$('#user-frame').modal('show');
	}
});

function ban_user() {
	if($("#ban_ip").is(':checked')) {
		var ban_ip_cmd  = "addip "+$("#period").val()+" "+$("#ipb").val();
		alert (ban_ip_cmd);
		$("#text").val(ban_ip_cmd);
		$('#sendcmd').submit();
	}
	if($("#ban_id").is(':checked')) {
		var ban_id_cmd  = "banid "+$("#period").val()+" "+$("#steam_idb").val();
		$("#text").val(ban_id_cmd);
		$('#sendcmd').submit();
	}
	$('#ban_user').modal('hide');
};

$( "#ban" ).click (function() {
	ban_user();
});

$( "#kick" ).click (function() {
	var kick_cmd  = "kick "+$("#name").val();
	$("#text").val(kick_cmd);
	$('#sendcmd').submit();
	$('#ban_user').modal('hide');
});
$( "#next_level" ).click (function() {
	var change_cmd  = "changelevel_next";
	$("#text").val(change_cmd);
	$('#sendcmd').submit();
	$('#quick_cmds').modal('hide');
});

$( "#maps" ).click (function() {
	var change_cmd  = "maps *";
	$("#text").val(change_cmd);
	$('#sendcmd').submit();
	$('#quick_cmds').modal('hide');
});

$( "#ip_list_banned" ).click (function() {
	var change_cmd  = "listip";
	$("#text").val(change_cmd);
	$('#sendcmd').submit();
	$('#quick_cmds').modal('hide');
});		

$( "#id_list_banned" ).click (function() {
	var change_cmd  = "listid";
	$("#text").val(change_cmd);
	$('#sendcmd').submit();
	$('#quick_cmds').modal('hide');
 });
 
 $( "#ip_write_banned" ).click (function() {
	var change_cmd  = "writeip";
	$("#text").val(change_cmd);
	$('#sendcmd').submit();
	$('#quick_cmds').modal('hide');
});

$( "#id_write_banned" ).click (function() {
	var change_cmd  = "writeid";
	$("#text").val(change_cmd);
	$('#sendcmd').submit();
	$('#quick_cmds').modal('hide');
});											
        
			//"ip_list_banned"
function selectOption(nr,element) {
    var select = $(element);
    if (select.children().length >= nr) {
        let value = select.find('option:eq(' + nr + ')').val();
        select.val(value).change();
	console.log(select.val(value));
    }
}

function ClearAllIntervals() {
    for (var i = 1; i < 99999; i++)
        window.clearInterval(i);
}

function loadIframe(iframeName, url) {
    var $iframe = $('#' + iframeName);
    if ($iframe.length) {
        $iframe.attr('src',url);
        return false;
    }
    return true;
}
$('#ban_user').on('show', function () {
      $('.modal-body',this).css({width:'auto',height:'auto', 'max-height':'100%'});
});

function unserialize(serialize) {
	let obj = {};
	serialize = serialize.split('&');
	for (let i = 0; i < serialize.length; i++) {
		thisItem = serialize[i].split('=');
		obj[decodeURIComponent(thisItem[0])] = decodeURIComponent(thisItem[1]);
	};
	return obj;
};
