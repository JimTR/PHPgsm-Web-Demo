<?php
 if(isset($_GET['debug'])) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	define('debug',true);
}
include "../inc/master.inc.php";
$id= $_GET['id'];
if (!isset($_GET['page'])) {$page = 0;}
else {$page = $_GET['page'];}
$sql = "select steam_id64,name_c,aka,server,first_log_on,last_log_on,log_ons,city,region from players where country_code like '$id' order by last_log_on DESC";
$r = $database->get_results($sql);
$country = paginate($r,$page,1000);
$data['country'] = $country['data'];
$sql = "SELECT country,sum(game_time) as online FROM `player_history`  where `country` like '$id';";
$online = $database->get_row($sql);
$data['online'] = convertSecToTime($online['online']);	
$data['rows'] =  $country['rows'];
$data['pages'] = $country['pages'];
$data['page'] = $country['page'];
$data['id'] = $id;
//$data['county'] = $r;
$sql = "SELECT players.name_c,players.steam_id64, sum(`game_time`) as total,players.log_ons FROM `player_history` left join players on player_history.steam_id= players.steam_id64 where player_history.country LIKE '$id' GROUP BY `steam_id`  ORDER BY `total`  DESC limit 1";
$p = $database->get_row($sql);
//echo $p['name_c'];
//$x =convertSecToTime($p['total']);
$data['top_player'] = "<a href='users.php?id={$p['steam_id64']}'>{$p['name_c']}</a>";
$data['top_player_time'] = convertSecToTime($p['total']) ; 
//printr($p);
echo json_encode($data,JSON_UNESCAPED_SLASHES);
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