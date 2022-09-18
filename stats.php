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
include 'inc/master.inc.php';
   $Auth = new Auth ();
$build = "3219-1103334067";
$version = "1.001";
$time = "1663056490";
$module = "Statistics";
$user = $Auth->getAuth();
$bserver = explode('=',$_SERVER['QUERY_STRING']);
$we_are_here = $settings['url'];
if($user->loggedIn()) {
		//set the sidebar option to logout;
		$user_data = array (
		'user_id' => $user->id,
		'user_name' => $user->username,
		'ip' =>  ip2long($_SERVER['REMOTE_ADDR']),
		'start_time' => time(),
		'nid' => $user->nid  
		) ;
		if ($database->get_row('select * from allowed_users where user_id = '.$user->id)) {
			$where = array('user_id' => $user->id);
			unset($user_data['user_id']);
			$database->update('allowed_users',$user_data,$where);
		} 
		else {
			$database->insert('allowed_users',$user_data);
		}
   	}
   	else {
		redirect('login.php');
		
	}
$url = $settings['url'];
$sidebar_data = array();
$header_vars['title'] = "$module";
$sql = "select * from server1 order by `host_name` ASC";
$sidebar_data['bmenu'] = '';
$sidebar_data['smenu'] = '';
$servers = $database->get_results($sql);
foreach ($servers as $server) {
	$fname = trim($server['host_name']);
        $href = "gameserver.php?server=$fname";
        if(!$server['enabled']) {
             $sidebar_data['smenu'] .='<li><a class="" href="'.$href.'" style="color:red;"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
             continue;
       }

	$href = 'gameserver.php?server='.$server['host_name'];
	if ($bserver == $server['host_name'] ) {$class = 'active';} else {$class='';}
	$sidebar_data['smenu'] .='<li><a class="'.$class.'" href="'.$href.'"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
}
$sql = "select * from base_servers where `enabled` = 1 and `extraip` = 0 ORDER BY `fname` ASC";
$base_servers = $database->get_results($sql);
foreach ($base_servers as $server) {
	$sidebar_data['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
}
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['page-title'] = 'Statistics';
$page['url'] = $url;
$template = new template;
$template->replace_vars($header_vars);
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] = $template->get_template();
$template->load('templates/stats.html');
$template->replace_vars($page);
$template->publish();
?>
