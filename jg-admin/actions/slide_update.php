<?php include_once("/vhost/vhost18/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */


    
    $c = new slide();
    $c->updateImages();
   
    

header("Location:".$_SERVER['HTTP_REFERER']);



?>