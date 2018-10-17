<?php include_once("/vhost/vhost18/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */


    
    $c = new slide();
    
    $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/standard.tpl");
    $leftnav = new leftnav();
    $out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array("",$leftnav->adminMenu(),$c->uploadify()),$tpl);
    echo $out;
    




?>