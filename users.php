<?php
/*
 * users.php
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
require DOC_ROOT. '/inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
	use xPaw\SourceQuery\SourceQuery;
	define( 'SQ_TIMEOUT',     $settings['SQ_TIMEOUT'] );
	define( 'SQ_ENGINE',      SourceQuery::SOURCE );
	define( 'LOG',	'logs/ajax.log');
$module = "users";	
$build = "3362-1104287304";
$version = "1.010";
$time = "1663578087";
$we_are_here = $settings['url'];
$url = $settings['url'];
$header_vars['title'] = "$module - $bserver";
$sql = "select * from server1 order by `host_name` ASC";
$servers = $database->get_results($sql);
/*foreach ($servers as $server) {
	$fname = trim($server['host_name']);
        $href = "gameserver.php?server=$fname";
        if(!$server['enabled']) {
             $sidebar_data['smenu'] .='<li><a class="" href="'.$href.'" style="color:red;"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
             continue;
       }

	$href = 'gameserver.php?server='.$server['host_name'];
	if ($bserver == $server['host_name'] ) {$class = 'active';} else {$class='';}
	$sidebar_data['smenu'] .='<li><a class="'.$class.'" href="'.$href.'"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
}
$sql = "select * from base_servers where `enabled` = 1 and `extraip` = 0 ORDER BY `fname` ASC";
$base_servers = $database->get_results($sql);
foreach ($base_servers as $server) {
	$sidebar_data['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
}
	*/
	
if(isset($_GET['id'])) {	
	//workout_options ($_GET);
	$page['userid'] = $_GET['id'];
}	 
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['title'] = "User Editor";
$template->load('templates/subtemplates/header.html'); // load header
$template->replace_vars($header_vars);
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] =$template->get_template();
//<a class="nav-link collapsed" id="users" href="users.php">
$page['sidebar'] = str_replace("class=\"nav-link collapsed\" id=\"$module\" ","class=\"nav-link\"  id=\"$module\" ",$page['sidebar']);
$template->load('templates/subtemplates/footer.html');
$page['footer'] = $template->get_template();
$page['bserver'] = $bserver;
$page['page-title'] = "Players";
$page['url'] = $url;
$template->load('templates/users.html');
//echo "page url is {$page['url']}";
//die();
$template->replace_vars($page);
$template->replace_vars($this_server);
$template->publish();
function workout_options ($get) {
	// see if we need to jump
	global $page;
	print_r($get);
	die();
}
?>
