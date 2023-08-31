 	var gdetail='';
 	//var total_pages = 0;
	//console.log("on load "+history.length);
	$('#sendcmd').on('submit', function(e) {
		e.preventDefault();
		var items='';
		var url = $(this).attr('action');
		$("#u-tbody").empty();
		var sndData = $('#sendcmd input').serialize();
		console.log(url)
		console.log(sndData);
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
						gdetail = "<tr><td><a href='"+'users.php?id='+item.steam_id64+"'>"+item.name_c+"</a></td><td style='padding-left:2%;'><img  style='border:1px solid;width:40px;' src='"+item.flag+"' title='"+item.country+"'></td><td>"+timestamp+"</td><td><a href='http://steamcommunity.com/profiles/"+item.steam_id64+"' target='_blank'>"+item.steam_id64+"</a></td></tr>";
						$("#data_table").append(gdetail); 
					});
					paginate(0,'data_table','u-pages-d');
					$("#p-loader").hide();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('failed '+textStatus);
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
	console.log(rowCount);
	$('#results').hide();
	$('#searchbox').show();
	$("#u-tbody").empty();
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
					console.log("in loop "+counter);
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
			console.log(data1.pages); 
			console.log(country);
			$('#player-results > tbody').empty();
			for (var i in country) {
				//
				player= country[i];
				server = player.server.replace(/\*/g, ', ');
				server = server.slice(0,-2);
				console.log("second hit");
				cRow = "<tr id='"+player.steam_id64+"'><td class='middle' style='overflow:hidden;max-width: 150px;'><a href='users.php?id="+player.steam_id64+"'>"+player.name_c+"</a></td><td class='middle'>"+player.city+" - "+player.region+"</td><td class='middle'>"+player.log_ons+"</td><td class='middle'>"+timeConverter(player.last_log_on)+"</td><td class='middle' style='overflow:hidden;max-width: 150px;'>"+server+"</td></tr>";
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
				$("#sys-count").text(sysbans.sysbans_count);
				sys_ban_table =sysbans.sys_bans;
				$(sys_ban_table).each(function(i,row){
					$("#sys-table").append(row);
				});
				paginate(0,'sys-table','sys-pages-d');
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
			dup_table =dups.dups;
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
			console.log("process "+vacbans.exe_time);
			$("#vac-count").text(vacbans.vac_count);
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
	console.log(url+" general");
	$.ajax({ 
		type: 'GET', 
		url: url,
		dataType: "json", 
		beforeSend: function() {
			//$("#vac-loader").show();
		},
		success: function (general) {
			console.log(general);
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
					console.log("must be the blank");
					$('#c-select').append($('<option>').text(row));
				}
				else {
					$('#c-select').append($('<option>').val(row.value).text(row.country));
				}
			});
			
		}
	});
}
$('body').click(function(e) {   
  var $target = $(e.target); 4
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
});
function search_table(haystack,needle) {
	console.log("looking for "+needle);
	found = false
$('#'+haystack+' tr').each(function(){
        if($(this).find('td').eq(0).text() == needle){
			cell = $(this).find('td').eq(0).html()
            $(this).css('background','red');
             var row_index = $(this).closest("tr").index();
   			 var col_index = $(this).index();
   			 alert ("cell = "+cell);
   			 found = true
            return false;
        }
        //else {
			//alert( needle+ " Not Found");
			//return;
		//}
    });
    if (found == false) {
    alert( needle+ " Not Found");
}
}
function rp(page,table,disp) {
	
	console.log("current pos "+pager_pos);
	console.log("total pages "+total_pages);
	console.log("display "+disp);
	console.log( "page to display "+page);
	console.log("current table "+table);
	
	$('#'+table).each(function () {
				//console.log('in each loop '+page);
				alert ("selected page "+page);
				  var $table = $(this);
				  //console.log($table.html());
				  var itemsPerPage = 100;
				  var currentPage = page;
				   pager_pos= page;
				   var pager;
				   //alert("full table length "+$table.length);
				  var pages = Math.ceil($table.find("tr:not(:has(th))").length / itemsPerPage); // fix this bit
				   total_pages = pages;
				   alert (pages);
				   if(page > pages) {currentPage=pages-1;}
				   //alert("new total pages "+pages);
				   //alert("supposed to be displaying "+page); 
				   //console.log("Pages with class "+pages1);
				  //var rowCount = $('#dup-table tr.yourClass').length;
				  //console.log("Row Count "+rowCount);
				   
				  $table.bind('repaginate', function () {
				    if (pages > 1) {
				    //console.log(pager);
				    //pager='';
				    //console.log("current page in bind "+currentPage);
				    //console.log("current pager "+pager);
				    if ($table.next().hasClass("pager")) {
						//console.log("pager has class");
				         pager = $table.next().empty(); 
				      }
				     else
				    pager = $('<ul class="pagination pager" id="pages'+disp+'" cp="'+page+'" style="padding-top: 20px; direction:ltr;">');
				     //pager = $('<ul class="pagination pager" id="pages'+disp+'" style="padding-top: 20px; direction:ltr; ">');
					if (currentPage >0 ){
						$('<li class="page-link page" id ="'+disp+'-f" title="First Page"></li>').text(' « ').bind('click', function () {
						currentPage = 0;
						$table.trigger('repaginate');
						}).appendTo(pager);
				
						$('<li class="page-link page" id="'+disp+'-p" title="Previous Page">  < </li>').bind('click', function () {
						if (currentPage > 0)
							currentPage--;
							$table.trigger('repaginate');
						}).appendTo(pager);
					}
				    var startPager = currentPage > 2 ? currentPage - 2 : 0;
				    var endPager = startPager > 0 ? currentPage + 3 : 5;
				    if (endPager > pages) {
						//alert ("endpager to large ! setting to "+pages+ "current page = "+currentPage );
				      endPager = pages;
				      startPager = pages - 5;    if (startPager < 0)
				        startPager = 0;
				    }
					//alert("end pager = "+endPager);
				    for (var page = startPager; page < endPager; page++) {
						
						if(page == currentPage) {
							//console.log("hit current page "+page);
							style ='page-box';
							}
							else{ style='';}
							pc = page + 1;
				      $('<li id="pg-'+disp+'-' + page + '" class="page-link page '+style+'" title="goto page '+pc+'"></li>').text(page + 1).bind('click', {
				          newPage: page
				        }, function (event) {
							//console.log(" ul perhaps ? "+page.html());
				          currentPage = event.data['newPage'];
				          $table.trigger('repaginate');
				      }).appendTo(pager);
				    }
					//console.log("current page (next) "+currentPage+ " pages "+pages);
					if (currentPage !== pages-1) {
						$('<li class="page-link page" id="'+disp+'-n" title="Next Page"> > </li>').bind('click', function () {
							//console.log(" ul perhaps ? "+pager.html());
						if (currentPage < pages - 1)
						currentPage++;
						$table.trigger('repaginate');
						}).appendTo(pager);
					
						$('<li class="page-link page" id="'+disp+'-l" title="Last Page"> » </li></ul>').bind('click', function () {
						currentPage = pages - 1;
						$table.trigger('repaginate');
						}).appendTo(pager);
					}	
				
				    if (!$table.next().hasClass("pager"))
				      pager.insertAfter($table);
				      //console.log("has pager");
				      //pager.insertBefore($table);
				    	
				  }// end $table.bind('repaginate', function () { ...
				  //alert("before table.find");	
				  $table.find('tbody tr:not(:has(th))').hide().slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).show();
				  //alert("total pages after table.find"+total_pages);
				  if (pages <2) {return;}
				  $("#"+table+"-wrap").scrollTop(0)
				   tp = $("#pages"+disp).html();
				   alert(tp);
				  page_display = currentPage+1 +"/"+pages;
				  startDiv = "<div style='float:left;' title='Page Count'> Page "+page_display+"</div><div style='float:right;padding-right:2%;'><ul class='pagination' cp='"+currentPage+"' tp='"+pages+"'>";
				  endDiv = "</ul></div>";
				  tp= startDiv+tp+endDiv;
				  //console.log(tp);
				  $("#"+disp).html(tp);
				  $("#pages"+disp).hide();
				  $('#'+disp).show();
				  //alert("wrapping up");
				  });

				  $table.trigger('repaginate');
				});								
	}			