<?php 
/*
 * untitled
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
 * check system bans against sourcebans 
 * 
 */
include "inc/master.inc.php"; // get set up
define('cr',PHP_EOL);
$games = array();
$sql = "select * from server1  where running = 1 order by `host_name` ASC";
$servers = db->get_results($sql);
foreach ($servers as $server) {
	// loop the data
	if(in_array($server['game'],$games)) { continue;}
	$ban_location = "{$server['location']}/{$server['game']}/cfg/banned_ip.cfg";
	$system_bans = explode(cr,trim(file_get_contents($ban_location)));
	//echo "{$server['host_name']}<br>";
	check_source_bans($system_bans);
	$games[] = $server['game'];
}

function check_source_bans($data) {
	// see if know these guys
	foreach ($data as $user) {
		// loop the system bans
		//include "inc/config.php";
		//print_r($config);
		$findip = explode(" ",$user);
		//echo "{$findip[2]}<br>";
		$x = trim($findip[2]);
		$y = ip2long($x);
		$sql = "select * from sb_bans  where ip like '$x'";
		//echo "using $sql ($y)<br>";
		$isplayer = db2->get_row($sql);
		$sql = "select * from players where ip like '$y'";
		$isp = db->get_results($sql);
		if($isplayer) { 
			$sb= true;
			echo "{$isplayer['name']}  is known to sourcebans<br>";
		}
		if ($isp) {
			if(!$b) {
				echo "{$isp[0]['name_c']} is a known player, but is not in the sourcebans table <br>";
			}
			else {
				echo "{$isp[0]['name_c']} is a known player, and is in the sourcebans table <br>";
			}
		}
		else {
			echo "$x - ip not found in any database<br>";
		}
	}
}