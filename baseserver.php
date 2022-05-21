<?php
include 'inc/master.inc.php';
$build = "4142-3255204870";
$version = "1.000";
$time = "1653110467";
$module = "API_Server";
$bserver = explode('=',$_SERVER['QUERY_STRING']);
//print_r($bserver);
    $Auth = new Auth ();
        $user = $Auth->getAuth();
if($user->loggedIn()) {
		// set sidebar
		$page['level'] = $user->level; //user is an object
   	}
   	else {
		redirect('login.php');
		//die ('not logged in');
	}        
$bserver = trim($bserver[1]);
//echo "$bserver<br>";
$template = new template;
$sidebar_data = array();
$sidebar_data['bmenu'] = '';
$header_vars['title'] = "Server $bserver";
$sql = "select * from server1 order by `host_name` ASC";
$we_are_here = $settings['url'];
$sidebar_data['smenu'] = '';
$servers = $database->get_results($sql);
//echo print_r($servers,true)."<br>";
//die();
foreach ($servers as $server) {
	$fname = trim($server['host_name']);
        $href = "gameserver.php?server=$fname";
        if(!$server['enabled']) {
           $sidebar_data['smenu'] .='<li><a class="" href="'.$href.'" style="color:red;"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
           continue;
        }
	$href = 'gameserver.php?server='.$server['host_name'];
	$sidebar_data['smenu'] .='<li><a class="" href="'.$href.'"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
}
//echo print_r($sidebar_data,true)."<br>";
$sql = "select * from base_servers where `enabled` = 1 and `extraip` = 0 ORDER BY `fname` ASC";
$base_servers = $database->get_results($sql);
//echo print_r($base_servers,true)."<br>";

foreach ($base_servers as $server) {

if ($server['fname'] === $bserver) {
	// get the stuff
$uri = parse_url($server['url']);
//echo print_r($uri,true)."<br>";
$url = $uri['scheme']."://".$uri['host'].':'.$server['port'];
if (isset($uri['path'])) {$url .= $uri['path'];}
//echo "$url<br>";	
	$url .="/ajax_send.php?url=$url/ajaxv2.php&query=action=all:server=$bserver";
//echo $url;
//die();
	$sdata = json_decode(geturl($url),true);
	$sidebar_data['bmenu'] .='<li><a class="active" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
	//print_r($sdata);
	//die();
	$sdata1= print_r($sdata,true);
}
else {
	$sidebar_data['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
}
}
$x =intval($sdata['total_size_raw'])/1000000;
$sdata['quota_pc'] = $x* (100/intval($sdata['quota']));
//$sdata['player_pc'] = round($sdata['used_slots']/$sdata['total_slots']*100,2);
//if ($sdata['player_pc'] == 0) { $sdata['player_pc'] = 100;}
 if ($sdata['reboot'] == 'yes' ) {$sdata['rebooot'] = 'rebooot';}
$data = print_r($sdata,true);
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['title'] = "API Server $bserver";
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
// background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
?>
