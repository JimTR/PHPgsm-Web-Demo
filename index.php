<?php
include 'inc/master.inc.php';
require DOC_ROOT. '/inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
	use xPaw\SourceQuery\SourceQuery;
	define( 'SQ_TIMEOUT',     $settings['SQ_TIMEOUT'] );
	define( 'SQ_ENGINE',      SourceQuery::SOURCE );
	define( 'LOG',	'logs/ajax.log');

$we_are_here = $settings['url'];
$template = new template;
$sql = "select * from server1 order by `host_name` ASC";
$sidebar_data = array();
$sidebar_data['smenu'] = '';
$xpaw = new SourceQuery( );
$servers = $database->get_results($sql);

foreach ($servers as $server) {
	$href = $we_are_here.'/gameserver.php?server='.$server['host_name'];
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

$sql = "select * from base_servers where `enabled` = '1' and `extraip` = '0' ";
$base_servers = $database->get_results($sql);
foreach ($base_servers as $server) {
$sidebar_data['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';

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
//print_r($countries);
//die();
//$template = new template;
$header_vars['php'] = "PHP";
$header_vars['gsm'] = "gsm";
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['title'] = 'PHPgsm Demo';
$template->load('templates/subtemplates/header.html'); // load header
$template->replace_vars($header_vars);
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] =$template->get_template();
$template->load('templates/subtemplates/footer.html');
$page['footer'] = $template->get_template();
$page['url'] = $we_are_here.'/ajax.php';
$template->load('templates/index.html');
$template->replace_vars($page);
$template->publish();
//print_r($settings);
