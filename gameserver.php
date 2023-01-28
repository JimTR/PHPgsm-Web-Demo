<?php
/*
 * gameserver.php
 * 
 * Copyright 2021 Jim Richardson <jim@noideersoftware.co.uk>
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
 * game server start up 
 */
//echo "hello there <br>";
include 'inc/master.inc.php';
$build = "5164-1513887087";
$version = "1.001";
$time = "1663578049";
$module = "Game_Server";
$bserver = explode('=',$_SERVER['QUERY_STRING']);
$we_are_here = $settings['url'];
$header_vars['title'] = "$module";
$is[0] = 'N/A';
require DOC_ROOT. '/inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
use xPaw\SourceQuery\SourceQuery;
	define( 'SQ_TIMEOUT',     $settings['SQ_TIMEOUT'] );
	define( 'SQ_ENGINE',      SourceQuery::SOURCE );
	define( 'LOG',	DOC_ROOT.'/logs/ajax.log');
$bserver = trim($bserver[1]);
//echo "$bserver<br>";
$template = new template;

$sql = "select * from server1 order by `host_name` ASC";
$servers = $database->get_results($sql);
$sql = "select * from server1 where host_name = '$bserver'";
$this_server =  $database->get_row($sql);
$tserver = $this_server['server_name'];
$header_vars['title'] = "$module - $tserver";
//print_r($this_server);
$file_select ='';
$cfg_path = $this_server['location'].'/'.$this_server['game'].'/cfg/';
foreach (glob("$cfg_path*.*") as $filename) {
    //echo "$filename size " . filesize($filename) . "\n";
    $basename = basename($filename);
    if ($basename == $this_server['host_name'].'.cfg') {$selected= 'selected';} else {$selected = '';}
    $file_select .= "<option value='$filename' $selected>$basename</option>";
}
$this_server['cfg_file'] = file_get_contents($this_server['location'].'/'.$this_server['game'].'/cfg/'.$this_server['host_name'].'.cfg');
$this_server['server_update'] = date("d-m-Y H:i:s a",$this_server['server_update']);
if ($this_server['starttime']) {$this_server['starttime'] = date("d-m-Y H:i:s a",$this_server['starttime']);}
$info = get_server_info($this_server);
$uri = parse_url($this_server['url']);
$url = $uri['scheme']."://".$uri['host'].':'.$this_server['bport'];
if(isset($uri['path'])){ $url .= $uri['path'];}
$v = json_decode(geturl("$url/api.php?action=game_detail&filter=$bserver&server=".$this_server['fname']),true); //needs replacing with ajax_send
//$info = array_merge($info,array_change_key_case($v[$bserver]));
$this_server = array_change_key_case(array_merge_recursive($this_server,$info));
$this_server['players'] -= $this_server['bots'];
//$this_server['rserver_update'] = date('d-m-y h: i:s a',$this_server['rserver_update']);
if ($this_server['secure']) {$this_server['secure'] = 'Yes';} else {$this_server['secure'] = 'No';}
$cmdline = stripslashes($this_server['startcmd']);
$this_server['startcmd'] =  str_replace('"', "", stripslashes($cmdline));
//die($cmdline);
$cmd_opts = cmd_line($cmdline);
$this_server['cmd_line_opts'] = '<table class="table table-sml">';
echo print_r($cmd_opts,true)."<br>";
$key =   array_partial_search($cmd_opts, "hostname");
	//echo "key found = $key<br>";
	if(count($key)) {echo "found at ".print_r($key,true)."<br>";}
	else{
		$soption="hostname";
		$option="hostname";
		$value="";
		$this_server['cmd_line_opts'] .= "<tr><td id='s$option'>$option</td><td >$value</td>";
		
		$this_server['cmd_line_opts'] .= "<td><input type='text' id='$soption' name='{$tmp1[0]}' value='$value' ></td><td></td><td>Host Name is set in the config file, setting it here will disable the config file option</td></tr>";
		}  

