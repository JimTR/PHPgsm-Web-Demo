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
?>
