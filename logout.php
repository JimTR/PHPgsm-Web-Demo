<?PHP
$build = "672-2441115016";
$version = "1.000";
$time = "1643265477";
    //require 'inc/master.inc.php';
define('DOC_ROOT', realpath(dirname(__FILE__)));
require DOC_ROOT . '/inc/functions.inc.php';  // spl_autoload_register() is contained in this file
    require DOC_ROOT. '/inc/config.php'; // get config
    include DOC_ROOT. '/inc/settings.php'; // get settings 
    include DOC_ROOT.'/inc/functions.lin.php'; // linux os functions there will be a windoze version functions.win.php
         const SALT = 'insert some random text here';
          $db_settings = $config['database']; // load default db connection settings
    $database = new db($db_settings); // start up a db class just in case we need it

    $template = new Template;
$Auth = new Auth ();
        $user = $Auth->getAuth();
print_r($user);
//die();
    //$filename = "user".$Auth->id.".txt";
    //$old = getcwd(); // Save the current directory
    //chdir(DOC_ROOT."/forum");
    //unlink($filename);
    //chdir($old); // Restore the old working directory    
    //$Auth->loginUrl = "";
    //$kill = $Auth->nid;
    //distroy_session($kill,$database);
    $Auth->logout();
//die();
    $pms="0";	
    //die ("got here ".$site->settings['url'].'/index.php');
   if(!empty($_SERVER['HTTP_REFERER'])){
       //redirect( $_SERVER['HTTP_REFERER']);
	}
	redirect('index.php');
    
?>
