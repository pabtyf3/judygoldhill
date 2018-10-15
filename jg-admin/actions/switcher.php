<?php include_once("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */

if(isset($_GET['class'])){
    
    $c = new $_GET['class']($_GET['id']);
    
    //$tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/standard.tpl");
    
    //$out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array("","",$c->form()),$tpl);
    //echo $out;
    $c->switcher();
    header("Location:".$_SERVER['HTTP_REFERER']);
}



?>