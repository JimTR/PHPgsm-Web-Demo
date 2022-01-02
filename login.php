<?PHP

    require 'inc/master.inc.php'; // load required files
	$time = microtime();
	$time = explode(' ', $time);
	$time = $time[1] + $time[0];
	$start = $time;
	  $Auth = new Auth ();
        $user = $Auth->getAuth();
	//print_r($_SERVER);
	//die();
if (!isset($_SERVER['HTTP_REFERER'])) 
{ 
	$_SERVER['HTTP_REFERER'] = "index.php";
	} 
//die();
    if($Auth->id > 0) 
           {
			   // already logged in default to the main index
			   $goto = ($_SERVER['HTTP_REFERER']);
			   if ($goto <> $_SERVER['PHP_SELF']) 
				{
					//die ($goto.' and '.$_SERVER['PHP_SELF']);
					//redirect($site->settings['url'].'/index.php');
					die ("user");
				}
			
			  else {
				  die("goto index");
				  redirect($goto);
			      }
}		
setcookie("redirect",$_SERVER['HTTP_REFFERER'],3600,'/');
    if(!empty($_POST['username']))
    {
		//print_r($_POST);
	     //die();
        if($Auth->login($_POST['username'], $_POST['password']))
        {
			//die('successful login'); 
			$goto = $_COOKIE['redirect'];
            setcookie ("redirect", "", time() - 3600,'/'); // clear the login cookie
            redirect($goto);
        }
        else
        {
			//die ('no user name');
            $Error = "You have entered an incorrect username/password combination.<br> Please try again. ";
           
           
	   }
		
    }
    
	
    // Clean the submitted username before redisplaying it.
    $username = isset($_POST['username']) ? htmlspecialchars($_POST['username']) : '';
    $password = isset($_POST['password']) ? htmlspecialchars($_POST['password']) : '';
    //$users = $database->num_rows("select * from sessions");
    $job = $_SERVER['HTTP_REFERER'];
	if (@!$_COOKIE['redirect']) {setcookie('redirect',$job, time() + (60 * 5),'/');} // make sure we go back
	$template = new Template;
	
	$template->load('templates/login.html');
	

      
   
	$template->publish();
	
?>

