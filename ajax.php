<?php
/*
 * ajax.php
 * 
 * Copyright 2021 Jim Richardson <jim@noideersoftware.co.uk>
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
 *  jquery back end for the demo project perhaps
 */
$build = "4464-1701218109";
$version = "1.000";
$time = "1648452191";
$module = "Comunication";
include "inc/master.inc.php"; // get set up
require DOC_ROOT. '/inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
use xPaw\SourceQuery\SourceQuery;
$module = $_GET['module'];
$page['players'] = 0;
define( 'SQ_TIMEOUT',     $settings['SQ_TIMEOUT'] );
define( 'SQ_ENGINE',      SourceQuery::SOURCE );
define( 'LOG',	DOC_ROOT.'/logs/ajax.log');
define('cr',PHP_EOL);
switch ($module) {
	case 'index':
		$sql = "select * from server1  where running = 1 order by `host_name` ASC";
		$xpaw = new SourceQuery( );
		$servers = $database->get_results($sql);
		//file_put_contents(LOG,'start'.PHP_EOL,FILE_APPEND);
		foreach ($servers as $server) {
			try{
				$xpaw->Connect( $server['host'], $server['port'], SQ_TIMEOUT, SQ_ENGINE );
				$sub_cmd = 'GetInfo';
				$info = $xpaw->GetInfo();
			}
			catch( Exception $e ){
				$Exception = $e;
				if (strpos($Exception,'Failed to read any data from socket')) {
					$Exception = 'Failed to read any data from socket Module (Ajax - Game Detail '.$sub_cmd.')';
				}
			}
			$xpaw->Disconnect();
			if (isset ($info['Players']) and $info['Players'] >0) {
				$players = $info['Players'] - $info['Bots'];
				$output = 'info->HostName = '.$info['HostName'].' $page->players = '.$page['players'].' info->Players = '.$info['Players'].' info->bots = '.$info['Bots']." \$players = $players".PHP_EOL;
				$page['players'] = $page['players']+$players;
				unset($info);
			}
			$ban_location = "{$server['location']}/{$server['game']}/cfg/banned_ip.cfg";
			$system_bans = explode(cr,file_get_contents($ban_location));
			$qstat['system_bans'] = $ban_location;	
		}
		$sql = "SELECT sum(players) as player_tot, count(country) as countries, sum(logins) as tot_logins, (select count(*) from servers) as game_tot, (select count(*) from servers where running = 1 and enabled = 1) as run_tot  FROM `logins` WHERE 1";
		$qstat = $database->get_row($sql);
		$page['player_tot'] =  $qstat['player_tot'];
		$page['logins_tot'] = $qstat['tot_logins'];
		$page['country_tot'] = $qstat['countries'];
		$page['game_tot'] = $qstat['game_tot'];
		$page['run_tot'] = $qstat['run_tot'];
		$sql = "SELECT * FROM `logins` limit 10";
		$countries = $database->get_results($sql);
		foreach ($countries as $country) {
			$country['flag'] = 'https://ipdata.co/flags/'.trim(strtolower($country['country_code'])).'.png';
		}
		$qstat['players']= $page['players'];
		$sql = "SELECT game as server,count(*) as today FROM player_history WHERE FROM_UNIXTIME(last_play,'%Y-%m-%d') = CURDATE() group by game";
		$todays_players = $database->get_results($sql);   
		foreach ($todays_players as $x) {$qstat['logins_today'] += $x['today'];}
		$sql = 'SELECT `country`,country_code, count(*) as today FROM players WHERE FROM_UNIXTIME(last_log_on,"%Y-%m-%d") = CURDATE() group by country_code order by today desc;';
		$todays_countries = $database->get_results($sql);
		$qstat['country_top_today']= $todays_countries[0]['country'];
		$sql = "SELECT * FROM `logins` limit 12";
		$countries = $database->get_results($sql);
		$qstat['country_top'] = $countries[0]['country'];
		$sql = "select players.name_c,players.country,players.country_code,players.log_ons,players.last_log_on,players.first_log_on,players.steam_id64 from players ORDER BY `players`.`log_ons` DESC LIMIT 9";
		$players = $database->get_results($sql);
		$i=0;
		foreach ($players as $player) {
			$playerN2 = $player['name_c'];
			$player['last_log_on'] = time2str($player['last_log_on']);
			if ($player['last_log_on'] == "1 weeks ago") {$player['last_log_on'] = 'a week ago';}
			$ds = DOC_ROOT;
			//echo "php $ds/plugins/steam_data.php {$player['steam_id64']}";
			//die();
			$v1 = shell_exec("php $ds/plugins/steam_data.php {$player['steam_id64']}");
			$steam_info =json_decode($v1,true);
			
			$steam_info['name'] = $playerN2;
			if ($player['first_log_on'] >0 ) {$player['first_log_on'] = time2str($player['first_log_on']);	}
			else {$player['first_log_on'] = 'N/A';}
			$c_code = trim(strtolower($player['country_code']));
			if ($c_code =="") {$img_src="img/unknown.png";}
			else {$img_src= "https://ipdata.co/flags/$c_code.png";}	
			$player_info[$i]['name'] = $playerN2;
			$player_info[$i]['map'] = "<img style='vertical-align: middle;' src='$img_src' onerror='imgError(this);'/> {$player['country']}";
			$player_info[$i]['joined']= $player['first_log_on'];
			$player_info[$i]['login'] = $player['last_log_on'];
			$player_info[$i]['logins'] = $player['log_ons'];
			$player_info[$i]['detail_link'] = "users.php?id={$player['steam_id64']}";
			$player_info[$i]['uid'] = $player['steam_id64'];
			$player_info[$i]['avatar'] = $steam_info['avatar']; 
			$i++;
		}
		//printr($steam_info);
		//die();
		$sql = "SELECT count(*) as player_count,sum(log_ons) as login_count, sum(time_on_line) as total_time  from players"; //get player count & time on line
		
		$stats = $database->get_results($sql);
		
		//$page['player_total'] = $stats[0]['player_count'];
		$qstat['total_time'] = convertSecToTime($stats[0]['total_time']);
		
		$sql = "SELECT count(*) as player_count,sum(log_ons) as login_count, sum(time_on_line) as total_time  from players";
		$bc = $database->get_results($sql);
		//print_r($bc);
		$qstat['pop_country'] = $bc[0]['country'];
		$qstat['pop_time'] = convertSecToTime($bc[0]['time']);
		//die(print_r($qstat));
		$sql = "SELECT servers.server_name,player_history.`game`,sum(player_history.`game_time`) as full_time FROM `player_history` left join servers on player_history.game= servers.host_name group by player_history.game ORDER BY `full_time` DESC limit 10";
		$stats = $database->get_results($sql);
				$qstat['most_played_time'] =convertSecToTime($stats[0]['full_time']);
		//echo 'full stats'.$stats[0]['full_time'].'<br>';
		
		$qstat['most_played'] = $stats[0]['server_name'];
		//die(print_r($qstat));
		$qstat['player_info'] = $player_info;
		
		
		echo json_encode($qstat);
		break;
		
		case 'gameserver' :
			if (isset($_GET['server'])) {
				$game_server = $_GET['server'];
			}
			else {
				break;
			}
			
		$sql = 'select * from server1 where  host_name ="'.$game_server.'"';
		$server = $database->get_row($sql);
		$page = array_change_key_case(array_merge($server,get_server_info($server)));
		echo json_encode($page);
		break;
		
		case 'colour':
			echo "hello";
			$git_cmd="git status";
			exec($git_cmd,$git_response);
			print_r( $git_response);	
			//printr($settings);
			//echo "the return is {$_COOKIE['phpgsm_colour']}<br>".print_r($_COOKIE['phpgsm_colour'],true);
			if ($_COOKIE['phpgsm_colour'] =='main') {
				
				echo "changing to circle";
			}
			break;
	}
	
function get_server_info($server) {
	// return xpaw info
	$xpaw = new SourceQuery( );
	try{
		$xpaw->Connect( $server['host'], $server['port'], SQ_TIMEOUT, SQ_ENGINE );
		$sub_cmd = 'GetInfo';
		$info = $xpaw->GetInfo();
	}
	catch( Exception $e ){
		$Exception = $e;
		if (strpos($Exception,'Failed to read any data from socket')) {
			$Exception = 'Failed to read any data from socket Module (Ajax - get_server_info '.$sub_cmd.')';
			log_to(LOG,$Exception);
		}
	}
	$xpaw->Disconnect();
	return($info);
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
	//return $interval->format('%y y %m mo %d d, %h h %i m %s s'); // convert into Years, Months, Days, Hours, Minutes and Seconds
	//die($return);
	return $return;
}
?>
