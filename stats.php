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
  
$build = "1667-3072679804";
$version = "1.001";
$time = "1663578073";
$module = "stats";
$bserver = explode('=',$_SERVER['QUERY_STRING']);
$we_are_here = $settings['url'];
$url = $settings['url'];
$sql = "select * from logins limit 1";
if ($settings['left_buttons']) {$page['button_class'] = "button-left";} else {$page['button_class']='';}
$country = $database->get_results($sql);
$page['country'] = $country[0]['country'];
$page['country_stat'] = "{$country[0]['logins']} / {$country[0]['players']}";
$sql = "SELECT count(*) as player_count,sum(log_ons) as login_count, sum(time_on_line) as total_time from players"; //get player count & time on line
$stats = $database->get_results($sql);
$page['player_total'] = $stats[0]['player_count'];
$page['total_time'] = convertSecToTime($stats[0]['total_time']);
$sql = "SELECT name_c as user_name,time_on_line as play_time, players.log_ons as total_logins, players.steam_id64 as steam_id FROM `players` WHERE `players`.time_on_line = (SELECT MAX(time_on_line) FROM players)";
$stats = $database->get_results($sql);
$page['time_online'] = "<a href='users.php?id={$stats[0]['steam_id']}'>{$stats[0]['user_name']}</a>";
$page['time_online_count'] = convertSecToTime($stats[0]['play_time']);
$sql = "SELECT name_c as user_name,time_on_line as play_time, players.log_ons as total_logins, players.steam_id64 as steam_id FROM `players` WHERE `players`.log_ons = (SELECT MAX(log_ons) FROM players)";
$stats = $database->get_results($sql);
$page['most_log_ons'] = "<a href='users.php?id={$stats[0]['steam_id']}'>{$stats[0]['user_name']}</a>";
$page['log_on_count'] = $stats[0]['total_logins'];
$sql = "SELECT servers.server_name,player_history.game as server_id,count(player_history.`game`) as total FROM `player_history` left join servers on player_history.game= servers.host_name group by player_history.`game` order by total desc limit 1;";
$stats = $database->get_results($sql);
$page['most_popular'] = $stats[0]['server_name'];
$page['most_popular_count'] = $stats[0]['total'];
$page['page-title'] = 'Statistics';
$page['url'] = $url;
$page['today'] = date("Y-m-d");
$sql = "SELECT servers.server_name,player_history.`game`,sum(player_history.`game_time`) as full_time FROM `player_history` left join servers on player_history.game= servers.host_name group by player_history.game ORDER BY `full_time` DESC limit 10";
$stats = $database->get_results($sql);
$page['most_played_time'] =convertSecToTime($stats[0]['full_time']);
$page['most_played'] = $stats[0]['server_name'];
$sql = "SELECT COUNT(*) AS total, ( SELECT COUNT(*) FROM sb_comms WHERE `RemovedOn` IS NULL ) AS live, ( SELECT COUNT(*) FROM sb_bans ) AS game_total, (select count(*) as game_live from sb_bans where RemovedOn is null) as game_live FROM `sb_comms`";
$comms = db2->get_results($sql);
$sql = "SELECT * FROM players INNER JOIN( SELECT ip FROM players GROUP BY ip HAVING COUNT(ip) > 1 order by ip) temp ON players.ip = temp.ip ORDER BY `players`.`ip` ASC"; // get dups
$dups = $database->get_results($sql);
$i=0;
$page['dup_count'] = count($dups);
foreach($dups as $dup) {
	// scan through
	$id = $dup['steam_id64'];
	if ($dup['ip'] == $last_ip) {
		// add to the row
		$i--;
		$last_login = date("d-m-y  h:i:s a",$dup['last_log_on']);
		$dup_table[$i]['name'] .="<table><tr class='no-border'><td style='width:50%'><a href='javascript:void(0)' class='user-id' id='$id' title='Last Seen $last_login'>{$dup['name_c']}</a></td><td style='width:40%;'>$last_login</td><td style='text-align:right;'>{$dup['log_ons']}</td></tr></table>";
		$i++;
		continue;
	}
	 $dup_table[$i]['ip'] = long2ip($dup['ip']);
	 $last_login = date("d-m-y  h:i:s a",$dup['last_log_on']);
	 $dup_table[$i]['name'] = "<table><tr class='no-border'><td style='width:50%;'><a href='javascript:void(0)' class='user-id' id='$id' title='Last Seen $last_login'>{$dup['name_c']}</a></td><td style='width:40%;'>$last_login</td><td style='text-align:right;'>{$dup['log_ons']}</td></tr></table>"; 
	 $last_ip = $dup['ip'];
	 $i++;
}
$page['dups'] ='';
foreach ($dup_table as $dup) {	
	$page['dups'] .= "<tr><td style='vertical-align:middle;'>{$dup['ip']}</td><td colspan=3>{$dup['name']}</td></tr>";
}
$page['comms_total'] = $comms[0]['total'];
$page['comms_live'] = $comms[0]['live'];
$page['game_live'] = $comms[0]['game_live'];
$page['game_total'] = $comms[0]['game_total'];
$template = new template;
$template->load('templates/subtemplates/header.html'); // load header
$template->replace_vars($header_vars);
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] = $template->get_template();
$page['sidebar'] = str_replace("class=\"nav-link collapsed\" id=\"$module\" ","class=\"nav-link\"  id=\"users\" ",$page['sidebar']);
$template->load('templates/stats.html');
$template->replace_vars($page);
$template->publish();

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
	//return $interval->format('%y y %m mo %d d, %h h %i m %s s'); // convert into Years, Months, Days, Hours, Minutes and Seconds
	return $return;
}
?>
