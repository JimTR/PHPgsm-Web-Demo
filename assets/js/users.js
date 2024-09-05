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
     $("#ifrm", parent.document).css('height',"80vh");
     $("iframe",parent.document)[0].setAttribute("scrolling", "no");
      if($("#ifrm", parent.document).attr('inframe') !== 'undefined') {
		  console.log("attr set");
	  }
	  if($("#ifrm", parent.document).attr('online') == 1) {
		 console.log("in console mode "+$("#ifrm", parent.document).attr('online'));
		 $('#sb-ban-tr').show();
		 $('#sb-mute-tr').show();
		 
	  }
	  
     $('#sendcmd').submit();
     displayData(userID);
    //alert ($("body").height(),true)
	return;
});
$( "#bans" ).click(function() {
  //alert( "Handler for .click() called." );
  $('#ban_history').modal('show');
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
        //console.log(data);
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
	


$( "#go_back" ).click (function() {
	// need to do a history back
	if ($('#user-id').is(':empty')){
		console.log("go back");
		$("#user-frame").attr("src","img/blank.png");
		$("#user-avatar").attr("src","img/blank.png");
		window.parent.$("#user-avatar").attr("src","");
		$('#editor').hide();
        $('#searchbox').show();
        $('#results').show();
		$("#gd1").empty();
		$("#gen").empty();
		parent.closeIFrame();
		gendetail="";
		gdetail="";
	}
	else {
		 var inframe = $("#ifrm", parent.document).attr('inframe');
		  var mod = $("#ifrm", parent.document).attr('mod');
			if(typeof inframe !== 'undefined' && inframe !== false){ 
			 // drop to results
			 //alert("back to results",true);
			 $('#frame-title', parent.document).html('Search');
			 $("#steam-link",parent.document).hide();
			 $("#user-avatar",parent.document).attr("src","img/blank.png");
			  $("iframe",parent.document)[0].setAttribute("scrolling", "yes");
			 history.back();
		 }
		
		else if(typeof mod !== 'undefined' && mod !== false){
				if(mod =="") {
					parent.closeIFrame();
				}
				//alert("we got history back in a frame mod ="+mod,true);
				$('#frame-title', parent.document).html(mod);
				$("#user-avatar",parent.document).hide();
				history.back();
		}
		else {
			//alert("straight history back",true);
			parent.closeIFrame();
		}
	}
});	
$('#sendcmd').change(function(){
	selected_value = $("input[name='type']:checked").val();
	
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
	$("#frame-dialog",parent.document).css("maxWidth","80vw");
	var url = $('#sendcmd').attr('action')+"?action=search&type=id&text="+userID;
	var user = ''; // $("#"+userID).find("td:first").text();
	$("#searchbox").hide();
	$("#results").hide();
	$("#user-frame").hide();
	$("#user-avatar").attr("src","img/blank.png");
	$("#ban-body").empty();
	players = data.text;
	console.log(url);
	//console.log(user);
	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success:function(data){
			$("#gd1").empty();
			var noe = data.data.length;
			if(typeof noe == 'undefined') {
				console.log('no history');
			}
			else {
				//console.log("found "+noe+" records");
			}	
			players = data.data;
			console.log(players);
			$.each(players, function(i, item) {
				if (item.server_name == null) {
					console.log ("server no longer managed");
				}
				else {
					console.log(item.server_name+" is valid");
					var timestamp =  timeConverter(item.last_play);
					$('#dta1').append("<tr><td style='width:335px;'>"+item.server_name+"</td><td style='text-align:center'>"+item.log_ons+"</td><td>"+timestamp+"</td><td style='text-align:right;padding-left:4%;'>"+item.game_time+"</td></tr>");
				}	
				man=item.name_c;
			});
			$('#dta1').append( "<tr><td  class='card-title'><h6  class='card-title' style='padding:0;'>Overall Time on Line</h6></td><td>&nbsp;</td><td colspan='2' style='text-align:right;padding-left:4%;vertical-align:top;'>"+data.time_on_line+"</td></tr>");
			//console.log(data);
			$("#gen").empty();
			
			gen_data = players[0];
			head = data;
			user = gen_data.name_c;
			first_log_on =  timeConverter(gen_data.first_log_on);
			last_log_on =  timeConverter(gen_data.last_log_on);
			if(typeof data.data.error == 'undefined') {
				
				steam_href = 'http://steamcommunity.com/profiles/'+gen_data.steam_id64;
				$("#steam-link",parent.document).attr("href",steam_href);
				$("#steam-link",parent.document).show();
				//$('#dta').append("<tr><td style='width:25%;'>Steam Id</td><td>"+gen_data.steam_id2+"</td></tr>");
				$('#dta').append('<tr><td>Steam ID</td><td>'+gen_data.steam_id64+'</td></tr>');
				$('#dta').append('<tr><td>Country</td><td>'+gen_data.country+'<img style="padding-left:5%;width:11%;"  src="'+gen_data.flag+'"></td></tr>');
				$('#dta').append("<tr><td>Last Known IP</td><td>"+gen_data.real_ip+"</td></tr>");
				$('#dta').append("<tr><td>First Log on</td><td>"+first_log_on+"</td></tr>");
				$('#dta').append("<tr><td>Latest Log on</td><td>"+last_log_on+"</td></tr>");
				//aka =JSON.parse('"'+gen_data.aka+'"');
				aka = gen_data.aka;
				//console.log("aka = "+aka);
				aka.replace(/\//g, '-')
				//'some+multi+word+string'.replace(/\+/g, ' ');
				if (aka != null){
					aka = aka.replace(/,\s*$/, "");
					$('#dta').append("<tr><td style='vertical-align:middle;'>Played as</td><td><div class='table-wrapper' style='min-height:20px;max-height:40px;'>"+aka+"</div></td></tr>");
				}
			}
			else {
				$('#dta').append('<tr><td>no data found for this user</td></tr>');
			}
		},
		complete:function(data){
			//console.log("start user data");
			//console.log(head);
			//console.log("end user data");
			$("#list-bans").hide();
			$('#un').html(user)
			$('#frame-title', parent.document).html('Details for '+user);
			//parent.('#un').html(user);
			$('#un', parent.document).html(user);
			$('#un-b').html(user)
			$('#ban-steam-id').val(userID);
			$("#ban-user-id").val(user);
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
					admin = "system";
				}
			}
			if (head.banned == 1) {
					reason = head.reason;
					$('#dta').append('<tr><td style="width:30%;">Banned By</td><td>'+admin+'</td></tr>');
					$('#dta').append('<tr><td>Reason</td><td>'+reason+'</td></tr>');
					user =  '<span style="color:red;font-weight:bold;">'+gen_data.name_c+'</span>';
					$('#un').html(user);
					$("#bans").show();
					$("#list-bans").show();
			}
			else if (head.banned == 2) {
				reason = head.reason;
				$('#dta').append('<tr><td style="width:30%;">Ban Removed By</td><td>'+admin+'</td></tr>');
				$('#dta').append('<tr><td>Reason</td><td>'+reason+'</td></tr>');
				user =  '<span style="color:orange;font-weight:bold;">'+gen_data.name_c+'</span>';
				$('#un').html(user);	
				$("#bans").show();
				$("#list-bans").show();
				
			}
			else if (head.banned == undefined) {
				user =	'<span style="color:green;font-weight:bold;">'+gen_data.name_c+'</span>';
				$('#un').html(user);
				$("#bans").hide();
			}	
			$('#editor').show();
			if (head.ban_history !== undefined) {
				//alert("bans");
				//ban_history = head.ban_history;
				$.each(head.ban_history, function(i, item) {
					console.log(item.authid+" "+item.created)
					 created = timeConverter(item.created);
					if(item.removed == null) {
						 ends ='permanent';
					}
					else {
						ends = timeConverter(item.ends);
					}
					$('#ban-body').append('<tr><td>'+item.steam_id+'</td><td>'+item.name+'</td><td>'+item.ip+'</td><td>'+item.reason+'</td><td>'+created+'</td><td>'+ends+'<td></tr>');
				});
				
			}
			if (head.outer_ip == null){
				console.log("no multiple users");
			}
			else {
				others ='';
				//console.log("found more than one");
				$.each(head.outer_ip, function(i,item) {
					others += '<a class="in-frame-user" href="users.php?id='+item.steam_id+'">'+item.name+"</a>, ";
				});
				$("#dta").append('<tr><td>Users on this ip</td><td>'+others.slice(0,-2)+'</td></tr>');
			}
		}
				
	});
	console.log("in user js "+history.length);
}

