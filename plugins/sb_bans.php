<?php
/*
 * sb_bans.php
 * 
 * Copyright 2023 Jim Richardson <jim@phporyx.co.uk>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */ if (!defined('DOC_ROOT')) {
    	define('DOC_ROOT', realpath(dirname(__FILE__) . '/../'));
    }
if(isset($_GET['debug'])) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	define('debug',true);
}

include DOC_ROOT.'/inc/master.inc.php';

if(isset($_GET)) {$input = $_GET;}
else{ $input =$_POST;}
//print_r($input);
//die();
$steam_id = new SteamID($input['steam_id']);
$input['correct_id'] = $steam_id->RenderSteam2();
$input['steam_3'] = $steam_id->RenderSteam3();
$input['uid'] = str_replace("STEAM_1","STEAM_0",$input['correct_id']);
$input['url'] = "http://localhost/ajaxv2.5/api.php?action=exe_tmux&cmd=c&text=sm_ban {$input['steam_user']} {$input['quantity']} {$input['ban_reason']}&server=fofserver";
echo "{$input['url']}<br>";
$ajax = geturl($input['url']);
echo "$ajax<br>";
die();
$input['ajax'] = $ajax; 
$sql = "select * from players where steam_id64='{$input['steam_id']}'";
//$input['x'] = db->get_results($sql);
echo json_encode($input);

//foreach ($x as $y){
	//print_r($y);
//} 
//print_r($_SERVER);
$ip = $_SERVER['REMOTE_ADDR'];
//$ip ="192.168.1.33:8080";
 //"INSERT INTO " . DB_PREFIX . "_bans(created,type,ip,authid,name,ends,length,reason,aid,adminIp ) VALUES
  //  (UNIX_TIMESTAMP(),?,?,?,?,(UNIX_TIMESTAMP() + ?),?,?,?,?)"
 //   );

