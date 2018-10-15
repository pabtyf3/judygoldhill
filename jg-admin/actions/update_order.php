<?php include_once("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */

if(isset($_POST['class'])){
    
    $c = new $_POST['class']();
    
   $c->update_order();
}
header("Location:".$_SERVER['HTTP_REFERER']);



?>