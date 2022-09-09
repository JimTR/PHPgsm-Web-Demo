var gdetail='';
	var gendetail ='';
	var item='';
 $(document).ready(function() {
     console.log('hit this');
    
	});
	$('#sendcmd').on('submit', function(e) {
    e.preventDefault();
    var items='';
    var url = $(this).attr('action');
    $("#data_table").html(items);
    var sndData = $('#sendcmd input').serialize();
    console.log(sndData);
    $.ajax({
    type: $(this).attr('method'),
    url: $(this).attr('action'),
    data: sndData,
    //cache: false,
    dataType: "json",
    //contentType: false,
    //processData: false,
    success:  function(data){
		var noe = data.data.length;
		$('#editor').hide();
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
			item.name = '<span style="text-decoration: line-through;">'+item.name+'</span>';
		}
		var last_log = timeConverter(item.last_log_on);
		items = items+'<tr  id="'+item.steam_id64+'"><td  class="tpButton" '+'ip="'+item.real_ip+'" flag="'+item.flag+'"><a href="#">'+item.name+'</a></td><td>'+last_log+'</td><td><a href="http://steamcommunity.com/profiles/'+item.steam_id64+'" target="_blank">'+item.steam_id64+'</a></td></tr>';
		uni = item.steam_id64;
		
		});
$("#data_table").html(items);
$('#results').show();
        console.log(data);
        }
    });
});
$('#data_table').on('click','.tpButton', function(event) {
	console.log("clicked data table");				
        var href = $(this).closest('tr').attr("id");
		console.log(href);        
	    var ip = $("#"+href).find("td:eq(0)").attr("ip");
	    console.log( "ip should be "+ip);
	    var user = $("#"+href).find("td:first").text();
	    var login = $("#"+href).find("td:eq(0)").attr("flag");
	    var url = $('#sendcmd').attr('action')+"?action=search&type=id&text="+href;
			console.log(url);
			console.log("login should be "+login);	
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
							gdetail += "<tr><td>"+item.server_name+"</td><td style='text-align:right;padding-right:16%;'>"+item.log_ons+"</td><td>"+timestamp+"</td></tr>";
							
							
						}	
						//console.log(item.name_c);
						man=item.name_c;
						
					});
					console.log(data);
					//console.log(man);
					gen_data =players[0];
					if(typeof data.data.error == 'undefined') {
											
					 if (gen_data.banned == 1) {
						gendetail += '<tr><td>User Status</td><td><span style="color:red;">Banned </span><span style="padding-right:20%;float:right;">Reason '+gen_data.reason+'</span></td></tr>';
					}
					gendetail += '<tr><td>Country</td><td>'+gen_data.country+'<img style="padding-left:5%;"  src="'+gen_data.flag+'"></td></tr>'
					gendetail += "<tr><td>Last Known IP</td><td>"+gen_data.real_ip+"</td></tr>";
					first_log_on =  timeConverter(gen_data.first_log_on);
					gendetail +="<tr><td>First Log on</td><td>"+first_log_on+"</td></tr>";
					first_log_on =  timeConverter(gen_data.last_log_on);
					gendetail +="<tr><td>Latest Log on</td><td>"+first_log_on+"</td></tr>";
					gendetail +="<tr><td>Steam Id</td><td>"+gen_data.steam_id2+"</td></tr>";
					gendetail +="<tr><td>Steam Id (old)</td><td>"+gen_data.steam_id+"</td></tr>";
					gendetail +='<tr><td>Steam Profile</td><td><a href=http://steamcommunity.com/profiles/'+gen_data.steam_id64+' target="_blank">'+gen_data.steam_id64+'</a></td></tr>';
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
                console.log("go back");
                $('#editor').hide();
                $('#searchbox').show();
                $('#results').show();
                //$('#text').val("");
                $("#gd1").empty();
				$("#gen").empty();
				gendetail="";
				gdetail="";
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
