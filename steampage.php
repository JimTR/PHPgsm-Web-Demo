<?php
 
    if (!defined('DOC_ROOT')) {
    	define('DOC_ROOT', realpath(dirname(__FILE__) ));
    }
    require DOC_ROOT . '/inc/functions.inc.php';  // spl_autoload_register() is contained in this file
    require DOC_ROOT. '/inc/config.php'; // get config
    include DOC_ROOT. '/inc/settings.php'; // get settings 
    include DOC_ROOT.'/inc/functions.lin.php'; // linux os functions there will be a windoze version functions.win.php
	require 'inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
	use xPaw\SourceQuery\SourceQuery;
	define( 'SQ_TIMEOUT',    3 );
	define( 'SQ_ENGINE',      SourceQuery::SOURCE );
	$xpaw = new SourceQuery( );
	$search_string = "<div class=\"playerAvatar profile_header_size";
	$db_settings = $config['database']; // load default db connection settings
	define('db', new db($db_settings)); 
	//$page = file_get_contents("765.dta");
	$found = false;
	$framed = false;
	$ban_process = false;
	$in_game_process = false;
	if(isset($argv[1])) {
		$id = $argv[1];
	}
	else {
		$id = $_GET['id'];
	}
	$sql = "select * from steam_data where steam_id like '$id'";
	$user = db->get_row($sql);
	if (empty ($user)) {
		 $insert = true;
	}
	else {
		$where['steam_id'] = $user['steam_id'];
		$insert = false;
	}
	if(!$insert) {
		if ($user['last_update'] < time() -  86400) {$full_scan = true;} else{$full_scan = false;}
	}
	$url= "https://steamcommunity.com/profiles/$id";
	$page = file_get_contents($url);
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
			// no need to go any further if $full _scan is false
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
			$user_data['steam_ban'] ='';
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
					$user_data['steam_ban'] .="This Player 's last ban was over 7 years ago";
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
				$second = 0;
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
	if ($insert) {
		//echo "insert data".PHP_EOL;
		$user_insert['steam_id'] = $id;
		$user_insert['avatar'] = $user_data['avatar'];
		$user_insert['last_update'] = time();
		$user_insert['steam_date'] = strtotime($steam_date);
		if(isset($user_data['steam_ban'])) {$user_insert['vac_ban'] = $user_data['steam_ban'];}
		$in = db->insert('steam_data',$user_insert); // now add it
	}
	else {
		//echo "update data".PHP_EOL;
		$user_update['last_update'] = time();
		if(isset($user_data['frame'])) {$user_update['avatar_frame'] = $user_data['frame'];}
		if(isset($user_data['steam_ban'])) {$user_update['vac_ban'] = $user_data['steam_ban'];}
		if(isset($steam_date)) {$user_update['steam_date'] = strtotime($steam_date);}
		db->update('steam_data',$user_update,$where); 
	}
	echo json_encode($user_data);
	
	/*  Functions  */
		
	function str2int($string) {
		$length = strlen($string);   
		for ($i = 0, $int = ''; $i < $length; $i++) {
			if (is_numeric($string[$i])){
				$int .= $string[$i];
			}
			else {break;}
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