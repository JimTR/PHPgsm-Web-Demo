var a_href=0;
var url='';
var id='';
var path='';
var type='Source';
var host= '';
var server='';
$(document).ready(function() {
	pagereferrer = document.referrer;
	console.log('hit that '+pagereferrer);
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
	rows = 100;
	cmd = url+'/api.php?action=console&server='+id+'&rows='+rows;
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
		var element = document.getElementById("log");
		if (element.scrollHeight - element.scrollTop === element.clientHeight){
			var bottom = true;
		}
		else {
			var bottom =false;
		}
		$("#log").html(items);
			if (bottom == true) {
     			element.scrollTop = element.scrollHeight;
			}
         }
    });

};
function players() {
	 //get player functions
	//alert ('Players ! '+url+' '+id);
	var items='';
	var cerror=false;
	cmd = url+'/api.php?action=viewserver&server='+id;
	$.ajax({
		statusCode: {
			500: function() {
				console.log("Script exhausted");
			}
		},
		type: 'GET',
        url: cmd,
        dataType: "json",
        success: function (data) {
        },
        complete:function(data){
			info = data.responseJSON.info;
			player = data.responseJSON.players;
			if(typeof(info.Map) == 'undefined') {
				console.log('no map !');
				return 0;
			}
			else {
				$('#player_title').html('Current Map&nbsp;'+info.Map);
			}
			if(typeof(player) == "null") { 
				console.log('returning empty from players function');
				return 0;
			} 
			$.each(player, function(i, item) {
				items = items+'<tr id="'+item.steam_id+'" style="width:100%;"><td style="width:50%;overflow:hidden;white-space: nowrap;" title="'+item.Name+' ('+item.steam_id+')" class="tpButton" log="'+item.logons+'">'+item.Name+'</td><td style="text-align:center;" title="'+item.country+'" id="'+item.ip+'"><img class="flag" '+item.flag+'/></td><td style="text-align:center;">'+item.Frags+'</td><td style="text-align:right;padding-right:4%;">'+item.TimeF+'</td></tr>';
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
	//console.log( $(this).attr('action'));
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
	//console.log("data to send "+sndData);
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
