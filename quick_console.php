<?php
/*
 * quick_console.php
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
	$tmp='';
	if($user->loggedIn()) {
		// set sidebar
		// allow user to use the api (ready for v3)
   	}
   	else {
		redirect('login.php');
	}
	$template = new template();
	$template->load('templates/subtemplates/header.html');
	$page['header'] = $template->get_template();
	$template->load('templates/subtemplates/footer.html');
	$page['footer'] = $template->get_template();
	$template->load('templates/subtemplates/sidebar.html');
	$page['sidebar'] = $template->get_template();
	//  sidebar
	$sql = "select * from server1 order by `host_name` ASC";
	$servers = $database->get_results($sql);
	foreach($servers as $server) {
		// populate the game server section
		$href = 'gameserver.php?server='.$server['host_name'];
		$page['smenu'] .='<li><a class="" href="'.$href.'"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
	}
	$sql = "select * from base_servers where `enabled` = 1 and `extraip` = 0 ORDER BY `fname` ASC";
	$base_servers = $database->get_results($sql);
	foreach ($base_servers as $server) {
		// populate base servers
		$page['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
	}

	$sql = "SELECT DISTINCT `host_name`,`server_name`,`url`,`bport`,`location`,`host`,`port` FROM server1 where `running` = 1 order by `host_name`";
    $servers = $database->get_results($sql);
    $sbox ='<option id ="" value="" path="" host ="">Choose Server</option>';
    foreach ($servers as $server) {
                //fill select box
                $sbox .='<option id ="'.$server['host_name'].'" value="'.$server['url'].':'.$server['bport'].'" path="'.$server['location'].'" host ="'.$server['host'].':'.$server['port'].'">'.$server['server_name'].'</option>';
        }
	$page['sbox'] = $sbox;
	$template->load('templates/quick-console.html');
	
	//echo $template->get_template();
	//die();
	$template->replace_vars($page);
	$template->publish();

?>
