<?php
if(isset($_GET['debug'])) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
}
include 'inc/master.inc.php';
define( 'LOG',	'logs/ajax.log');
$module = "Dashboard";	
$build = "8669-4063036449";
$version = "1.010";
$time = "1664264149";
$we_are_here = $settings['url'];
$template = new template;
//die();
$sql = "select * from server1 order by `host_name` ASC";
$servers = $database->get_results($sql);
$page['gd'] ='';
foreach ($servers as $server) {
	$fname = trim($server['host_name']);
	$href = "console.php?server=$fname";
	$game_link= "steam://connect/{$server['host']}:{$server['port']}/";
	if(empty($server['starttime'])) { $server['starttime']= 0;}
	$start = date("d-m-y  h:i:s a",$server['starttime']);
	$fname = trim($server['host_name']);
	$disp ='style="display:none;"';
	$template->load('templates/subtemplates/server_card.html');
	$lserver['id'] = $fname;
	$lserver['server_name'] = $server['server_name'];
	$lserver['console_link'] = $href;
	$lserver['detail_link'] = "gameserver.php?server=$fname";
	$lserver['setting_link'] = "settings.php?id=$fname";
	$lserver['game_link'] = $game_link; 
	$ban_location = "{$server['location']}/{$server['game']}/cfg/banned_ip.cfg";
	$system_bans = explode(PHP_EOL,file_get_contents($ban_location));
	$lserver['system_bans'] = count($system_bans);	
	 $template->replace_vars($lserver);
     $page['gd'] .= $template->get_template();
     
}
$page['country_data'] = "";
for($i=0; $i<12; $i++) {
	$template->load('templates/subtemplates/country_card.html');
	$country['id'] = "country-$i";
	$template->replace_vars($country);
	$page['country_data'] .= $template->get_template();
}

$page['fpd'] = '';

for($i=0; $i<9; $i++){
	$template->load('templates/subtemplates/player_card.html');
	$steam_info['uid'] = "player$i";
	$template->replace_vars($steam_info);
	$page['fpd'] .=$template->get_template();
}

$header_vars['php'] = "PHP";
$header_vars['gsm'] = "gsm";
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['title'] = $module;
$template->load('templates/subtemplates/header.html'); // load header
$template->replace_vars($header_vars);
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] =$template->get_template();
$page['url'] = $we_are_here.'/ajax.php';
$page['uri'] = $we_are_here;
$template->load('templates/subtemplates/alert.html');
$page['alert'] = $template->get_template();
$template->load('templates/subtemplates/user-frame.html');
$page['userframe'] = $template->get_template();
$template->load('templates/index.html');
//echo $page['jsa'];
$template->replace("jsa",$page['jsa']);
$template->replace("country_data",$page['country_data']);
$template->replace("gd",$page['gd']);
$template->replace("fpd",$page['fpd']);
$template->replace("header",$page['header']);
$template->replace_vars($page);
$template->replace_vars($sidebar_data);
$template->publish();
