<?php
include "../inc/master.inc.php";
$id= $_GET['id'];
$sql = "select steam_id64,name_c,aka,server,first_log_on,last_log_on,log_ons,city from players where country_code like '$id' limit 1000";
//echo "$sql<br>";
$r = $database->get_results($sql);
//printr($r);
echo json_encode($database->escape($r));
//echo json_encode($id);
