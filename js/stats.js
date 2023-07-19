 	var gdetail='';
	//console.log("on load "+history.length);
	$('#sendcmd').on('submit', function(e) {
		e.preventDefault();
		var items='';
		var url = $(this).attr('action');
		$("#data_table").html(items);
		var sndData = $('#sendcmd input').serialize();
		console.log(url)
		console.log(sndData);
		$.ajax({
			type: $(this).attr('method'),
			url: url,
			data: sndData,
			dataType: "json",
			success:  function(data){
				//console.log(data);
				if (data.count ==  0) {return}
					$("#searchbox").css("display","none");
					$("#results").css("display","block");
					$("#full-back").hide();
					$("#go_back").show();
					console.log(data.start);
					$('#count').html(data.count);
					$('#starter').html(data.start);
					$('#finisher').html(data.finish);
					player = data.results;
					$.each(player, function(i, item) {
						var timestamp =  timeConverter(item.last_log_on);
						gdetail += "<tr><td><a href='"+'users.php?id='+item.steam_id64+"'>"+item.name_c+"</a></td><td style='padding-left:2%;'><img  style='border:1px solid;width:40px;' src='"+item.flag+"' title='"+item.country+"'></td><td>"+timestamp+"</td><td>" ;
						gdetail +='<a href=http://steamcommunity.com/profiles/'+item.steam_id64+' target="_blank">'+item.steam_id64+'</a></td></tr>';
						man=item.name_c;
					});
					$("#data_table").html(gdetail);
					//console.log(gdetail)
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('failed '+textStatus);
			}
		});
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
	var rowCount = $('#data_table tr').length;
	console.log(rowCount);
	$('#results').hide();
	$('#searchbox').show();
	$("#data_table").empty();
	$("#gen").empty();
	$("#go_back").hide();
	$("#full-back").show();
	gendetail="";
	gdetail="";
});	
//$('th').click(function(){
//	var table = $(this).parents('table').eq(0)
//	var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
//	this.asc = !this.asc
//	if (!this.asc){rows = rows.reverse()}
//		for (var i = 0; i < rows.length; i++){table.append(rows[i])}
//})

function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}

function getCellValue(row, index){ return $(row).children('td').eq(index).text() }
function loadIframe(iframeName, url) {
    var $iframe = $('#' + iframeName);
    if ($iframe.length) {
        $iframe.attr('src',url);
        return false;
    }
    return true;
}
$('.user-id').on("click",function(){
	console.log ("length "+history.length);
//console.log( this.parent());
  var usersid =  $(this).attr("id");
   loadIframe("ifrm", "frame.php?id="+usersid);
   $('#ban_user').modal('show');	
});
$("#country").change(function(){
	$("#country-body").empty();
	option = $('option:selected', this).attr('flag');
	val = $('option:selected', this).val();
	if(val == "none selected") {
		$("#country-name").text('');
		$("#country").blur();
		$("#country-results").hide();
		$("#country-stats").hide();
		return;
	}
	text = $('option:selected', this).text();
	url = "helpers/country.php?id="+val;
	console.log(url);
	$("#country-pages").hide();
	 $.ajax({ 
        type: 'GET', 
        url: url,
        dataType: "json", 
        success: function (data1) {
			// got data
			console.log(data1);
			$("#c-rows").text(data1.rows); 
			$("#online-time").text(data1.online);
			$("#online-player").text(data1.top_player);
			$("#online-player-time").text(data1.top_player_time);
			country = data1.country;
			if(data1.pages == 1) {$("#country-pages").hide();}
			
			else {
				$("#country-pages").empty();
				for (var counter = 0; counter < data1.pages; counter++) {
					console.log("in loop "+counter);
					realPage = counter+1;
					if (counter == data1.page) {
						//console.log ("we have the page to highlight "+counter);
						pageNo ='<li class="page-item"><span class="page-link" style="background-color: #2c2c;" url="helpers/country.php?id='+data1.id+'&page='+counter+'">'+realPage+'</span></li>';
					}
					else {
						pageNo ='<li class="page-item"><span class="page-link" url="helpers/country.php?id='+data1.id+'&page='+counter+'">'+realPage+'</span></li>';
					}
					$("#country-pages").append(pageNo);
				}
				$("#country-pages").show();
				//$("#country-pages").hide();
				
			}
			console.log(data1.pages); 
			console.log(country);
			
			for (var i in country) {
				//
				player= country[i];
				server = player.server.replace(/\*/g, ', ');
				server = server.slice(0,-2)
				cRow = "<tr  style='vertical-align:middle;' id='"+player.steam_id64+"'><td style='overflow:hidden;max-width: 150px;'><a href='users.php?id="+player.steam_id64+"'>"+player.name_c+"</a></td><td>"+player.city+" - "+player.region+"</td><td>"+player.log_ons+"</td><td>"+timeConverter(player.last_log_on)+"</td><td style='overflow:hidden;max-width: 150px;'>"+server+"</td></tr>";
				$('#player-results > tbody:last-child').append(cRow);
			}
		}
		
    });
	$("#country-name").text(text);
	$("#country").blur();
	$("#country-results").show();
	$("#country-stats").show();
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
$('.page-link').on("click",function(){
	//
	console.log("entered click");

});
$(document).on('click','.page-link',function(){
//your code here
console.log("entered click");
	var url =  $(this).attr("url");
	console.log(url);
	
	$.ajax({ 
        type: 'GET', 
        url: url,
        dataType: "json", 
        success: function (data1) {
			// got data
			console.log(data1);
			country = data1.country;
			//$("#c-rows").text(data1.rows); 
			if(data1.pages == 1) {$("#country-pages").hide();} 
			else {
				$("#country-pages").empty();
				for (var counter = 0; counter < data1.pages; counter++) {
					console.log("in loop "+counter);
					realPage = counter+1;
					if (counter == data1.page) {
						pageNo ='<li class="page-item"><span class="page-link" style="background-color: #2c2c;" url="helpers/country.php?id='+data1.id+'&page='+counter+'">'+realPage+'</span></li>';
					}
					else{
						pageNo ='<li class="page-item"><span class="page-link" url="helpers/country.php?id='+data1.id+'&page='+counter+'">'+realPage+'</span></li>';
					}
					$("#country-pages").append(pageNo);
				}
				$("#country-pages").show();
			}
			console.log(data1.pages); 
			console.log(country);
			$("#country-body").empty();
			for (var i in country) {
				console.log('in loop reload');
				player= country[i];
				server = player.server.replace(/\*/g, ', ')
				cRow = "<tr  id='"+player.steam_id64+"'><td style='overflow:hidden;max-width: 150px;'><a href='users.php?id="+player.steam_id64+"'>"+player.name_c+"</a></td><td>"+player.city+" - "+player.region+"</td><td>"+player.log_ons+"</td><td>"+timeConverter(player.last_log_on)+"</td><td style='overflow:hidden;max-width: 150px;'>"+server+"</td></tr>";
				$('#player-results > tbody:last-child').append(cRow);
			}
		}
		
    });
});
$('#vac').on('click','tr', function() {
	console.log( $( this ).find("td:first").text());
	lookfor = $( this ).find("td:first").text();
	//Selected_Rows = $("#sb_ban tr :contains('"+lookfor+"')");
	//alert(Selected_Rows.length);
	//console.log(Selected_Rows);	
	$("#sb_ban").scrollTop($("tr :contains('"+lookfor+"')").parent('tr').offset().top);
	rowpos=45;
	$('#sb_ban').scrollTop(rowpos.top);
	
	$('#sb_ban').scrollTop( $('#sb_ban').find( 'tr:last' ).scrollTop() );
});