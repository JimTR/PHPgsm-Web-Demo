<?php
include 'inc/master.inc.php';
$template = new template;
$sql = "select * from server1 order by `host_name` ASC";
$sidebar_data = array();
$sidebar_data['smenu'] = '';
$servers = $database->get_results($sql);
foreach ($servers as $server) {
$sidebar_data['smenu'] .='<li><a class="" href="#"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
	
}
$sql = "select * from base_servers where `enabled` = '1' and `extraip` = '0' ";
$base_servers = $database->get_results($sql);
foreach ($base_servers as $server) {
$sidebar_data['bmenu'] .='<li><a class="" href="#"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';

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
$template->load('templates/index.html');
$template->replace_vars($page);
$template->publish();
//print_r($settings);
