<?PHP

   // require 'inc/master.inc.php'; // load required files
define('DOC_ROOT', realpath(dirname(__FILE__)));
require DOC_ROOT . '/inc/functions.inc.php';  // spl_autoload_register() is contained in this file
    require DOC_ROOT. '/inc/config.php'; // get config
    include DOC_ROOT. '/inc/settings.php'; // get settings 
    include DOC_ROOT.'/inc/functions.lin.php'; // linux os functions there will be a windoze version functions.win.php
	 const SALT = 'insert some random text here';
define('dark',411811);
    define ('light',1297820);
	  $db_settings = $config['database']; // load default db connection settings
    $database = new db($db_settings); // start up a db class just in case we need it
$template = new template;
$build = "1888-294676103";
$version = "1.001";
$time = "1643282591";
	$time = microtime();
	$time = explode(' ', $time);
	$time = $time[1] + $time[0];
	$start = $time;
	  $Auth = new Auth ();
        $user = $Auth->getAuth();
	//print_r($user);
	//die('got to here');
if (!isset($_SERVER['HTTP_REFERER'])) 
{ 
	$_SERVER['HTTP_REFERER'] = "index.php";
	} 
//die();
    if($user->id > 0) 
           {
			   // already logged in default to the main index
			   $goto = ($_SERVER['HTTP_REFERER']);
			   if ($goto <> $_SERVER['PHP_SELF']) 
				{
					//die ($goto.' and '.$_SERVER['PHP_SELF']);
					redirect('index.php');
					die ("user");
				}
			
			  else {
				  die("goto index");
				  redirect($goto);
			      }
}		
//print_r($_SERVER);
setcookie("redirect",$_SERVER['HTTP_REFFERER'],3600,'.');
//die();
    if(!empty($_POST['username']))
    {
		print_r($_POST);
	     //die();
        if($Auth->login($_POST['username'], $_POST['password']))
        {
			//die('successful login'); 
			$goto = $_COOKIE['redirect'];
            setcookie ("redirect", "", time() - 3600,'.'); // clear the login cookie
            redirect($goto);
        }
        else
        {
			die ('no user name');
            $Error = "You have entered an incorrect username/password combination.<br> Please try again. ";
           
           
	   }
		
    }
    
//print_r($_POST);	
    // Clean the submitted username before redisplaying it.
    $username = isset($_POST['username']) ? htmlspecialchars($_POST['username']) : '';
    $password = isset($_POST['password']) ? htmlspecialchars($_POST['password']) : '';
    //$users = $database->num_rows("select * from sessions");
    $job = $_SERVER['HTTP_REFERER'];
	if (@!$_COOKIE['redirect']) {setcookie('redirect',$job, time() + (60 * 5),'/');} // make sure we go back
	//$template = new Template;
$template->load('templates/subtemplates/footer.html');
$page['footer'] = $template->get_template();
$template->load('templates/subtemplates/header.html');
$page['header'] = $template->get_template();
//print_r($page);
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
//print_r($page);
	$template->load('templates/login.html');
	$template->replace_vars($page);    
   
	$template->publish();
	
?>

