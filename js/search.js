// search.js
 $(document).ready(function() {
 //alert("change",false,"search.js loaded");
 //console.log("search.js");
 //console.log($("#ifrm", parent.document).attr('inframe'));
 var attr = $("#ifrm", parent.document).attr('inframe');
//alert("attr set to "+attr,true);
 if(typeof attr !== 'undefined' && attr !== false){
	 console.log("we need to show a list");
	 $("#text").val(attr);
	 //console.log($('#sendcmd input').serialize());
	 $('#ifrm', parent.document).attr("height", "60vh");
	$("#ifrm", parent.document).height("60vh"); 
	$('#ifrm', parent.document).attr("width", "100%");
	$("#ifrm", parent.document).width("100%");
	$('#frame-dialog', parent.document).css('maxWidth','71vw');
	$('#frame-title', parent.document).html('Search Results');
	$('#results').show();
	$('#searchbox').hide();
	$('#sendcmd').submit();
	 return;
 }
 
	if ($('#user-id').is(':empty')){
		$('#ifrm', parent.document).attr("height", "26vh");
		$("#ifrm", parent.document).height("26vh"); 
		$('#ifrm', parent.document).attr("width", "100%");
		$("#ifrm", parent.document).width("100%");
		$('#frame-dialog', parent.document).css('maxWidth','40vw');
		$("#searchbox").show();
		return;
	}
     var userID = $('#user-id').text();
     value = "id";
     $("input[name=type][value=" + value + "]").prop('checked', true);
     $('#text').val(userID);
     $('#sendcmd').submit();
     displayData(userID);
	return;
});
$('#sendcmd').on('submit', function(e) {
    e.preventDefault();
    var items='';
    var url = $(this).attr('action');
    console.log("this is the url "+url);
     $("#data_table").html(items);
    var sndData = $('#sendcmd input').serialize();
    console.log("what's this "+sndData);
    returndata = $("#text").val();
    console.log("full url " +returndata);
     $.ajax({
    type: $(this).attr('method'),
    url: $(this).attr('action'),
    data: sndData,
    async: false,
    dataType: "json",
    success:  function(data){
		var noe = data.data.length;
		console.log(noe);
		if (typeof(noe) == 'undefined') {
			$('#results').hide();
			//$('#error_action').text('Invalid Search');
			//$('#error_text').html('Can not find '+data.text);
			//$('#error').modal('show');
			if(data.lookfor == 'fuzzy') { data.lookfor = "User Name";}
			alert('Can not find '+data.text,false,"Invalid "+data.lookfor+" Search");
			return;
		}
        var uni= '';
        players = data.data;
        console.log("player length "+players.length);
        if (players.length == 1) {
			// just go to it
			
			href = players[0].steam_id64
			url = "frame.php?frame=user_frame&id="+href;
			//alert(url,true);
			$('#frame-dialog', parent.document).css('maxWidth','83%');
			$('#ifrm', parent.document).attr("height", "80vh");
			$("#ifrm", parent.document).height("80vh"); 
			$('#ifrm', parent.document).attr("width", "100%");
			$("#ifrm", parent.document).width("100%");
			$("#ifrm", parent.document).attr('src',url);
			$('#frame-title', parent.document).html('Details for '+players[0].name_c);
			//$("#ifrm", parent.document).attr('inframe',$("#text").val(attr));
			$("#ifrm", parent.document). removeAttr(inframe); 
			return;
		} 
		console.log(players);
		$("#ifrm", parent.document).attr('inframe',$("#text").val());
		
        items = '<thead><th  style="width:25%;">User</th><th>Last Log On</th><th>Profile Link</th></thead>';
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
			//alert("user-id is empty",true);
			
			$('#ifrm', parent.document).attr("height", "60vh");
			$("#ifrm", parent.document).height("60vh"); 
			$('#ifrm', parent.document).attr("width", "100%");
			$("#ifrm", parent.document).width("100%");
			$('#frame-dialog', parent.document).css('maxWidth','71vw');
			$('#frame-title', parent.document).html('Search Results');
			$('#results').show();
			$('#searchbox').hide();
		}
        //console.log(data);
	}
	});
 });
 $('#sendcmd').change(function(){
	selected_value = $("input[name='type']:checked").val();
	console.log(selected_value);
		switch(selected_value) {
			case 'fuzzy':
				$("#text").attr('placeholder','Enter User Name');
				break;
			case 'id':
				$("#text").attr('placeholder','Enter Steam ID in any format');
				break;
			default:
				$("#text").attr('placeholder','Enter valid IPv4 ');
		}
});
$( "#go_back" ).click (function() {
	console.log("button pressed search.js");
	$('#ifrm', parent.document).attr("height", "26vh");
	$("#ifrm", parent.document).height("26vh"); 
	var attr = $("#ifrm", parent.document).attr('inframe');
	if(typeof attr !== 'undefined' && attr !== false){$("#ifrm", parent.document). removeAttr('inframe');} 
	$('#ifrm', parent.document).attr("width", "100%");
	$("#ifrm", parent.document).width("100%");
	$('#frame-dialog', parent.document).css('maxWidth','40vw');
	$('#frame-title', parent.document).html('Search');
	$("#searchbox").show();
	$("#results").hide();
});
$('#data_table').on('click','.tpButton', function(event) {
	console.log("clicked data table");	
	var href = $(this).closest('tr').attr("id");
	console.log(href); 
	var ip = $("#"+href).find("td:eq(0)").attr("ip");
	var user = $("#"+href).find("td:first").text();
	var login = $("#"+href).find("td:eq(0)").attr("flag");
	//var url = $('#sendcmd').attr('action')+"?action=search&type=id&text="+href;
	url = "frame.php?frame=user_frame&id="+href;
	//alert(url,true);
	$('#frame-dialog', parent.document).css('maxWidth','83%');
	$('#ifrm', parent.document).attr("height", "80vh");
	$("#ifrm", parent.document).height("80vh"); 
	$('#ifrm', parent.document).attr("width", "100%");
	$("#ifrm", parent.document).width("100%");
	$("#ifrm", parent.document).attr('src',url);
	//$("#ifrm", parent.document).attr('inframe',url);
	
});