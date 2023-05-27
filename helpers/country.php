<?php
include "../inc/master.inc.php";
$id= $_GET['id'];
if (!isset($_GET['page'])) {$page = 0;}
else {$page = $_GET['page'];}
$sql = "select steam_id64,name_c,aka,server,first_log_on,last_log_on,log_ons,city,region from players where country_code like '$id' order by log_ons DESC";
$rows = $database->num_rows( $sql);
if ($rows > 999) {
	$pages= ceil($rows/1000);
}
else {
	$pages = 1;
}
$r = $database->get_results($sql);
switch ($page) {
	case 0:
		$data['country'] = array_slice($r,0,1000);
	default:
		$data['country'] = array_slice($r,1000*$page,1000);	
	}
$sql = "SELECT country,sum(game_time) as online FROM `player_history`  where `country` like '$id';";
$online = $database->get_row($sql);
$data['online'] = convertSecToTime($online['online']);	
$data['rows'] =  $rows;
$data['pages'] = $pages;
$data['page'] = $page;
$data['id'] = $id;
//$data['county'] = $r;
echo json_encode($data);
//echo json_encode($id);
function convertSecToTime($sec){
	$return='';
	if (!is_numeric($sec)) {$sec=0;}
	$date1 = new DateTime("@0"); //starting seconds
	$date2 = new DateTime("@$sec"); // ending seconds
	$interval =  date_diff($date1, $date2); //the time difference
	$y =  $interval->format('%y');
	$m = $interval->format('%m');
	$d = $interval->format('%d');
	$h = $interval->format('%H');
	$mi = $interval->format('%I');
	$s = $interval->format('%S');
	if ($y >0) {$return.= "{$y}y, ";}
	if ($m >0) {$return.= "{$m}m, ";}
	//if ($m > 0 and $y == 0) {$return .= "$m mo ";}
	if($d >0){$return .= "{$d}d, ";}
	$return .= "$h:";
	$return.= "$mi:";
	$return .= "$s";	
	//return $interval->format('%y y %m mo %d d, %h h %i m %s s'); // convert into Years, Months, Days, Hours, Minutes and Seconds
	return $return;
}