<?php
   
    if (!defined('DOC_ROOT')) {
    	define('DOC_ROOT', realpath(dirname(__FILE__) . '/../'));
    }
    
    require DOC_ROOT . '/inc/functions.inc.php';  // spl_autoload_register() is contained in this file
    require DOC_ROOT. '/inc/config.php'; // get config
    include DOC_ROOT. '/inc/settings.php'; // get settings 
    include DOC_ROOT.'/inc/functions.lin.php'; // linux os functions there will be a windoze version functions.win.php
$build = "1892-1363311387";
$version = "3.00";
$time = "1639730055";
$template = new template;
	$time_format = "h:i:s A";  // force time display
	$tz = $settings['server_tz']; // set a default time zone
   	date_default_timezone_set($tz); // and set it 
    $db_settings = $config['database']; // load default db connection settings
    define ('db_settings',$db_settings);
    define( 'SEND_ERRORS_TO', $config['database']['errors'] ); //set email notification email address
    define( 'DISPLAY_DEBUG', $config['database']['display_error'] ); //display db errors?
    define( 'DB_COMMA',  '`'); // back tick 
    define( 'TIME_NOW', time()); //time stamp
    define( 'FORMAT_TIME',  date($time_format)); // format the time
    define( 'GIG',1073741824);
    define('settings',$settings); // read only but global !
    define('dark',411811);
    define ('light',1297820);
    
     if ($settings['send_cors'] ==1) {
		 header("Access-Control-Allow-Origin: *");
	}
    if ($settings['year'] == true)
   {
	// set data to roman numerals
       define ("COPY_YEAR", romanNumerals(date("Y"))); 
       define ("START_YEAR",romanNumerals($settings['start_year']));
   }
    else {
	 define ("COPY_YEAR", date("Y")); 
     define ("START_YEAR",$settings['start_year']);
      }

    const SALT = 'insert some random text here';
    $database = new db($db_settings); // start up a db class just in case we need it
    // Fix magic quotes
        $_POST    = fix_slashes($_POST);
        $_GET     = fix_slashes($_GET);
        $_REQUEST = fix_slashes($_REQUEST);
        $_COOKIE  = fix_slashes($_COOKIE);
    //print_r ($_COOKIE);
       if (!isset($_COOKIE['phpgsm_theme'])) {
		$arr_cookie_options = array (
                'expires' => time() + 60*60*24*30,
                'path' => '/',
                'domain' => '', // leading dot for compatibility or use subdomain
                'secure' => true,     // or false
                'httponly' => false,    // or false
                'samesite' => 'Lax' // None || Lax  || Strict
                );
		setcookie('phpgsm_theme', light, $arr_cookie_options);
		   
		}
        else {
		switch($_COOKIE['phpgsm_theme']) {
			case light:
				$template->load('templates/subtemplates/light-include.html');
				$page['include']= $template->get_template();
				break;
			case dark:
				$template->load('templates/subtemplates/dark-include.html');
                                $page['include']= $template->get_template();
                                break;
			default:
				$template->load('templates/subtemplates/light-include.html');
                                $page['include']= $template->get_template();
                                break;
   		 }
	}
$template->load('templates/subtemplates/footer.html');
$page['footer'] = $template->get_template();
$template->load('templates/subtemplates/header.html');
$page['header'] = $template->get_template();
 $Auth = new Auth ();
$user = $Auth->getAuth(); // get the user
if($user->loggedIn()) {
	
		//set the sidebar option to logout;
		$user_data = array (
		'user_id' => $user->id,
		'user_name' => $user->username,
		'ip' =>  ip2long($_SERVER['REMOTE_ADDR']),
		'start_time' => time(),
		'nid' => $user->nid  
		) ;
		if ($database->get_row('select * from allowed_users where user_id = '.$user->id)) {
			$where = array('user_id' => $user->id);
			unset($user_data['user_id']);
			$database->update('allowed_users',$user_data,$where);
		} 
		else {
			$database->insert('allowed_users',$user_data);
		}
   	}
   	elseif (basename($_SERVER['REQUEST_URI'], '?' . $_SERVER['QUERY_STRING']) !== 'login.php') {
		echo basename($_SERVER['REQUEST_URI'], '?' . $_SERVER['QUERY_STRING']);
		
		redirect('login.php');
		
	}
$sidebar_data = array();
$sidebar_data['smenu']='';
$sidebar_data['bmenu'] = '';
$sql = "select * from server1 order by `host_name` ASC";
$sidebar_data['bmenu'] = '';
$sidebar_data['smenu'] = '';
$bserver = explode('=',$_SERVER['QUERY_STRING']);
//print_r($bserver);
$servers = $database->get_results($sql);
foreach ($servers as $server) {
	$fname = trim($server['host_name']);
        $href = 'gameserver.php?server='.$server['host_name'];
        if(!$server['enabled']) {
             $sidebar_data['smenu'] .='<li><a class="" href="'.$href.'" style="text-decoration: line-through;"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
             continue;
       }
	
	if ($bserver[1] == $server['host_name'] ) {$class = 'active';} else {$class='';}
	$sidebar_data['smenu'] .='<li><a class="'.$class.'" href="'.$href.'"><img style="width:16px;" src="'.$server['logo'].'">&nbsp;'.$server['server_name'].'&nbsp;</a></li>';
}

$sql = "select * from base_servers where `enabled` = 1 and `extraip` = 0 ORDER BY `fname` ASC";
$base_servers = $database->get_results($sql);
foreach ($base_servers as $server) {
	$sidebar_data['bmenu'] .='<li><a class="" href="baseserver.php?server='.$server['fname'].'"><i class="bi bi-server" style="font-size:12px;"></i>'.$server['fname'].'</a></li>';
}
$sidebar_data['servers'] = 'Game Servers';
$sidebar_data['base_servers'] = 'Base Servers';

?>
