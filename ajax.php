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
 *  jquery back end for the demo project
 */

include "inc/master.inc.php"; // get set up
require DOC_ROOT. '/inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
use xPaw\SourceQuery\SourceQuery;
$module = $_GET['module'];
switch ($module) {
	case 'index':
		//echo "module = $module";
		$page['players'] = 0;
		define( 'SQ_TIMEOUT',     $settings['SQ_TIMEOUT'] );
		define( 'SQ_ENGINE',      SourceQuery::SOURCE );
		define( 'LOG',	'logs/ajax.log');
		$sql = "select * from server1 order by `host_name` ASC";
		$xpaw = new SourceQuery( );
		$servers = $database->get_results($sql);
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
												}
						
														
									}
	$xpaw->Disconnect();
	if (isset ($info['Players']) or $info['Players'] >0) {
		//
		// add them up here
		$players = $info['Players'] - $info['Bots'];
		$page['players'] = $page['players']+$players;
	}	
}


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
	    echo json_encode($page);
		break;
	}

?>
