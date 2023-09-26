<?php
include 'inc/master.inc.php';
$frame_to_load = $_GET['frame'];

if (empty($frame_to_load) ) {
	$load = "templates/frames/404.html";
}
else {$load = "templates/frames/$frame_to_load.html";}
$template->load($load);
$page['id'] = $_GET['id'];
$page['url'] = $settings['url'];
$template->replace_vars($page);
$template->publish();

