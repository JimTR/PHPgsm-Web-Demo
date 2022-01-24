<?php
/*
 * updates.php
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
include 'inc/master.inc.php';
$Auth = new Auth ();
$user = $Auth->getAuth();
$we_are_here = $settings['url'];
if($user->loggedIn()) {
		// set sidebar
		// allow user to use the api (ready for v3)
		$user_data = array (
		'user_id' => $user->id,
		'user_name' => $user->username,
		'ip' =>  ip2long($_SERVER['REMOTE_ADDR']),
		'start_time' => time() 
		) ;
		if ($database->get_row('select * from allowed_users where ip = '.$user_data['ip'])) {
			$where = array('user_id' => $user->ip);
			unset($user_data['user_ip']);
			$database->update('allowed_users',$user_data,$where);
		} 
		else {
			$database->insert('allowed_users',$user_data);
		}
   	}
else {
	redirect('login.php');
}
$page['page-title'] = ucfirst(basename($_SERVER['SCRIPT_NAME'], ".php"));
$template = new template;
$sidebar_data = array();
$sidebar_data['smenu'] = '';
$sidebar_data['bmenu']= '';
$dropbox_id = $user->dropbox_id;
if (empty(trim($dropbox_id))) {
	$page['dropbox_id'] = 'no dropbox id set local backups only';
}
else {
	$page['dropbox_id'] =$dropbox_id;
}
if($_GET or $_POST) {
	echo 'we  are doing something<br>';
}
$page['dropbox_id'] = print_r($_SERVER,true);
$template->load('templates/subtemplates/sidebar.html');
//menu_item($template->get_template());
$page['sidebar'] = $template->get_template();
$template->load('templates/updates.html');
$template->replace_vars($page);
$template->publish();

function menu_item($menu) {
	// set class
	echo '<xmp>'.$menu.'</xmp>';
	die();
}
?>
