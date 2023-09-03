/**
* Template Name: NiceAdmin - v2.2.0
* Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
var nativeAlert = window.alert;
window.alert = function(message) {
		console.log("alert triggered");
		console.log("message = "+message);
		if( typeof message == "undefined") {
			console.log("ignore there is no message set");
		}
	}; 
jQuery(document).ready(function(){
var wSize = jQuery(window).width();
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
   console.log( 'Browser Window width : '+width + ' , height : ' + height );
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
	 
	 console.log("page start "+table);
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