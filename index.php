<?php
include 'inc/master.inc.php';
require DOC_ROOT. '/inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
use xPaw\SourceQuery\SourceQuery;
define( 'SQ_TIMEOUT',     $settings['SQ_TIMEOUT'] );
define( 'SQ_ENGINE',      SourceQuery::SOURCE );
define( 'LOG',	'logs/ajax.log');
$module = "Dashboard";	
$build = "8669-4063036449";
$version = "1.010";
$time = "1664264149";
$we_are_here = $settings['url'];
$sql = "SELECT game as server,count(*) as today FROM player_history WHERE FROM_UNIXTIME(last_play,'%Y-%m-%d') = CURDATE() group by game";
$todays_players = $database->get_results($sql);   
foreach ($todays_players as $x) {$page['logins_today'] += $x['today'];}
$sql = 'SELECT `country`,country_code, count(*) as today FROM players WHERE FROM_UNIXTIME(last_log_on,"%Y-%m-%d") = CURDATE() group by country_code order by today desc;';
$todays_countries = $database->get_results($sql);
$page['country_top_today']= $todays_countries[0]['country'];
$template = new template;
$sql = "select * from server1 order by `host_name` ASC";
$xpaw = new SourceQuery( );
$servers = $database->get_results($sql);
$gd ='';
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
	//$lserver['logo'] = $server['logo'];
	$lserver['console_link'] = $href;
	$lserver['detail_link'] = "gameserver.php?server=$fname";
	$lserver['game_link'] = $game_link; 
	$ban_location = "{$server['location']}/{$server['game']}/cfg/banned_ip.cfg";
	$system_bans = explode(PHP_EOL,file_get_contents($ban_location));
	$lserver['system_bans'] = count($system_bans);	
	 $template->replace_vars($lserver);
     $gd .= $template->get_template();
     
}

$page['gd']= $gd;
$sql = "SELECT sum(players) as player_tot, count(country) as countries, sum(logins) as tot_logins, (select count(*) from servers) as game_tot, (select count(*) from servers where running = 1 and enabled = 1) as run_tot  FROM `logins` WHERE 1";
$qstat = $database->get_row($sql);
$sql = "SELECT servers.server_name,player_history.game as server_id,count(player_history.`game`) as total FROM `player_history` left join servers on player_history.game= servers.host_name group by player_history.`game` order by total desc limit 1;";
$stats = $database->get_results($sql);
//$page['most_popular'] = $stats[0]['server_name'];
//$page['most_popular_count'] = $stats[0]['total'];
$page['player_tot'] =  $qstat['player_tot'];
$page['logins_tot'] = $qstat['tot_logins'];
$page['country_tot'] = $qstat['countries'];
//$page['game_tot'] = $qstat['game_tot'];
//$page['run_tot'] = $qstat['run_tot'];
$sql = "SELECT * FROM `logins` limit 12";
$countries = $database->get_results($sql);
$page['country_top'] = $countries[0]['country'];
//$i=0;
$page['country_data'] = "";
for($i=0; $i<=12; $i++) {
	
	$template->load('templates/subtemplates/country_card.html');
	
	$country['id'] = "country-$i";
	$template->replace_vars($country);
	$page['country_data'] .= $template->get_template();
}

$sql = "select players.name_c,players.country,players.country_code,players.log_ons,players.last_log_on,players.first_log_on,players.steam_id64 from players ORDER BY `players`.`log_ons` DESC LIMIT 9";
$fpd = '';
$players = $database->get_results($sql);
$i=0;
foreach ($players as $player) {
	$playerN2 = $player['name_c'];
	$player['last_log_on'] = time2str($player['last_log_on']);
    if ($player['last_log_on'] == "1 weeks ago") {$player['last_log_on'] = 'a week ago';}
	$v1 = shell_exec("php steampage.php {$player['steam_id64']}");
	$template->load('templates/subtemplates/player_card.html');
	$steam_info =json_decode($v1,true);
	$steam_info['name'] = $playerN2;
	if ($player['first_log_on'] >0 ) {$player['first_log_on'] = time2str($player['first_log_on']);	}
	else {$player['first_log_on'] = 'N/A';}
	$c_code = trim(strtolower($player['country_code']));
	if ($c_code =="") {$img_src="img/unknown.png";}
	else {$img_src= "https://ipdata.co/flags/$c_code.png";}	
	$steam_info['map'] = "<img style='vertical-align: middle;' src='$img_src'/> {$player['country']}";
	$steam_info['joined']= $player['first_log_on'];
	$steam_info['login'] = $player['last_log_on'];
	$steam_info['logins'] = $player['log_ons'];
	$steam_info['detail_link'] = "users.php?id={$player['steam_id64']}";
	$steam_info['uid'] = "player$i";
	$template->replace_vars($steam_info);
	$fpd .=$template->get_template();
	$i++;
}
$sql = "SELECT country,sum(time_on_line) as time FROM `players` group by country order by time desc limit 1";
$bc = $database->get_results($sql);
$page['pop_country'] = $bc[0]['country'];
$page['pop_time'] = convertSecToTime($bc[0]['time']);
$header_vars['php'] = "PHP";
$header_vars['gsm'] = "gsm";
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['title'] = $module;
$page['jsa'] = $jsa;
$page['pd'] = $pd;
$page['fpd'] = $fpd;
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