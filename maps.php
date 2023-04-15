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
	
	if ($_POST['action'] == 'upload') {
		$sql = "select * from server1 where host_name = '$bserver'";
		$server =  $database->get_row($sql);
		$output[] =$server['location'];
		$symlink_location = "{$server['location']}/{$server['game']}";
		$output[] = "this is symlink $symlink_location";
		$location = "{$server['install_dir']}/{$server['game']}";
		if ($symlink_location === $location) {$symlink = false;} 	else {$symlink = true;}
		if($symlink)  {$output[] = "we should symlink";}
		$output[] = $location;
		$countfiles = count($_FILES['userfile']['name']);
		$output[] = "file count $countfiles";
		$totalFileUploaded = 0;
		for($i=0;$i<$countfiles;$i++){
			$filename = $_FILES['userfile']['name'][$i];
			$extension = pathinfo($filename,PATHINFO_EXTENSION);
			$extension = strtolower($extension);
			## File upload allowed extensions
			$valid_extensions = array("bsp","nav","ain","bz2");
			$response = 0;
			## Check file extension
			if(in_array(strtolower($extension), $valid_extensions)) {
              ## Upload file
				$output[] = "extension $extension";
				switch ($extension) {
					// work out where to put them
					case "bsp":
					case "nav":
						$upload_location = "$location/maps/$filename";
						$symlink_upload = "$symlink_location/maps/$filename";
						$output[] = "$upload_location";
					case "ain":	
						$upload_location = "$location/maps/graphs/$filename";
						$symlink_upload = "$symlink_location/maps/graphs/$filename";
					case "bz2":
				}
				if(move_uploaded_file($_FILES['userfile']['tmp_name'][$i],$upload_location)){
					if($symlink) {
						$output[] = "linking $upload_location to $symlink_upload";
						symlink($upload_location,$symlink_upload); 
					}
                   $output[] = "file name : $filename";
                   $totalFileUploaded++;
				}
			}
		}
		$output[] = "Total File uploaded : $totalFileUploaded";
		$view = json_encode($output);
		echo $view;
	}
	if ($_POST['action'] == 'mapcycle') {
		$maps = $_POST;
		unset($maps['action']);
		unset($maps['server']);
		$sql = "select * from server1 where host_name = '$bserver'";
		$server =  $database->get_row($sql);
		$file_to_write = "{$server['location']}/{$server['game']}/cfg/mapcycle.txt";
		unlink($file_to_write);
		foreach ($maps as $k => $v) {
			log_to($file_to_write,trim($k));
		}
		echo json_encode("map cycle updated");
	}
