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
$bserver = explode('=',$_SERVER['QUERY_STRING']);
$we_are_here = dirname($_SERVER['SCRIPT_NAME']);
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
$info = get_server_info($this_server);
$this_server = array_change_key_case(array_merge_recursive($this_server,$info));
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
$page['url'] = $x;
$template->load('templates/gameserver.html');
$template->replace_vars($page);
$template->replace_vars($this_server);
$template->publish();

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
