<?php include_once("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */


    
    $c = new projectvideo();
    $c->updateVideos();
   
    

header("Location:".$_SERVER['HTTP_REFERER']);



?>