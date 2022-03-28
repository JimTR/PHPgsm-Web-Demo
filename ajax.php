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
switch ($module) {
	case 'index':
		//echo "module = $module";
		
		//echo LOG;
		$sql = "select * from server1  where running = 1 order by `host_name` ASC";
		$xpaw = new SourceQuery( );
		$servers = $database->get_results($sql);
		//file_put_contents(LOG,'start'.PHP_EOL,FILE_APPEND);
		foreach ($servers as $server) {
	try
			{
				$xpaw->Connect( $server['host'], $server['port'], SQ_TIMEOUT, SQ_ENGINE );
				$sub_cmd = 'GetInfo';
				$info = $xpaw->GetInfo();
			}
	catch( Exception $e )
										{
												$Exception = $e;
												if (strpos($Exception,'Failed to read any data from socket')) {
														$Exception = 'Failed to read any data from socket Module (Ajax - Game Detail '.$sub_cmd.')';
														//file_put_contents(LOG,$Exception,PHP_EOL,FILE_APPEND);
												}
						
														
									}
	$xpaw->Disconnect();
	
	if (isset ($info['Players']) and $info['Players'] >0) {
		//
		// add them up here
		//print_r($info);
		
		$players = $info['Players'] - $info['Bots'];
		$output = 'info->HostName = '.$info['HostName'].' $page->players = '.$page['players'].' info->Players = '.$info['Players'].' info->bots = '.$info['Bots']." \$players = $players".PHP_EOL;
		$page['players'] = $page['players']+$players;
		
		//file_put_contents(LOG,$output,FILE_APPEND);
		unset($info);
	}	
}
//file_put_contents(LOG,'end'.PHP_EOL,FILE_APPEND);

		$sql = "SELECT sum(players) as player_tot, count(country) as countries, sum(logins) as tot_logins, (select count(*) from servers) as game_tot, (select count(*) from servers where running = 1) as run_tot  FROM `logins` WHERE 1";
		$qstat = $database->get_row($sql);
		$page['player_tot'] =  $qstat['player_tot'];
		$page['logins_tot'] = $qstat['tot_logins'];
		$page['country_tot'] = $qstat['countries'];
		$page['game_tot'] = $qstat['game_tot'];
		$page['run_tot'] = $qstat['run_tot'];
		$sql = "SELECT * FROM `logins` limit 10";
		$countries = $database->get_results($sql);
		foreach ($countries as $country) {
			// do stats
		$country['flag'] = 'https://ipdata.co/flags/'.trim(strtolower($country['country_code'])).'.png';
	}
		//print_r($page);
		$qstat['players']= $page['players'];
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
	}
	
function get_server_info($server) {
	// return xpaw info
	
	$xpaw = new SourceQuery( );
	try
			{
				$xpaw->Connect( $server['host'], $server['port'], SQ_TIMEOUT, SQ_ENGINE );
				$sub_cmd = 'GetInfo';
				$info = $xpaw->GetInfo();
			}
	catch( Exception $e )
										{
												$Exception = $e;
												if (strpos($Exception,'Failed to read any data from socket')) {
														$Exception = 'Failed to read any data from socket Module (Ajax - get_server_info '.$sub_cmd.')';
														file_put_contents(LOG,$Exception,PHP_EOL,FILE_APPEND);
												}
						
														
									}
	$xpaw->Disconnect();
	return($info);
}
?>
