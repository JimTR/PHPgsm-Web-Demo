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
include DOC_ROOT.'/inc/master.inc.php';
$sql = "select * from sb_bans";
$x = db2->get_results($sql);
echo json_encode($x);

//foreach ($x as $y){
	//print_r($y);
//} 
//print_r($_SERVER);
$ip = $_SERVER['REMOTE_ADDR'];
//$ip ="192.168.1.33:8080";
 //"INSERT INTO " . DB_PREFIX . "_bans(created,type,ip,authid,name,ends,length,reason,aid,adminIp ) VALUES
  //  (UNIX_TIMESTAMP(),?,?,?,?,(UNIX_TIMESTAMP() + ?),?,?,?,?)"
 //   );

echo  '<script src = "../js/jquery.js"></script>';
echo ' <script src = "../assets/js/main.js"></script>';
echo '<script>
	 $(document).ready(function() {
	 var ip ="'.$ip.'"
	  x = validateIP(ip);
	 if (x == true) { console.log(ip+" is valid");}
	  else { console.log(ip+" is no good");}
		console.log("system ready for banning cheating bastards");
		//console.log(ip+" "+x);
		
		
	});
  </script>';