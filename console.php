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
	if (isset($_GET['server'])) {
		// just load this server
		$display_server = $_GET['server'];
		$sql = "SELECT `host_name`,`server_name`,`url`,`bport`,`location`,`host`,`port` FROM server1 where `host_name` = '{$_GET['server']}' ";
		$server = $database->get_row($sql);
		//print_r($server);
		//die();
		$display_server = " - ".$server['server_name'];
	}
$build = "3243-1919938056";
	$version = "1.000";
$time = "1663578036";
	$module = "Console";
	$we_are_here = $settings['url'];
	$tmp='';
	$sidebar_data['servers'] = 'Game Servers';
	$sidebar_data['base_servers'] = 'Base Servers';
	
	$template = new template();
	$template->load('templates/subtemplates/header.html');
	$page['header'] = $template->get_template();
	$template->load('templates/subtemplates/footer.html');
	$page['footer'] = $template->get_template();
	$template->load('templates/subtemplates/sidebar.html');
	$template->replace_vars($sidebar_data);
	$page['sidebar'] = $template->get_template();
	$sql = "SELECT DISTINCT `host_name`,`server_name`,`url`,`bport`,`location`,`host`,`port` FROM server1 where `running` = 1 order by `host_name`";
    $servers = $database->get_results($sql);
    $sbox ='<option id ="" value="" path="" host ="">Choose Server</option>';
    foreach ($servers as $server) {
                //fill select box
		$uri = parse_url($server['url']);
		$url = $uri['scheme']."://".$uri['host'].':'.$server['bport'];
		if (isset($uri['path'])) {$url .= $uri['path'];}
		//echo "$url<br>";
		//print_r($server);
                $sbox .='<option id ="'.$server['host_name'].'" value="'.$url.'" path="'.$server['location'].'" host ="'.$server['host'].':'.$server['port'].'">'.$server['server_name'].'</option>';
                //get_maps($server);
        }
	$page['sbox'] = $sbox;
	//we need to fill the map select some how  
	$template->load('templates/console.html');
	$page['display_server'] =$display_server;
	$template->replace_vars($page);
	$template->publish();

function get_maps($server) {
	// get the option list of maps
	$file = $server['location'].'/'.$server['game'].'/cfg/mapcycle.txt'; // work out file we need a fall back
	$map_list = explode(cr,file_get_contents($file)); // get the file & array it
	$box = '<select class="form-control" style="width:227px;display:none;" id="map_change_'.$server['host_name.'].'" >'; // split the server id so the change fuction will work use server var
	//now loop
	foreach ($map_list as $map) {
		// think ! add to box
	}
	$box .= '</select>';
	//<option id="test" value="http://localhost:80/ajaxv2.5" path="/home/jim/games/bb2" host="81.132.54.204:27015">Brainbread II</option>
	//</select>
}
?>
