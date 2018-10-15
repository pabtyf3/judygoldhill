<?php include_once("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */

if(isset($_GET['class'])){
    
    $c = new $_GET['class']($_GET['id']);
    
   $c->delete();
}
header("Location:".$_SERVER['HTTP_REFERER']);



?>