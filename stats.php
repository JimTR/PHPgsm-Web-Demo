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
	if (in_array('search',$options)) {
		$menu_bar .='<li class="nav-item"><a class="nav-link" href="users.php"><i class="fa-solid fa-magnifying-glass"></i> <span class="span-show">Search Players</span></a></li>';
	}					
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
/*function get_gameList() {
	global $page;
	$sql = "SELECT servers.server_name,player_history.`game`,sum(player_history.`game_time`) as full_time, count(player_history.game) as player_tot  FROM `player_history` left join servers on player_history.game= servers.host_name group by player_history.game ORDER BY `full_time` DESC ";
	$stats = db->get_results($sql);
	//$page['most_played_time'] =convertSecToTime($stats[0]['full_time']);
	//$page['most_played'] = $stats[0]['server_name'];
	$page['game_list'] ='';
	foreach ($stats as $stat) {
		if ($stat['full_time'] == 0) {continue;}
		$used_time = convertSecToTime($stat['full_time']);
		$page['game_list'] .= "<tr><td><a href='gameserver.php?server={$stat['game']}'>{$stat['server_name']}</a></td><td>$used_time</td><td>{$stat['player_tot']}</td></tr>";
	}
}

function ip_dups() {
	global $page;
	$sql = "SELECT * FROM players INNER JOIN( SELECT ip FROM players GROUP BY ip HAVING COUNT(ip) > 1 order by ip) temp ON players.ip = temp.ip ORDER BY `players`.`ip` ASC"; // get dups
	$dups = db->get_results($sql);
	$i=0;
	$page['dup_count'] = count($dups);
	$last_ip='';
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
	$dup_table = paginate($dup_table,0,100);
	print_r($dup_table);
	die();
	$page['dups'] ='';
	foreach ($dup_table['data'] as $dup) {	
		$page['dups'] .= "<tr><td style='vertical-align:middle;'>{$dup['ip']}</td><td colspan=4>{$dup['name']}</td></tr>";
	}
}

function system_bans() {
	global $page;
	$sql = "select * from server1 order by `host_name` ASC";
	$servers = db->get_results($sql);
	$ips = array();
	$bl =array();
	$lookfor = '';
	$lookforid ='';
	foreach ($servers as $server) {
		// get system bans
		$ip_ban_location = "{$server['location']}/{$server['game']}/cfg/banned_ip.cfg";
		$id_ban_location = "{$server['location']}/{$server['game']}/cfg/banned_user.cfg";
		if(in_array($ip_ban_location,$bl) or in_array($id_ban_location,$bl )) {continue;}
		if(is_file($ip_ban_location)) {$ip_system_bans = explode(PHP_EOL,trim(file_get_contents($ip_ban_location)));}
		if(is_file($id_ban_location)) {$id_system_bans = explode(PHP_EOL,trim(file_get_contents($id_ban_location)));}
		foreach ($ip_system_bans as $system_ban) {
			// split this up
			$tmp = explode(" ",$system_ban);
			if(!isset($tmp[1])) { continue;}
			unset($tmp[0]);
			$unit['ip' ] = $tmp[2];
			$unit['ipl' ] = ip2long(trim($tmp[2]));
			$unit['time'] = $tmp[1];
			$game = $server['game'];
			$x['ip'][$unit['ipl']] =$unit;
			$lookfor .= "or ip = {$unit['ipl']} ";
		}
		foreach($id_system_bans as $system_ban) {
			$id_count = count($id_system_bans) ;
			if(empty($tmp[2])) {continue;}
			$tmp = explode(" ",$system_ban);
			if (!empty($tmp[2])) {
				$steam_id = new SteamID(trim($tmp[2]));
				$id64 = $steam_id->ConvertToUInt64();
			}
			else{continue;}
			$unit1['id'] = $id64;
			$unit1['test'] = $tmp[2];
			$unit1['time'] = $tmp['1'];
			$unit1['poo'] = "shit";
			$x['id'][$id64]=$unit1;
			$lookforid .= "or steam_id64 like '$id64' ";
		}
		$bl[] =$ip_ban_location;
		$bl[] =$id_ban_location;
	}
	$sql = "select * from players where ".substr($lookfor,2);
	$system_ips = db->get_results($sql);
	foreach ($system_ips as $system_ip) {
		$ips = $system_ip['ip'];
		$x['ip'][$ips]['name'] = $system_ip['name_c'];
		$x['ip'][$ips]['steam_id'] = $system_ip['steam_id64'];
		$x['ip'][$ips]['last_log_on'] = date("d-m-Y",$system_ip['last_log_on']);
	}
	$line='';
	foreach ($x['ip'] as $y) {
		if(empty($y['ip'])){continue;} 
		if(isset($y['name'])) {
			$id = $y['steam_id'];
			$name = $y['name'];
			$name = "<a href='users.php?id=$id'>$name</a>";
			if($y['last_log_on'] == 0) {$logon = "-";}
			else {$logon = $y['last_log_on'];}
		}
		else {
			$name = "-";
			$logon = "-";
		}
		$line .= "<tr><td>{$y['ip']}</td><td style='text-align:center;'>$name</td><td style='text-align:center;'>$logon</td></tr>";
	}
	$sql = "select * from players where ".substr($lookforid,2);
	$system_ips = db->get_results($sql);
	foreach ($system_ips as $system_ip) {
		$ips = $system_ip['steam_id64'];
		$x['id'][$ips]['name'] = $system_ip['name_c'];
		if(empty($system_ip['steam_id64'])) {$x['id'][$ips]['steam_id'] = $ips;}
		else {$x['id'][$ips]['steam_id'] = $system_ip['steam_id64'];}
		$x['id'][$ips]['last_log_on'] = date("d-m-Y",$system_ip['last_log_on']);
	}
	foreach ($x['id'] as $y) {
		$id = $y['test'];
		if(isset($y['name'])) {
			$name = $y['name'];
			$name = "<a href='users.php?id=$id'>$name</a>";
			if($y['last_log_on'] == 0) {$logon = "-";}
			else {$logon = $y['last_log_on'];}
		}
		else {
			$name = "-";
			$logon = "-";
			$link = $y['id'];
			$id = "<a href='http://steamcommunity.com/profiles/$link' target='_blank'>$id</a>";
		}
		$line .= "<tr><td>$id</td><td style='text-align:center;'>$name</td><td style='text-align:center;'>$logon</td></tr>";
	}
	$ip_count = count($x['ip']);
	$id_count = count($x['id']);
	$page['sysbans_count'] = $ip_count+$id_count;
	$page['sys_bans'] = $line;
}

function general () {
	global $page;
	$sql = "select * from logins limit 1";
	$country = db->get_row($sql);
	$page['country'] = $country['country'];
	$page['country_stat'] = "{$country['logins']} / {$country['players']}";
	$sql = "SELECT count(*) as player_count,sum(log_ons) as login_count, sum(time_on_line) as total_time from players"; //get player count & time on line
	$stats = db->get_row($sql);
	$page['player_total'] = $stats['player_count'];
	$page['total_time'] = convertSecToTime($stats['total_time']);
	$sql = "SELECT name_c as user_name,time_on_line as play_time, players.log_ons as total_logins, players.steam_id64 as steam_id FROM `players` WHERE `players`.time_on_line = (SELECT MAX(time_on_line) FROM players)";
	$stats = db->get_row($sql);
	$page['time_online'] = "<a href='users.php?id={$stats['steam_id']}'>{$stats['user_name']}</a>";
	$page['time_online_count'] = convertSecToTime($stats['play_time']);
	$sql = "SELECT name_c as user_name,time_on_line as play_time, players.log_ons as total_logins, players.steam_id64 as steam_id FROM `players` WHERE `players`.log_ons = (SELECT MAX(log_ons) FROM players)";
	$stats = db->get_row($sql);
	$page['most_log_ons'] = "<a href='users.php?id={$stats['steam_id']}'>{$stats['user_name']}</a>";
	$page['log_on_count'] = $stats['total_logins'];
	$sql = "SELECT servers.server_name,player_history.game as server_id,count(player_history.`game`) as total FROM `player_history` left join servers on player_history.game= servers.host_name group by player_history.`game` order by total desc limit 1;";
	$stats = db->get_row($sql);
	$page['most_popular'] = $stats['server_name'];
	$page['most_popular_count'] = $stats['total'];
	
}
function country() {
	global $page;
	$sql = "SELECT COUNT(*) AS total, ( SELECT COUNT(*) FROM sb_comms WHERE `RemovedOn` IS NULL ) AS live, ( SELECT COUNT(*) FROM sb_bans ) AS game_total, (select count(*) as game_live from sb_bans where RemovedOn is null) as game_live FROM `sb_comms`";
	$comms = db2->get_results($sql);
	$sql = "SELECT `country`, `flag`, `country_code` FROM `logins` order by `country` ASC";
	$c1 = db->get_results($sql);
	$page['c_select'] ="<option>none selected</option>";
	foreach ($c1 as $c2) {
		if($c2['country'] == ''){continue;}
		$page['c_select'] .="<option value='{$c2['country_code']}' flag='{$c2['flag']}'>{$c2['country']}</option>"; 
	}
	$page['comms_total'] = $comms[0]['total'];
	$page['comms_live'] = $comms[0]['live'];
	$page['game_live'] = $comms[0]['game_live'];
	$page['game_total'] = $comms[0]['game_total'];
}*/
