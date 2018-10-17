<?php include_once("/vhost/vhost18/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */
    $c = new page($_GET['p']);
    $ln = new leftnav($_GET['p']);
    if($_GET['p']==1||!isset($_GET['p'])){
        $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/no_toppad.tpl");
    }else{
    $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/standard.tpl");
    }
    $out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array($c->meta(),$ln->output,$c->to_content()),$tpl);
    echo $out;


?>