		var a_href=0;
		var url='';
		var id='';
		var path='';
		var type='Source';
		var host= '';
			$(document).ready(function() {
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
	rows = 0;
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
items = items+'<tr id="'+item.steam_id+'"style="width:100%;"><td class="tpButton">'+item.Name+'</td><td id="'+item.ip+'"><img class="flag" '+item.flag+'/>'+item.country+'</td><td>'+item.Frags+'</td><td>'+item.TimeF+'</td></tr>';
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
// $('tr').click(function() {
	//alert( $('#players_table tr').length )
	    //event.preventDefault();
        var href = $(this).closest('tr').attr("id");
	    var ip =$ ("#"+href).find("td:eq(1)").attr("id");
	    //var user =$(this).text;
	    var user = $("#"+href).find("td:first").text();
	   // alert(ip);
	
        if(href) {
         //alert('ban user '+href+'  '+user+' '+ip+' ?' );
			 //dialog.dialog( "open" );
			//$("input.name").val(user)
			$('#name').attr('value',user)
			$('#ip').attr('value',ip)
			$('#steam_id').attr('value',href)
			$("#create-user").click();
			//$('#ex1').modal();
       }
	 console.log( "click players");
    });
$("#player td").click(function() {
     alert($(this).html());
     });
				
		// var dialog, form;	
		 $( function(){
           var dialog, form, 
                // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
                emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                name = $( "#name" ),
                email = $( "#ip" ),
                steam_id  = $( "#steam_id" ),
                period = $( "#period" ),
                kick = $( "#kick" ),
                allFields = $( [] ).add( name ).add( email ).add( steam_id ).add( period ).add( kick ),
                tips = $( ".validateTips" );
                function updateTips( t ) {
                    tips
                    .text( t )
                    .addClass( "ui-state-highlight" );
                        setTimeout(function() {
                        tips.removeClass( "ui-state-highlight", 1500 );
                    }, 500 );
                }

                   

               
                function ban_user() {
					var ban_cmd  = "addip "+$("#period").val()+" "+$("#ip").val();
					$("#text").val(ban_cmd);
                   // alert($('form').serialize());
					
					var txt  =$( 'form' ).serializeArray();
					console.log( "txt = "+txt );
					//txt[0].text "new string";
					//alert(txt..serialize());
                    dialog.dialog( "close" );
					//alert('we need to set the correct options here');
					$('#sendcmd').submit();
                 }
                dialog = jQuery( "#dialog-form" ).dialog({
                    autoOpen: false,
                    height: 340,
                    width: 375,
                    modal: true,
                    buttons: {
                    "Ban User": ban_user,
                    Cancel: function() {
                        dialog.dialog( "close" );
                    }
              },
                close: function() {
                    form[ 0 ].reset();
                    allFields.removeClass( "ui-state-error" );
                }
            });

            form = dialog.find( "form" ).on( "submit", function( event ) {
                event.preventDefault();
                alert ("event triggered");
                //addUser();
            });

            $( "#create-user" ).button().on( "click", function() {
                dialog.dialog( "open" );
            });

        });
			});


