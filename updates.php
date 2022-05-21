<?php
/*
 * updates.php
 * 
 * Copyright 2022 Jim Richardson <jim@noideersoftware.co.uk>
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
$build = "12412-433334213";
$version = "1.002";
$time = "1653110566";
$module = "Update";
define('cr',PHP_EOL);
$Auth = new Auth ();
$user = $Auth->getAuth();
$we_are_here = $settings['url'];
if($user->loggedIn()) {
		// set sidebar
		// allow user to use the api (ready for v3)
		$user_data = array (
		'user_id' => $user->id,
		'user_name' => $user->username,
		'ip' =>  ip2long($_SERVER['REMOTE_ADDR']),
		'start_time' => time() 
		) ;
		if ($database->get_row('select * from allowed_users where ip = '.$user_data['ip'])) {
			$where = array('user_id' => $user->ip);
			unset($user_data['user_ip']);
			$database->update('allowed_users',$user_data,$where);
		} 
		else {
			$database->insert('allowed_users',$user_data);
		}
   	}
else {
	redirect('login.php');
}
$page['bmenu']='';
$page['smenu'] ='';
$sql = "select * from server1 order by `host_name` ASC";
$servers = $database->get_results($sql);
foreach ($servers as $server) {
		if(empty($server['starttime'])) { $server['starttime']=0;}
		$start = date("d-m-y  h:i:s a",$server['starttime']);
	     $fname = $server['host_name'];
	     $disp ='style="display:none;"';
		 $href = 'gameserver.php?server='.$server['host_name'];
		 $gd .='<tr id="'.$fname.'" '.$disp.'><td><span class="invert_link"><a href="'.$href.'" class="invert_link">'.$server['server_name'].'</a></span></td><td><span  id="cmap'.$fname.'">No Data</span></td><td style="text-align:center;"><span id="gol'.$fname.'"></span></td><td  style="text-align:center;" id="gdate'.$fname.'">'.$start.'</td></tr>'; 
		 $page['smenu'] .='<li><a class="" href="'.$href.'"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
	 }
$sql = "select * from base_servers where `enabled` = 1 and `extraip` = 0 ORDER BY `fname` ASC";
$base_servers = $database->get_results($sql);	 
foreach ($base_servers as $server) {
	$page['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
} 
$page['page-title'] = ucfirst(basename($_SERVER['SCRIPT_NAME'], ".php"));
$template = new template;
$template->load('templates/subtemplates/sidebar.html');
$template->replace_vars($page);
$page['sidebar'] = $template->get_template();
$table_row='';
foreach (glob("*.php") as $filename) {
	$check = check_file($filename);
	if(empty($check['module'] )) {
		//echo 'hit empty<br>';
		$check['module'] = pathinfo($check['file_name'],PATHINFO_FILENAME);
	}
	$table_row .='<tr><td>'.$check['module'].'</td><td>'.$check['full_version'].'</td><td>'.$check['reason'].'</td><td>'.$check['time'].'</td><td style="color:#5769C7;">'.$check['git_version'].'</td></tr>';
}
//print_r($check);
//die();
$page['sw_table'] = $table_row;
$template->load('templates/updates.html');
$template->replace_vars($page);
$template->publish();

function check_file($file_name) {
	  // test file
	$return=array();
	if(is_file($file_name) == false){
		echo error.' Could not find '.$file_name.cr;
		$return['reason'] = ' Could not find ';
		$return['symbol'] = $cross;
		$return['status'] = false;
		return $return;
	}
	
	$file = file_get_contents($file_name); // got the file
	$fsize = filesize($file_name); // not sure with this
	$nf = explode(cr,$file);// turn file to array
	$matches = array_values(preg_grep('/\$build = "\d+-\d+"/', $nf));
	if (!empty($matches)){$b_match =$matches[0];} else{ $b_match = '';} 
	$matches = array_values(preg_grep('/\$version = "\d+.\d+"/', $nf));
	if (!empty($matches)){$v_match =$matches[0];} else{ $v_match = '';} 
	$matches = array_values(preg_grep('/\$version = "\d+.\d+.\d+"/', $nf));
	if (!empty($matches)){$v1_match =$matches[0];} else{ $v1_match = '';} 
	$matches = array_values(preg_grep('/\$time = "\d+"/', $nf));
	if (!empty($matches)){$t_match =$matches[0];} else{ $t_match = '';}
	$matches = array_values(preg_grep('/\$module = "\w+"/', $nf));
	if (!empty($matches)){$module =$matches[0];} else{ $module = '';}
	$nf = remove_item($nf,$b_match); // build info
	$nf = remove_item($nf,$v_match); // duplet
	//$nf = remove_item($nf,$v1_match); //triplet
	$nf = remove_item($nf,$t_match); // time string
	$length = strlen(implode(cr,$nf)); // string length
	$crc = crc32(implode(cr,$nf)); // crc the remaining
	if (!empty($t_match)) {
		$t = trim(str_replace('$time = "','',$t_match));
		$t = trim(str_replace('";','',$t));
		$time = date("d-m-Y H:i:s",$t);
	}
	else {$time='0';}
	if (!empty($module)) {
		$module = trim(str_replace('$module = "','',$module));
		$module = trim(str_replace('";','',$module));
		$module = trim(str_replace('_',' ',$module));
	}
	if (!empty($v_match)) {
	//print_r($v);
	$version = trim(str_replace('$version = "','',$v_match));
	$version = trim(str_replace('";','',$version));
	}
	if (!empty($v1_match)) {
	//print_r($v);
	$version = trim(str_replace('$version = "','',$v1_match));
	$version = trim(str_replace('";','',$version));

	}
	if ($b_match=='' and empty($version)) {
		$version = '';
	//echo error.' unable to check '.$file_name.' file structure is incorrect'.$cross.cr;
	$return['file_name'] = $file_name;
	$return['reason'] = 'Unknown module';
	$return['symbol'] = '';
	$return['status'] = false;
	$return['fsize'] = $length;
	$return['build'] ='';
	$return['full_version'] = $version;
	$return['module'] = $module;
	//$return['time'] = 0;
	return $return;
	}
	$build = str_replace('$build = "','',$b_match);
	$build = str_replace('";','',$build);
	$b_detail = explode('-',$build);
    $remote_file = check_remote_file($file_name); // see if there's an update
    //file_put_contents('debug.txt',"Local Version $version \n".print_r($remote_file,true).cr,FILE_APPEND);
	if (!empty($version) and $b_match == '' ) {
		
		if ($remote_file['version'] === $version) {
			$return['file_name'] = $file_name;
			$return['reason'] = "user configured file";
			$return['symbol'] = '';
			$return['status'] = true;
			$return['fsize'] = $length;
			$return['build'] ='';
			$return['full_version'] = "$version-$fsize-$crc";
			$return['time'] = date ("d-m-Y H:i:s", filectime($file_name));
			$return['module'] = $module;
		}
		if ( floatval($remote_file['version']) > floatval($version)){
			$return['reason'] = 'Update Available';
			$return['symbol'] = " ";
			$return['file_name'] = $file_name;
			$return['full_version'] = "$version-$fsize-$crc";
			$return['builld'] = '';
			$return['fsize'] = $length;
			$return['time'] = date ("d-m-Y H:i:s", filectime($file_name));
			$return['module'] = $module;
			return $return;
		}
	elseif ( $remote_file['version'] < $version and !empty($remote_file['version'])){
			$return['reason'] = "Local file is newer than Source";
			$return['symbol'] = "";
			$return['file_name'] = $file_name;
			$return['full_version'] = "$version-$fsize-$crc";
			$return['builld'] = '';
			$return['fsize'] = $length;
			$return['time'] = date ("d-m-Y H:i:s", filectime($file_name));
			$return['module'] = $module;
		}
	elseif (empty($remote_file['version'])) {
		// not in
		$return['reason'] = "User Configured Module";
		$return['symbol'] = "";
		$return['file_name'] = $file_name;
		$return['full_version'] = "$version-$fsize-$crc";
		$return['builld'] = '';
		$return['fsize'] = $length;
		$return['time'] = date ("d-m-Y H:i:s", filectime($file_name));
		$return['module'] = $module;
	}		
	return $return;
	}	
	if ($b_detail[0] == $length and $crc == $b_detail[1]) {
		
		if (empty($remote_file['time'])) { 
			$return['reason'] = "File not found (2)";
			$return['symbol'] = '';
			$file_name= $file_name;
			$d_version = "$version-$fsize-$crc";
			$time  = $time;
			$return['module'] = $module;
			}
		elseif ($remote_file['time'] == $t) {
			 $return['reason'] = "Up to date"; 
			 $file_name = $file_name;
			 $d_version = "$version-$length-$crc";
			 $return['module'] = $module;
			 $sx = strcmp($remote_file['full_version'] ,$d_version);
			 if ( $sx !==0) {
				$return['git_version'] = $remote_file['full_version'];
			}
			else {
				$return['git_version'] = '';
			} 
			 $time  =  date("d-m-Y H:i:s",$remote_file['time']);
			 }
		elseif ($remote_file['time'] < $t) 
		{
			 $return['reason'] = "Warning, local file is newer than source !";
			 $return['symbol'] = ""; 
			 $file_name = $file_name;
			 $d_version = "$version-$length-$crc";
			 $time  =  date("d-m-Y H:i:s",$remote_file['time']);
			 $return['module'] = $module;
			 			 		 }
		elseif ($remote_file['time'] > $t) 
		{ 
			$return['reason'] = "Update Available";
			$return['git_version'] = $remote_file['full_version'];
			$file_name = $file_name;
			$d_version = "$version-$length-$crc";
			$time  =  date("d-m-Y H:i:s",$remote_file['time']);
			$return['module'] = $module;
			}
		
		$return['file_name'] = $file_name;
		$return['status'] = 1;
		$return['fsize'] = $fsize;
		$return['build'] = $crc;
		$return['version'] = $version;
		$return['full_version'] = $d_version;
		$return['time'] = $time;
		$return['module'] = $module;
		return $return;
	}
	else {
		$return['file_name'] = $file_name;
		$return['reason'] = "Warning local module has altered";
		$return['symbol'] = '';
		$return['status'] = 2;
		$return['fsize'] = $fsize;
		$return['build'] = $crc;
		$return['version'] = $remote_file['version'];
		$return['full_version'] = "$version-$length-$crc";
		$return['time'] = $time;
		$return['module'] = $module;
		return $return;
	}
}

function remove_item($array,$value) {
        // remove item from array
        $remove = array_search_partial($array,$value);
        if(!$remove == false ) {
                unset($array[$remove]);
        }
        return $array;
}
function arrayInsert($array, $position, $insertArray)
{
    $ret = [];

    if ($position == count($array)) {
        $ret = $array + $insertArray;
    }
    else {
        $i = 0;
        foreach ($array as $key => $value) {
            if ($position == $i++) {
                $ret += $insertArray;
            }

            $ret[] = $value;
        }
    }

    return $ret;
}

function check_remote_file($file_name) {
	$file ="https://raw.githubusercontent.com/JimTR/phpgsmdemo/main/$file_name"; // need to have this as a branch setting
	//echo "file = $file".cr;
	$raw = geturl($file);
	$nf = explode(cr,$raw);// turn file to array
	$matches = array_values(preg_grep('/\$build = "\d+-\d+"/', $nf));
	if (!empty($matches)){$b_match =$matches[0];} else{ $b_match = '';} 
	$matches = array_values(preg_grep('/\$version = "\d+.\d+"/', $nf));
	if (!empty($matches)){$v_match =$matches[0];} else{ $v_match = '';} 
	$matches = array_values(preg_grep('/\$version = "\d+.\d+.\d+"/', $nf));
	if (!empty($matches)){$v1_match =$matches[0];} else{ $v1_match = '';} 
	$matches = array_values(preg_grep('/\$time = "\d+"/', $nf));
	if (!empty($matches)){$t_match =$matches[0];} else{ $t_match = '';}
	$nf = remove_item($nf,$b_match); // build info
	$nf = remove_item($nf,$v_match); // duplet
	$nf = remove_item($nf,$v1_match); //triplet
	$nf = remove_item($nf,$t_match); // time string
	$length = strlen(implode(cr,$nf)); // string length
	$crc = crc32(implode(cr,$nf)); // crc the remaining
	$time = trim(str_replace('$time = "','',$t_match));
	$time = trim(str_replace('";','',$time));
	$version = trim(str_replace('$version = "','',$v_match));
	$version = trim(str_replace('";','',$version));
	$build = str_replace('$build = "','',$b_match);
	$build = str_replace('";','',$build);
	$return['file_name'] = $file_name;
	$return['build'] = $build;
	$return['time'] = $time;
	$return['version'] = $version;
	$return['full_version'] ="$version-$build";
	//file_put_contents('debug.txt',print_r($return,true).cr,FILE_APPEND);
	return $return;
}

?>
