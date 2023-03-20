var gdetail='';
var gendetail ='';
var item='';
var data="";
 $(document).ready(function() {
     console.log('hit this');
     console.log($('#user-id').text());
     if ($('#user-id').is(':empty')){
		 $("#searchbox").show();
		return;
	}
     var userID = $('#user-id').text();
     value = "id";
     $("input[name=type][value=" + value + "]").prop('checked', true);
     $('#text').val(userID);
     $('#sendcmd').submit();
     //alert(userID);
     displayData(userID);
	return;
	});
	$('#sendcmd').on('submit', function(e) {
    e.preventDefault();
    var items='';
    var url = $(this).attr('action');
    $("#data_table").html(items);
    var sndData = $('#sendcmd input').serialize();
    console.log("we are using "+url);
    $.ajax({
    type: $(this).attr('method'),
    url: $(this).attr('action'),
    data: sndData,
    async: false,
    dataType: "json",
    //contentType: false,
    //processData: false,
    success:  function(data){
		var noe = data.data.length;
		//alert (sndData);
		//alert(data.length);
		//alert(noe);
		
		//$('#editor').hide();
		if (typeof(noe) == 'undefined') {
			$('#results').hide();
			$('#error_action').text('Invalid Search');
			$('#error_text').html('Can not find '+data.text);
			$('#error').modal('show');
			return;
		}
			
        //alert("Updated "+noe);
        var uni= '';
        players = data.data;
        $.each(players, function(i, item) {
		if (item.steam_id64 == uni) {return true;}
		if(item.banned == 1) { 
			console.log("banned "+item.name);
			item.name = '<span style="text-decoration: line-through;">'+item.name_c+'</span>';
		}
		console.log(item.name);
		enc_name = item.name_c;
		var last_log = timeConverter(item.last_log_on);
		items = items+'<tr  id="'+item.steam_id64+'"><td  class="tpButton" '+'ip="'+item.real_ip+'" flag="'+item.flag+'"><a href="#">'+enc_name+'</a></td><td>'+last_log+'</td><td><a href="http://steamcommunity.com/profiles/'+item.steam_id64+'" target="_blank">'+item.steam_id64+'</a></td></tr>';
		uni = item.steam_id64;
		//alert("all done");
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
	//console.log("are we touching this ? "+tpButton);
	console.log("clicked data table");	
		//alert($('we have an id set and data'+ '#user-id').text());			
        var href = $(this).closest('tr').attr("id");
		console.log(href); 
		//alert (href);       
	    var ip = $("#"+href).find("td:eq(0)").attr("ip");
	    console.log( "ip should be "+ip);
	    var user = $("#"+href).find("td:first").text();
	    var login = $("#"+href).find("td:eq(0)").attr("flag");
	    var url = $('#sendcmd').attr('action')+"?action=search&type=id&text="+href;
			console.log(url);
			console.log("login should be "+login);
			console.log("href is "+href);	
        if(href) {
			if(href == 'undefined') {
				//alert('can not ban an unknown user');
				$('#error_action').text('Invalid User');
				$('#error_text').html('You can not view an unknown user<br>This maybe a bot or a user that is curently unknown');
				$('#error').modal('show');
				return ;
			}
				
			$.ajax({
				type: 'GET',
				url: url,
				//data: sndData,
				//cache: false,
				dataType: "json",
				//contentType: false,
				//processData: false,
				success:function(data){
					var noe = data.data.length;
					if(typeof noe == 'undefined') {
						console.log('no history via noe');
						//no_history = true;
					}
					else {
						console.log("found "+noe+" records");
					}	
					//$('#editor').hide();
					players = data.data;
					$.each(players, function(i, item) {
						if (item.server_name == null) {
							console.log ("no longer with us");
							//return true;
						}
						else {
							console.log(item.server_name+" is valid");
							var timestamp =  timeConverter(item.last_play);
							//return(myDate.toLocaleString());
							gdetail += "<tr><td>"+item.server_name+"</td><td style='text-align:right;padding-right:7%;'>"+item.log_ons+"</td><td>"+timestamp+"</td><td style='padding-left:4%;'>"+item.game_time+"</td></tr>";
							
							
						}	
						//console.log(item.name_c);
						man=item.name_c;
						
					});
					gdetail += "<tr><td ><h6  class='card-title' style='padding:0;'>Overall Time on Line</h6></td><td style='padding-right:6.5%;text-align:right;' colspan=3>"+data.time_on_line+"</td></tr>";
					console.log(data);
					//console.log(man);
					gen_data =players[0];
					if(typeof data.data.error == 'undefined') {
											
					 if (gen_data.banned == 1) {
						gendetail += '<tr><td>User Status</td><td><span style="color:red;">Banned </span><span style="padding-right:20%;float:right;">Reason '+gen_data.reason+'</span></td></tr>';
					}
					
					gendetail +="<tr><td>Steam Id</td><td>"+gen_data.steam_id2+"</td></tr>";
					gendetail +='<tr><td>Steam Profile</td><td><a href=http://steamcommunity.com/profiles/'+gen_data.steam_id64+' target="_blank">'+gen_data.steam_id64+'</a></td></tr>';
					gendetail += '<tr><td>Country</td><td>'+gen_data.country+'<img style="padding-left:5%; width:11%"  src="'+gen_data.flag+'"></td></tr>'
					gendetail += "<tr><td>Last Known IP</td><td>"+gen_data.real_ip+"</td></tr>";
					first_log_on =  timeConverter(gen_data.first_log_on);
					gendetail +="<tr><td>First Log on</td><td>"+first_log_on+"</td></tr>";
					first_log_on =  timeConverter(gen_data.last_log_on);
					gendetail +="<tr><td>Last Log on</td><td>"+first_log_on+"</td></tr>";
					gendetail += "<tr><td>Total Log ons</td><td>"+gen_data.total_log_ons+"</td></tr>";
					
					console.log(gen_data);
					//gendetail +="<tr><td>Overall Time on Line</td><td>"+data.time_on_line+"</td></tr>";
					aka = gen_data.aka;
					if (aka != null){
						//alert("first run "+aka);
						aka = aka.replace(/,\s*$/, "");
						//aka = JSON.parse('"'+aka+'"');
						gendetail +="<tr><td>Played as</td><td>"+aka+"</td></tr>";
					}
					}
					else {
						gendetail ='<tr><td>no data found for this user</td></tr>';
					}
				},
				 complete:function(data){
					//setTimeout(index(url),7000);
					//console.log("complete "+man);
					//console.log(gendetail);
					$("#gd1").html(gdetail);
					$("#gen").html(gendetail);
					//$('#cflag').attr('src',login)
					$('#un').html(user)
					$('#results').hide();	
					$('#editor').show();
					$('#searchbox').hide();
				}
				
			});	
			//console.log("end name set to "+man);
			
        	$('#name').attr('value',user)
			//$('#ip').attr('value',ip)
			//un = un+" !";
			$('#un').html(user)
			$('#steam_id').attr('text',href)
			//$('#ipb').attr('value',ip)
			$('#steam_idb').attr('value',href)
			
		}
		$('#results').hide();	
		$('#editor').show();
		console.log("done");
		get_steam_data(href);
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
     // Convert an hours component of "0" to "12"
    
  //hour = ( currentHours == 0 ) ? 12 : currentHours;
 
  //var date = dateOrdinal(date);
  var d = a.getDate();
	var d1 =a.getHours();
//console.log(currentHours);
var d = ('0'+d).slice(-2);
	var m = a.getMonth()+1;
var m = ('0'+m).slice(-2);

var hour =('0'+hour).slice(-2);
        //m += 1;  // JavaScript months are 0-11
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
                $('#editor').hide();
                $('#searchbox').show();
                $('#results').show();
                //$('#text').val("");
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
    // code block
    $("#text").attr('placeholder','Enter User Name');
    break;
  case 'id':
    // code block
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
	$("#editor").show();
	players = data.text;
	console.log(url);
		$.ajax({
				type: 'GET',
				url: url,
				//data: sndData,
				//cache: false,
				dataType: "json",
				//contentType: false,
				//processData: false,
				success:function(data){
					var noe = data.data.length;
					if(typeof noe == 'undefined') {
						console.log('no history via noe');
						//no_history = true;
					}
					else {
						console.log("found "+noe+" records");
					}	
					//$('#editor').hide();
					players = data.data;
					
					$.each(players, function(i, item) {
						if (item.server_name == null) {
							console.log ("no longer with us");
							//return true;
						}
						else {
							console.log(item.server_name+" is valid");
							
							var timestamp =  timeConverter(item.last_play);
							//return(myDate.toLocaleString());
							gdetail += "<tr><td>"+item.server_name+"</td><td style='text-align:right;padding-right:7%;'>"+item.log_ons+"</td><td>"+timestamp+"</td><td style='padding-left:4%;'>"+item.game_time+"</td></tr>";
							
							
						}	
						//console.log(item.name_c);
						man=item.name_c;
						
					});
					gdetail += "<tr><td  class='card-title'><h6  class='card-title' style='padding:0;'>Overall Time on Line</h6></td><td style='padding-right:6.5%;text-align:right;' colspan=3>"+data.time_on_line+"</td></tr>";
					console.log(data);
					//console.log(man);
					gen_data = players[0];
					user = JSON.parse('"'+gen_data.name_c+'"');
					if(typeof data.data.error == 'undefined') {
											
					 if (gen_data.banned == 1) {
						gendetail += '<tr><td>User Status</td><td><span style="color:red;">Banned </span><span style="padding-right:20%;float:right;">Reason '+gen_data.reason+'</span></td></tr>';
					}
					
					gendetail +="<tr><td>Steam Id</td><td>"+gen_data.steam_id2+"</td></tr>";
					gendetail +='<tr><td>Steam Profile</td><td><a href=http://steamcommunity.com/profiles/'+gen_data.steam_id64+' target="_blank">'+gen_data.steam_id64+'</a></td></tr>';
					gendetail += '<tr><td>Country</td><td>'+gen_data.country+'<img style="padding-left:5%;width:11%;"  src="'+gen_data.flag+'"></td></tr>'
					gendetail += "<tr><td>Last Known IP</td><td>"+gen_data.real_ip+"</td></tr>";
					first_log_on =  timeConverter(gen_data.first_log_on);
					gendetail +="<tr><td>First Log on</td><td>"+first_log_on+"</td></tr>";
					first_log_on =  timeConverter(gen_data.last_log_on);
					gendetail +="<tr><td>Latest Log on</td><td>"+first_log_on+"</td></tr>";
					//gendetail +="<tr><td>Overall Time on Line</td><td>"+data.time_on_line+"</td></tr>";
					aka = gen_data.aka;
					if (aka != null){
						//alert(aka);
						aka = aka.replace(/,\s*$/, "");
						//aka = JSON.parse('"'+aka+'"');
						gendetail +="<tr><td>Played as</td><td>"+aka+"</td></tr>";
					}
					//gendetail +="<tr><td>Played as</td><td>"+aka+"</td></tr>";
					}
					else {
						gendetail ='<tr><td>no data found for this user</td></tr>';
					}
				},
				 complete:function(data){
					//setTimeout(index(url),7000);
					//console.log("complete "+man);
					console.log(gen_data);
					console.log(user);
					$("#gd1").html(gdetail);
					$("#gen").html(gendetail);
					//$('#cflag').attr('src',login)
					$('#un').html(user)
					$('#results').hide();	
					$('#editor').show();
					$('#searchbox').hide();
					get_steam_data(userID);
				}
				
			});
	}			
function get_steam_data(user_id) {
	//alert(user_id);
	 var url = "steampage.php?id="+user_id;
	 //alert(window.location.href);
	 //alert (url);
	 $.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success:function(data){
			console.log(data);
			//alert ("success");
			if (data.frame !== undefined) {
				console.log("framed image");
				$("#user-frame").attr("src",data.frame);
				$("#user-frame").show();
			}
			$("#user-avatar").attr("src",data.avatar);	
			$('#dta').append('<tr><td>Steam Status</td><td>'+data.status+'</td></tr>');
		},
		complete:function(data){
			//alert("complete");
			//alert(data);
			//console.log(data);		
		}
				
	});
}			
	

