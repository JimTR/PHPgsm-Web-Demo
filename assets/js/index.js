$(document).ready(function(){
	origin   = window.location.href;
	origin = origin.replace(/\/[^\/]+$/,"");
	//alert($.cookie("phpgsm"));
	div = localStorage.getItem('card-order');
	if( div !== null){
		$("#drag-box").html(div);
		console.log("load cards");
	}
	if (typeof servers != 'undefined'){
		serverCount = servers.length;
		$.each(servers, function( index, value ) {
			console.log( index + ": " + value );
			online(value);
			setInterval( function() { online(value); }, refresh );
		});
	}
});

function online(url){
     var timer =sessionStorage.getItem(url);
     if (serverCount >1) {$("#server-desc").text("API Servers");}
     ticker = new Date(Date.now()) ;
     console.log(ticker+": enter online with "+url+" ("+refresh+")");
	 $.ajax({
		url: url,
		async: true,
		type: 'post',
		dataType: "json" ,
		success: function(data,status){
			if(data == "session failed"){
				console.log("the session failed");
				 noSession();
				return;
			}
			 ticker = new Date(Date.now()) ;
			console.log("hit success at "+ticker);
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
					//$('#player').text(general.server_players);
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
				if(typeof general.players != 'undefined') {
				$('#player-tot').text(general.players.player_tot);
				$('#logins-tot').text(general.players.tot_logins);
				$('#game_tot').text(general.players.game_tot);
				$('#player').text(general.total_players);
				$('#run_tot').text(general.players.run_tot);
				if ( general.todays_players == undefined )  { general.todays_players = '0';}
				$('#logins-today').text(general.todays_players);
				$('#p-stats').hide();
				$('#p-table').show();
				$('#countries').text(general.players.countries);
				if (general.top_country_today == null) { general.top_country_today = "No Logins Today";}
				$('#country-top-today').text(general.top_country_today);
				$('#country-top').text(general.country_data[0].country);
				$('#pop-country').text(general.pop_country+" ("+general.pop_time+")");
				$('#c-stats').hide();
				$('#c-table').show();
				$('#most-played').text(general.top_server);
				$('#most-played-time').text(general.most_played_time);
				$('#s-stats').hide();
				$('#s-table').show();
				}
				if (i =='top_players') {var top_players=data[i];}
				//console.log(country_data);
				for (var j in country_data) {
					//console.log(country_data[j]['test']);
					$("#country-"+j+"-name").text(country_data[j]['country']);
					$("#country-"+j+"-flag").attr("src",country_data[j]['flag']);
					$("#country-"+j+"-logins").text(country_data[j]['logins']);
					$("#country-"+j+"-players_total").text(addCommas(country_data[j]['player_count']));
					$("#country-"+j+"-players_today").text(country_data[j]['today']);
					$("#country-"+j+"-percent").text(country_data[j]['percent']);
					$("#country-"+j+"-time").text(country_data[j]['time']);
				}
				for (var j in  top_players) {
					// read in players
					playerId = "#"+j;
					player_data = top_players[j];
					//console.log(playerId);
					//console.log(player_data); 
					$(playerId+"-login").html(player_data.last_log_on);
					$(playerId+"-avatar1").attr("src",player_data.avatar);
					$(playerId+"-name").html(player_data.name);
					$(playerId+"-joined").html(player_data.first_log_on);
					$(playerId+"-logins").html(player_data.log_ons);
					$(playerId+"-time").html(player_data.time);
					country = "<div style='overflow:hidden;'><img src='"+player_data.flag+"' onerror='imgError(this);'/><span style='padding-left:2%;'>"+player_data.country+"</span></div>";
					$(playerId+"-map").html(country);
					$(playerId+"-link").attr("onclick","iclick('frame.php?id="+player_data.steam_id+"&frame=user_frame')");
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
						$('#time-online'+server_id).html(server.game_time); 
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
						max_players = $.trim(server.max_players.toString());
						$('#gol'+server_id).text(real_players+'/'+max_players);
						$('#pt'+server_id).html("<span>"+server.players_today+"</span> out of  "+addCommas(server.player_tot));
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
						sname =  $("#"+ServerData[1]+"-name").text();
						stname =  escapeHtml($("#"+ServerData[1]+"-name").text());
						//console.log(sname);
						online_servers += "<tr id ='"+ServerData[1]+"-row'  title ='open console "+stname+"' class='"+ServerData[1]+"'><td><a href='console.php?server="+ServerData[1]+"'>"+sname+"</a></td><td  title='players online' style='text-align:center;'>"+ServerData[0]+"</td></tr>"; 
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
			$("#active-load").hide(); // hide the spinning wheel
			$(".row").css("display", "flex");
			$("#header-wrapper").show();
			$("#a-stats").hide();
			$("#a-table").show();
			$("#drag-box").show();
			$("#borderedTabContent").show();
			if(!isMobile()) {$("#menu-bar").show();}
			history.replaceState({}, null, "index.php");
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
    image.src = "img/worldwide.png";
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
	console.log("is this the frame bug");
	$('#user-frame').modal('show');
	
});

function iclick(url) {
	loadIframe("ifrm", url);
    $("#ifrm").attr("height", "80vh");
	$("#ifrm").height("80vh"); 
	$("#ifrm").attr("width", "80vw");
	$("#frame-dialog").css("max-width", "80vw");
	$("#ifrm")[0].setAttribute("scrolling", "auto");
    $('#user-frame').modal('show');
}


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

function isElement(element) {
	// return  element status
	if ($("#"+element).length > 0){
		return true;
	}
	return false;	
}

$('.dropdown-menu span.dropdown-toggle').on('click', function(e) {
	if (!$("#submenu").hasClass('show')) {
		$("#submenu").attr("test","closed");
		$("#submenu").removeClass('show');
	}
	else{
		$("#submenu").attr("test","open");
		$("#submenu").addClass('show');
	}
	return false;
});
$("#borderedTab li ").click(function() {
	//
	id = $(this).attr("id");
	console.log("bt tab clicked "+id);
});
$("#util li ").click(function(){
	id = $(this).attr("id");
	console.log("util tab clicked "+id);
});	