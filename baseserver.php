<?php
include 'inc/master.inc.php';
$bserver = explode('=',$_SERVER['QUERY_STRING']);

$bserver = trim($bserver[1]);
$template = new template;
$sidebar_data = array();
$header_vars['title'] = "Server $bserver";
$sql = "select * from server1 order by `host_name` ASC";
$we_are_here = dirname($_SERVER['SCRIPT_NAME']);
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
if ($server['fname'] === $bserver) {
	// get the stuff
	$url = $server['url'].':'.$server['port'].'/ajax_send.php?url='.$server['url'].':'.$server['port'].'/ajaxv2.php&query=action=all';
	$sdata = json_decode(geturl($url),true);
	//print_r($sdata);
	//die();
	$sdata1= print_r($sdata,true);
}
}
$x =$sdata['total_size_raw']/1000000;
$sdata['quota_pc'] = $x* (100/$sdata['quota']);
$sdata['player_pc'] = round($sdata['used_slots']/$sdata['total_slots']*100,2);
//if ($sdata['player_pc'] == 0) { $sdata['player_pc'] = 100;}
 
$data = print_r($sdata,true);
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['title'] = "Server $bserver";
$template->load('templates/subtemplates/header.html'); // load header
$template->replace_vars($header_vars);
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] =$template->get_template();
$template->load('templates/subtemplates/footer.html');
$page['footer'] = $template->get_template();
$page['bserver'] = $bserver;
//$page['model_name'] = $sdata['model_name'];
//$page['uptime'] = $sdata['boot_time'];
$page['data'] = $data;
$sdata1= print_r($sdata,true);
//$page['url'] =dirname($_SERVER['PHP_SELF'])."/ajax.php?".$_SERVER['QUERY_STRING']."&module=baseserver&url=$url";
$page['url'] = $url;
//print_r($page);
$sdata['g_pc'] = ($sdata['live_servers'] / $sdata['total_servers'])*100;
$template->load('templates/baseserver.html');
$template->replace_vars($page);
$template->replace_vars($sdata);
$template->publish();
?>
