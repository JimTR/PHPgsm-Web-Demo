<?php
  if (!defined('DOC_ROOT')) {
    	define('DOC_ROOT', realpath(dirname(__FILE__) . '/../'));
    }
	require DOC_ROOT . '/inc/functions.inc.php';  // spl_autoload_register() is contained in this file
    require DOC_ROOT. '/inc/config.php'; // get config
    include DOC_ROOT. '/inc/settings.php'; // get settings 
    include DOC_ROOT.'/inc/functions.lin.php'; // linux os functions there will be a windoze version functions.win.php
    if (is_cli()) {
		$id = $argv[1];
	}
	else {
		//echo "I don't think so";
		$id = $_GET['id'];
	}
	require DOC_ROOT.'/inc/xpaw/SourceQuery/bootstrap.php'; // load xpaw
	use xPaw\SourceQuery\SourceQuery;
	define( 'SQ_TIMEOUT',    3 );
	define( 'SQ_ENGINE',      SourceQuery::SOURCE );
	define ('xpaw' , new SourceQuery( ));
	
	$db_settings = $config['database']; // load default db connection settings
	define('db', new db($db_settings)); 
	//$sql = "select * from steam_data where steam_id like '$id'";
	$sql = "SELECT players.name_c,players.aka,steam_data.* FROM `steam_data` left join players on steam_data.steam_id = players.steam_id64 WHERE `steam_id` like '$id';";
	$user_data = db->get_row($sql);
	/*if(is_null($user_data['name_c'])) {
		die ("critical error user not found in the data table");
		print_r($user_data);
	}*/
	//print_r($user_data);
	//die();
	if (empty ($user_data)) {$insert = true;} else {$insert = false;}
	$xml=file_get_contents("https://steamcommunity.com/profiles/$id?xml=1");
	$xml   = simplexml_load_string($xml,"SimpleXMLElement", LIBXML_NOCDATA);
	$user = json_decode(json_encode((array) $xml), true);
	$full_data = db->escape(json_encode((array) $xml));
	foreach ($user as $k => $v) {
		if(is_array($v)) {
			$extra[$k] = $v;
			unset($user[$k]);
		}
	}
	//print_r($user);
	//die();
	if (isset($user['memberSince'])) {
		$user['adjust'] = strtotime(str_replace(",","",$user['memberSince']));
	}
	else {
		$user['adjust']=0;
	} 
	if (str_starts_with($user['stateMessage'],'In-Game')) {
		// hmm
		$user['stateMessage'] = strip_tags($user['stateMessage']);
		$user['stateMessage'] = str_replace('In-Game','',$user['stateMessage']);
	}
	//print_r($user);
	if (isset($user['inGameServerIP'])) {
		$server_name = inGame($user['inGameServerIP']);
	}
	if(!empty($user_data)) {
		//echo "user_data \r\n".print_r($user_data,true);
		$t = time();
		$hoursToSubtract = 1;
		$timeToSubtract = ($hoursToSubtract * 60 * 60);
		$ut = $user_data['last_update'];
		$lf = $t - $timeToSubtract;
		if ($user_data['last_update'] < $lf) {
			$new_data['steam_id'] = $id;
			$new_data['name_c'] = $user['steamID'];
			$new_data['steam_date'] = $user['adjust'];
			$new_data['avatar'] = $user['avatarFull'];
			$new_data['last_update'] = time();
			$new_data['vac_ban'] = $user['vacBanned'];
			$new_data['profile_state'] = $user['privacyState'];
			// add extra's
			$sp = get_steamPage($id);
			if(isset($sp['frame'])) {$new_data['avatar_frame'] = $sp['frame'];}
			if(isset($sp['steam_level'])) {$new_data['steam_level'] = $sp['steam_level'];}
			if(isset($sp['steam_xp'])) {$new_data['steam_xp'] = $sp['steam_xp'];}
			if(isset($sp['ban_ts'])) {$new_data['last_ban'] = $sp['ban_ts'];}
			if(isset($sp['steam_ban'])) {$new_data['ban_desc'] = $sp['steam_ban'];}
			$where['steam_id'] = $user_data['steam_id'];
			unset($new_data['steam_id']);
			unset($new_data['name_c']);
			$new_data['full_data'] = $full_data;
			//die($full_data);
			db->update('steam_data',$new_data,$where); 
			
			if ($user['onlineState'] == 'in-game') {$new_data['game'] = $user['stateMessage'];}
			else {$new_data['status'] = $user['stateMessage'];}
			if (isset($server_name ) and $server_name !== false) {$new_data['game'] .=" $server_name"; }
			if ($user['onlineState'] == 'in-game') {
				$new_data['game'] = $user['stateMessage'];
				$new_data['status'] ="In Game";
			}
			else {$new_data['status'] = $user['stateMessage'];}
			echo json_encode($new_data);
		} 
		else{ 
			if ($user['onlineState'] == 'in-game') {
				$user_data['game'] = $user['stateMessage'];
				$user_data['status'] ="In Game";
			}
			else {$user_data['status'] = $user['stateMessage'];}
			if ($user['onlineState'] == 'in-game') {$user_data['game'] = $user['stateMessage'];}
			if (isset($server_name ) and $server_name !== false) {$user_data['game'] .=" $server_name"; }
			unset($user_data['id']);
			unset($user_data['last_update']);
			unset($user_data['steam_id']);
			$user_data['steam_date'] = date("d M, Y",$user_data['steam_date']);
			foreach ($user_data as $k=> $v) {
				if(is_null($v)) { unset ($user_data[$k]);}
			}
			if ( $user_data['steam_date'] >0 ) {
				//echo $user_data['steam_date'];
				//$user_data['steam_date'] = date("d M, Y",$user_data['steam_date']);
			}
			else {
				unset($user_data['steam_date']);
			}
			
			
			//print_r($user_data);	
			echo json_encode($user_data);
			exit;
		}
		
	}
	else {
		//echo "let's add\r\n";
		$sp = get_steamPage($id);
		$new_data['steam_id'] = $id;
		$new_data['steam_date'] = $user['adjust'];
		$new_data['avatar'] = $user['avatarFull'];
		$new_data['last_update'] = time();
		$new_data['vac_ban'] = $user['vacBanned'];
		$new_data['profile_state'] = $user['privacyState'];
		// add extra's
		if(isset($sp['frame'])) {$new_data['avatar_frame'] = $sp['frame'];}
		if(isset($sp['steam_level'])) {$new_data['steam_level'] = $sp['steam_level'];}
		if(isset($sp['steam_xp'])) {$new_data['steam_xp'] = $sp['steam_xp'];}
		if(isset($sp['ban_ts'])) {$new_data['last_ban'] = $sp['ban_ts'];}
		if(isset($sp['steam_ban'])) {$new_data['ban_desc'] = $sp['steam_ban'];}
		$new_data['full_data'] = $full_data;
		$in = db->insert('steam_data',$new_data); // now add it
		if ($user['onlineState'] == 'in-game') {$new_data['game'] = $user['stateMessage'];}
		else {$new_data['status'] = $user['stateMessage'];}
		
		if ( $new_data['steam_date'] >0 ) {
				//echo $user_data['steam_date'];
				$new_data['steam_date'] = date("d M, Y",$new_data['steam_date']);
			}
			else {
				unset($new_data['steam_date']);
			}	
			if ($user['onlineState'] == 'in-game') {
				$new_data['game'] = $user['stateMessage'];
				$new_data['status'] ="In Game";
				if (isset($server_name ) and $server_name !== false) {$new_data['game'] .=" $server_name"; }
			}
			else {$new_data['status'] = $user['stateMessage'];}
		echo json_encode($new_data);
	}
	//if ($user['vacBanned']==1) {echo "naughty {$user['steamID']} you have a vac ban \r\n";}
	//print_r($new_data);

