/**
* Template Name: NiceAdmin - v2.2.0
* Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
var nativeAlert = window.alert;
window.alert = function(message,show,title) {
		//console.log("alert triggered");
		//console.log("message = "+message);
		//console.log("show = "+show);
		if( typeof show == "undefined") {
			//console.log("ignore alert, show is not set ");
		}
		else {
			if (show ==true) { 
				nativeAlert(message);
			}
			else {
				//console.log("custom alert");
				//$("#alert").toggle();
				$("#alert-title").html(title);
				$("#alert-message").html(message);
				$('#alert').modal({ show: false});
				$('#alert').modal('show');
			}
		}
	};
	var referrer =  document.referrer; 
	var start_history = history.length; 
	function onGot(historyItems) {
  for (const item of historyItems) {
    console.log(item.url);
    console.log(new Date(item.lastVisitTime));
  }
}


  
jQuery(document).ready(function(){
var wSize = jQuery(window).width();
//console.log("in main js "+history.length);
//console.log(referrer);
if(wSize > 400) {
//console.log(wSize);
jQuery('body').addClass('toggle-sidebar');
sessionStorage.clear();	
updateClock();
setInterval('updateClock()', 1000);
}
});

$( window ).resize(function() {
   var width = $(window).width();
   var height = $(window).height();
   //console.log( 'Browser Window width : '+width + ' , height : ' + height );
});

function updateClock ()
    {
    var currentTime = new Date ( );
    var currentHours = currentTime.getHours ( );
    var currentMinutes = currentTime.getMinutes ( );
    var currentSeconds = currentTime.getSeconds ( );
 
    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
 
    // Choose either "AM" or "PM" as appropriate
    var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";
 
    // Convert the hours component to 12-hour format if needed
    currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
 
    // Convert an hours component of "0" to "12"
    currentHours = ( currentHours == 0 ) ? 12 : currentHours;
 
    // Compose the string for display
    var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;
     
     
    $("#clock").html(currentTimeString);
    // $('#clock').css('color','red');
    //console.log(currentTime.getTime());  
     }
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Sidebar toggle
   */
  if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function(e) {
      select('body').classList.toggle('toggle-sidebar')
    })
  }

  /**
   * Search bar toggle
   */
  if (select('.search-bar-toggle')) {
    on('click', '.search-bar-toggle', function(e) {
      select('.search-bar').classList.toggle('search-bar-show')
    })
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Initiate tooltips
   */
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  /**
   * Initiate quill editors
   */
  if (select('.quill-editor-default')) {
    new Quill('.quill-editor-default', {
      theme: 'snow'
    });
  }

  if (select('.quill-editor-bubble')) {
    new Quill('.quill-editor-bubble', {
      theme: 'bubble'
    });
  }

  if (select('.quill-editor-full')) {
    new Quill(".quill-editor-full", {
      modules: {
        toolbar: [
          [{
            font: []
          }, {
            size: []
          }],
          ["bold", "italic", "underline", "strike"],
          [{
              color: []
            },
            {
              background: []
            }
          ],
          [{
              script: "super"
            },
            {
              script: "sub"
            }
          ],
          [{
              list: "ordered"
            },
            {
              list: "bullet"
            },
            {
              indent: "-1"
            },
            {
              indent: "+1"
            }
          ],
          ["direction", {
            align: []
          }],
          ["link", "image", "video"],
          ["clean"]
        ]
      },
      theme: "snow"
    });
  }

  /**
   * Initiate TinyMCE Editor
   */

  var useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  

  /**
   * Initiate Bootstrap validation check
   */
  var needsValidation = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(needsValidation)
    .forEach(function(form) {
      form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

  /**
   * Initiate Datatables
   */
  const datatables = select('.datatable', true)
  datatables.forEach(datatable => {
    new simpleDatatables.DataTable(datatable);
  })

  /**
   * Autoresize echart charts
   */
  const mainContainer = select('#main');
  if (mainContainer) {
    setTimeout(() => {
      new ResizeObserver(function() {
        select('.echart', true).forEach(getEchart => {
          echarts.getInstanceByDom(getEchart).resize();
        })
      }).observe(mainContainer);
    }, 200);
  }

})();

function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

function getCookie(cname) {
	//document.cookie = cname;
	//console.log(document.cookie);
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "poo";
}
$('#themeswitch').click(function()
 {
	  var oldCookieValue = getCookie('phpgsm_theme');
       		
		switch (oldCookieValue) {
			case '411811':
				console.log('dark to light');
				setCookie('phpgsm_theme', '1297820',30);
				break;
			case '1297820':
				console.log('light to dark');
				setCookie('phpgsm_theme', '411811',30);
				break;
			}
			location.reload();
});
$('#themeswitchp').click(function()
 {
	  var oldCookieValue = getCookie('phpgsm_theme');
       		
		switch (oldCookieValue) {
			case '411811':
				console.log('dark to light');
				setCookie('phpgsm_theme', '1297820',30);
				break;
			case '1297820':
				console.log('light to dark');
				setCookie('phpgsm_theme', '411811',30);
				break;
			}
			location.reload();
});
$('#switch').click(function()
 {
	 var oldCookieValue = getCookie('phpgsm_colour');
	 //alert (oldCookieValue);
		
 });
 function paginate(page,table,disp,PerPage) {
	 
	 //console.log("page start "+table);
	$('#'+table).each(function () {
				//console.log('in each loop '+page);
				  var $table = $(this);
				  //console.log($table.html());
				if(typeof PerPage === 'undefined') { var itemsPerPage = 100;}
				else { var itemsPerPage = PerPage;}
				   
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
				    //console.log("current page in bind "+currentPage);
				    //console.log("current pager "+pager);
				    if ($table.next().hasClass("pager")) {
						//console.log("pager has class");
				         pager = $table.next().empty(); 
				      }
				     else
						pager = $('<ul class="pagination pager" id="pages'+disp+'" cp="'+page+'" pp="'+itemsPerPage+'" style="padding-top: 20px; direction:ltr;">');
					if (currentPage >0 ){
						$('<li class="page-link pagination-page" id ="'+disp+'-f" title="First Page"></li>').text(' « ').bind('click', function () {
						currentPage = 0;
						$table.trigger('repaginate');
						}).appendTo(pager);
				
						$('<li class="page-link pagination-page" id="'+disp+'-p" title="Previous Page">  < </li>').bind('click', function () {
						if (currentPage > 0)
							currentPage--;
							$table.trigger('repaginate');
						}).appendTo(pager);
					}
				    var startPager = currentPage > 2 ? currentPage - 2 : 0;
				    var endPager = startPager > 0 ? currentPage + 3 : 5;
				    if (endPager > pages) {
						
				      endPager = pages;
				      startPager = pages - 5;    if (startPager < 0)
				        startPager = 0;
				    }
					//alert("end pager = "+endPager);
				    for (var page = startPager; page < endPager; page++) {
						
						if(page == currentPage) {
							//console.log("hit current page "+page);
							
							style ='  page-box';
							title = "goto top";
							}
							else{ 
								pc = page + 1;
								style='';
								title =  'goto page '+pc;
							}
							
				      $('<li id="pg-'+disp+'-' + page + '" class="page-link pagination-page'+style+'" title="'+title+'"></li>').text(page + 1).bind('click', {
				          newPage: page
				        }, function (event) {
							
				          currentPage = event.data['newPage'];
				          $table.trigger('repaginate');
				      }).appendTo(pager);
				    }
					
					if (currentPage !== pages-1) {
						$('<li class="page-link pagination-page" id="'+disp+'-n" title="Next Page"> > </li>').bind('click', function () {
							
						if (currentPage < pages - 1)
						currentPage++;
						$table.trigger('repaginate');
						}).appendTo(pager);
					
						$('<li class="page-link pagination-page" id="'+disp+'-l" title="Last Page"> » </li></ul>').bind('click', function () {
						currentPage = pages - 1;
						$table.trigger('repaginate');
						}).appendTo(pager);
					}	
				
				    if (!$table.next().hasClass("pager"))
				      pager.insertAfter($table);
				    				    	
				  }// end $table.bind('repaginate', function 

				  $table.find('tbody tr:not(:has(th))').hide().slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).show();
				  if (total_pages <2) {
					  //alert("only one page");
					  $('#'+disp).hide();
					  return;
					}
				  $("#"+table+"-wrap").scrollTop(0)
				   tp = $("#pages"+disp).html();
				   //console.log(tp);
				  page_display = currentPage+1 +"/"+total_pages;
				  startDiv = "<div style='float:left;' title='Page Count'> Page "+page_display+"</div><div style='float:right;padding-right:2%;'><ul class='pagination' cp='"+currentPage+"' tp='"+pages+"' pp='"+itemsPerPage+"'>";
				  endDiv = "</ul></div>";
				  tp= startDiv+tp+endDiv;
				  
				  $("#"+disp).html(tp);
				  $("#pages"+disp).hide();
				  $('#'+disp).show();
				 });

				  $table.trigger('repaginate');
				});								
	}	
	function validateIP(ip){ 
		var ipaddress = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
           
          if (ipaddress.test(ip)) {
            return true;
          } else {
            return false;
          }
	}
	
 function force_back () {
		 console.log("in gb1 "+history.length);
		 new_history = history.length;
		 console.log("start history = "+start_history); 
		 //history.back(start_history - 1)
		  window.history.go(start_history - new_history - 1);
	 }
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
function loadIframe(iframeName, url) {
    var $iframe = $('#' + iframeName);
    if ($iframe.length) {
        $iframe.attr('src',url);
        return false;
    }
    return true;
}
function closeIFrame(parent){
	if(parent) {
		console.log("need to close from parent");
	} 
     $('#user-frame').modal('hide');
     //$('#myModal').modal('hide');

}
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
				//$('#user').removeClass('hidden');
			}
			else {
				//$('#user').removeClass('hidden');
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
            $('#root-fs').text(data.root_filesystem);
            $('#home-fs').text(data.home_filesystem);
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
             $('#quota-use').css('width',data.quota_pc+"%");
              $('#quota-pbs').width($('#quota-progress').width());
              quotaText = $.trim(data.quota_used)+"/"+data.quota+" - "+data.quota_pc+'% used';
             $("#quota-pbs").text(quotaText);
             changeClass('quota-use',data.quota_pc);
             $('#root-use').css('width',data.root_pc);
             changeClass('root-use',parseInt(data.root_pc));
             rootText = $.trim(data.root_used)+"/"+data.root_size+" - "+data.root_pc+' used';
             $("#root-pbs").text(rootText);
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
