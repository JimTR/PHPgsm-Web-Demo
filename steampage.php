<?php
$search_string = "<div class=\"playerAvatar profile_header_size";
include "inc/functions.inc.php";
//$page = file_get_contents("765.dta");
$found = false;
$framed = false;
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
		//echo "$line\n";
		$found = true;
		continue;
	}
	if($found) {
		if (str_starts_with($line,'<div class="profile_header_badgeinfo">')){
			$found = false;
			//die();
			continue;
		}
		//$line = str_replace('<img src=','<img style="width:50px;height:50px;" src=',$line);
		if (str_starts_with($line,'<div class="profile_avatar_frame')) {
			//echo "framed\n";
			$framed =true;
		}
		if ($framed) {
			if (str_starts_with($line,'</div>')){
				//echo "frame finish $line\n";
				$framed = false;
				continue;
			}
			if(strpos($line,"img src")) {
				//echo "image found\n";
				//echo strip_tags($line)."\n";
				$x = str_replace('<img src="','',$line);
				$x = str_replace('">','',$x);
				//echo "$x\n";
				$user_data['frame'] = $x;
			}
		}
		else {
			if(strpos($line,"img src")) {
				//echo "image found\n";
				//echo strip_tags($line)."\n";
				$x = str_replace('<img src="','',$line);
				$x = str_replace('">','',$x);
				//echo "$x\n";
				$user_data['avatar'] = $x;
			}
			//echo "$line\n";
		}
	}  
	$years = strpos($line,'Member since');
	if ($years !== false) {
		$steam_date = substr($line,$years);
		$steam_date = str_replace('." >','',$steam_date);
		$steam_date = str_replace('.">','',$steam_date);
		$steam_date = str_replace('Member since ','',$steam_date);
		//echo "test  $steam_date\n";
		$user_data['steam_date'] = $steam_date;
	}
}
//echo "</div>";
//print_r($user_data);
echo json_encode($user_data).PHP_EOL;
