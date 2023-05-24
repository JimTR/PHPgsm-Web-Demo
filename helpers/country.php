<?php
include "../inc/master.inc.php";
$id= $_GET['id'];
$sql = "select * from players where country_code like '$id'";
//echo "$sql<br>";
$r = $database->get_results($sql);
echo json_encode($r);
//echo json_encode($id);