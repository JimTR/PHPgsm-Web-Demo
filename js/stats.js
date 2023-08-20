 	var gdetail='';
 	var pager_pos = 0;
 	var total_pages = 0;
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
					$("#searchbox").hide();
					$("#results").show();
					$("#full-back").hide();
					$("#go_back").show();
					console.log(data.start);
					$('#count').html(data.count);
					$('#starter').html(data.start);
					$('#finisher').html(data.finish);
					player = data.results;
					$.each(player, function(i, item) {
						var timestamp =  timeConverter(item.last_log_on);
						gdetail = "<tr><td><a href='"+'users.php?id='+item.steam_id64+"'>"+item.name_c+"</a></td><td style='padding-left:2%;'><img  style='border:1px solid;width:40px;' src='"+item.flag+"' title='"+item.country+"'></td><td>"+timestamp+"</td><td>" ;
						gdetail +='<a href=http://steamcommunity.com/profiles/'+item.steam_id64+' target="_blank">'+item.steam_id64+'</a></td></tr>';
						man=item.name_c;
						$("#data_table").append(gdetail); 
					});
					//$("#data_table").html(gdetail); // bad fix
					//console.log(gdetail)
					rp(0,'data_table','u-pages-d');
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
function sb_ban () {
	action= 'sb-ban';
		url = "plugins/stats_data.php?action="+action;
		console.log(url +" in function");
		$.ajax({ 
			type: 'GET', 
			url: url,
			dataType: "json", 
			success: function (sbbans) {
				$("#sb-count").text(sbbans.sb_count);
				sb_ban_table =sbbans.sb_bans;
				$(sb_ban_table).each(function(i,row){
					//console.log(row);
					$("#sb-ban-body").append(row);
				});
			}
		});
}
function sys_ban() {
	action = 'sys-bans';
		url = "plugins/stats_data.php?action="+action;
		console.log(url+" in function" );
		$.ajax({ 
			type: 'GET', 
			url: url,
			dataType: "json", 
			success: function (sysbans) {
				$("#sys-count").text(sysbans.sysbans_count);
				sys_ban_table =sysbans.sys_bans;
				$(sys_ban_table).each(function(i,row){
					$("#sys-bans").append(row);
				});
			}
		});
}
function dup_page() {
	action = 'dups';
	url = "plugins/stats_data.php?action="+action;
	console.log(url);
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
			 rp(0,'dup-table','pages-d');
		}
	});
}


function vac_ban() {
	action = 'vac-ban';
	url = "plugins/stats_data.php?action="+action;
	console.log(url+" vac_ban");
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
				$("#vac-bans").append(row);
			});
			$("#vac-loader").hide();
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
			console.log("process "+vacbans.exe_time);
			$("#vac-count").text(vacbans.vac_count);
			vac_ban_table =vacbans.vac_bans;
			$(vac_ban_table).each(function(i,row){
				//console.log(row);
				$("#vac-bans").append(row);
			});
			//$("#vac-loader").hide();
		}
	});
}
$('body').click(function(e) {   
  var $target = $(e.target); 4
  //alert("clicked")
  //console.log($target);  
  if ($target.hasClass("test")) {
    // do something
    v = $(e.target).parent().parent().parent().attr('id');
     //var $table = $("#dup-table");
     y = $target.attr('id');
     if (y == v+'-f') {
		 $target.text(1);
		 console.log ("target text "+$target.text);
	 }
	 if (y == v+'-p') {
		 $target.text(pager_pos);
	 }
	 if(y == v+"-n") {
		 $target.text(pager_pos+2)
	 }
	 if(y ==v+'-l') {
		 $target.text(total_pages);
	 }
     console.log("id = "+y);
     x = $target.text()-1;
     console.log(x);
     v = $(e.target).parent().parent().parent().attr('id');
    //alert (v);
     ce = $(e.target).parent().parent().parent().parent().attr('id');
     var msgId = $("#"+ce).closest('table').attr('id');
     //if($("#"+ce).find('table').length) {
		 tbl = $("#"+ce).find('table');
		  var msgId = tbl.attr('id');
      //} else {
 // no table found
//}
     //alert("parent div "+ce);
     //alert ("closest table "+msgId );
    //alert("we clicked pagination "+x+" div to use "+v );
    rp(x, msgId,v);
  }
});

