<?php
/*
 * linked_ips.php
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

 if(isset($_GET['debug'])) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
}
include '../inc/master.inc.php';
$sql = "SELECT * FROM players INNER JOIN( SELECT ip FROM players GROUP BY ip HAVING COUNT(ip) > 1 order by ip) temp ON players.ip = temp.ip ORDER BY `players`.`ip` ASC"; // get dups
$dups = db->get_results($sql);
//printr($dups);
foreach($dups as $dup) {
	// scan through
	$id = $dup['steam_id64'];
	if ($dup['ip'] == $last_ip) {
		// add to the row
		$i--;
		$last_login = date("d-m-y  h:i:s a",$dup['last_log_on']);
		$dup_table[$i]['name'] .="<table><tr class='no-border'><td style='width:31%'><a href='javascript:void(0)' class='user-id' id='$id' title='Last Seen $last_login'>{$dup['name_c']}</a></td><td style='width:19%;'>$last_login</td><td style='text-align:center;width: 37%;'>{$dup['log_ons']}</td><td style='text-align:right;padding-right: 6%;'>0</td></tr></table>";
		$i++;
		continue;
	}
	 $dup_table[$i]['ip'] = long2ip($dup['ip']);
	 $last_login = date("d-m-y  h:i:s a",$dup['last_log_on']);
	 $dup_table[$i]['name'] = "<table><tr class='no-border'><td style='width:31%;'><a href='javascript:void(0)' class='user-id' id='$id' title='Last Seen $last_login'>{$dup['name_c']}</a></td><td style='width:19%;'>$last_login</td><td style='text-align:center;width: 37%;'>{$dup['log_ons']}</td><td style='text-align:right;padding-right: 6%;'>0</td></tr></table>"; 
	 $last_ip = $dup['ip'];
	 $i++;
}
//$dup_table = paginate($dup_table,0,100);
$page['dups'] ='';
//printr($dup_table);
//die();
//foreach ($dup_table['data'] as $dup) {	
foreach ($dup_table as $dup) {	
	$page['dups'] .= "<tr><td style='vertical-align:middle;'>{$dup['ip']}</td><td colspan=4>{$dup['name']}</td></tr>";
	//$x[] =  "<tr><td style='vertical-align:middle;'>{$dup['ip']}</td><td colspan=4>{$dup['name']}</td></tr>";	
}

//$ = paginate($dup_table,0,100);
//echo $page['dups'];
$sql = "SELECT name_c as user_name,time_on_line as play_time, players.log_ons as total_logins, players.steam_id64 as steam_id FROM `players` WHERE `players`.time_on_line = (SELECT MAX(time_on_line) FROM players)";
$stats['time_on_line'] = db->get_row($sql);
$sql = "select * from logins limit 1";
$stats['country'] = db->get_row($sql);
$sql = "SELECT count(*) as player_count,sum(log_ons) as login_count, sum(time_on_line) as total_time from players"; //get player count & time on line
$stats['counts'] = db->get_row($sql);
$sql = "SELECT name_c as user_name,time_on_line as play_time, players.log_ons as total_logins, players.steam_id64 as steam_id FROM `players` WHERE `players`.log_ons = (SELECT MAX(log_ons) FROM players)";
$stats['times'] = db->get_row($sql);
$stats['dups'] = $page['dups'];
//printr($stats);
echo "<table>{$stats['dups']}</table>";