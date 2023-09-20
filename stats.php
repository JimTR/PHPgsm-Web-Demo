<?php
/*
 * stats.php
 * 
 * Copyright 2022 Jim Richardson <jim@noideersoftware.co.uk>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */
 if(isset($_GET['debug'])) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	define('debug',true);
}
include 'inc/master.inc.php';
 $build = "1667-3072679804";
$version = "1.001";
$time = "1663578073";
$module = "stats";
if ($settings['left_buttons']) {$page['button_class'] = "button-left";} else {$page['button_class']='';}
$bserver = explode('=',$_SERVER['QUERY_STRING']);
$we_are_here = $settings['url'];
$url = $settings['url'];
$page['url'] = $settings['url'];
$page['page-title'] = 'Statistics';
$page['today'] = date("Y-m-d");
menu_bar();
$template = new template;
$template->load('templates/subtemplates/header.html'); // load header
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] = $template->get_template();
$page['sidebar'] = str_replace("class=\"nav-link collapsed\" id=\"$module\" ","class=\"nav-link\"  id=\"users\" ",$page['sidebar']);
$template->load('templates/subtemplates/alert.html');
$page['alert'] = $template->get_template();
$template->load('templates/subtemplates/user-frame.html');
$page['userframe'] = $template->get_template();
$template->load('templates/stats.html');
$template->replace_vars($page);
$template->publish();

function menu_bar() {
	global $page;
	// work out options
	$options = explode(",",settings['stats']['options']);
	$menu_bar ='<ul class="nav nav-tabs nav-tabs-bordered mini" id="borderedTab" role="tablist" style="margin-bottom:1%;">';
	$menu_bar .='<li class="nav-item" role="presentation"><button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#bordered-home" type="button" role="tab" aria-controls="home" aria-selected="true"><i class="fa-solid fa-igloo"></i> <span class="span-show">General</span></button></li>
		<li class="nav-item" role="presentation"><button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#bordered-profile" type="button" role="tab" aria-controls="profile" aria-selected="false"><i class="ri-base-station-line"></i> <span class="span-show">Player Lists</span></button></li>';
	if (in_array('county',$options)) {
		$menu_bar .='<li class="nav-item" role="presentation"><button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#bordered-contact" type="button" role="tab" aria-controls="contact" aria-selected="false"><i class="bx bx-world"></i> <span class="span-show">Country Lists</span></button></li>';
		//country();
	}
	if (in_array('linked',$options)) {
		$menu_bar .='<li class="nav-item" role="presentation"><button class="nav-link" id="supported-games" data-bs-toggle="tab" data-bs-target="#bordered-games" type="button" role="tab" aria-controls="contact" aria-selected="false"><i class="fa-solid fa-link"></i> <span class="span-show">Linked IP Addresses</span></button></li>';
		//ip_dups();
	}
	if (in_array('bans',$options)) {
		$ban_options = explode(",",settings['stats']['ban_options']);					
		$menu_bar .='<li class="nav-item" role="presentation"><button class="nav-link" id="bans" data-bs-toggle="tab" data-bs-target="#bordered-bans" type="button" role="tab" aria-controls="contact" aria-selected="false"><i class="fa-solid fa-user-slash"></i> <span class="span-show">User Bans</span></button></li>';
		$ban_count = count($ban_options);
		switch($ban_count) {
			case 1:
				$page['div_width'] = 'col-lg-9';
				break;
			case 2:
				$page['div_width'] = 'col-lg-6';
				break;
			case 3:
				$page['div_width'] = 'col-lg-4';
				break;			
		}
		if (in_array("sb-bans",$ban_options)) {$page['sb_ban_class'] ='';}
		else { $page['sb_ban_class'] = 'style="display:none;"';}
		if (in_array("vac-bans",$ban_options)) {$page['vac_ban_class'] ='';}
		else { $page['vac_ban_class'] = 'style="display:none;"';}
		if (in_array("sys-bans",$ban_options)) {/*ystem_bans();*/$page['sys_ban_class'] ='';}
		else { $page['sys_ban_class'] = 'style="display:none;"';}
	}
	/*if (in_array('search',$options)) {
		$menu_bar .='<li class="nav-item"><a class="nav-link" href="users.php"><i class="fa-solid fa-magnifying-glass"></i> <span class="span-show">Search Players</span></a></li>';
	}*/					
	$menu_bar.='</ul>';
	$page['menu_bar'] = $menu_bar;				
}
function convertSecToTime($sec){
	$return='';
	if (!is_numeric($sec)) {$sec=0;}
	$date1 = new DateTime("@0"); //starting seconds
	$date2 = new DateTime("@$sec"); // ending seconds
	$interval =  date_diff($date1, $date2); //the time difference
	$y =  $interval->format('%y');
	$m = $interval->format('%m');
	$d = $interval->format('%d');
	$h = $interval->format('%H');
	$mi = $interval->format('%I');
	$s = $interval->format('%S');
	if ($y >0) {$return.= "{$y}y, ";}
	if ($m >0) {$return.= "{$m}m, ";}
	//if ($m > 0 and $y == 0) {$return .= "$m mo ";}
	if($d >0){$return .= "{$d}d, ";}
	$return .= "$h:";
	$return.= "$mi:";
	$return .= "$s";	
	return $return;
}
