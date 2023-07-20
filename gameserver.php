<?php
/*
 * gameserver.php
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
 * game server start up 
 */
//echo "hello there <br>";
include 'inc/master.inc.php';
$build = "5164-1513887087";
$version = "1.001";
$time = "1663578049";
$module = "Game_Server";
$bserver = explode('=',$_SERVER['QUERY_STRING']);
$we_are_here = $settings['url'];
$header_vars['title'] = "$module";
$is[0] = 'N/A';
require DOC_ROOT. '/inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
use xPaw\SourceQuery\SourceQuery;
	define( 'SQ_TIMEOUT',     $settings['SQ_TIMEOUT'] );
	define( 'SQ_ENGINE',      SourceQuery::SOURCE );
	define( 'LOG',	DOC_ROOT.'/logs/ajax.log');
$bserver = trim($bserver[1]);
//echo "$bserver<br>";
 $page['max_upload'] = dataSize(file_upload_max_size());
 $template = new template;
$sql = "select * from server1 order by `host_name` ASC";
$servers = $database->get_results($sql);
$sql = "select * from server1 where host_name = '$bserver'";
$this_server =  $database->get_row($sql);
define('this_server',$this_server);
$tserver = $this_server['server_name'];
$header_vars['title'] = "$module - $tserver";
//print_r($this_server);
$sql = "SELECT `steam_id`, players.name_c, player_history.`game_time`, players.country, `last_play` FROM `player_history` LEFT JOIN players ON player_history.steam_id = players.steam_id64 WHERE `game` LIKE '$bserver' ORDER BY `game_time` DESC;
";
$players = $database->get_results($sql);
$player_rows ='<tbody>';
$x=0;
foreach ($players as $player) {
	$online = convertSecToTime($player['game_time']);
	if($x >500) {$player_rows .="</tbody><tbody style='display:none'>";}
	$player_rows .= "<tr><td><a href='users.php?id={$player['steam_id']}'>{$player['name_c']}</a></td><td>{$player['country']}</td><td style='text-align:right;padding-right:7%;'>$online</td></tr>";
	$x++;
}
$page['player_list'] = "$player_rows</tbody>";
$this_server['server_update'] = date("d-m-Y H:i:s a",$this_server['server_update']);
if ($this_server['starttime']) {$this_server['starttime'] = date("d-m-Y H:i:s a",$this_server['starttime']);}
$info = get_server_info($this_server);
$uri = parse_url($this_server['url']);
$url = $uri['scheme']."://".$uri['host'].':'.$this_server['bport'];
if(isset($uri['path'])){ $url .= $uri['path'];}
$v = json_decode(geturl("$url/api.php?action=game_detail&filter=$bserver&server=".$this_server['fname']),true); //needs replacing with ajax_send
//$info = array_merge($info,array_change_key_case($v[$bserver]));
$this_server = array_change_key_case(array_merge_recursive($this_server,$info));
$this_server['players'] -= $this_server['bots'];
//$this_server['rserver_update'] = date('d-m-y h: i:s a',$this_server['rserver_update']);
if ($this_server['secure']) {$this_server['secure'] = 'Yes';} else {$this_server['secure'] = 'No';}
//die(print_r($this_server));
$page['join_link'] = 'steam://connect/'.$this_server['host'].':'.$this_server['port'].'/'; 
if($this_server['enabled'] ==0) {$page['checked'] = "checked";}
else {$page['checked'] ='';}
$is = explode("\t",trim(shell_exec('du -hs '.$this_server['install_dir'])));
$this_server['install_size'] = $is[0];
$x = json_encode($this_server);
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['title'] = "Server $tserver";
$template->load('templates/subtemplates/header.html'); // load header
$template->replace_vars($header_vars);
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] =$template->get_template();
$template->load('templates/subtemplates/footer.html');
$page['footer'] = $template->get_template();
$page['bserver'] = $bserver;
$page['file_select'] = $file_select;
$page['url'] = $url;
$template->load('templates/gameserver.html');
$template->replace_vars($page);
$template->replace_vars($this_server);
$template->publish();
//$database->disconnect();

function get_server_info($server) {
	// return xpaw info
	
	$xpaw = new SourceQuery( );
	try
			{
				$xpaw->Connect( $server['host'], $server['port'], SQ_TIMEOUT, SQ_ENGINE );
				$sub_cmd = 'GetInfo';
				$info = $xpaw->GetInfo();
				if ($info['Players'] > 0) {
					// get player list
					$players = $xpaw->GetPlayers();
					if(!empty($players)) {$info['player_list'] = $players;}
				}
				$rules = $xpaw->GetRules();
				$info['vars'] = $rules;
			}
	catch( Exception $e )
		{
			$Exception = $e;
			if (strpos($Exception,'Failed to read any data from socket')) 
			{
				$Exception = 'Failed to read any data from socket Module (Ajax - get_server_info '.$sub_cmd.')';
				//file_put_contents(LOG,$Exception,PHP_EOL,FILE_APPEND);
			}
			$info['l_status'] = 'offline';
			$info['steamid'] = 'N/A';
			$info['map'] = 'N/A';
			$info['hostname'] = 'N/A';
			$xpaw->Disconnect();
			return $info;
		}
	$info['l_status'] = 'online';								
	$xpaw->Disconnect();
	return $info;
}

function in_arrayr($needle, $haystack) {
        foreach ($haystack as $v) {
                if ($needle == $v) return true;
                elseif (is_array($v)) return in_array($needle, $v);
        }
        return false;
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
?>
