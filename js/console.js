		var a_href=0;
		var url='';
		var id='';
		var path='';
		var type='Source';
		var host= '';
		$(document).ready(function() {
			console.log('hit this');
			$( "#buttonr" ).click(function() {
			$("#buttonr").blur();   
			$("#rules").toggle();
			
		});
			$("#quick").click(function() {
				$("#extended").toggle();
			});
			$("#extended_close").click(function() {
				$("#extended").toggle();
			});	
			$("#rules").click(function() {
				console.log ("click rules");
				$("#rules").toggle();
			});	
			
				$("#servers").change(function(){
				if(!typeof(logi) == 'undefined') {	
				clearInterval(logi); // stop old stuff
				clearInterval(playi);
				}
				 url = this.value;
				 id = $(this).children(":selected").attr("id");	
				 path = $(this).children(":selected").attr("path");
				host = $(this).children(":selected").attr("host");
				port =$(this).children(":selected").attr("port");	
			   	console.log('going for fetch');	
				fetchlog(port,id,url);
				logi = setInterval(fetchlog, 5000);
				players(port,id,url);	
				playi = setInterval(players, 7000);	
					console.log('logi '+logi+' playi '+playi);
					 var element = document.getElementById("log");
     				element.scrollTop = element.scrollHeight;
					console.log('ht = '+element.scrollTop);
					var currentId = url;
					console.log(url);
					$('#sendcmd').attr('action',url+ '/ajaxv2.php');
					$('#server').attr('value',id);
					//setTimeout(function() { startTimer(parm1); }, startInterval);
					 //a_href = setTimeout(FetchLog, 1000);
					//var sc = $('#log').scrollHeight();
					//$('#log').scrollTop = $('#log').height();
					 var element = document.getElementById("log");
     				element.scrollTop = element.scrollHeight;
					console.log('top = '+element.scrollTop);
					//FetchPlayers();
					//a_href = setTimeout(function(){FetchLog(url,id,path);},1000);
					//console.log('in change '+currentId);
			// 1st
    // do your code here
    // When your element is already rendered
});
			
			$( "#close" ).click(function() {
  //alert( "Handler for .click() called." );
			$("#rules").toggle();
});
		
function fetchlog() {
	//alert(port+' '+id+' '+url);
	rows = 100;
	cmd = url+'/ajax_send.php?url='+url+'/ajaxv21.php&query=action=console:server='+id+':rows='+rows;
	//alert (cmd);
	var items='';
         //console.log(cmd);
          $.ajax({
			
        type: 'GET',
        url: cmd,
        dataType: "json",
			    statusCode: {
        500: function() {
          alert("Script exhausted");
			return;
        }
      },
        success: function (data) {
                        console.log('got data - fetchlog');


        },
        complete:function(data){
                         console.log(data);
$.each(data.responseJSON, function(i, item) {
   // alert(item);
items = items+item;
});
			var element = document.getElementById("log");
			if (element.scrollHeight - element.scrollTop === element.clientHeight)
    		{
				var bottom = true;
			}
			else {
				var bottom =false;
			}
$("#log").html(items);
			       if (bottom == true) {
     				element.scrollTop = element.scrollHeight;
					console.log('top = '+element.scrollTop);
				   }
                }
    });

};
function players() {
	 //get player functions
	//alert ('Players ! '+url+' '+id);
        var items='';
		var cerror=false;
	cmd = url+'/ajax_send.php?url='+url+'/ajaxv2.php&query=action=viewserver:id='+id;
	
         //console.log(cmd);
          $.ajax({
			      statusCode: {
        500: function() {
         console.log("Script exhausted");
        }
      },
		type: 'GET',
        url: cmd,
        dataType: "json",
        success: function (data) {
                       console.log('got data - viewplayers');
					 //info = data.responseJSON.info;
             		//console.log('current data - '+info);	

        },
        complete:function(data){
                       // console.log(data);
						
                        info = data.responseJSON.info;
                        player = data.responseJSON.players;
			             if(typeof(info.Map) == 'undefined') {
				  			console.log('no map !');
				  			return 0;
			  			}
						else {
							$('#player_title').html('Current Map&nbsp;'+info.Map);
						}
						if(typeof(player) == "null") { 
							console.log('returning empty from players function');
   							 return 0;
						} 
						//pno = player.length;
						
                       
			
$.each(player, function(i, item) {
    //alert(item);
items = items+'<tr id="'+item.steam_id+'"style="width:100%;"><td class="tpButton">'+item.Name+'</td><td id="'+item.ip+'"><img class="flag" '+item.flag+'/><span style=padding-left:5%;">'+item.country+'</span></td><td>'+item.Frags+'</td><td>'+item.TimeF+'</td></tr>';
});
$("#pbody").html(items);
//items='<div style="width:100%;position:relative;text-align:center;top:5;">Current Rule Set</div><br>';
			items='';
			 rules = data.responseJSON.rules;
$.each(rules, function(i, item2) {
    //alert(item);
items = items+'<div style="clear:both;padding:5px;"><div style="padding-right:10px;width:30%;text-align:left;float:left;">'+i+'</div><div style="width:60%;clear:none;text-align:right;float:left;">'+item2+'</div></div>';
});
$("#rule").html(items);
                }
    });

};
$('#sendcmd').on('submit', function(e) {
        e.preventDefault();
        //alert('send command');
       console.log( $(this).attr('action'));
        
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            success: function(data) {
            
                $('#ajax-response').html(data);
                $("#ajax-response").show();
                $('#text').val(""); 
                $("#send").blur(); 
                $('#ajax-response').delay(3000).fadeOut('slow');
            }
        });

    });
$('#player').on('click','.tpButton', function(event) {				
        var href = $(this).closest('tr').attr("id");
	    var ip =$ ("#"+href).find("td:eq(1)").attr("id");
	    var user = $("#"+href).find("td:first").text();
	    	
        if(href) {
			if(href == 'undefined') {
				//alert('can not ban an unknown user');
				$('#error_action').text('Invalid User');
				$('#error_text').text('can not ban an unknown user or bot');
				$('#error').modal('show');
				return ;
				}
        	$('#name').attr('value',user)
			$('#ip').attr('value',ip)
			$('#steam_id').attr('value',href)
			$('#ban_user').modal('show');
		}
	 console.log( "click players");
	});

		            
                function ban_user() {
					var ban_cmd  = "addip "+$("#period").val()+" "+$("#ip").val();
					$("#text").val(ban_cmd);
                    //alert($('form').serialize());
					
					var txt = $( 'form' ).serializeArray();
					console.log( "txt = "+txt );
					
					$('#sendcmd').submit();
					$('#ban_user').modal('hide');
                 };
                 
             $( "#ban" ).click (function() {
                ban_user();
            });

        });
			
function selectOption(nr,element) {
    var select = $(element);
    if (select.children().length >= nr) {
        let value = select.find('option:eq(' + nr + ')').val();
        select.val(value).change();
	console.log(select.val(value));
    }
}



