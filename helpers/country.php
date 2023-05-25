<?php
include "../inc/master.inc.php";
$id= $_GET['id'];
if (!isset($_GET['page'])) {$page = 1;}
else {$page = $_GET['page'];}
$sql = "select steam_id64,name_c,aka,server,first_log_on,last_log_on,log_ons,city from players where country_code like '$id'";
$rows = $database->num_rows( $sql);
if ($rows > 999) {
	$pages= ceil($rows/1000);
}
else {
	$pages = 1;
}
$r = $database->get_results($sql);
switch ($page) {
	case 1:
		$data['country'] = array_slice($r,0,1000);
	}
$data['rows'] =  $rows;
$data['pages'] = $pages;
//$data['county'] = $r;
echo json_encode($data);
//echo json_encode($id);
