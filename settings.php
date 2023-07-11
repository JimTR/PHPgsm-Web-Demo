<?php
/*
 * settings.php
 * 
 * Copyright 2023 Jim Richardson <jim@phporyx.co.uk>
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
// ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);


$module = "settings";
include 'inc/master.inc.php'; // add setup
if(isset($_GET['id'])) {
	$server_name = $_GET['id'];
	$sql = "select * from server1 where host_name ='$server_name'";
	//printr(get_defined_constants(true));
	$server_record = db->get_row($sql);
	$page['setting_title'] =  "Settings for{$server_record['server_name']}";
	$setting_type = true;
}
else{ 
	$page['setting_title'] =  "System Settings";
	$setting_type = false;
}
$url = $settings['url'];
$template = new template;
$template->load('templates/subtemplates/header.html'); // load header
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] = $template->get_template();
$page['sidebar'] = str_replace("class=\"nav-link collapsed\" id=\"$module\" ","class=\"nav-link\"  id=\"users\" ",$page['sidebar']);
if($setting_type){
	$template->load('templates/subtemplates/server_settings.html');
	$template->replace_vars($server_record);
	$page['menu_bar']  = $template->get_template();
}
else { $page['menu_bar'] = "need system menu";}
$template->load('templates/settings.html');
$template->replace_vars($page);
$template->publish();