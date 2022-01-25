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
$sql = "select * from server1 order by `host_name` ASC";
$servers = $database->get_results($sql);
foreach ($servers as $server) {
		if(empty($server['starttime'])) { $server['starttime']=0;}
		$start = date("d-m-y  h:i:s a",$server['starttime']);
	     $fname = $server['host_name'];
	     $disp ='style="display:none;"';
		 $href = 'gameserver.php?server='.$server['host_name'];
		 $gd .='<tr id="'.$fname.'" '.$disp.'><td><span class="invert_link"><a href="'.$href.'" class="invert_link">'.$server['server_name'].'</a></span></td><td><span  id="cmap'.$fname.'">No Data</span></td><td style="text-align:center;"><span id="gol'.$fname.'"></span></td><td  style="text-align:center;" id="gdate'.$fname.'">'.$start.'</td></tr>'; 
		 $page['smenu'] .='<li><a class="" href="'.$href.'"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
	 }
$sql = "select * from base_servers where `enabled` = 1 and `extraip` = 0 ORDER BY `fname` ASC";
$base_servers = $database->get_results($sql);	 
foreach ($base_servers as $server) {
	$page['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
} 
$page['page-title'] = ucfirst(basename($_SERVER['SCRIPT_NAME'], ".php"));
$template = new template;
$sidebar_data = array();
//$sidebar_data['smenu'] = '';
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
$template->replace_vars($page);
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
