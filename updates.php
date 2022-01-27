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
$build = "8263-966391347";
$version = "2.071";
$time = "1643206975";
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
$table_row='';
foreach (glob("*.php") as $filename) {
	$check = check_file($filename);
	//echo pathinfo('/www/htdocs/index.html', PATHINFO_EXTENSION);
	//$table->addRow(array($check['file_name'],$check['symbol'],$check['reason'],$check['full_version']));
	$table_row .='<tr><td>'.pathinfo($check['file_name'],PATHINFO_FILENAME).'</td><td>'.$check['full_version'].'</td><td>'.$check['reason'].'</td><td></td></tr>';
}
//print_r($check);
//die();
$page['sw_table'] = $table_row;
$page['sidebar'] = $template->get_template();
$template->load('templates/updates.html');
$template->replace_vars($page);
$template->publish();

function check_file($file_name) {
	$return=array();
	global $page;
	if(is_file($file_name) == false){
		$return['reason'] = ' Could not find ';
		$return['symbol'] = $cross;
		$return['status'] = false;
		return $return;
	}
	
	$file = file_get_contents($file_name);
	$fsize = filesize($file_name)+1;
	$nf = explode(cr,$file);
	$matches = array_values(preg_grep('/^\$build = "\d+-\d+";/', $nf));
	$v = array_values(preg_grep('/^\$version = "\d+.\d+"/', $nf));
	$v1 = array_values(preg_grep('/^\$version = "\d+.\d+.\d+"/', $nf));
	if (!empty($v)) {
	$version = trim(str_replace('$version = "','',$v[0]));
	$version = trim(str_replace('";','',$version));
	$page['debug'] .= "version = $version<br>";
	}
	if (!empty($v1)) {
	//print_r($v);
	$version = trim(str_replace('$version = "','',$v1[0]));
	$version = trim(str_replace('";','',$version));
	//echo $version.cr;
	//print_r($matches);
	}
$o_length = strlen($file);
$matches = array_values(preg_grep('/\$build = "\d+-\d+"/', $nf));
if (!empty($matches)){$b_match =$matches[0];} else{ $b_match = '';}
$matches = array_values(preg_grep('/\$version = "\d+.\d+"/', $nf));
if (!empty($matches)){$v_match =$matches[0];} else{ $v_match = '';}
$matches = array_values(preg_grep('/\$version = "\d+.\d+.\d+"/', $nf));
if (!empty($matches)){$v1_match =$matches[0];} else{ $v1_match = '';}
$matches = array_values(preg_grep('/\$time = "\d+"/', $nf));
if (!empty($matches)){$t_match =$matches[0];} else{ $t_match = '';}
$b_pos = array_search_partial($nf,$b_match);
$v_pos = array_search_partial($nf,$v_match);
$v1_pos = array_search_partial($nf,$v1_match);
$t_pos = array_search_partial($nf,$t_match);

	$nf = remove_item($nf,$b_match); // build info
	$nf = remove_item($nf,$v_match); // duplet
	$nf = remove_item($nf,$t_match); // time string

	if (empty($matches) and empty($version)) {
	//echo error.' unable to check '.$file_name.' file structure is incorrect'.$cross.cr;
	$return['file_name'] = $file_name;
	$return['reason'] = "File structure is incorrect";
	$return['symbol'] = $cross;
	$return['status'] = false;
	$return['fsize'] = $fsize;
	$return['build'] ='';
	$return['full_version'] = $version;
	return $return;
	}
	$oldbp = strpos($file,'$build');
	$eol = strpos($file,';',$oldbp)+1;
	$build = substr($file,$oldbp,$eol-$oldbp);
	$a_length = strlen(implode(cr,$nf));
	$crc = crc32(implode(cr,$nf)); // crc the remaining
    //echo 'file '.$file_name.' - '.$tmp.' '.$ns.cr;
	//$build = trim($matches[0]);
	$build = str_replace('$build = "','',$build);
	$build = str_replace('"','',$build);
	$b_detail = explode('-',$build);
	//echo "\$fsize = $fsize \$ns = $ns strlen = $length".cr;
	if (!empty($version) and empty($matches)) {
		$return['file_name'] = $file_name;
		$return['reason'] = "user configured file";
		$return['color'] = 'green';
		$return['status'] = true;
		$return['fsize'] = $fsize;
		$return['build'] ='';
		$return['full_version'] = "$version-$fsize-$ns";
		return $return;
	}	
	if ($b_detail[0] == $a_length and $crc == $b_detail[1]) {
		
		//echo advice.' '.$file_name.$tick.cr;
		$return['file_name'] = $file_name;
		$return['reason'] = "File structure is correct";
		$return['color'] = 'green';
		$return['status'] = 1;
		$return['fsize'] = $fsize;
		$return['build'] = $ns;
		$return['version'] = $version;
		$return['full_version'] = "$version-$fsize-$crc";
		return $return;
	}
	else {
		//echo $file_name.' has an error !, it\'s not as we coded it  '.cr;
		//echo 'have you editied the file ? If so you need to re install a correct copy.'.cr;
		$return['file_name'] = $file_name;
		$return['reason'] = "File stucture has altered !";
		$return['color'] = 'yellow';
		$return['status'] = 2;
		$return['fsize'] = $fsize;
		$return['build'] = $ns;
		$return['version'] = $version;
		$return['full_version'] = "$version-$fsize-$crc";
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
	$file ="https://raw.githubusercontent.com/JimTR/phpgsmdemo//main/$file_name"; // need to have this as a branch setting
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
	$time = trim(str_replace('$time = "','',$t_match));
	$time = trim(str_replace('";','',$time));
	$version = trim(str_replace('$version = "','',$v_match));
	$version = trim(str_replace('";','',$version));
	$build = str_replace('$build = "','',$b_match);
	$build = str_replace('";','',$build);
	$return['build'] = $build;
	$return['time'] = $time;
	$return['version'] = $version;
	return $return;
}

?>
