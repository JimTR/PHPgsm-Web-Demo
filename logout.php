<?PHP
$build = "672-2441115016";
$version = "1.000";
$time = "1643265477";
ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
    require 'inc/master.inc.php';
	$Auth = new Auth ();
	$user = $Auth->getAuth();
	$Auth->logout();
//die();
    $pms="0";	
    //die ("got here ".$site->settings['url'].'/index.php');
   if(!empty($_SERVER['HTTP_REFERER'])){
       //redirect( $_SERVER['HTTP_REFERER']);
	}
	redirect('index.php');
    
?>
