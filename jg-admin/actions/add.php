<?php include_once("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */

if(isset($_GET['class'])){
    if($_GET['class']!="pmeta"){
    $c = new $_GET['class']();
    }else{
        $c = new pmeta($_GET['typeid'],$_GET['type']);
    }
    
    $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/standard.tpl");
    
    $out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array("","",$c->form()),$tpl);
    echo $out;
    
}



?>