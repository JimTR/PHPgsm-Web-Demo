<?php
/*
 * Register script
 * reworked 8-1-15
 *  
 */
 
 require 'inc/master.inc.php'; // do login or not
 $template = new Template;
if (!is_cli()) {
// hmm  think we go 404
$template->load('templates/404.html');
$template->publish();

}	
 print_r ($argv);
 $username = $argv[1];
 $password = $argv[2];
 $email = $argv[3];
 $checku['username'] = $username;
 if ($database->exists("users","username",$checku))
		{
			echo "We're sorry, you have entered a username that is in use.".PHP_EOL;
			die ();
			}
 $nid = getnid();
 $validemail=valid_email($email, true);
		              if(!$validemail)
		              { 
						  echo "There appears to be a problem with your email address check & retry".PHP_EOL;
						 die();
			}
	$password = md5($password.SALT);
	echo "password = $password    nid = $nid".PHP_EOL;
		$newuser['nid'] = $nid;
		$newuser['username']= $username;
		$newuser['password'] = $password;
		$newuser['email'] = $email; 
		//$newuser['ip'] = $ip;	
		$newuser['regdate'] = time();
		print_r($newuser);
		$database->insert ("users",$newuser);		
 die();
	 if(!empty($_POST['username']))
	{
		
		// add user
		$ip = getip();
		$ips = $database->num_rows("select * from users where ip = '".$ip."'");
		
		if ($ips >= 2) {
			$Error = "<li>This IP is already registered</li>";
			//goto render;
		}
		$invalidwords = array ("select","delete","insert","update","'");
		$word = substr_count_array( $_POST['username'], $invalidwords);
		$word = $word + substr_count_array( $_POST['password'], $invalidwords);
		//die ("Word = ".$word);
		if ($word >0) {
					$Error ="Invalid Username or Password";
					goto render;
				}
		$checku['username'] = $_POST['username'];
		if (strlen ($_POST['password']) <= $site->settings['pwdlen']) {
			$Error = "<li>Invalid Password, passwords must be longer than ".$site->settings['pwdlen']." chrs and not contain your username</li>";
			//goto render;
		}
		$pwdcheck = stripos ($_POST['password'] , $_POST['username']);
		if ($pwdcheck !== false)
		{
			$Error .= "Invalid Password, passwords must be longer than ".$site->settings['pwdlen']." chrs and not contain your username";
			goto render;
		}
		$checke['email'] = $_POST['email'];
		//else {$Error = "test this out"; goto render;} 
		
		if (!$_POST['email'])
			{$Error .= 'There appears to be a problem with your email address check & retry';
				
			} 
			else 
			{
				$validemail=valid_email($_POST['email'], true);
		              if(!$validemail)
		              { 
						  $Error .= "There appears to be a problem with your email address check & retry";
						  goto render;}
			}
		
		if ($database->exists("users","username",$checku))
		{
			$Error .="<li>We're sorry, you have entered a username that is in use.</li>";
			//die ($Error);
			//goto render;
			}
			
		if ($database->exists("users","email",$checke))
		{
			$Error .="We're sorry, you have entered an email address that is in use.";
			//die ($Error);
			goto render;
			}
		
		if (rpHash($_POST['defaultReal']) <> $_POST['defaultRealHash']) {	
			
			$Error .= " You Supplied an incorrect captcha";
			
		
			goto render; 
			
		}
			
			//if ($Error){goto render;}		
		//$newuser = array();
		
		$file='log.txt';
			   if(! empty($_SERVER['REMOTE_ADDR']) ){
		
		$nid = getnid();
        $password = md5($_POST['password'].SALT);
		$newuser['nid'] = $nid;
		$newuser['username']= $_POST['username'];
		$newuser['password'] = $password;
		$newuser['email'] = $_POST['email']; 
		$newuser['ip'] = $ip;	
		$newuser['regdate'] = time();
		$person = $_POST['username'].' '.FORMAT_TIME.' '.$ip;
		log_to ($file,$person);
		
		
			$database->insert ("users",$newuser);
			//echo 'error set <br>';
			//print_r($newuser);
		//die();
		}
			 if($Auth->login($_POST['username'], $_POST['password']))
        {
			
            redirect("index.php");
        }
        else
        {
			
            $Error->add($Shit, "We're sorry, you have entered an incorrect username or password. Please try again.");
           
	   }
			die();
		}  
   elseif(!empty($_POST)) {$Error = "No Username supplied";} 
render:	
if ($Error <> "")
	{
		$Error = "<ul class=\"alert error\" style=\"width:98%;margin:10px\">".$Error."</ul>";
		
	}
// put the page together	
$page['header'] = $template->load($page['template_path'].'header.html', COMMENT);
$page['footer'] = $template->load($page['template_path'].'footer.tmpl', COMMENT);
$page['include'] = $template->load($page['template_path'].'include.tmpl',COMMENT);
$page['title'] .=" - Register";
$page['css'] = '';// $template->load ('css/yuiapp.css');
$page['css'] ="<style>".$page['css']."</style>";
$page['stuff'] = "register page";
$page['email'] = $_POST['email'];
$page['pwdlen']  = $site->settings['pwdlen'];
$page['username'] = $_POST['username'];
$page['login'] = $template->load($page['template_path'].'guest.html', COMMENT) ;
$template->load($page['template_path'].'register.html');
$template->replace_vars($page);
$template->replace("password",$_POST['password']);
$template->replace("result"," register");
$template->replace("title", "Register");
$template->replace ("path", $site->settings['url']);
$template->replace("error",$Error );
//$template->replace("login",$login);
$template->replace("vari",DOC_ROOT);
$template->replace("adminstats","");
$template->replace("datetime", FORMAT_TIME);
if($site->settings['showphp'] === false)
{
$template->removephp();
}
$template->listv("lang/reg_lang.php","");
$template->publish();
 
 function substr_count_array( $haystack, $needle ) {
     $count = 0;
      $haystack = strtolower($haystack);
     foreach ($needle as $substring) {
		  $substring = strtolower($substring);
          $count += substr_count( $haystack, $substring);
     }
     return $count;
} 
function rpHash($value) { 
    $hash = 5381; 
    $value = strtoupper($value); 
    for($i = 0; $i < strlen($value); $i++) { 
        $hash = (leftShift32($hash, 5) + $hash) + ord(substr($value, $i)); 
    } 
    return $hash; 
} 
 
// Perform a 32bit left shift 
function leftShift32($number, $steps) { 
    // convert to binary (string) 
    $binary = decbin($number); 
    // left-pad with 0's if necessary 
    $binary = str_pad($binary, 32, "0", STR_PAD_LEFT); 
    // left shift manually 
    $binary = $binary.str_repeat("0", $steps); 
    // get the last 32 bits 
    $binary = substr($binary, strlen($binary) - 32); 
    // if it's a positive number return it 
    // otherwise return the 2's complement 
    return ($binary[0] == "0" ? bindec($binary) : 
        -(pow(2, 31) - bindec(substr($binary, 1)))); 
} 
?>
