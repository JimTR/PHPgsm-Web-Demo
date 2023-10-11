<?php
if(isset($_GET['debug'])) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	define('debug',true);
}
include 'inc/master.inc.php';
//die(print_r($_GET));
$frame_to_load = $_GET['frame'];

if (empty($frame_to_load) ) {
	$load = "templates/frames/404.html";
}
else {$load = "templates/frames/$frame_to_load.html";}
$template->load($load);
if ($frame_to_load == "base_frame") {
	//die("base");
	//http://localhost:80/ajaxv2.5/api.php?action=all&server=localhost
	$id = "{$_GET['url']}/api.php?action=all&server={$_GET['id']}";
	$page['id'] =$id;
	//die($id);
}
//elseif ($frame_to_load == "stats_frame") {
	//$id = "{$_GET['url']}/api.php?action=all&server={$_GET['id']}";
	//die($id);
//}
	
else{
	$page['id'] = $_GET['id'];
	$page['url'] = $settings['url'];
}
$template->replace_vars($page);
$template->publish();

