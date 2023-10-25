 	var gdetail='';
 	$(document).ready(function() {
		var pager_pos= 0;
		var now = new Date();
		var day = ("0" + now.getDate()).slice(-2);
		var month = ("0" + (now.getMonth() + 1)).slice(-2);
		var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
		$('#start').val(today);
		$("#finish").val(today);
		general();
		sb_ban();
		sys_ban();
		dup_page();
		vac_ban();
	});
	
	$('#sendcmd').on('submit', function(e) {
		e.preventDefault();
		var items='';
		var url = $(this).attr('action');
		$("#u-tbody").empty();
		var sndData = $('#sendcmd input').serialize();
		//console.log(url)
		//console.log(sndData);
		$.ajax({
			type: $(this).attr('method'),
			url: url,
			data: sndData,
			dataType: "json",
			beforeSend: function() {
				$("#p-loader").show();
			},
			success:  function(data){
				//console.log(data);
				if (data.count ==  0) {return}
					$("#searchbox").hide();
					$("#results").show();
					$("#full-back").hide();
					$("#go_back").show();
					$('#count').html(data.count);
					$('#starter').html(data.start);
					$('#finisher').html(data.finish);
					player = data.results;
					
					$.each(player, function(i, item) {
						var timestamp =  timeConverter(item.last_log_on);
						gdetail = "<tr><td><span class='player-link' id='"+item.steam_id64+"'>"+item.name_c+"</span></td><td style='padding-left:2%;'><img  style='border:1px solid;width:40px;' src='"+item.flag+"' title='"+item.country+"'></td><td>"+timestamp+"</td><td><a href='http://steamcommunity.com/profiles/"+item.steam_id64+"' target='_blank'>"+item.steam_id64+"</a></td></tr>";
						$("#data_table").append(gdetail); 
					});
					paginate(0,'data_table','u-pages-d');
					$("#p-loader").hide();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('failed '+textStatus,false);
			}
			//$("#p-loader").hide();
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
	//console.log(rowCount);
	$('#results').hide();
	$('#searchbox').show();
	$("#u-tbody").empty();
	$("#gen").empty();
	$("#go_back").hide();
	$("#full-back").show();
	gendetail="";
	gdetail="";
});	

function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}

function getCellValue(row, index){ return $(row).children('td').eq(index).text() }

$("#c-select").change(function(){
	$("#country-body").empty();
	option = $('option:selected', this).attr('flag');
	val = $('option:selected', this).val();
	if(val == "none selected") {
		$("#country-name").text('');
		$("#c-select").blur();
		$("#country-results").hide();
		$("#country-stats").hide();
		return;
	}
	text = $('option:selected', this).text();
	url = "helpers/country.php?id="+val;
	//alert(url);
	$("#country-pages").hide();
	 $.ajax({ 
        type: 'GET', 
        url: url,
        dataType: "json", 
        success: function (data1) {
			// got data
			console.log(data1);
			//alert("data back");
			$("#c-rows").text(data1.rows); 
			$("#online-time").text(data1.online);
			$("#online-player").html(data1.top_player);
			$("#online-player-time").text(data1.top_player_time);
			country = data1.country;
			if(data1.pages == 1) {$("#country-pages").hide();}
			
			else {
				$("#country-pages").empty();
				for (var counter = 0; counter < data1.pages; counter++) {
					//console.log("in loop "+counter);
					realPage = counter+1;
					if (counter == data1.page) {
						//console.log ("we have the page to highlight "+counter);
						pageNo ='<li class="page-item"><span class="page-link page-box"  url="helpers/country.php?id='+data1.id+'&page='+counter+'">'+realPage+'</span></li>';
					}
					else {
						pageNo ='<li class="page-item"><span class="page-link" url="helpers/country.php?id='+data1.id+'&page='+counter+'">'+realPage+'</span></li>';
					}
					$("#country-pages").append(pageNo);
				}
				$("#country-pages").show();
				//$("#country-pages").hide();
				
			}
			//console.log(data1.pages); 
			//console.log(country);
			$('#player-results > tbody').empty();
			for (var i in country) {
				//
				player= country[i];
				server = player.server.replace(/\*/g, ', ');
				server = server.slice(0,-2);
				//console.log("second hit");
				cRow = "<tr id='"+player.steam_id64+"'><td class='middle' style='overflow:hidden;max-width: 150px;'><span class='player-link' id='"+player.steam_id64+"'>"+player.name_c+"</span></td><td class='middle'>"+player.city+" - "+player.region+"</td><td class='middle'>"+player.log_ons+"</td><td class='middle'>"+timeConverter(player.last_log_on)+"</td><td class='middle' style='overflow:hidden;max-width: 150px;'>"+server+"</td></tr>";
				$('#player-results > tbody:last-child').append(cRow);
			}
			//alert ("paginate");
			paginate(0,"player-results","pages-p");
			//var tableRow = $("#player-results td").filter(function() {
			//	return $(this).text() == "";
			//}).closest("tr");
			//console.log("found "+tableRow.html());
		}
		
    });
	$("#country-name").text(text);
	$("#c-select").blur();
	
	$("#country-results").show();
	$("#country-stats").show();
	//alert("done");
});

$("#country").on('click','.page-link',function(){
//your code here
console.log("entered click");
	var url =  $(this).attr("url");
	//console.log(url);
	
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
						pageNo ='<li class="page-item"><span class="page-link page-box" url="helpers/country.php?id='+data1.id+'&page='+counter+'">'+realPage+'</span></li>';
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
				cRow = "<tr  id='"+player.steam_id64+"'><td  class='middle' style='overflow:hidden;max-width: 150px;'><a href='users.php?id="+player.steam_id64+"'>"+player.name_c+"</a></td><td class='middle'>"+player.city+" - "+player.region+"</td><td class='middle'>"+player.log_ons+"</td><td class='middle'>"+timeConverter(player.last_log_on)+"</td><td class='middle' style='overflow:hidden;max-width: 150px;'>"+server+"</td></tr>";
				$('#player-results > tbody:last-child').append(cRow);
			}
			//alert("paginate #2");
			 //rp(0,"player-results","pages-p");
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
function sb_ban () {
	action= 'sb-ban';
		url = "plugins/stats_data.php?action="+action;
		//console.log(url +" in function");
		$.ajax({ 
			type: 'GET', 
			url: url,
			dataType: "json", 
			success: function (sbbans) {
				$("#sb-count").text(sbbans.sb_count);
				sb_ban_table =sbbans.sb_bans;
				$(sb_ban_table).each(function(i,row){
					//console.log(row);
					$("#sb-table").append(row);
				});
				paginate(0,'sb-table','sb-pages-d');
			}
		});
}
function sys_ban() {
	action = 'sys-bans';
		url = "plugins/stats_data.php?action="+action;
		//console.log(url+" in function" );
		$.ajax({ 
			type: 'GET', 
			url: url,
			dataType: "json", 
			success: function (sysbans) {
				//console.log(sysbans);
				//$("#sys-count").text(sysbans.sysbans_count);
				count = 0
				sys_ban_table =sysbans.sys_bans;
				$(sys_ban_table).each(function(i,row){
					$("#sys-table").append(row);
					count++;
				});
				$("#sys-count").text(count);
				paginate(0,'sys-table','sys-pages-d');
				sys_ban_table_id =sysbans.sys_bans_id;
				//console.log("ban table = "+sys_ban_table_id.length);
				count = 0
				$(sys_ban_table_id).each(function(i,row){
					$("#sys-id-table").append(row);
					count++;
				});
				$("#sys-id-count").text(count);
				paginate(0,'sys-id-table','sys-id-pages-d');
			}
		});
}
function dup_page() {
	action = 'dups';
	url = "plugins/stats_data.php?action="+action;
	//console.log(url);
	$.ajax({ 
		type: 'GET', 
		url: url,
		dataType: "json", 
		success: function (dups) {
			//console.log(dups);
			$("#dup-count").text(dups.dup_count);
			dup_table = dups.dups;
			$(dup_table).each(function(i,row){
				$this = $(row);
				$("#dup-table").append(row);
				//$this.addClass('yourClass');
			});
			
			 paginate(0,'dup-table','pages-d');
		}
	});
}


function vac_ban() {
	action = 'vac-ban';
	url = "plugins/stats_data.php?action="+action;
	//console.log(url+" vac_ban");
	$.ajax({ 
		type: 'GET', 
		url: url,
		dataType: "json", 
		beforeSend: function() {
			$("#vac-loader").show();
		},
		success: function (vacbans) {
			//console.log("process "+vacbans.exe_time);
			$("#vac-count").text(vacbans.vac_count);
			$("#g-vac-ban").text(vacbans.vac_count);
			vac_ban_table =vacbans.vac_bans;
			$(vac_ban_table).each(function(i,row){
				//console.log(row);
				$("#vac-table").append(row);
			});
			$("#vac-loader").hide();
			//alert('paginate');
			paginate(0,'vac-table','v-pages-d');
		}
	});
}
function general() {
	action = 'general';
	url = "plugins/stats_data.php?action="+action;
	//console.log(url+" general");
	$.ajax({ 
		type: 'GET', 
		url: url,
		dataType: "json", 
		beforeSend: function() {
			//$("#vac-loader").show();
		},
		success: function (general) {
			//console.log(general);
			$("#total-players").html(general.player_total);
			$('#total_time').html(general.total_time);
			$('#country').html(general.country);
			$('#country_stat').html(general.country_stat);
			$('#time_online').html(general.time_online);
			$('#time_online_count').html(general.time_online_count);
			$('#most_log_ons').html(general.most_log_ons);
			$('#log_on_count').html(general.log_on_count);
			$('#most_popular').html(general.most_popular);
			$('#most_popular_count').html(general.most_popular_count);
			$('#most_played').html(general.most_played);
			$('#most_played_time').html(general.most_played_time);
			$('#comms_live').html(general.comms_live+" active bans out of "+general.comms_total);
			$('#game_live').html(general.game_live+" active bans out of "+general.game_total);	
			gameList = general.game_list;
			$(gameList).each(function(i,row){
				$("#game-list").append(row);
			});
			c_select = general.c_select;
			$(c_select).each(function(i,row){
				//console.log(row);
				if(typeof row.value =='undefined') {
					//console.log("must be the blank");
					$('#c-select').append($('<option>').text(row));
				}
				else {
					$('#c-select').append($('<option>').val(row.value).text(row.country));
				}
			});
			$("#general-data").show();
		}
	});
}
$('body').click(function(e) {   
  var $target = $(e.target); 
  //alert($target.attr('id'),true);
   if ($target.hasClass("pagination-page")) {
    // do something
    v = $(e.target).parent().parent().parent().attr('id');
    y = $target.attr('id');
    if (y == v+'-f') {
		 $target.text(1);
	} 
	if (y == v+'-p') {
		$target.text($target.parent().attr('cp'));
	}
	 if(y == v+"-n") {
		 nextPage = parseInt($target.parent().attr('cp'));
		 nextPage = nextPage+2;
		 $target.text(nextPage);
	 }
	 if(y ==v+'-l') {
		 $target.text($target.parent().attr('tp'));
	 }
	 pp = $target.parent().attr('pp');
     console.log("id = "+y);
     x = $target.text()-1;
     //console.log(x);
     ce = $(e.target).parent().parent().parent().parent().attr('id');
     var msgId = $("#"+ce).closest('table').attr('id');
     tbl = $("#"+ce).find('table');
	 var msgId = tbl.attr('id');
   // search_table(msgId,'JimR');
   //alert("parent div "+ce);
   //alert ("closest table "+msgId );
   //alert("we clicked pagination "+x+" div to use "+v );
    paginate(x, msgId,v,pp);
    //rp(x, msgId,v);
  }
  if ($(e.target).hasClass("player-link")) {
	  //alert("player link target "+$target.attr('id'),true);
	  id =  $(e.target).attr('id');
	  $inframe =$(window.parent.document).find("#ifrm");
	  url = "frame.php?frame=user_frame&id="+id;
	  console.log(url);
	  if($inframe.attr("mod") !== undefined) {
		//alert ("frame.php?frame=user_frame&id="+id,true);
		$inframe.attr("src",url);
	}	
	 else{ 
		loadIframe("ifrm", url);
		$('#user-frame').modal('show');
	}
  }
});
function search_table(haystack,needle) {
	//console.log("looking for "+needle);
	found = false
$('#'+haystack+' tr').each(function(){
        if($(this).find('td').eq(0).text() == needle){
			cell = $(this).find('td').eq(0).html()
            $(this).css('background','red');
             var row_index = $(this).closest("tr").index();
   			 var col_index = $(this).index();
   			 //alert ("cell = "+cell);
   			 found = true
            return false;
        }
        //else {
			//alert( needle+ " Not Found");
			//return;
		//}
    });
    if (found == false) {
		//alert( needle+ " Not Found");
	}
}
$('#b-select').change(function() {
	val = $('option:selected', this).val();
	//alert( val,true );
	$("#b-select > option").each(function() {
		//alert(this.text + ' ' + this.value,true);
		hide = this.value;
		$("#"+hide).hide();
	});
	$("#"+val).show();
	$("#b-select").blur();
});