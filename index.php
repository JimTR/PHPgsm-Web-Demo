<?php
include 'inc/master.inc.php';
require DOC_ROOT. '/inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
	use xPaw\SourceQuery\SourceQuery;
	define( 'SQ_TIMEOUT',     $settings['SQ_TIMEOUT'] );
	define( 'SQ_ENGINE',      SourceQuery::SOURCE );
	define( 'LOG',	'logs/ajax.log');
    $Auth = new Auth ();
    $user = $Auth->getAuth();
	$we_are_here = $settings['url'];
if($user->loggedIn()) {
		// set sidebar
		// allow user to use the api (ready for v3)
		$user_data = array (
		'user_id' => $user->id,
		'user_name' => $user->username,
		'ip' =>  ip2long($_SERVER['REMOTE_ADDR']),
		'start_time' => time() 
		) ;
		if ($database->get_row('select * from allowed_users where user_id = '.$user->id)) {
			$where = array('user_id' => $user->id);
			unset($user_data['user_id']);
			$database->update('allowed_users',$user_data,$where);
		} 
		else {
			$database->insert('allowed_users',$user_data);
		}
   	}
   	else {
		redirect('login.php');
		
	}

$template = new template;
$sql = "select * from server1 order by `host_name` ASC";
$sidebar_data = array();
//$page = array();
$sidebar_data['smenu'] = '';
$xpaw = new SourceQuery( );
$servers = $database->get_results($sql);
$gd ='';
foreach ($servers as $server) {
		if(empty($server['starttime'])) { $server['starttime']=0;}
		$start = date("d-m-y  h:i:s a",$server['starttime']);
	     $fname = $server['host_name'];
	     $disp ='style="display:none;"';
		 $href = 'gameserver.php?server='.$server['host_name'];
		 $gd .='<tr id="'.$fname.'" '.$disp.'><td><span class="invert_link"><a href="'.$href.'" class="invert_link">'.$server['server_name'].'</a></span></td><td><span  id="cmap'.$fname.'">No Data</span></td><td style="text-align:center;"><span id="gol'.$fname.'"></span></td><td  style="text-align:center;" id="gdate'.$fname.'">'.$start.'</td></tr>'; 
		 $sidebar_data['smenu'] .='<li><a class="" href="'.$href.'"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
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
		$players = $info['Players']-$info['Bots'];
		$page['players'] += $players;
	}	
}
$page['gd']= $gd;
$jsa ='';
$sql = "select * from base_servers where `enabled` = 1 and `extraip` = 0 ORDER BY `fname` ASC";
$base_servers = $database->get_results($sql);
//https://api.noideersoftware.co.uk/ajax_send.php?url=https://api.noideersoftware.co.uk/ajaxv2.php&query=action=game_detail
foreach ($base_servers as $server) {
$sidebar_data['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
$jsa .= '"'.$server['url'].'/ajax_send.php?url='.$server['url'].'/ajaxv2.php&query=action=game_detail:server='.$server['fname'].'",';
}

if (endsWith($jsa, ',')) {
	//die($jsa);
	// chop comma
	$jsa = rtrim($jsa,",");
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
$template->load('templates/subtemplates/country_table.html');
$country['flag'] = 'https://ipdata.co/flags/'.trim(strtolower($country['country_code'])).'.png';
$template->replace_vars($country);
$page['country_data'] .= $template->get_template();
}
$sql = "select servers.server_name,player_history.*,players.name,players.country_code from player_history left join players on `steam_id` = players.steam_id64 left join servers on player_history.`game` = servers.host_name  ORDER BY `player_history`.`log_ons` DESC LIMIT 10";
	$players = $database->get_results($sql);
	$pd = '';
	foreach ($players as $player) {
		// top 10 players server
		$playerN2 = Emoji::Decode($player['name']);
		//$player['last_play'] = date('d-m-Y H:i:s',$player['last_play']);
                $player['last_play'] = time2str($player['last_play']);
		if ($player['last_play'] == "1 weeks ago") {$player['last_play'] = 'a week ago';}
                //if ($player['log_ons'] < 100) {$player['log_ons'] =' '.$player['log_ons'];}
		$map = '<img style="width:5%;vertical-align: middle;" src="https://ipdata.co/flags/'.trim(strtolower($player['country_code'])).'.png">';
		$pd.='<tr><td style="vertical-align: middle;">'.$map.'  '.$playerN2.'</td><td>'.$player['server_name'].'</td><td><span style="">'.$player['log_ons'].'</span></td><td style="text-align:left;padding-right:6%;">'.$player['last_play'].'</td></tr>';
	}
	$sql = "select players.name,players.country_code,players.log_ons,players.last_log_on,players.first_log_on from players ORDER BY `players`.`log_ons` DESC LIMIT 10";
	$fpd = '';
	$players = $database->get_results($sql);
	foreach ($players as $player) {
		// top 10 players
		$playerN2 = Emoji::Decode($player['name']);
		$player['last_log_on'] = time2str($player['last_log_on']);
                if ($player['last_log_on'] == "1 weeks ago") {$player['last_log_on'] = 'a week ago';}
		//if ($player['log_ons'] < 100) {$player['log_ons'] =' '.$player['log_ons'];}
		if ($player['first_log_on'] >0 ) {
			$player['first_log_on'] = time2str($player['first_log_on']);
		}
		else {
			$player['first_log_on'] = 'N/A';
		}
		$map = '<img style="width:5%;vertical-align: middle;" src="https://ipdata.co/flags/'.trim(strtolower($player['country_code'])).'.png">';
		$fpd.='<tr><td style="vertical-align: middle;"><span class="span_black">'.$map.'  '.$playerN2.'</span></td><td><span class="span_black">'.$player['first_log_on'].'</span></td><td><span>'.$player['log_ons'].'</span></td><td><span>'.$player['last_log_on'].'</span></td></tr>';
	}
//print_r($countries);
//die();
//$template = new template;
$header_vars['php'] = "PHP";
$header_vars['gsm'] = "gsm";
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['title'] = 'PHPgsm Demo';
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
//print_r($settings);
function endsWith( $haystack, $needle ) {
    $length = strlen( $needle );
    if( !$length ) {
        return true;
    }
    return substr( $haystack, -$length ) === $needle;
}