function get_steamPage($id) {
	// scrape the steam page for more info
	$user_data= array();
	$user_data['frame'] = null;
	$framed = false; 
	$ban_process = false;
	$url= "https://steamcommunity.com/profiles/$id";
	$page = file_get_contents($url);
	$tmp = array_filter(explode(PHP_EOL,$page));
	foreach ($tmp as $line) {
		$work[] = trim($line);
	}
	foreach ($work as $line) {
		// look for stuff the xml does not have
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
					$user_data['ban_ts'] = strtotime($date_last_banned);
				}
				else {
					$user_data['steam_ban'] .="Last ban was over 7 years ago";
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
						$date_last_banned = date('d-m-Y',$ts);
					}
				}
			}
		}	
	}
	//print_r($user_data);
	return $user_data;
}
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
	function inGame ($server) {
		// retrive the server
		// inGameServerIP
		$tmp = explode(":",$server);
		
		try
					{
						xpaw->Connect( $tmp[0], $tmp[1], SQ_TIMEOUT, SQ_ENGINE );
						$sub_cmd = 'GetInfo';
						$info = xpaw->GetInfo();
					}
				catch( Exception $e ) {					
					xpaw->Disconnect();
					return false;
				}
				xpaw->Disconnect();
				//print_r($info);
				$servername = $info['HostName'];
				return $servername;
	}