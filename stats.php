<?php
/*
 * stats.php
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
  
$build = "1667-3072679804";
$version = "1.001";
$time = "1663578073";
$module = "stats";
$bserver = explode('=',$_SERVER['QUERY_STRING']);
$we_are_here = $settings['url'];
$url = $settings['url'];
$sql = "select * from logins limit 1";
$country = $database->get_results($sql);
$page['country'] = $country[0]['country'];
$page['country_stat'] = "{$country[0]['logins']}/{$country[0]['players']}";
$sql = "SELECT * FROM `user_stats`order by time_on_line desc, log_ons desc;";
$stats = $database->get_results($sql);
//die(print_r($stats,true));
//reset($stats);
$page['time_online'] = $stats[0]['name'];
$page['time_online_count'] = convertSecToTime($stats[0]['time_on_line']);
$columns = array_column($stats, 'total_log_ons');
array_multisort($columns, SORT_DESC, $stats);
$page['most_log_ons'] = $stats[0]['name'];
$page['log_on_count'] = $stats[0]['total_log_ons'];
$page['page-title'] = 'Statistics';
$page['url'] = $url;
$page['today'] = date("Y-m-d");
$template = new template;
$template->load('templates/subtemplates/header.html'); // load header
$template->replace_vars($header_vars);
$page['header'] = $template->get_template();
$template->load('templates/subtemplates/sidebar.html'); //sidebar
$template->replace_vars($sidebar_data);
$page['sidebar'] = $template->get_template();
$page['sidebar'] = str_replace("class=\"nav-link collapsed\" id=\"$module\" ","class=\"nav-link\"  id=\"users\" ",$page['sidebar']);
$template->load('templates/stats.html');
$template->replace_vars($page);
$template->publish();

function convertSecToTime($sec){
	$return='';
	if (!is_numeric($sec)) {$sec=0;}
	$date1 = new DateTime("@0"); //starting seconds
	$date2 = new DateTime("@$sec"); // ending seconds
	$interval =  date_diff($date1, $date2); //the time difference
	$y =  $interval->format('%y');
	$m = $interval->format('%m');
	$d = $interval->format('%d');
	$h = $interval->format('%H');
	$mi = $interval->format('%I');
	$s = $interval->format('%S');
	if ($y >0) {$return.= "{$y}y, ";}
	if ($m >0) {$return.= "{$m}m, ";}
	//if ($m > 0 and $y == 0) {$return .= "$m mo ";}
	if($d >0){$return .= "{$d}d, ";}
	$return .= "$h:";
	$return.= "$mi:";
	$return .= "$s";	
	//return $interval->format('%y y %m mo %d d, %h h %i m %s s'); // convert into Years, Months, Days, Hours, Minutes and Seconds
	return $return;
}
?>
