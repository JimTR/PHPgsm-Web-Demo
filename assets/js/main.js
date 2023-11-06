/**
* Template Name: NiceAdmin - v2.2.0
* Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
var nativeAlert = window.alert;
var interval;
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
	if(!isMobile()) {
		sessionStorage.clear();	
		updateClock();
		interval = setInterval('updateClock()', 1000);
	}
	else {
		$(".bi-bell").parent().parent().css({"padding-right": "10%", "display": "inline"});
	}
});

$( window ).resize(function() {
	if(isMobile()) {
		$(".bi-bell").parent().parent().css({"padding-right": "10%", "display": "inline"});
		if(typeof interval !== 'undefined'){
			clearInterval(interval);
			interval = 0;
			$("#clock").text("");
		}
	}
	else {
		updateClock();
		if (interval == 0 ) {interval = setInterval('updateClock()', 1000);}
		$(".bi-bell").parent().parent().css({"padding-right": "0%", "display": "inline"});
	}
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
     
     
    $("#clock").text(currentTimeString);
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
function themeswitch()
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
}
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
	 inmod =$('#ifrm',parent.document).attr('mod');
	 if (typeof inmod !== 'undefined' && inmod !== false) {
		 parent.closeIFrame(1);
		 return;
	 }
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
		alert($("#user-frame", parent.document).attr("aria-hidden"));
		$("#user-frame", parent.document).modal('hide');
		// $('#user-frame').modal('hide');
	} 
     $('#user-frame').modal('hide');
     $("#user-avatar").hide();
     function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function test() {
  //console.log('start timer');
  await delay(1000);
  $('#ifrm').attr("src","");
  $('#ifrm').attr("mod","");
  $("#steam-link").hide();
  $("#steam-link").attr("href","#");
  $("#user-avatar").attr("src","img/blank.png");
  $("#ifrm").attr("return-to","");
	//console.log('after 1 second');
}

test();

}
$('iframe').click(function(){
   Id=$(this).attr('id');
   alert(Id);
 });
 window.isMobile = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

function activeTab(tab){
	$(".tab-pane").removeClass("active show");
	$("#"+tab).addClass("active show");
	$("body").removeClass("toggle-sidebar");
};
