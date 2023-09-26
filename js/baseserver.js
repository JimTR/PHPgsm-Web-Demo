 function base_servers(url) {
	 // bring back base_server detail
	 //console.log("base url "+url);
	  $.ajax({ 
        type: 'POST', 
        url: url, 
        dataType: "json", 
        success: function (data) {
			var server_id = data.server_id; 
            console.log(data);
            //document.cookie = "favorite_food=tripe; SameSite=None; Secure";
            var oldCookieValue = getCookie('phpgsm_theme');
            console.log(oldCookieValue);
            if ($('#level').text() == 'admin') {var level = 1;} 
            else { var level = 0;}
            $('#server-id').text(data.server_id);
            $('#boot').text(data.boot_time);
            $('#model').text(data.model_name);
            $('#processors').text(data.processors);
            $('#cores').text(data.cpu_cores);
            $('#speed').text(data.cpu_MHz+" Mhz");
            $('#load').text(data.load_pc);
            $('#cache').text(data.cache_size);
            $('#ip').text(data.ips);
            $('#reboot').text(data.reboot);
            $('#host').text(data.host);
            $('#os').text(data.os);
            $('#k_ver').text(data.k_ver);
            $('#process').text(data.process);
            $('#php').text(data.php);
            $('#screen').text(data.screen);
            $('#tmux').text(data.tmux);
            $('#glibc').text(data.glibc);
            $('#mysql').text(data.mysql);
            $('#mysql').text(data.apache);
            $('#curl').text(data.curl); 
            $('#quotav').text(data.quotav);
            $('#postfix').text(data.postfix); 
            $('#git').text(data.git);
            $('#boot_filesystem').text(data.root_filesystem);
            if (level == 1) {
				$('#root').removeClass('hidden');
				$('#user').removeClass('hidden');
			}
			else {
				$('#user').removeClass('hidden');
				$('#root').addClass('hidden');
			}	
            $('#boot_mount').text(data.root_mount);
			$('#boot_size').text(data.root_size);
            $('#boot_used').text(data.root_used+' ('+data.root_pc+')');
            $('#boot_free').text(data.root_free);
            $('#memtotal').text(data.MemTotal);
            $('#memfree').text(data.MemFree);
            $('#memcached').text(data.Cached);
            $('#memactive').text(data.MemAvailable);
            $('#swap-total').text(data.SwapTotal);
            $('#swap-free').text(data.SwapFree); 
            mem_pc = parseFloat(data.MemAvailable_raw) * 100 / parseFloat(data.MemTotal_raw);
            //mem_pc =  ((parseFloat(data.MemAvailable_raw) - parseFloat(data.MemTotal_raw)) /parseFloat(data.MemAvailable_raw))*100 ;
            //mem_pc +=100;
            mem_pc = mem_pc.toFixed(2);
            swap_pc = ((parseFloat(data.SwapTotal_raw) - parseFloat(data.SwapFree_raw)) /parseFloat(data.SwapTotal_raw))*100 ;
            swap_free = data.SwapFree_raw;
            console.log("swap free "+swap_free);
            console.log("swap total "+data.SwapTotal_raw);
            console.log ("swap pc before maths "+swap_pc);
            swap_pc = swap_pc.toFixed(2)
            swap_total = parseFloat(data.SwapTotal_raw);
            console.log("mem pc "+mem_pc);
            console.log("swap total "+swap_total);
            console.log("swap pc "+swap_pc);
            $('#u_mount').text(data.dir);
            $('#u_size').text(data.quota);
            $('#load_1').text(data.load_1_min_pc);
            $('#load_10').text(data.load_10_min_pc);
            $('#load_15').text(data.load_15_min_pc);
            changeforeground('load_1',parseInt(data.load_1_min_pc));
			changeforeground('load_10',parseInt(data.load_10_min_pc));
			changeforeground('load_15',parseInt(data.load_15_min_pc));
            if (data.hypervisor_vendor !==undefined){
				//console.log(data.hypervisor_vendor);
				$('#ctype').text(data.hypervisor_vendor);
			}
            var qpc_rounded = Math.round(data.quota_pc * 10) / 10
            $('#u_used').text(data.quota_used+' ('+qpc_rounded+'%)');
            $('#u_free').text(data.quota_free);
            if (data.reboot == 'Yes') {$('#reboot').addClass('rebooot');}
            else {$('#reboot').removeClass('rebooot');}
            // mem graphs
            var tmem =Math.round(100-(parseInt(data.MemFree)/parseInt(data.MemTotal))*100)
            //mem graph
            $('#tmem_pb').css('width',tmem+'%');
            $('#tmem_pbs').width($('#tmem_pb').parent().width());
            $("#tmem_pbs").html('Free ('+data.MemFree+')');
            changeClass( 'tmem_pb',tmem);
            //swap graph
            var smem = Math.round(100-(parseInt(data.SwapTotal_raw)/parseInt(data.SwapFree_raw))*100);
            console.log ("smem = "+smem);
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
             //var quota_pc = x* (100/parseFloat(data.quota));
             // game graph
            $("#gs_pb").attr('aria-valuenow',data.server_total_servers);
            $("#gs_pbs").text(data.server_live_servers+'/'+data.server_total_servers);
            $('#gs_pbs').width($('#gs_pb').parent().width());
          
            var gs_width = parseInt(data.server_live_servers) / parseInt(data.server_total_servers)*100;
            $('#gs_pb').css('width',gs_width+'%');
            changeClass('gs_pb',gs_width);
            // disk used graph
            $("#ud_pb").attr('aria-valuemax',data.quota);
            $("#ud_pbs").text(data.total_size);
            $('#ud_pbs').width($('#ud_pb').parent().width());
            $("#ud_pb").css('width',data.quota_pc+'%');
            //var rounded = Math.round(number * 10) / 10
             changeClass('ud_pb',data.quota_pc);
             $('#swap').css('width',swap_pc+'%');
             $('#swap-progress').attr("title",swap_pc+"% swap used");
             changeClass('swap',swap_pc);
             $('#s-mem').css('width',mem_pc+'%');
             $('#mem-progress').attr("title",mem_pc+"% memory available");
             changeClass('s-mem',mem_pc,"reverse");
             $('#swap_pbs').text(data.SwapFree+" available" );
             $('#mem-pbs').text(data.MemAvailable+'/'+data.MemTotal);
            // mem used graph
            //$('#mem_pbs').width($('#mem_pb').parent().width());
            $("#mem_pbs").text(data.total_mem+'%');
            $("#mem_pb").css('width',data.total_mem+'%');
            changeClass('mem_pb',parseInt(data.total_mem));
            //cpu graph
             $('#cpu_pbs').width($('#cpu_pb').parent().width());
             $("#cpu_pbs").text(data.game_cpu+'%');
             $("#cpu_pb").css('width',data.game_cpu+'%');
             changeClass('cpu_pb',parseInt(data.game_cpu));
             // slots graph
             $('#op_pbs').width($('#op_pb').parent().width());
             $("#op_pbs").text(data.server_players+'/'+data.server_total_bots+'/'+data.server_total_slots);
             var player_pc = data.server_used_slots/data.server_total_slots*100; 
             $("#op_pb").css('width',player_pc+'%');
             changeClass('op_pb',Math.round(player_pc));
             
           
        },
        complete:function(data,data1){
			    //setTimeout(base_servers(url),3000);
				$('#games').show();
				$('#loading').hide();
				$("div").removeClass("active");
				$("div").removeClass("progress-striped");
		}
    });

 }
 
 function changeforeground(id,rate,reverse) {
	 // change colours
	 color = percentToRGB(rate,reverse);
	 //console.log(id);
	 $('#'+id).css('color',color);
 }
 
 function changeClass(id,rate,reverse) {
	
if ( $( "#"+id ).length ) {	
     var classList = document.getElementById(id).className.split(/\s+/);
     for (var i = 0; i < classList.length; i++) {
		if (classList[i] !== 'progress-bar') {
          $('#'+id).removeClass(classList[i]);
		}
		console.log("id = "+id+" reverse = "+reverse);
		color = percentToRGB(rate,reverse);
		$('#'+id).css('background-color',color); 
	}
} 
}

function percentToRGB(percent,reverse) {
	//console.log("reverse = "+reverse);
    if (percent >= 100) {
        percent = 99
    }
    var r, g, b;
    if(reverse !== 'reverse') {
		if (percent < 50) {
			// green to yellow
			r = Math.floor(255 * (percent / 50));
			g = 255;
		} 
		else {
			// yellow to red
			r = 255;
			g = Math.floor(255 * ((50 - percent % 50) / 50));
		}
		b = 0;
		return "rgb(" + r + "," + g + "," + b + ")";
	}
	else {
		//console.log("we should reverse with "+percent);
		if (percent > 50) {
			// green to yellow
			r = Math.floor(255 * (percent / 50));
			g = 255;
		} 
		else {
			// yellow to red
			r = 255;
			g = Math.floor(255 * ((50 - percent % 50) / 50));
		}
		b = 0;
		return "rgb(" + r + "," + g + "," + b + ")";
	}
		
}
// $.cookie('phpgsm_theme', id); // ready for theme change ?
