
function copyDivToClipboard() {
	var range = document.createRange();
	range.selectNode(document.getElementById("vcmd"));
	window.getSelection().removeAllRanges(); // clear current selection
	window.getSelection().addRange(range); // to select text
	document.execCommand("copy");
	window.getSelection().removeAllRanges();// to deselect
}

$("input[type='checkbox']").change(function() {
	expression = ($(this).attr('id'));
	if ($( "input[name^='map']" )) {return;}
	switch(expression) {
		case 'disable-server':
		case 'delete-server':
			chkvalue = $(this).val();
				if(this.checked) {
					$(this).val("0");
					$("#dis-text").val("0");
				}
				else {
					$(this).val("1");
					$("#dis-text").val("1");
				}
				return;
				break
		default:
			if(this.checked) {
				//Do stuff
			}
			else {
				cmd =$("#scmd").val();
				original = $(this).attr("orig");
				original = $.trim(original);
				cmd = cmd.replace(original+" ","");
				$("#vcmd").text(cmd);
				$(this).closest('tr').remove();
				$("#scmd").val(cmd);
			}
	}
});

$("input[type='text']").change(function() {
    expression = ($(this).attr('id'));
    cmd = $("#scmd").val();
    newopt = $(this).attr("option")+" "+$(this).val();
    original = $(this).attr("orig");
	original = $.trim(original);
	option = $(this).attr('option');
	change = $("#changes").val();
    switch(expression) {
		case 'scmd':
		case 'onew':
			return;
		case 'ohostname':
			alert ("host name change");
			if ($(this).val() === "") {
				$(this).attr("orig","not set");
				cmd = cmd.replace(" "+original,"");
				$("#scmd").val(cmd);
				newline = cmd.replace(newopt,'"'+newopt+'"'); 
				$("#vcmd").text(newline);
				return;
			}	
	    		
			if (original === "not set") {
				cmd = cmd.replace("+map",newopt+" +map");
			}
			else {
				cmd = cmd.replace(original,newopt);
			}
			
			$(this).attr("orig",newopt)
			$("#scmd").val(cmd);
			newline = cmd.replace($(this).val(),'"'+$(this).val()+'"'); 
			$("#vcmd").text(newline);
			if($("#changes").val() =='nothing') {
				$("#changes").val(option);
			}
			else {
				added = change.replace(option,'');
				added = $.trim(added);
				added = added+','+option;
				chr =added.charAt(0); // check for comma 
				if (chr == ",") {
					added = added.substring(1, added.length);
				}
				$("#changes").val(added);
			}	
		break;
		
		default:
		// code block
		if($(this).val() == '') {
			// remove the option
			cmd = cmd.replace(original+" ","");
			$("#vcmd").text(cmd);
			$("#scmd").val(cmd);
			added = change.replace(option,'');
			chr =added.charAt(0);
			if (chr == ",") {
				added = added.substring(1, added.length);
			}
			$("#changes").val(added);
			$(this).closest('tr').remove();
			
		}
		else {
			// update the option
			cmd = cmd.replace(original+" ",newopt+" ");
			$(this).attr("orig",newopt)
			$("#scmd").val(cmd);
			$("#vcmd").text(cmd);
			if($("#changes").val() =='nothing') {
				$("#changes").val(option);
			}	
			else {
				added = change.replace(option,'');
				added = $.trim(added);
				added = added+','+option;
				chr =added.charAt(0); // check for comma 
				if (chr == ",") {
					added = added.substring(1, added.length);
				}
				$("#changes").val(added);
			}
		}
	}
});


 $('#file-list').change (function ()
    {
		
		flist="";
		szt=0;
        for (var i = 0; i < this.files.length; i++)
        {
			sz = formatBytes(this.files[i].size)
            //alert(sz);
            szt +=this.files[i].size;
            flist +="<tr><td>"+ this.files[i].name+"</td><td style='text-align:right;'>"+sz+"</td></tr>";
        }
        if(flist !== "") {
			sztf = formatBytes(szt);
			flist = "<h6 class='card-title'>Files to upload</h6><table>"+flist;
			flist += "<tr><td class='card-title'>Total size of upload</td><td class='card-title' style='text-align:right;'>"+sztf+"</td></tr>";
			flist += "<tr><td colspan=2>	Add to all available servers ? <input name='all_servers' type='checkbox' id='all-servers'></td></tr>";
			flist+= "<tr><td colspan=2>"+sztf+ " used out of  "+ maxFilesize+"</td></tr>"
			flist += '<tr><td><button class="btn btn-primary" style="margin-top:7%;" type ="submit "><i class="fa fa-cloud-upload"></i> Upload Map Files</button></td></tr></table>';
		}
		
        $("#f-list").html(flist);
        
    });
    
$('#fileview').change(function(){
   console.log ("fileview changed");
   //alert ($('#fileview').val());
});

$('#files').change(function(){
	//selected_value = $('#files').val();
	selected_value = $('#files').find(":selected").val();
	console.log("triggerd change");
	//alert (selected_value);
	var sendurl = url+"/api.php?action=get_file&cmd=view&n="+selected_value;
	console.log(sendurl);
	//return;
	$.ajax({
		type: 'GET',
		url: sendurl,
		dataType: 'text',
		success: function(data) {
			//alert(data);
			$("#fileview").val(data);
			$('#fileview').scrollTop(0);    
		}
	});
});

