$(document).ready(function(){
	/*Notification.requestPermission().then((result) => {
		//console.log(result);
		//if (result !== "granted") {
			//askNotificationPermission();
		}
	});
	
	img = "img/logo.png";
	text = `Your on the index page `;
	notification = new Notification('Game Server Manager', { body: text, icon: img});*/
 });

function index() {
	// read data use simular to loading the index file
	if (serverCount >1) {$("#server-desc").text("API Servers");}
	//console.log("in index ");
     $.ajax({ 
        type: 'GET', 
        url: 'ajax.php', 
        data    : { module: 'index' },
        dataType: "json", 
        success: function (data1) {
			// got data
			//alert(data1);
			//console.log(data1);
			$('#player_tot').text(data1.player_tot);
			$('#logins_tot').text(data1.tot_logins);
			$('#game_tot').text(data1.game_tot);
			$('#player').text(data1.players);
			$('#run_tot').text(data1.run_tot);
			if ( data1.logins_today == undefined )  { data1.logins_today = '0';}
			$('#logins_today').text(data1.logins_today);
			$('#p-stats').hide();
			$('#p-table').show();
			$('#countries').text(data1.countries);
			if (data1.country_top_today == null) { data1.country_top_today = "No Logins Today";}
			$('#country_top_today').text(data1.country_top_today);
			$('#country_top').text(data1.country_top);
			$('#pop_country').text(data1.pop_country+" ("+data1.pop_time+")");
			$('#c-stats').hide();
			$('#c-table').show();
			$('#most-played').text(data1.most_played);
			$('#most-played-time').text(data1.total_time);
			$('#s-stats').hide();
			$('#s-table').show();
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
				//$("#player"+i+"-link").attr("url",player.detail_link);
				$("#player"+i+"-link").attr("onclick","iclick('"+player.detail_link+"')");
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
		success: function(data,status){
			var ptot= 0;
			var online_has_players = {};
			var ps = '';
			//var data = xml;
			for (var i in data) {
				var fname = i; // got the base server
				//console.log(fname);
				
				if( i =='general' ) {
					var general = data[i];
					//console.log(general);
					var serverid = general.server_id;
					href="<span id='"+serverid+"' class = 'baseserver player-link'>"+serverid+"</span>"; //change this line
					$("#"+serverid+"-p-name").html(href);
					$("#"+serverid+"-p-name").attr('url',general.server_url);
					$("#"+serverid+"-up-time").html(general.uptime);
					cpu = general.cpu_info;
					title = '';
					if(cpu.reboot  == "Yes") { 
						title += "Warning - This server&#39;s parent needs rebooting";
						cpu.reboot = "<img src ='img/offline.png' title='"+title+"'></img>";
						
					}
					else{ 
						if(parseInt(cpu.load_1_min_pc) >80 ) {
							title += "this server is using a lot of cpu";
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
						if( g =='country_data') {
							var country_data = general['country_data'];  
						}
					} 
				}
				if (i =='top_players') {var top_players=data[i];}
				//console.log(country_data);
				for (var j in country_data) {
					//console.log(country_data[j]['test']);
					$("#country-"+j+"-name").text(country_data[j]['country']);
					$("#country-"+j+"-flag").attr("src",country_data[j]['flag']);
					$("#country-"+j+"-logins").text(country_data[j]['logins']);
					$("#country-"+j+"-players_total").text(country_data[j]['players']);
					$("#country-"+j+"-players_today").text(country_data[j]['today']);
					$("#country-"+j+"-percent").text(country_data[j]['percent']);
					
				}
				for (var j in  top_players) {
					// read in players
					var td_title = '<tr id="playerrow_'+j+'" title ="'+top_players[j]['country']+'"><td id="player_row_'+j+'"><img src="'+top_players[j]['flag']+'" style ="width:5%;vertical-align: middle;">&nbsp;&nbsp;'+top_players[j]['name']+'</td>';
					var td_first_logon = '<td>'+top_players[j]['first_log_on']+'</td>';
					var td_logons = '<td>'+top_players[j]['log_ons']+'</td>';
					var td_last_logon = '<td>'+top_players[j]['last_log_on']+'</td></tr>';
					var tr = td_title+td_first_logon+td_logons+td_last_logon;
					$("td#player_row_"+j).parent().replaceWith(tr);   
				}
				
				for (var j in data[i]) {
					// we have the individal server
					if (typeof serverlength === 0) {
						//console.log('server not set');
						return;
					}   
					var server = data[i][j]; // got server id
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
			
				for (var j in data[i]) {
					if (typeof serverlength === 0) {return;}   
					var server = data[i][j]; // got server id
					var server_id = j;	
					if (server.running == 1 ) {
						var playern = server.Players;
						$('#pl'+server_id).html(playern); 
						$("#"+server_id).show();
						var logo  = server.logo;
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
								//console.log('no need players array not set '+server.server_name);
								return;
							}   
							$('#op1'+server_id).css('cursor','pointer');
							$('#gol'+server_id).removeClass("map-title").addClass('p_count');
							$("#"+server_id+"-playerbody").empty();
							var players = $.map(server.players, function(value, index) { return [value]; });
							for (p in players) {
								newRowContent='<tr style="font-size:14px;" class="p-name"><td style="width:50% !important;"><i >'+players[p].Name+'</i></td><td style="text-align:right;width:15%;" >'+players[p].Frags+'</td><td style=text-align:right;padding-right:3%;width:20%" class="p_time">'+players[p].TimeF+'</td></tr>'; 
								$("#"+server_id+"-playerbody").append(newRowContent);
							}
						}
					}
					else {$('#'+server_id).hide(); } // hide the server output					
				}
				online_servers = "";
				addedbody = false;
				ols = 0;
				var rowCount = $('#xy tr').length;
				var count = $('#'+serverid+"-active").children('tr').length;
				//console.log("count = "+count+" rowCount = "+rowCount);
				thisbody = serverid+"-active"
				if (ptot >0 ) {
					bodylength = $("#"+thisbody).length;
					$("#"+thisbody).empty();
					//console.log("emptying "+thisbody);
					if( $('#'+thisbody).length >0 ) {addedBody= false;}
					else{
						online_servers = "<tbody id='"+thisbody+"' class='no-border'>"; //<tr><td colspan='2'>Active server for "+serverid+"</td></tr>"; 
						addedbody = true;
					}
					$.each( online_has_players, function( key, value ) {
						ServerData = value.split(",");
						thisServer = "#"+ServerData[1]+"-row";
						//console.log("we need to remove "+thisServer);
						$(thisServer).remove();
						sname = $("#"+ServerData[1]+"-name").text();
						online_servers += "<tr id ='"+ServerData[1]+"-row' title ='open console "+sname+"' class='"+ServerData[1]+"'><td><a href='console.php?server="+ServerData[1]+"'>"+sname+"</a></td><td  title='players online' style='text-align:center;'>"+ServerData[0]+"</td></tr>"; 
					});
					if(addedbody == true) {online_servers +="</tbody>";}
					ols = online_servers.length;
					if (addedbody == true) {$("#xy").append(online_servers);}
					else {$("#"+thisbody).append(online_servers);}
					$("#dormant").hide();
					$("#xy").show();
				}
				else {
					if(ptot==0){$("#"+thisbody).empty();	}
					rowCount = $('#xy tr').length;
					if (rowCount == 0){
						$("#dormant").show();
						$("#xy").hide();
					}
				}
			}
			$("#a-stats").hide();
			$("#a-table").show();
		},
		fail: function() {
			alert('Failed');
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
$(document).on("click",".mobile-link", function () {
	var id = $(this).attr("tab");
	 activeTab(id);
	
	
});	
$(document).on("click",".uclick", function () {
	// user click
	//url = this.attr("url");
	var id = this.id;
	url =$("#"+id).attr("url");
	$("#ifrm").attr("height", "80vh");
	$("#ifrm").height("80vh"); 
	$("#ifrm").attr("width", "80vw");
	$("#frame-dialog").css("max-width", "80vw");
	$("#ifrm")[0].setAttribute("scrolling", "auto");
	loadIframe("ifrm", url);
	$('#user-frame').modal('show');
	
});
$(document).on("click",".stats", function () {
	var id = this.id;
	if (isMobile()){url = "baseserver.php?server="+id;}
	else {url = "frame.php?frame=stats_frame&id="+id;}
	switch(id) {
		case "general":
			// code block
			id = "General Statistics";
			break;
		case "user-list":
			id = "User Lists";
			// code block
			break;
		case "country-list":
			id = "Country Lists";
			// code block
			break;
		case "linked-ip":
			id = "Linked IP Addresses";
			// code block
			break;
		case "ban-lists":
			id = "Banned Users";
			// code block
			break;
		case "theme-switch":
			alert("changing theme !",true);	
			break;			
		default:
			// code block
	}
	title = id.replace('-',' ');
	title= ucwords(title,true) ;
	$("#ifrm").attr("height", "80vh");
	$("#ifrm").height("80vh"); 
	$("#ifrm").attr("width", "90vw");
	$("#ifrm").attr("mod", title);
	$("#frame-dialog").css("max-width", "90vw");
	$("#frame-title").html(title);
	
	//url = "frame.php?frame=base_frame&id="+clickedBtnID+"&url="+linkUrl;
	//$("#ifrm")[0].setAttribute("scrolling", "no");
	//alert('url to use ' + url,true,"button click");
	loadIframe("ifrm", url);
	$('#user-frame').modal('show');
});	 
function sclick() {
	//alert("search clicked with ",false,"it worked");
	$("#ifrm").attr("height", "30vh");
	$("#ifrm").height("30vh"); 
	$("#ifrm").attr("width", "50vw");
	$("#frame-dialog").css("max-width", "40vw");
	//$("#frame-dialog").max-width ("50vw");
	$("#frame-title").html("Search");
	url = "frame.php?frame=search_frame";
	$("#ifrm")[0].setAttribute("scrolling", "auto");
	 console.log(url);
	  //alert ("frame.php?frame=user_frame&id="+id);	
	  //window.location.href=url;
	loadIframe("ifrm", url);
	$('#user-frame').modal('show');
}
function iclick(url) {
	loadIframe("ifrm", url);
    $("#ifrm").attr("height", "80vh");
	$("#ifrm").height("80vh"); 
	$("#ifrm").attr("width", "80vw");
	$("#frame-dialog").css("max-width", "80vw");
	$("#ifrm")[0].setAttribute("scrolling", "auto");
    $('#user-frame').modal('show');
}
$(document).on("click",".baseserver", function () {
   var clickedBtnID = $(this).attr('id'); 
     //alert(clickedBtnID  ,true);
     linkUrl =  $(this).parent().attr('url');
     //alert (linkUrl,true); 
   $("#ifrm").attr("height", "85vh");
	$("#ifrm").height("85vh"); 
	$("#ifrm").attr("width", "90vw");
	$("#frame-dialog").css("max-width", "90vw");
	$("#frame-title").html("API Server "+clickedBtnID);
	if (isMobile()){ 
		url= "baseserver.php?server="+clickedBtnID;
		 window.location = url;
	}
	else {
		url = "frame.php?frame=base_frame&id="+clickedBtnID+"&url="+linkUrl;
		$("#ifrm")[0].setAttribute("scrolling", "no");
		//alert('url to use ' + url,true,"button click");
		loadIframe("ifrm", url);
		$('#user-frame').modal('show');
	}
});

$(document).on("click",".player-link", function () {
   var clickedBtnID = $(this).parent().attr('url'); 
   //alert("player-link "+clickedBtnID  ,true);
   return clickedBtnID;
   
});
$(document).on("click",".p_count", function () {
   var clickedBtnID = $(this).attr('id'); 
    x= clickedBtnID.replace('gol','');
   clickedBtnID=x+'-secret';
   //alert("p_count click "+clickedBtnID  ,true);
   $("#"+clickedBtnID).show();
   return clickedBtnID;
   
});
$("#user-frame").on("hidden.bs.modal", function () {
    // put your default event here
    $('#ifrm').removeAttr("inframe");
});
$(document).on("click",".secret", function () {
   var clickedBtnID = $(this).attr('id'); 
   $("#"+clickedBtnID).hide();
 });
 //$(document).on("click",".btn-close",function (){
	 //alert($('#ifrm').attr("src"),true); 
	 //$('#ifrm').attr('src','');
	 //$('#ifrm').attr('src', '');
	 //alert("src should be empty",true);
     //alert($('#ifrm').attr("src"),true); 
     //closeIFrame();
// });
function ucwords(str,force){
  str=force ? str.toLowerCase() : str;  
  return str.replace(/(\b)([a-zA-Z])/g,
           function(firstLetter){
              return   firstLetter.toUpperCase();
           });
}
function isElement(element) {
	// return  element status
	if ($("#"+element).length > 0){
		return true;
	}
	return false;	
}