function get_steam_data(user_id) {
	 var url = "plugins/steam_data.php?id="+user_id;
	 console.log("into steam data with "+url);
	 $.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success:function(data){
			console.log(data);
			if (data.avatar_frame !== undefined) {
				console.log("framed image");
				$("#user-frame").attr("src",data.avatar_frame);
				$("#user-frame").show();
			}
			if (!isUrlValid(data.avatar)) {
				data.avatar = "https://avatars.cloudflare.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";
			}
			
			$("#user-avatar").attr("src",data.avatar);	
			
			window.parent.$("#user-avatar").attr("src",data.avatar);
			window.parent.$("#user-avatar").show();
			
			if(data.status == null ) {data.status = "Private Profile";}
			if (data.profile_state == "" || data.profile_state == null) {
				data.status ="Profile Not Set Up"; 
				$("#extend-steam").hide();
			}
			if (data.profile_state == null) {data.profile_state='';}
			console.log("logging full data");
			console.log("profile set to "+data.profile_state);
			profile = $.trim(data.profile_state);
			console.log("profile now "+profile);
			switch (profile) {
				case null:
					data.profile_state="";
				break;
				case "friendsonly":
					data.profile_state ="Friends Only";
					break;
				case "public":
					console.log("Hit public");
					data.profile_state ="Public";
					$("#extend-steam").show();
					try {
						console.log(data);
						s_data = $.parseJSON(data.full_data);
						console.log(s_data);
						//console.log(s_data.summary);
						//console.log(s_data.realname);
						isObject = s_data.realname instanceof Object;
						if(typeof s_data.steamID != "undefined")  {$("#s-user").text(s_data.steamID);}
						if(typeof s_data.realname != "undefined" &&  !isObject)  {$("#s-profile").append("<tr><td style='width:10%;'>Real Name</td><td >"+s_data.realname+"</td></tr>");}
						else {$("#s-profile").append("<tr><td style='width:10%;'>Real Name</td><td>Not Disclosed</td></tr>");}
						isObject = s_data.location instanceof Object;
						if(typeof s_data.location != "undefined" && !isObject)  {$("#s-profile").append("<tr><td>Location</td><td>"+s_data.location+"</td></tr>");}
						else {$("#s-profile").append("<tr><td>Location</td><td>Not Disclosed</td></tr>");}
						//if(s_data.summary =="No information given.") {$("#s-profile").append("<tr><td>Summary</td><td>"+s_data.summary+"</td></tr>");}
						//else if(typeof s_data.summary != "undefined")  {
							
							console.log("length = "+s_data.summary.length);
							var ks = s_data.summary.split("<br>");
							console.log(ks.length);
							if(ks.length > 1){
								console.log("more than i line");
								//$("#s-profile").append("<tr><td>Summary</td><td><div class='table-wrapper' style='min-height:4vh;max-height:15vh;'>"+s_data.summary+"</div></td></tr>");
								$("#summary-body").html(s_data.summary);
								$("#summary").toggle();
							}
							else {
								$("#s-profile").append("<tr><td>Summary</td><td>"+s_data.summary+"</td></tr>");
							}	
						//}
						if(typeof s_data.groups != "undefined") { 
							//console.log("we have groups");
							groups = s_data.groups.group;
							groupCount = 0;
							//console.log("Group Count = "+groups.length());
							$.each(groups, function(key,group) {
								console.log(group.groupName);
								if(typeof group.groupName != "undefined")  {
									$("#groups").append("<tr><td><img src='"+group.avatarIcon+"'/>&nbsp"+group.groupName+"</td><td>"+group.summary+"</td><td>"+group.memberCount+"</td></tr>");
									groupCount++;
								}
								$("#group-count").text("("+groupCount+")");
							});
							console.log(groupCount);
							if (groupCount == 0) {
								$("#s-profile").append("<tr><td>Groups</td><td>None Defined</td></tr>");
								$("#group-a").hide();
							}
						}
						else{
							console.log("no groups");
							$("#s-profile").append("<tr><td>Groups</td><td>None Defined</td></tr>");
							$("#group-a").hide();
						}
					}
					catch (e) {
						//alert('cannot load data because: '+e,true);
						//console.log(data.full_data);
						//console.log($.parseJSON(JSON.stringify(data.full_data)));
						//$("#extend-steam").hide();
						document.location.reload();
					};
                   
					//s_data = $.parseJSON(data.full_data);
					
					//console.log(s_data.groups);
					
					//console.log(s_data.location);
					break;
				case "private":
					data.profile_state="Private";
					break;	
			}
			$('#dta').append('<tr><td>Steam Status</td><td>'+data.status+'</td></tr>');
			if (data.status !=="Profile Not Set Up"){$('#dta').append('<tr><td>Steam Profile</td><td>'+data.profile_state+'</td></tr>');}
			if (data.steam_date !== undefined) {
				if($.isNumeric(data.steam_date)) {
					console.log("date is a number");
					data.steam_date =timeConverter(data.steam_date);
					data.steam_date = data.steam_date.replace('00:00', '');
				}
				if(data.status !== "Private Profile" && data.status !== "Profile Not Set Up"  && data.profile_state == "public") {
					$('#dta').append('<tr><td>Steam Profile</td><td>'+data.profile_state+'</td></tr>');
					$('#dta').append('<tr><td>Steam Member Since</td><td>'+data.steam_date+'</td></tr>');
				}
			}
			if (data.ban_desc !== undefined) {
				$('#dta').append('<tr><td>Steam Bans</td><td style="color:red;">'+data.ban_desc+'</td></tr>');
			}
			if (data.steam_level !== undefined) {
				level = data.steam_level;
				if (data.steam_xp !== undefined) {
				level = level+"  ("+data.steam_xp+")";
				}
				$('#dta').append('<tr><td>Steam Level</td><td>'+level+'</td></tr>');
			}
			if(data.game !== undefined) {
				in_game = data.game;
				if(data.current_host !== undefined) {
					in_game += ' - '+data.current_host;
				}
				$('#dta').append('<tr><td>Currently Playing</td><td>'+in_game+'</td></tr>');
			}
		},
		complete:function(data){
			//console.log("frame name");
		}
	});
}	
function shutdiv (open,close) {
	//console.clear();
	//console.log("shut div open = "+open+" close = "+close);
	//return
	//if ( $("#"+).css('display') == 'none' || $(element).css("visibility") == "hidden"){
    // 'element' is hidden
//}
$(".frame-popup").hide();
	$('#'+open).show();
	window.scrollTo(0,0);
}
$('#quantity').change(function(){
	//
	qty = $('#quantity').val();
	console.log(qty);
	if (qty > 0) {
		time = convertMinutes(qty);
		$("#ban-length").html("Ban Length "+time);
	}
	else {
		//console.log("permanent");
		$("#ban-length").html("Ban Length permanent");
	}
});		

