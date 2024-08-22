<?php
 require 'inc/master.inc.php'; // load required files
define('dark',411811);
define ('light',1297820);
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
if (!isset($_SERVER['HTTP_REFERER'])) { $_SERVER['HTTP_REFERER'] = "index.php";} 
if($user->id > 0) {
	// already logged in default to the main index
	$goto = ($_SERVER['HTTP_REFERER']);
	if ($goto <> $_SERVER['PHP_SELF']) {redirect('index.php');}
	else {redirect($goto);} 
}		
setcookie("redirect",$_SERVER['HTTP_REFFERER'],3600,'.');
if(!empty($_POST['username'])){
	if($Auth->login($_POST['username'], $_POST['password'])){
		$goto = $_COOKIE['redirect'];
		setcookie ("redirect", "", time() - 3600,'.'); // clear the login cookie
		redirect("index.php");
	}
	else{
		$template->load('templates/subtemplates/footer.html');
		$page['footer'] = $template->get_template();
		$template->load('templates/subtemplates/header.html');
		$page['header'] = $template->get_template();
		$page['error'] = "display:block";
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
		$page['error'] = "display:block;";
		$template->load('templates/login.html');
		$template->replace_vars($page);    
		$template->publish();
    }
}
$username = isset($_POST['username']) ? htmlspecialchars($_POST['username']) : '';
$password = isset($_POST['password']) ? htmlspecialchars($_POST['password']) : '';
$job = $_SERVER['HTTP_REFERER'];
if (@!$_COOKIE['redirect']) {setcookie('redirect',$job, time() + (60 * 5),'/');} // make sure we go back
$template->load('templates/subtemplates/footer.html');
$page['footer'] = $template->get_template();
$template->load('templates/subtemplates/header.html');
$page['header'] = $template->get_template();
switch($_COOKIE['phpgsm_theme']) {
	case light:
		$template->load('templates/subtemplates/light-include.html');
		$page['include'] = $template->get_template();
		break;
	case dark:
		$template->load('templates/subtemplates/dark-include.html');
		$page['include'] = $template->get_template();
		break;
	default:
		$template->load('templates/subtemplates/light-include.html');
		$page['include'] = $template->get_template();
		break;
}
$page['error'] = "display:none;";
$template->load('templates/login.html');
$template->replace_vars($page);    
$template->publish();