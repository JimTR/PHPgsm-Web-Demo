<?php
include 'inc/master.inc.php';
$template->load('templates/subtemplates/frame.html');
$page['id'] = $_GET['id'];
$page['url'] = $settings['url'];
$template->replace_vars($page);
$template->publish();

