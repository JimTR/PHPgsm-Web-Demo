<?php
require 'inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
	use xPaw\SourceQuery\SourceQuery;
	define( 'SQ_TIMEOUT',    3 );
	define( 'SQ_ENGINE',      SourceQuery::SOURCE );
	$xpaw = new SourceQuery( );
$search_string = "<div class=\"playerAvatar profile_header_size";
include "inc/functions.inc.php";
//$page = file_get_contents("765.dta");
$found = false;
$framed = false;
$ban_process = false;
$id = $_GET['id'];
$url= "https://steamcommunity.com/profiles/$id";
$page = curl($url);
$tmp = array_filter(explode(PHP_EOL,$page));
foreach ($tmp as $line) {
	$work[] = trim($line);
}
foreach($work as $line) {
	if (str_starts_with($line, $search_string)) {
		preg_match('/<div class="playerAvatar profile_header_size (.*)" (.*)>/', $line, $output);
		$state = trim($output[1]);
		if($state == "offline") {$user_data['status'] = "offline";} else {$user_data['status'] ="online";}
		$found = true;
		continue;
	}
	if($found) {
		if (str_starts_with($line,'<div class="profile_header_badgeinfo">')){
			$found = false;
			continue;
		}
		if (str_starts_with($line,'<div class="profile_avatar_frame')) {
			$framed =true;
		}
		if ($framed) {
			if (str_starts_with($line,'</div>')){
				$framed = false;
				continue;
			}
			if(strpos($line,"img src")) {
				$x = str_replace('<img src="','',$line);
				$x = str_replace('">','',$x);
				$user_data['frame'] = $x;
			}
		}
		else {
			if(strpos($line,"img src")) {
				$x = str_replace('<img src="','',$line);
				$x = str_replace('">','',$x);
				$user_data['avatar'] = $x;
			}
			
		}
	}  
	$years = strpos($line,'Member since');
	if ($years !== false) {
		$steam_date = substr($line,$years);
		$steam_date = str_replace('." >','',$steam_date);
		$steam_date = str_replace('.">','',$steam_date);
		$steam_date = str_replace('Member since ','',$steam_date);
		$user_data['steam_date'] = $steam_date;
	}
	$level = strpos($line,'<span class="friendPlayerLevelNum"');
	if($level !==false) {
		if(!str_ends_with($line,"</div></div>")) { continue;}
		$steam_level =substr($line,$level);
		$steam_level = str_replace('<span class="friendPlayerLevelNum">','',$steam_level);
		$steam_level = str_replace('</span></div></div>','',$steam_level);
		$user_data['steam_level'] = intval($steam_level);
	}
	$xp = strpos($line,'<div class="xp">');
		if($xp !== false) {
			$steam_xp = str_replace('<div class="xp">','',$line);
			$steam_xp = str_replace('</div>','',$steam_xp);
			$user_data['steam_xp'] = $steam_xp;
		}
		$ban = strpos($line,'<div class="profile_ban_status">');
		if($ban !==false) {
			$ban_process = true;
			$ban_output = '';
			// we have a vac ban
		}	
		if ($ban_process) {
			$finish_ban = strpos('<div class="responsive_count_link_area">',$line);
			if ($finish_ban !== false) {
				$ban_process = false;
				if(isset($date_last_banned)) {
					$user_data['steam_ban'] .= "last ban $date_last_banned";
				}
				else {
					$user_data['steam_ban'] .="This Player may have set bans private";
				} 
			}
			else{
				$line = trim(preg_replace('/\t/', '', $line));
				$span_pos = strpos($line,'<span ');
				if($span_pos) {
					$line = substr($line,0,$span_pos).", ";
					$user_data['steam_ban'] .= $line;
					continue;
				}
				$x = str2int($line);
				if (is_numeric($x) ) {
					if($x >0 ){
						$second += (($x * 24 + 0) * 60 + 0) * 60;
						$ts = time() - $second;	
						$date_last_banned = date('d-m-y',$ts);
					}
				}
			}
		}
		$in_game = strpos($line,'<div class="profile_in_game persona in-game">');
		if($in_game !==false) {
			$in_game_process = true;
		}
		if($in_game_process) {
			$finish_in_game = strpos($line,'<div class="responsive_count_link_area">');
			$in_game_process = false;
		}
		else {
			$line = trim(preg_replace('/\t/', '', $line));
			if (str_starts_with($line,'<div class="profile_in_game_name">')) {
				$tmp = str_replace('<div class="profile_in_game_name">','',$line);
				$tmp = str_replace('</div>','',$tmp);
				$user_data['in_game'] = $tmp;
				
			}
			if (str_starts_with($line,'<a href="steam://connect/')) {
				$tmp = str_replace('<a href="steam://connect/','',$line);
				$tmp = str_replace('" class="btn_green_white_innerfade btn_small_thin">','',$tmp);
				$user_data['current_server'] = $tmp;
				$tmp = explode(":",$tmp);
				try
					{
						$xpaw->Connect( $tmp[0], $tmp[1], SQ_TIMEOUT, SQ_ENGINE );
						$sub_cmd = 'GetInfo';
						$info = $xpaw->GetInfo();
					}
				catch( Exception $e )
					{
						$Exception = $e;
						if (strpos($Exception,'Failed to read any data from socket')) {
							$Exception = 'Failed to read any data from socket Module (Ajax - Game Detail '.$sub_cmd.')';
						}
					}
					$xpaw->Disconnect();
					if(isset($info['HostName'])) { $user_data['current_host'] = $info['HostName'];}
			}
				
		}
	
}
echo json_encode($user_data).PHP_EOL;

function str2int($string) {
  $length = strlen($string);   
  for ($i = 0, $int = ''; $i < $length; $i++) {
    if (is_numeric($string[$i]))
        $int .= $string[$i];
     else break;
  }

  return (int) $int;
}
function days_convert($sum) {
    $years = floor($sum / 365);
    $months = floor(($sum - ($years * 365))/30.5);
    $days = ($sum - ($years * 365) - ($months * 30.5));
    if ($years >1) {$years .=" years";} else {$years .=" year";}  
    if ($months >1) {$months .=" months";} else {$months .=" month";}
    if ($days >1) {$days .=" days";} else {$days .=" day";}
    return "$years $months $days";
}