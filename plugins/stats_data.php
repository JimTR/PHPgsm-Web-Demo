<?php
/*
 * stats_data.php
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
	define('debug',true);
}
 include '../inc/master.inc.php';
 
   if (isset($_GET)) {
	  $options= array();
	  $options = $_GET;
	  if(isset($_POST)) {
		  $options = array_merge($options,$_POST);
	  }
  }
  //printr($options);
  define ('options',$options);
  if(isset(options['page'])) { echo " we are at ".options['page']."<br>";}
  define('per_page', settings['stats']['per_page']);
  switch (strtolower($options['action'])) {
	 case 'country':
		country();
		break;
	case 'sb-ban':
		sb_bans();
		break;
	case 'vac-ban':
		vac_bans();
		break;
	case 'sys-bans':
		system_bans();
		break;
	case 'dups':
		ip_dups();
		break;
	case 'general':
		general();
		break;					
}
 function country() {
	$sql = "SELECT COUNT(*) AS total, ( SELECT COUNT(*) FROM sb_comms WHERE `RemovedOn` IS NULL ) AS live, ( SELECT COUNT(*) FROM sb_bans ) AS game_total, (select count(*) as game_live from sb_bans where RemovedOn is null) as game_live FROM `sb_comms`";
	$comms = db2->get_results($sql);
	$sql = "SELECT `country`, `flag`, `country_code` FROM `logins` order by `country` ASC";
	$c1 = db->get_results($sql);
	$country['c_select'] ="<select><option>none selected</option>";
	foreach ($c1 as $c2) {
		if($c2['country'] == ''){continue;}
		$country['c_select'] .="<option value='{$c2['country_code']}' flag='{$c2['flag']}'>{$c2['country']}</option>"; 
	}
	$country['c_select'] .="</select>";
	$country['comms_total'] = $comms[0]['total'];
	$country['comms_live'] = $comms[0]['live'];
	$country['game_live'] = $comms[0]['game_live'];
	$country['game_total'] = $comms[0]['game_total'];
	//printr($country);
	echo json_encode($country,JSON_UNESCAPED_SLASHES);
}

function sb_bans() {
	$sql = "select * from sb_bans where RemovedON is null order by created DESC";
	$sb_bans = db2->get_results($sql);
	$lookfor = '';
	$output['sb_count'] =count($sb_bans);
	foreach ($sb_bans as $sb_ban) {
		if(isset($sb_ban['ip'])) {$ip = ip2long($sb_ban['ip']);}
		$created = date("d-m-Y",$sb_ban['created']);
		$ends = date("d-m-Y",$sb_ban['ends']);
		if(!empty($sb_ban['authid'])) {
			$steam_id = new SteamID($sb_ban['authid']);
			$id64 = $steam_id->ConvertToUInt64();
			$lookfor .= "or steam_id64 like '$id64' ";
		}
		$newdata =  array (
			'ip' => $ip,
			'steam_id' => $id64,
			'name' => $sb_ban['name'],
			'reason' => $sb_ban['reason'],
			'created' => $created,
			'ends'=> $ends
		);
		$bans[] = $newdata;	
	}
	$sql = "select * from players where ".substr($lookfor,2);
	$db_users = db->get_results($sql);
	foreach($db_users as $db_user) {
		$id = $db_user['steam_id64'];
		$key = array_search($id, array_column($bans, 'steam_id'));
		$bans[$key]['last_log_on'] = date("d-m-Y",$db_user['last_log_on']);
		$bans[$key]['name'] = "<a href='users.php?id=$id'>{$db_user['name_c']}</a>";
		$bans[$key]['server'] = $db_user['server'];
	}
	$line ='';
	foreach ($bans as $ban) {
		if (!isset($ban['last_log_on'])) {$ban['last_log_on'] = '-';}
		$line .= "<tr><td>{$ban['name']}</td><td>{$ban['created']}</td><td>{$ban['last_log_on']}</td></tr>";
	}
	$output['sb_bans'] = $line;
	//printr($output);
	echo json_encode($output,JSON_UNESCAPED_SLASHES);
	
}

function vac_bans(){
	$output['vac_bans'] = '';
	$time_start = microtime(true);
	$sql = "SELECT players.name_c,players.aka,players.last_log_on,players.steam_id64,steam_data.* FROM `steam_data` left join players on steam_data.steam_id = players.steam_id64 WHERE steam_data.vac_ban = 1 order by players.last_log_on DESC;";
	$vac_bans = db->get_results($sql);
	$output['vac_count'] = count($vac_bans);
	//$vac_bans = paginate($vac_bans,0,per_page);
	//$output['total_pages'] = $vac_bans['pages'];
	//$output['current_page'] = $vac_bans['page']+1;
	foreach ($vac_bans as $vac_ban) {
		// who has a vac ban
		$name = $vac_ban['name_c'];
		$last_ban = date("d-m-Y",$vac_ban['last_ban']);
		$last_ban ="<span style='color:red;font-weight:bold;'>$last_ban</span>";
		$title=  "$name has a current VAC ban";
		$last_logon = date("d-m-Y",$vac_ban['last_log_on']);
		if($vac_ban['last_ban'] ==0){
			$date = strtotime("$last_logon -7 years");
			$date = date("d-m-Y",$date);
			$title =  "$name&#39;s last ban was at least 7 years ago";
			$last_ban = "<span style='color:orange;font-weight:bold;'>$date</span>"; 
		} 
		if(empty($vac_ban['name_c'])) { 
			$vac_ban['name_c'] = $vac_ban['steam_id']; // we don't have the user logged in
			$player_link = "<a href='users.php?id={$vac_ban['steam_id']}'>{$vac_ban['name_c']}</a>";
		}
		else {
			$player_link = "<a href='users.php?id={$vac_ban['steam_id']}'>{$vac_ban['name_c']}</a>";
		}
		$output['vac_bans'] .= "<tr title='$title'><td style='width:45%;overflow:hidden;white-space: nowrap;'>$player_link</td><td>$last_ban</td><td>$last_logon</td></tr>";
	}
	$time_end = microtime(true);
	$output['exe_time'] = ($time_end - $time_start)/60;
	echo json_encode($output,JSON_UNESCAPED_SLASHES);
}
function system_bans() {
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
		if(empty($system_ip['steam_id64'])) {$x['id'][$ips]['steam_id64'] = $ips;}
		else {$x['id'][$ips]['steam_id'] = $system_ip['steam_id64'];}
		$x['id'][$ips]['last_log_on'] = date("d-m-Y",$system_ip['last_log_on']);
	}
	foreach ($x['id'] as $y) {
		$id = $y['ips'];
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
			$id = "<a href='http://steamcommunity.com/profiles/$link' target='_blank'>$link</a>";
		}
		$id_line .= "<tr><td class='user'>$id</td><td style='text-align:center;'>$name</td><td style='text-align:center;'>$logon</td></tr>";
	}
	$ip_count = count($x['ip']);
	$id_count = count($x['id']);
	$output['sysbans_count'] = $ip_count+$id_count;
	$output['sys_bans'] = $line;
	$output['sys_bans_id'] = $id_line;
	echo json_encode($output,JSON_UNESCAPED_SLASHES);
}
function ip_dups() {
	$sql = "SELECT * FROM players INNER JOIN( SELECT ip FROM players GROUP BY ip HAVING COUNT(ip) > 1 ORDER BY ip ) temp ON players.ip = temp.ip LEFT JOIN steam_data AS s ON players.steam_id64 = s.steam_id ORDER BY `players`.`ip` ASC;" ;// get dups
	$dups = db->get_results($sql);
	$i=0;
	$output['dup_count'] = count($dups);
	$last_ip='';
	foreach($dups as $dup) {
	// scan through
		if ($dup['vac_ban']) { $bans = '<i class="fa-regular fa-circle-xmark" style="color:red;font-weight: 600;"></i>';}
		else {$bans = '';}
		$id = $dup['steam_id64'];
		if ($dup['ip'] == $last_ip) {
			// add to the row
			$i--;
			$last_login = date("d-m-y  h:i:s a",$dup['last_log_on']);
			$dup_table[$i]['name'] .="<div><div style='width:31%;float:left;clear:both;padding-bottom:1%;'><a href='javascript:void(0)' class='user-id' id='$id' title='Last Seen $last_login'>{$dup['name_c']}</a></div><div style='width:19%;float:left;'>$last_login</div><div style='text-align:center;width: 37%;float:left;'>{$dup['log_ons']}</div><div style='width:11%;float:left;'>$bans</div></div>";
			$i++;
			continue;
		}
		$dup_table[$i]['ip'] = long2ip($dup['ip']);
		$last_login = date("d-m-y  h:i:s a",$dup['last_log_on']);
		$dup_table[$i]['name'] = "<div><div style='width:31%;float:left;padding-bottom:1%;'><a href='javascript:void(0)' class='user-id' id='$id' title='Last Seen $last_login'>{$dup['name_c']}</a></div><div style='width:19%;float:left;padding-bottom:1%;'>$last_login</div><div style='text-align:center;width: 37%;float:left;padding-bottom:1%;'>{$dup['log_ons']}</div><div style='width:11%,float:left;'>$bans</div></div>"; 
		$last_ip = $dup['ip'];
		$i++;
	}
	//$dup_table = paginate($dup_table,0,100);
	//print_r($dup_table);
	//die();
	$page['dups'] ='';
	foreach ($dup_table as $dup) {	
		$output['dups'] .= "<tr><td style='vertical-align:middle;'>{$dup['ip']}</td><td colspan=4>{$dup['name']}</td></tr>";
	}
	echo json_encode($output,JSON_UNESCAPED_SLASHES);
}
function general () {
	$sql = "select * from logins limit 1";
	$country = db->get_row($sql);
	$output['country'] = $country['country'];
	$output['country_stat'] = "{$country['logins']} / {$country['players']}";
	$sql = "SELECT count(*) as player_count,sum(log_ons) as login_count, sum(time_on_line) as total_time from players"; //get player count & time on line
	$stats = db->get_row($sql);
	$output['player_total'] = $stats['player_count'];
	$output['total_time'] = convertSecToTime($stats['total_time']);
	$sql = "SELECT name_c as user_name,time_on_line as play_time, players.log_ons as total_logins, players.steam_id64 as steam_id FROM `players` WHERE `players`.time_on_line = (SELECT MAX(time_on_line) FROM players)";
	$stats = db->get_row($sql);
	$output['time_online'] = "<a href='users.php?id={$stats['steam_id']}'>{$stats['user_name']}</a>";
	$output['time_online_count'] = convertSecToTime($stats['play_time']);
	$sql = "SELECT name_c as user_name,time_on_line as play_time, players.log_ons as total_logins, players.steam_id64 as steam_id FROM `players` WHERE `players`.log_ons = (SELECT MAX(log_ons) FROM players)";
	$stats = db->get_row($sql);
	$output['most_log_ons'] = "<a href='users.php?id={$stats['steam_id']}'>{$stats['user_name']}</a>";
	$output['log_on_count'] = $stats['total_logins'];
	$sql = "SELECT servers.server_name,player_history.game as server_id,count(player_history.`game`) as total FROM `player_history` left join servers on player_history.game= servers.host_name group by player_history.`game` order by total desc limit 1;";
	$stats = db->get_row($sql);
	$output['most_popular'] = $stats['server_name'];
	$output['most_popular_count'] = $stats['total'];
	$sql = "SELECT servers.server_name,player_history.`game`,sum(player_history.`game_time`) as full_time, count(player_history.game) as player_tot  FROM `player_history` left join servers on player_history.game= servers.host_name group by player_history.game ORDER BY `full_time` DESC ";
	$stats = db->get_results($sql);
	$output['most_played_time'] =convertSecToTime($stats[0]['full_time']);
	$output['most_played'] = $stats[0]['server_name'];
	//$page['game_list'] ='';
	foreach ($stats as $stat) {
		if ($stat['full_time'] == 0) {continue;}
		$used_time = convertSecToTime($stat['full_time']);
		$output['game_list'][] = "<tr><td><a href='gameserver.php?server={$stat['game']}'>{$stat['server_name']}</a></td><td>$used_time</td><td>{$stat['player_tot']}</td></tr>";
	}
	$sql = "SELECT COUNT(*) AS total, ( SELECT COUNT(*) FROM sb_comms WHERE `RemovedOn` IS NULL ) AS live, ( SELECT COUNT(*) FROM sb_bans ) AS game_total, (select count(*) as game_live from sb_bans where RemovedOn is null) as game_live FROM `sb_comms`";
	$comms = db2->get_results($sql);
	//$sql = "SELECT `country`, `flag`, `country_code` FROM `logins` order by `country` ASC";
	$output['comms_total'] = $comms[0]['total'];
	$output['comms_live'] = $comms[0]['live'];
	$output['game_live'] = $comms[0]['game_live'];
	$output['game_total'] = $comms[0]['game_total'];
	$sql = "SELECT `country`, `flag`, `country_code` FROM `logins` order by `country` ASC";
	$c1 = db->get_results($sql);
	
	$i=0;
	$output['c_select'][$i]="none selected";
	$i=1;
	foreach ($c1 as $c2) {
		if($c2['country'] == ''){continue;}
		//$output['c_select'] .="<option value='{$c2['country_code']}' flag='{$c2['flag']}'>{$c2['country']}</option>";
		$output['c_select'][$i]['value'] = $c2['country_code'];
		$output['c_select'][$i]['country'] = $c2['country'];
		$output['c_select'][$i]['flag'] = $c2['flag'];
		$i++;
	}
	echo json_encode($output,JSON_UNESCAPED_SLASHES);
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