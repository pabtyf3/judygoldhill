<?php include("/vhost/vhost18/j/u/d/judygoldhill.com/www/includes/config.inc"); 

/**
 * @author pabtyf
 * @copyright 2012
 */

//var_dump($_POST);

$ctype = $_POST['class'];
$id = isset($_POST['id'])?$_POST['id']:"";
$class = new $ctype($id);

$class->processForm();
if(isset($_POST['ret'])){
header("Location:".$_POST['ret']);
}

?>