$("#cnew").click(function() {
	cmd =$("#scmd").val();
	cmd = $.trim(cmd);
	orig = $("#onew").val();
	prefix = orig.charAt(0) ;
	if ((prefix !== "+" ) && (prefix !== "-"))  {
		alert("all options must start with either a + or - sign\n - for command line otions + for CVARS")
		return;
	}
	var [option, value] = orig.split(" ");
	optionid = option.substring(1, option.length);
	alert(optionid);
	if(typeof value != 'undefined'){
		html = "<tr id='tr-"+optionid+"'><td>"+optionid+"</td><td></td><td><input type='text' id='o"+optionid+"' option='"+option+"' orig='"+option+"' value='"+value+"'></td><td></td><td>no help</td></tr>";
		cmd = cmd+" "+option+" "+value;
		$("#vcmd").text(cmd);
	}
	else{
		html = "<tr id='tr-"+optionid+"'><td>"+optionid+"</td><td></td><td><input type='checkbox' id='o"+optionid+"' option='"+option+"' orig='"+option+"' checked></td><td></td><td>no help</td></tr>";
		value=""; // stop undefined later
		cmd = cmd+" "+option;
	}
	$("#scmd").val(cmd);
	if ($("#ohostname").val()) {
		hoption = $("#ohostname").val();
		newhopt = '"'+hoption+'"';
		test = cmd.replace(hoption,newhopt)
		$("#vcmd").text(test);
	}
	else {
		$("#vcmd").text(cmd);
	}
	var row = $(this).closest('tr');
	var row_index = $(row).index();
	$('#options-table > tbody > tr').eq(row_index).before(html); //adds new row
	$("#onew").val('');
	$("#changes").val = $("#changes").val+','+option;
});  

$('#disable-server').submit(function(e) {
	alert("we are here");
	e.preventDefault();
	url +="/"+$(this).attr('action');
	var formValues = $(this).serialize();
	console.log( $(this).attr('action'));
	$.ajax({
		type: $(this).attr('method'),
		url: url,
		data: formValues,
		dataType: 'json',
		success: function(data) {
			console.clear();
			console.log (data); 
			alert (data[0]);   
			$('#disable-response').html(data[0]);
			$("#disable-response").show();
			$('#disable-response').delay(3000).fadeOut('slow');
		}
	});
});

$('select').on('change', function() {
	id =$(this).attr("id");
	if (id == "files") {return;}
	option = $(this).attr("option");
	newid = option.substring(1, option.length);
	newopt = $(this).val();
	newopt = option+" "+newopt;
	full = $(this).attr('orig');
	cmd = $("#scmd").val();
	vcmd = $("#vcmd").text();
	switch (option){
		case "+map":
			full = $(this).attr("option");
			full = full+" "+$("#o"+newid).val();
			cmd = cmd.replace(full,newopt);
			vcmd = vcmd.replace(full,newopt);
			$("#o"+newid).val($(this).val());
			break;
		default:
			cmd = cmd.replace(full,newopt);
			vcmd = vcmd.replace(full,newopt);
			//alert ("vcmd = "+vcmd);
			$(this).attr("orig",newopt);
	}
	$("#scmd").val(cmd);
	$("#vcmd").text(vcmd);
});


$('#save-file').click(function() {
	console.log("saving file");
	selected_value = $('#files').val();
	console.log(selected_value);
	var sendurl = "helpers/settings.php";
	file = $('#fileview').val();
	//alert(file);
	console.log(sendurl);
    $.ajax({
		type: 'POST',
		url: sendurl,
		dataType: 'text',
		data: { 'import': file,
		'action': 'get_file' ,
		'cmd': 'save' ,
		'n': selected_value },
		success: function(data) {
			console.log(data);
			//alert("data back"+data);
			$("#fileview").text(data);
			var $textarea = $('#fileview');
			$textarea.scrollTop(0);
			sendurl='';    
		}
	});
}); 

$('#map-update').on('submit', function(e) {
	e.preventDefault();
	murl = $(this).attr('action');
	var formValues = $(this).serialize();
	$.ajax({
		type: $(this).attr('method'),
		url: murl,
		dataType: "json",
		data: formValues,
		success: function(data) {
			 nc =  $("table input[type=checkbox]:checked").length-1;
			 $("#cycle-count").html(nc);;
			$("#map-response").html(data);
			$("#map-response").show();
			$('#map-response').delay(3000).fadeOut(1000); 

		}
	});
});

 function checkTotalCheckedBoxes(){
	   var checked = 0;
$("#table-wrapper" ).each(function( ) {
  if(this.children.length === 3){ 

	$(this.children).each(function() {
        this.checked ? checked++ : null;      
        $("input[name="+this.name+"]").parent().siblings().closest('.totalchecked')[0].innerText = (checked) + " selected"; 

  	    });
  }
});
alert (checked);
return checked;
}     
$("input[type='checkbox']").on('change', function() {
//$(document).on('change', 'checkbox', function() {
	oid = this.id;
	 if(this.checked) {
      console.log ("checkbox is checked");
    }
    else {
		console.log ("unchecked");
		trid = $(this).closest('tr').attr('id'); 
		 original = $(this).attr("orig");
		 vcmd = $("#vcmd").text();
		 cmd = $("#scmd").val();
		 alert(vcmd);
		 newopt='';
		 cmd = cmd.replace(original,newopt);
		 vcmd = vcmd.replace(original,newopt);
		 $("#"+trid).remove();
		 $("#scmd").val(cmd);
		 $("#vcmd").text(vcmd);
		 
	}
});
function onClickHandler(){
    var chk=document.getElementById("box").value;
	
    //use this value

}

$('#startcmd').on('submit', function(e) {
	e.preventDefault();
	
	url +="/"+$(this).attr('action');
	alert(url);
	var formValues = $(this).serialize();
	$.ajax({
		type: $(this).attr('method'),
		url: url,
		data: formValues,
		success: function(data) {
		}
	});
});

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
