<?php
/*
 * settings.php
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
// ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);


$module = "settings";
include 'inc/master.inc.php'; // add setup
if(isset($_GET['id'])) {
	$server_name = $_GET['id'];
	$page['server'] = $server_name;
	$sql = "select * from server1 where host_name ='$server_name'";
	//printr(get_defined_constants(true));
	$server_record = db->get_row($sql);
	$page['setting_title'] =  "Settings for {$server_record['server_name']}";
	$uri = parse_url($server_record['url']);
	$url = $uri['scheme']."://".$uri['host'].':'.$this_server['bport'];
	if(isset($uri['path'])){ $url .= $uri['path'];}
	$page['url'] = $url;
	$setting_type = true;
}
else{ 
	$page['setting_title'] =  "System Settings";
	$setting_type = false;
}
$url = $settings['url'];
$template = new template;
$template->load('templates/subtemplates/header.html'); // load header
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] = $template->get_template();
$page['sidebar'] = str_replace("class=\"nav-link collapsed\" id=\"$module\" ","class=\"nav-link\"  id=\"users\" ",$page['sidebar']);
$page['max_upload'] = dataSize(file_upload_max_size());

if($setting_type){
	
	$template->load('templates/subtemplates/server_settings.html');
	$template->replace_vars($server_record);
	$template->replace_vars($page);
	$page['menu_bar']  = $template->get_template();
	$current_maps = get_maps($server_record);
	$page['map_files'] = $current_maps['formatted'];
	$page['map_size'] = $current_maps['total_size'];
	$page['map_count'] = count($current_maps);
	$page['map_cycle'] = $current_maps['mapcycle'];
	$mods = get_mods($server_record);
	$page['mod_list'] = $mods['mods'];
	$page['sm_plugins'] = $mods['sm_plugins'];
	$page['cmd_line_opts'] =get_cmdline($server_record['host_name']);
	$page['file_select'] = read_cfgs($server_record);
	$page['cfg_file'] = file_get_contents($server_record['location'].'/'.$server_record['game'].'/cfg/'.$server_record['host_name'].'.cfg');
	//printr($page);
	//die();
}
else { $page['menu_bar'] = "need system menu";}

$template->load('templates/settings.html');
$template->replace_vars($page);
$template->publish();

function get_cmdline ($server){
	//$bserver = explode('=',$_SERVER['QUERY_STRING']);
	$sql = "select * from server1 where host_name = '$server'";
	$this_server =  db->get_row($sql);
	// read original cmd line in
	$cmdline = stripslashes($this_server['startcmd']);
	$this_server['startcmd'] =  str_replace('"', "", stripslashes($cmdline));
	$cmd_opts = cmd_line($cmdline);
	$option_help['ignoresigint'] = "Disables &laquo; ctl+c &raquo; in the terminal console";
	$option_help['sv_setsteamaccount'] = "set a persistant username and password. some games require this option  to be set";
	$option_help['mp_teamplay'] = "Set to 0 for FFA or 1 for teams"; 
	$option_help['strictportbind'] = "The server will fail to start if it's port is already in use. if not set the server will start but on the next available port";
	$option_help['fof_sv_maxteams'] = "Set The maximum amout of teams in teamplay mode";
	$option_help['fof_sv_currentmode']="";
	$option_help['sv_contact'] ="Admin's contact Email address";
	$option_help['mapcyclefile'] = "mapcycle file, if deleted the default file will be used";
	$key =   array_partial_search($cmd_opts, "hostname");
	//echo "key found = ".print_r($key,true)."<br>";
	//die();
	$this_server['cmd_line_opts'] = '<table id="options-table" class="table table-sml"><tbody id="options-body">';
	if(count($key)) { 
		//print_r($key);
		//die();
		}
	
	else{
		//$option="hostname";
		$option="hostname";
		$value="";
		//$this_server['cmd_line_opts'] .= "<tr id='tr-$option'><td>$option</td><td >$value</td>";
		//$this_server['cmd_line_opts'] .= "<td><input type='text' id='o$option' option='+hostname' value='$value' orig='not set'></td><td></td><td>Host Name is set in the config file, setting it here will disable the config file option</td></tr>";
		}
		//echo count($cmd_opts);
		//printr($cmd_opts);
		//die();
	foreach($cmd_opts as $tmp) {
	// loop the array
	
	$tmp1 = explode(" ",trim($tmp));
	//print_r($tmp1);
	if (count($tmp1) >= 3) {
		for ($x = 2; $x <= count($tmp1); $x+=1) {
			$tmp1[1] = $tmp1[1]." ".db->escape($tmp1[$x]);
		}
	
	}
	$option = substr($tmp1[0], 1);
	//$value = str_replace('"', "", stripslashes($tmp1[1]));
	$value=trim($tmp1[1]);
	$value = htmlentities($value,ENT_QUOTES | ENT_HTML401); 
	//$value=str_replace("'","",$tmp1[1]);
	//$value=$tmp1[1];
	//echo "new value = $value<br>";
	//echo "$option<br>";
	$this_server['cmd_line_opts'] .= "<tr id='tr-$option'><td>$option</td><td >$value</td>";
	if ($option =="map" || $option=="hostname") {
		// text options
		if($option == "hostname") {
			//echo "value = $value<br>";
			//print_r($tmp1);
			//die();
			$this_server['cmd_line_opts'] .= "<td><input type='text' id='o$option' option='{$tmp1[0]}' value='$value'  orig='{$tmp1[0]} $value'></td><td></td><td>using this option will disable the hostname in the config file </td></tr>";
		}
		if($option == "map") {	
			
			$this_server['cmd_line_opts'] .= "<td><input type='text' id='o$option' option='{$tmp1[0]}' value='$value' orig='{$tmp1[0]} $value'></td><td>$map_options</td><td>you can use any valid map , but check your player count </td></tr>";
		}
	}
	elseif ($option =="maxplayers") {
		//players
		if($this_server['game_max_players'] >0){
			$max_players = $this_server['game_max_players'];
		}
		else {
			$max_players = 64;
		}
		$this_server['cmd_line_opts'] .= "<td><select style='width:20%;' id='o$option' option='{$tmp1[0]}' orig='{$tmp1[0]} $value'>";
		for ($x = 2; $x <= $max_players; $x+=2) {
			if ($x == $value) {
				// set selected
				$this_server['cmd_line_opts'] .="<option  selected value='$x'>$x</option>";
			}
			else{
				$this_server['cmd_line_opts'] .="<option  value='$x'>$x</option>";
			}
		}
		$this_server['cmd_line_opts'].="</select></td><td>Required</td><td>set maximum player value<span style='color:red;'> Warning</span> Not all maps are designed for high player numbers</td></tr>";
	}
	else{
		$int = (int) filter_var($value, FILTER_SANITIZE_NUMBER_INT);
		if (is_int($value) or $int >0 ){
			// a number
			//print_r($tmp1);
			//die();
			//echo "$option needs a drop down<br>";
			//$this_server['cmd_line_opts'] .= "<td><input type='text' id='o$option' option='$option' value='$value' orig='{$tmp1[0]} $value'><//td><td></td><td>numeric value</td></tr>";
			//continue;
		}
		if(strlen($value) >0){
			// text box
			if (isset($option_help[$option])) { $help = $option_help[$option];} else {$help = "no help avaiible";}
			$this_server['cmd_line_opts'] .= "<td><input type='text' id='o$option' option='{$tmp1[0]}' value='$value' orig='{$tmp1[0]} $value'><//td><td></td><td>$help</td></tr>";
		}
		else {
			if (isset($option_help[$option])) { $help = $option_help[$option];} else {$help = "no help avaiible";}
			$this_server['cmd_line_opts'] .= "<td><input type='checkbox' id='o$option' option='{$tmp1[0]}' value='$value' orig='{$tmp1[0]} $value' checked><//td><td></td><td>$help</td></tr>";
		}
	}
}
$this_server['cmd_line_opts'] .= "<td>Add an option</td><td></td><td id='new'><input type='text' id='onew' value='' orig=''><//td><td><button class='btn btn-primary'  id='cnew'>Add</button></td><td>proceed with caution</td></tr>";
//die();
$this_server['cmd_line_opts'].="</tbody></table>";
//echo $this_server['cmd_line_opts'];
//die();
return $this_server['cmd_line_opts'];	  
}
function cmd_line($cmd_line) {
	// function to split command line into bits
	if(empty($cmd_line)) {return false;}
	$cmd_line = str_replace("+","#plus+",$cmd_line);
	$cmd_line = str_replace("-","*minus-",$cmd_line);
	$cmd_line= str_replace('"','',$cmd_line);
	//preg_split('/(\#plus|\*minus)/', $input_line);
	$split = preg_split('/(\#plus|\*minus)/', $cmd_line);
	//unset($split[0]);
	//unset($split[1]);
	//unset($split[2]);
	$split = array_slice($split,7); // remove stuff the user can not edit
	$split = array_values(array_filter($split));
	foreach ($split as $temp) {
		$tmp[] = trim($temp);
	}
	$split = $tmp;
	//print_r  ($split);
	//echo "<br>$cmd_line";
	//die ();
	return $split;	
}
function get_maps($server) {
	$all_files = 0;
	$map_count = 0;
	// need to add  mapcycle 
	$mc_file = "{$server['location']}/{$server['game']}/cfg/mapcycle.txt";
	$mc_list = explode(PHP_EOL,file_get_contents($mc_file));
	foreach ($mc_list as $k => $v) {
		$mc_list[$k] = trim($v);
	}
	$map_dir = "{$server['location']}/{$server['game']}/maps";
	foreach (glob("$map_dir/*.bsp") as $filename) {
		$filename1 = pathinfo($filename, PATHINFO_FILENAME); 
		$tmp['file'] = basename($filename1);
		if(in_array($filename1,$mc_list)) {
			$tmp['in_cycle'] ="<input style ='margin-left:18%;' type='checkbox' id='map-$filename1' name='$filename1' checked>" ;
			$map_count ++;
		}
		else {$tmp['in_cycle'] ="<input style='margin-left:18%;' type='checkbox' id='map-$filename1' name='$filename1'>";}
		$tmp['size'] =  dataSize(filesize($filename));
		$all_files += filesize($filename);
		$return[] =$tmp;
		$return['formatted'] .= "<tr><td>{$tmp['file']}</td><td>{$tmp['size']}</td><td>{$tmp['in_cycle']}</td></tr>";
	}
	
	$return['total_size'] = dataSize($all_files);
	$return['mapcycle'] = $map_count;
	
	return $return;
}
function get_mods($server) {
	$mod_location = "{$server['location']}/{$server['game']}/addons";
	$plugin_header='';
	$plugin_rows ='';
	if (!is_dir($mod_location)) {
		$return['mods'] ="none installed";
		$return['sm_plugins'] = "none installed";
		return $return ;
	}
	$files = array_diff(scandir($mod_location),array('..', '.'));
	//print_r($files);
	foreach ($files as $file) {
		if(is_dir("$mod_location/$file")) {
			$return['mods'].="<tr><td colspan=2>$file</td></tr>";
			if($file == "sourcemod") {
				$plugin_location= "$mod_location/$file/plugins";
				$sm_plugins = array_values(array_diff(scandir($plugin_location),array('..', '.')));
				$plugin_rows='';
				foreach ($sm_plugins as $plugin) {
					// tidy up the plugins
					if (str_starts_with($plugin, ".")){continue;}
					$plugin_name = pathinfo("$plugin_location/$plugin",PATHINFO_FILENAME);
					$plugin_lastupdate = date ("d-m-Y H:i:s", filemtime("$plugin_location/$plugin"));
					$plugin_rows.="<tr><td>$plugin_name</td><td>$plugin_lastupdate</td></tr>";
				}
			}
			$return['sm_plugins'] = $plugin_rows;
		}
	}
	return $return;
}
function read_cfgs($server) {
	$cfg_path = $server['location'].'/'.$server['game'].'/cfg/';
	foreach (glob("$cfg_path*.*") as $filename) {
		//echo "$filename size " . filesize($filename) . "\n";
		$basename = basename($filename);
		if ($basename == $server['host_name'].'.cfg') {$selected= 'selected';} else {$selected = '';}
		$file_select .= "<option value='$filename' $selected>$basename</option>";
	}
	return $file_select;
}
