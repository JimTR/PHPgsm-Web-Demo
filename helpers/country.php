<?php
include "../inc/master.inc.php";
$id= $_GET['id'];
$sql = "select steam_id64,name_c,aka,server,first_log_on,last_log_on,log_ons,city from players where country_code like '$id' limit 1000";
$rows = $database->num_rows( "select steam_id64,name_c,aka,server,first_log_on,last_log_on,log_ons,city from players where country_code like '$id'");
if ($rows > 999) {
	$pages= ceil($rows/1000);
}
else {
	$pages = 1;
}
$r = $database->get_results($sql);
$data['rows'] =  $rows;
$data['pages'] = $pages;
$data['county'] = $r;
echo json_encode($data);
//echo json_encode($id);