function convertMinutes(minutes) {
  // Calculate the number of days
  const days = Math.floor(minutes / 1440);

  // Calculate the number of hours
  const hours = Math.floor((minutes % 1440) / 60);

  // Calculate the number of minutes
  const remainingMinutes = minutes % 60;
  if (days > 0) {rday =  `${days} days, `;}
  else {rday='';}
  if (hours > 0) { rhour = `${hours} hours, `;}
  else {rhour ='';} 
  return rday+rhour+`${remainingMinutes} minutes`;
}

$('#check-all').change(function() {
	//
	console.log("check-all change");
	if ($( "#check-all" ).prop( "checked") == true ) {
		console.log("checked");
		$( "#sys-ban" ).prop( "checked", true );
		$('#sys-ban').val(true);
		$( "#sys-ban-ip" ).prop( "checked", true );
		$('#sys-ban-ip').val(true);
		if($("#sb-ban").is(":visible")) {
			$( "#sb-ban" ).prop( "checked", true );
			$( "#sb-mute" ).prop( "checked", true );
		}
	}
	else{
		console.log("not checked");
		$( "#sys-ban" ).prop( "checked", false );
		$( "#sys-ban-ip" ).prop( "checked", false );
		if($("#sb-ban").is(":visible")) {
			$( "#sb-ban" ).prop( "checked", false );
			$( "#sb-mute" ).prop( "checked", false );
		}
	}
}); 
$(".in-frame-user").click(function(e){
	 e.preventDefault();
	console.log("clicked another user");
});
$(document).on('click', '.in-frame-user', function(e){
     e.preventDefault();
	console.log("clicked another user (doc)");
	href = $(this).attr("href");
	console.log ("href = "+href);
	suffix = href.match(/\d+/);
	console.log("suffix = "+suffix);
	//$("#ifrm", parent.document).attr('src', href);
	//$("#gen").empty();
	displayData(suffix);
    });