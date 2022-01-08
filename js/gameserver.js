// gameserver.js
function get_game() {
cmd = url+'/ajax_send.php?url='+url+'/ajaxv2.php&query=action=game_detail:server='+server+':filter='+game;
//alert (cmd);
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
            console.log('got data - game_detail');
            //alert ('success game_detail')
        },
        complete:function(data){
			var general = data.responseJSON.general;
			var serverd = data.responseJSON.server;
			//console.log(general);
			//console.log(serverd);
			$('#mem').text(serverd.mem+"%");
			$('#cpu').text(serverd.cpu+"%");
			$('#gametags').text(serverd.GameTags);
			$('#hostname').text(serverd.HostName);
			$('#map').text(serverd.Map);
			$('#players').text(serverd.Players-serverd.Bots);
			$('#bots').text(serverd.Bots);
		}
    });
}