function rp(page,table,disp) {
	console.log("current pos "+pager_pos);
	console.log("total pages "+total_pages);
	console.log("display "+disp);
	console.log( "page to display "+page);
	console.log("current table "+table);
	$('#'+table).each(function () {
				console.log('in each loop '+page);
				  var $table = $(this);
				  //console.log($table.html());
				  var itemsPerPage = 100;
				  var currentPage = page;
				   pager_pos= page;
				   var pager;
				  var pages = Math.ceil($table.find("tr:not(:has(th))").length / itemsPerPage); // fix this bit
				   total_pages = pages;
				   //alert("new total pages "+pages);
				   //alert("supposed to be displaying "+page); 
				   //console.log("Pages with class "+pages1);
				  //var rowCount = $('#dup-table tr.yourClass').length;
				  //console.log("Row Count "+rowCount);
				   
				  $table.bind('repaginate', function () {
				    if (pages > 1) {
				    //console.log(pager);
				    //pager='';
				    console.log("current page in bind"+currentPage);
				    console.log("current pager "+pager);
				    if ($table.next().hasClass("pager")) {
						//console.log("pager has class");
				         pager = $table.next().empty(); 
				      }
				     else
				    pager = $('<ul class="pagination pager" id="pages'+disp+'" style="padding-top: 20px; direction:ltr; ">');
					if (currentPage >0 ){
						$('<li class="page-link test" id ="'+disp+'-f" title="First Page"></li>').text(' « ').bind('click', function () {
						currentPage = 0;
						$table.trigger('repaginate');
						}).appendTo(pager);
				
						$('<li class="page-link test" id="'+disp+'-p" title="Previous Page">  < </li>').bind('click', function () {
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
							console.log("hit current page "+page);
							style ='  page-box"';
							}
							else{ style='';}
							pc = page + 1;
				      $('<li id="pg-'+disp+'-' + page + '" class="page-link test'+style+'" title="goto page '+pc+'"></li>').text(page + 1).bind('click', {
				          newPage: page
				        }, function (event) {
							console.log(" ul perhaps ? "+page.html());
				          currentPage = event.data['newPage'];
				          $table.trigger('repaginate');
				      }).appendTo(pager);
				    }
					console.log("current page (next) "+currentPage+ " pages "+pages);
					if (currentPage !== pages-1) {
						$('<li class="page-link test" id="'+disp+'-n" title="Next Page"> > </li>').bind('click', function () {
							console.log(" ul perhaps ? "+pager.html());
						if (currentPage < pages - 1)
						currentPage++;
						$table.trigger('repaginate');
						}).appendTo(pager);
					
						$('<li class="page-link test" id="'+disp+'-l" title="Last Page"> » </li></ul>').bind('click', function () {
						currentPage = pages - 1;
						$table.trigger('repaginate');
						}).appendTo(pager);
					}	
				
				    if (!$table.next().hasClass("pager"))
				      pager.insertAfter($table);
				      console.log("has pager");
				      //pager.insertBefore($table);
				    	
				  }// end $table.bind('repaginate', function () { ...

				  $table.find('tbody tr:not(:has(th))').hide().slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).show();
				  //alert(total_pages);
				  if (total_pages <2) {return;}
				  $("#"+table+"-wrap").scrollTop(0)
				   tp = $("#pages"+disp).html();
				   console.log(tp);
				  page_display = currentPage+1 +"/"+total_pages;
				  startDiv = "<div style='float:left;' title='Page Count'> Page "+page_display+"</div><div style='float:right;padding-right:2%;'><ul class='pagination'>";
				  endDiv = "</ul></div>";
				  tp= startDiv+tp+endDiv;
				  console.log(tp);
				  $("#"+disp).html(tp);
				  $("#pages"+disp).hide();
				  $('#'+disp).show();
				  //alert("wrapping up");
				  });

				  $table.trigger('repaginate');
				});								
	}			