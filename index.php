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
	 $lserver['logo'] = $server['logo'];
	 $lserver['console_link'] = $href;
	 $lserver['detail_link'] = "gameserver.php?server=$fname";
	 $lserver['game_link'] = $game_link; 
	 $template->replace_vars($lserver);
     $gd .= $template->get_template();
}
$page['gd']= $gd;
$jsa ='';
$sql = "select * from base_servers where `enabled` = 1 and `extraip` = 0 ORDER BY `fname` ASC";
$base_servers = $database->get_results($sql);
$sidebar_data['bmenu'] ='';
foreach ($base_servers as $server) {
	$uri = parse_url($server['url']);
	$url = $uri['scheme']."://".$uri['host'].':'.$server['port'];
	if(isset($uri['path'])) {$url .= "/".$uri['path'];}
	$sidebar_data['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
	$template->load('templates/subtemplates/server_body.html');
	$template->replace("fname",$server['fname']);
	$page['server_body'] .= $template->get_template();
	$jsa .= '"'.$url.'/api.php?action=game_detail&server='.$server['fname'].'",';
}
if (endsWith($jsa, ',')) {$jsa = rtrim($jsa,",");} //upgrade this to php 8
$sql = "SELECT sum(players) as player_tot, count(country) as countries, sum(logins) as tot_logins, (select count(*) from servers) as game_tot, (select count(*) from servers where running = 1 and enabled = 1) as run_tot  FROM `logins` WHERE 1";
$qstat = $database->get_row($sql);
$page['player_tot'] =  $qstat['player_tot'];
$page['logins_tot'] = $qstat['tot_logins'];
$page['country_tot'] = $qstat['countries'];
$page['game_tot'] = $qstat['game_tot'];
$page['run_tot'] = $qstat['run_tot'];
$sql = "SELECT * FROM `logins` limit 12";
$countries = $database->get_results($sql);
$page['country_top'] = $countries[0]['country'];
$i=0;
$page['country_data'] = "";
foreach ($countries as $country) {
	$template->load('templates/subtemplates/country_card.html');
	$cname = trim($country['country']);
	$key = searchforkey($cname, $todays_countries,'country');
	if ($key === false) {$cplayers = 0;}
	else {$cplayers = $todays_countries[$key]['today'];}
	$country['row_id'] = $i;
	$country['percent'] = number_format(($country['logins']/$page['logins_tot'])*100,2).'%';
	$country['p_percent'] = number_format(($country['players']/$page['player_tot'])*100,2).'%';
	$country['flag'] = 'https://ipdata.co/flags/'.trim(strtolower($country['country_code'])).'.png';
	$country['name'] = $country['country'];
	$country['players_today'] = $cplayers;
	$template->replace_vars($country);
	$page['country_data'] .= $template->get_template();
	$i++;
}
$sql = "select servers.server_name,player_history.*,players.name,players.country_code,players.steam_id64 from player_history left join players on `steam_id` = players.steam_id64 left join servers on player_history.`game` = servers.host_name  ORDER BY `player_history`.`log_ons` DESC LIMIT 12";
$players = $database->get_results($sql);
$pd = '';
foreach ($players as $player) {
	$playerN2 = Emoji::Decode($player['name']);
    $player['last_play'] = time2str($player['last_play']);
	if ($player['last_play'] == "1 weeks ago") {$player['last_play'] = 'a week ago';}
	$map = '<img style="width:5%;vertical-align: middle;" src="https://ipdata.co/flags/'.trim(strtolower($player['country_code'])).'.png">';
	$pd.='<tr><td style="vertical-align: middle;">'.$map.'  '.$playerN2.'</td><td>'.$player['server_name'].'</td><td><span style="">'.$player['log_ons'].'</span></td><td style="text-align:left;padding-right:6%;">'.$player['last_play'].'</td></tr>';
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
	$steam_info['map'] = "<img style='vertical-align: middle;' src='https://ipdata.co/flags/$c_code.png'/> {$player['country']}";
	$steam_info['joined']= $player['first_log_on'];
	$steam_info['login'] = $player['last_log_on'];
	$steam_info['logins'] = $player['log_ons'];
	$steam_info['detail_link'] = "users.php?id={$player['steam_id64']}";
	$template->replace_vars($steam_info);
	$fpd .=$template->get_template();
	$i++;
}
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
function endsWith( $haystack, $needle ) {
	$length = strlen( $needle );
	if( !$length ) {
		return true;
	}
	return substr( $haystack, -$length ) === $needle;
}
