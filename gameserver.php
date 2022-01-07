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
   $Auth = new Auth ();
        $user = $Auth->getAuth();
$bserver = explode('=',$_SERVER['QUERY_STRING']);
$we_are_here = $settings['url'];
if($user->loggedIn()) {
		//set the sidebar option to logout;
   	}
   	else {
		redirect('login.php');
		
	}
$is[0] = 'N/A';
require DOC_ROOT. '/inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
use xPaw\SourceQuery\SourceQuery;
		define( 'SQ_TIMEOUT',     $settings['SQ_TIMEOUT'] );
		define( 'SQ_ENGINE',      SourceQuery::SOURCE );
		define( 'LOG',	DOC_ROOT.'/logs/ajax.log');
$bserver = trim($bserver[1]);
//echo "$bserver<br>";
$template = new template;
$sidebar_data = array();
$header_vars['title'] = "Server $bserver";
$sql = "select * from server1 order by `host_name` ASC";
$sidebar_data['smenu'] = '';
$servers = $database->get_results($sql);
foreach ($servers as $server) {
	$href = $we_are_here.'/gameserver.php?server='.$server['host_name'];
	$sidebar_data['smenu'] .='<li><a class="" href="'.$href.'"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
}
$sql = "select * from base_servers where `enabled` = '1' and `extraip` = '0' ";
$base_servers = $database->get_results($sql);
foreach ($base_servers as $server) {
	$sidebar_data['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
}
$sql = "select * from server1 where host_name = '$bserver'";
$this_server =  $database->get_row($sql);
$this_server['server_update'] = date("d-m-Y H:i:s a",$this_server['server_update']);
if ($this_server['starttime']) {$this_server['starttime'] = date("d-m-Y H:i:s a",$this_server['starttime']);}
$info = get_server_info($this_server);
$v = json_decode(geturl($this_server['url'].'/ajaxv2.php?action=game_detail&filter='.$bserver),true);
//$info = array_merge($info,array_change_key_case($v[$bserver]));
if ($info['l_status'] == 'offline') {
	$page['display'] = 'hidden';
	$page['buttons'] =  '<td  id="start"><button id="stop_server" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#quit_game"><i class="bi bi-exclamation-octagon"></i> Start Server</button></td>';
	$page['buttons'] .= '<td id="settings"><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit"><i class="ri-edit-2-line"></i> Settings</button></td>';
	}
else {
	$page['buttons'] = ' <td class="<!--#display#-->" id="stop"><button id="stop_server" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#quit_game"><i class="bi bi-exclamation-octagon"></i> Stop Server</button></td>
					  					<td class="<!--#display#-->" id="restart"><button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#ban_user"><i class="ri-restart-line"></i> Restart Server</button></td>
					<td class="<!--#display#-->" id="join"><button type="button" class="btn btn-primary"><i class="fa fa-gamepad"></i> <a style="color:#fff;" href="<!--#join_link#-->"> Join Server</a></button></td>
				
					<td class="<!--#display#-->" id="cvar"><button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalDialogScrollable"><i class="ri-booklet-line"></i> View C Vars</button></td>
					<td id="settings"><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit"><i class="ri-edit-2-line"></i> Settings</button></td>';
}	
$this_server = array_change_key_case(array_merge_recursive($this_server,$info));
$this_server['players'] -= $this_server['bots'];
//$this_server['rserver_update'] = date('d-m-y h: i:s a',$this_server['rserver_update']);
if ($this_server['secure']) {$this_server['secure'] = 'true';} else {$this_server['secure'] = 'false';}
$page['join_link'] = 'steam://connect/'.$this_server['host'].':'.$this_server['port'].'/'; 
$is = explode("\t",trim(shell_exec('du -hs '.$this_server['install_dir'])));
$this_server['install_size'] = $is[0];
$x = json_encode($this_server);
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['title'] = "Game Server $bserver";
$template->load('templates/subtemplates/header.html'); // load header
$template->replace_vars($header_vars);
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] =$template->get_template();
$template->load('templates/subtemplates/footer.html');
$page['footer'] = $template->get_template();
$page['bserver'] = $bserver;
//$page['url'] = $x;
//$v = json_decode(geturl($this_server['url'].'/ajaxv2.php?action=game_detail&filter='.$bserver),true);
//$v[$bserver] = array_change_key_case($v[$bserver]);
//die(print_r($v,true));
$template->load('templates/gameserver.html');
$template->replace_vars($page);
$template->replace_vars($this_server);
$template->replace_vars($v[$bserver]);
$template->publish();

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
												if (strpos($Exception,'Failed to read any data from socket')) {
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
?>
