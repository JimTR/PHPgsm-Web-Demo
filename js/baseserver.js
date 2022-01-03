 function base_servers(url) {
	 // bring back base_server detail
	  $.ajax({ 
        type: 'POST', 
        url: url, 
        dataType: "json", 
        success: function (data) {
	    var server_id = data.server_id; 
            //console.log(server_id);
            $('#boot').text(data.boot_time);
            $('#model').text(data.model_name);
            $('#processors').text(data.processors);
            $('#cores').text(data.cpu_cores);
            $('#speed').text(data.cpu_MHz);
            $('#load').text(data.load);
            $('#cache').text(data.cache_size);
            $('#ip').text(data.ips);
            $('#reboot').text(data.reboot);
            $('#boot_filesystem').text(data.root_filesystem);
            $('#boot_mount').text(data.root_mount);
            $('#boot_size').text(data.root_size);
            $('#boot_used').text(data.root_used+' ('+data.root_pc+')');
            $('#boot_free').text(data.root_free);
            $('#memtotal').text(data.MemTotal);
            $('#memfree').text(data.MemFree);
            $('#memcached').text(data.Cached);
            $('#memactive').text(data.MemAvailable);
            $('#swaptotal').text(data.SwapTotal);
            $('#swapfree').text(data.SwapFree); 
            // mem graphs
            var tmem =Math.round(100-(parseInt(data.MemFree_raw)/parseInt(data.MemTotal_raw))*100)
            //mem graph
            $('#tmem_pb').css('width',tmem+'%');
            $('#tmem_pbs').width($('#tmem_pb').parent().width());
            $("#tmem_pbs").html('Free ('+data.MemFree+')');
            changeClass( 'tmem_pb',tmem);
            //swap graph
            var smem = Math.round(100-(parseInt(data.SwapFree_raw)/parseInt(data.SwapTotal_raw))*100);
            $('#smem_pb').css('width',smem+'%');
            $("#smem_pbs").html('Free ('+data.SwapFree+')');
            $('#smem_pbs').width($('#smem_pb').parent().width());
            changeClass( 'smem_pb',smem);
            //end mem graphs
            $('#hname').text(data.host);
            $('#distro').text(data.os);
            $('#kernel').text(data.k_ver);
            $('#process').text(data.process);
            $('#php').text(data.php);
            $('#glibc').text(data.glibc);
            $('#screen').text(data.screen);
            $('#apache').text(data.apache);
            $('#mysql').text(data.mysql);
            $('#curl').text(data.curl);
            $('#nginx').text(data.nginx);
            $('#quota').text(data.quotav);
            $('#postfix').text(data.postfix);
             var x =  parseFloat(data.total_size_raw.toFixed(2))/1000000;
             var quota_pc = x* (100/parseFloat(data.quota));
             // game graph
            $("#gs_pb").attr('aria-valuenow',data.live_servers);
            $("#gs_pbs").text(data.live_servers+'/'+data.total_servers);
            $('#gs_pbs').width($('#gs_pb').parent().width());
            var gs_width = parseInt(data.live_servers) / parseInt(data.total_servers)*100;
            $('#gs_pb').css('width',gs_width+'%');
            
            changeClass('gs_pb',gs_width);
            // disk used graph
            $("#ud_pb").attr('aria-valuemax',data.total_servers);
            $("#ud_pbs").text(data.total_size);
            $('#ud_pbs').width($('#ud_pb').parent().width());
            $("#ud_pb").css('width',quota_pc+'%');
             changeClass('ud_pb',quota_pc);
            // mem used graph
            //$('#mem_pbs').width($('#mem_pb').parent().width());
            $("#mem_pbs").text(data.total_mem+'%');
            $("#mem_pb").css('width',data.total_mem+'%');
              changeClass('mem_pb',parseInt(data.total_mem));
            //cpu graph
             $('#cpu_pbs').width($('#cpu_pb').parent().width());
             $("#cpu_pbs").text(data.total_cpu+'%');
             $("#cpu_pb").css('width',data.total_cpu+'%');
              changeClass('cpu_pb',parseInt(data.total_cpu));
             // slots graph
             $('#op_pbs').width($('#op_pb').parent().width());
             $("#op_pbs").text(data.total_players+'/'+data.total_bots+'/'+data.total_slots);
             var player_pc = data.used_slots/data.total_slots*100; 
             $("#op_pb").css('width',player_pc+'%');
             changeClass('op_pb',Math.round(player_pc));
             
           
        },
        complete:function(data,data1){
			    setTimeout(base_servers(url),3000);
				$('#games').show();
				$('#loading').hide();
				$("div").removeClass("active");
				$("div").removeClass("progress-striped");
		}
    });

 }
 function changeClass(id,rate) {
	
if ( $( "#"+id ).length ) {	
     var classList = document.getElementById(id).className.split(/\s+/);
     //console.log(classList+' '+rate);
     //$('#').width($('#object').parent().width());
     for (var i = 0; i < classList.length; i++) {
		 
    if (classList[i] !== 'progress-bar') {
          $('#'+id).removeClass(classList[i]);
	  }
	 
	  color = percentToRGB(rate);
	  $('#'+id).css('background-color',color); 
		}
	} 
}

function percentToRGB(percent) {
    if (percent >= 100) {
        percent = 99
    }
    var r, g, b;

    if (percent < 50) {
        // green to yellow
        r = Math.floor(255 * (percent / 50));
        g = 255;

    } else {
        // yellow to red
        r = 255;
        g = Math.floor(255 * ((50 - percent % 50) / 50));
    }
    b = 0;

    return "rgb(" + r + "," + g + "," + b + ")";
}