foreach($cmd_opts as $tmp) {
	// loop the array
	$tmp1 = explode(" ",trim($tmp));
	
	if (count($tmp1) >= 3) {
		for ($x = 2; $x <= count($tmp1); $x+=1) {
		$tmp1[1] = $tmp1[1]." ".$tmp1[$x];
	}
	//$tmp1(1)
	}
	$option = substr($tmp1[0], 1);
	$value = str_replace('"', "", stripslashes($tmp1[1]));
	$value = htmlentities($value);
	//$value=str_replace("'","",$tmp1[1]);
	//echo "new value = $value<br>";
	$this_server['cmd_line_opts'] .= "<tr><td id='s$option'>$option</td><td >$value</td>";
	if ($option =="map" || $option=="hostname") {
		// text options
		if($option == "hostname") {
			//echo "value = $value<br>";
			//print_r($tmp1);
			//die();
			$this_server['cmd_line_opts'] .= "<td><input type='text' id='s$option' name='{$tmp1[0]}' value='$value' ></td><td></td><td>using this option will disable the hostname in the config file , &quot;entries must be in quotes&quot; </td></tr>";
		}
		else {	
			$this_server['cmd_line_opts'] .= "<td><input type='text' id='s$option' name='{$tmp1[0]}' value='$value' ></td><td>Required</td><td>this here for some reason </td></tr>";
		}
	}
	elseif ($option =="maxplayers") {
		//players
		$this_server['cmd_line_opts'] .= "<td><select id='$soption' name='{$tmp1[0]}' >";
		for ($x = 2; $x <= 24; $x+=2) {
			if ($x == $value) {
				// set selected
				$this_server['cmd_line_opts'] .="<option  selected value='$x'>$x</option>";
			}
			else{
				$this_server['cmd_line_opts'] .="<option  value='$x'>$x</option>";
			}
		}
		$this_server['cmd_line_opts'].="</select></td><td>Required</td><td>set maximum player value</td></tr>";
	}
	else{
		$this_server['cmd_line_opts'] .= "<td><input type='checkbox' id='$soption' name='$option' value='$value' checked><//td><td></td><td>check this if required</td></tr>";
	}
}
//die();
$this_server['cmd_line_opts'].="</table>";
//die(print_r($this_server));
$page['join_link'] = 'steam://connect/'.$this_server['host'].':'.$this_server['port'].'/'; 
$is = explode("\t",trim(shell_exec('du -hs '.$this_server['install_dir'])));
$this_server['install_size'] = $is[0];
$x = json_encode($this_server);
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';
$page['title'] = "Server $tserver";
$template->load('templates/subtemplates/header.html'); // load header
$template->replace_vars($header_vars);
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] =$template->get_template();
$template->load('templates/subtemplates/footer.html');
$page['footer'] = $template->get_template();
$page['bserver'] = $bserver;
$page['file_select'] = $file_select;
$page['url'] = $url;
$template->load('templates/gameserver.html');
$template->replace_vars($page);
$template->replace_vars($this_server);
$template->publish();
$database->disconnect();

function get_server_info($server) {
	// return xpaw info
	
	$xpaw = new SourceQuery( );
	try
			{
				$xpaw->Connect( $server['host'], $server['port'], SQ_TIMEOUT, SQ_ENGINE );
				$sub_cmd = 'GetInfo';
				$info = $xpaw->GetInfo();
				if ($info['Players'] > 0) {
					// get player list
					$players = $xpaw->GetPlayers();
					if(!empty($players)) {$info['player_list'] = $players;}
				}
				$rules = $xpaw->GetRules();
				$info['vars'] = $rules;
			}
	catch( Exception $e )
		{
			$Exception = $e;
			if (strpos($Exception,'Failed to read any data from socket')) 
			{
				$Exception = 'Failed to read any data from socket Module (Ajax - get_server_info '.$sub_cmd.')';
				//file_put_contents(LOG,$Exception,PHP_EOL,FILE_APPEND);
			}
			$info['l_status'] = 'offline';
			$info['steamid'] = 'N/A';
			$info['map'] = 'N/A';
			$info['hostname'] = 'N/A';
			$xpaw->Disconnect();
			return $info;
		}
	$info['l_status'] = 'online';								
	$xpaw->Disconnect();
	return $info;
}
function cmd_line($cmd_line) {
	// function to split command line into bits
	if(empty($cmd_line)) {return false;}
	$cmd_line = str_replace("+","#+",$cmd_line);
	$cmd_line = str_replace("-","*-",$cmd_line);
	$split = preg_split('/(\#|\*)/', $cmd_line);
	//unset($split[0]);
	//unset($split[1]);
	//unset($split[2]);
	$split = array_slice($split,7); // remove stuff the user can not edit
	$split = array_values(array_filter($split));
	//print_r  ($split);
	//echo "<br>$cmd_line";
	//die ();
	return $split;	
}
function in_arrayr($needle, $haystack) {
        foreach ($haystack as $v) {
                if ($needle == $v) return true;
                elseif (is_array($v)) return in_array($needle, $v);
        }
        return false;
} 
?>
