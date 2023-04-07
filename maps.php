<?php
/*
 * maps.php
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
 */
 	include 'inc/master.inc.php';
	$bserver = $_POST['server'];
	$sql = "select * from server1 where host_name = '$bserver'";
	$server =  $database->get_row($sql);
	echo "{$server['location']}<br>";
	$symlink_location = "{$server['location']}/{$server['game']}";
	echo "this is symlink $symlink_location<br>";
	$location = "{$server['install_dir']}/{$server['game']}";
	if ($symlink_location === $location) {$symlink = false;} 	else {$symlink = true;}
	if($symlink)  {echo "we should symlink<br>";}
	echo $location;
	//die();
    $countfiles = count($_FILES['userfile']['name']);
    echo "<br>file count $countfiles<br>";
	
    $totalFileUploaded = 0;
    for($i=0;$i<$countfiles;$i++){
         $filename = $_FILES['userfile']['name'][$i];

         ## Location
         //$location = "/usr/games/".$filename;
         $extension = pathinfo($filename,PATHINFO_EXTENSION);
         $extension = strtolower($extension);

         ## File upload allowed extensions
         $valid_extensions = array("bsp","nav","ain","bz2");
		//echo "extension $extension<br>";
         $response = 0;
         ## Check file extension
         if(in_array(strtolower($extension), $valid_extensions)) {
              ## Upload file
              echo "extension $extension<br>";
              switch ($extension) {
				  // work out where to put them
				  case "bsp":
				  case "nav":
				  	$upload_location = "$location/maps/$filename";
					$symlink_upload = "$symlink_location/maps/$filename";
					echo "$upload_location<br>";
				case "ain":	
					//$location  ="";
			  }
              if(move_uploaded_file($_FILES['userfile']['tmp_name'][$i],$upload_location)){
				  if($symlink) {
					  echo "linking $upload_location to $symlink_upload<br>";
					symlink($upload_location,$symlink_upload); // doesn't work 100%
					//shell_exec("ln -s $upload_location $symlink_upload"); // this does
					 
				}

                   echo "file name : ".$filename."<br/>";

                   $totalFileUploaded++;
              }
         }

    }
    echo "Total File uploaded : ".$totalFileUploaded;


