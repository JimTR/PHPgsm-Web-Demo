<?php
include 'inc/master.inc.php';
define( 'LOG',	'logs/ajax.log');
$module = "Dashboard";	
$build = "8669-4063036449";
$version = "1.010";
$time = "1664264149";
$we_are_here = $settings['url'];
$template = new template;
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
	$key = searchforkey($fname, $todays_players,'server');
	if ($key === false) {$player_tot = 0; }
	else {$player_tot = $todays_players[$key]['today']; }
	$disp ='style="display:none;"';
	$template->load('templates/subtemplates/server_card.html');
	$lserver['id'] = $fname;
	$lserver['server_name'] = $server['server_name'];
	$lserver['console_link'] = $href;
	$lserver['detail_link'] = "gameserver.php?server=$fname";
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
$template->load('templates/index.html');
$template->replace_vars($page);
$template->publish();
$database->disconnect();

function searchforkey($id, $array,$col) {
	foreach ($array as $key => $val) {
		if ($val[$col] === $id) {
			return $key;
		}
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
	//return $interval->format('%y y %m mo %d d, %h h %i m %s s'); // convert into Years, Months, Days, Hours, Minutes and Seconds
	return $return;
}