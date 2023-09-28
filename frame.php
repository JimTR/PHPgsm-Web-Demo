<?php
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
	$id = "{$settings['url']}/api.php?action=all&server={$_GET['id']}";
	$page['id'] =$id;
}
else{$page['id'] = $_GET['id'];}
$page['url'] = $settings['url'];
$template->replace_vars($page);
$template->publish();

