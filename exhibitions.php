<?php include_once("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */
    
    $ln = new leftnav();
    $id = isset($_GET['id'])&&$_GET['id']!=""?$_GET['id']:"";
    
    if($id==""){
        $c = new page(7);
    }else{
        $c = new pmeta($id,"exhibition");
    }
    
    //echo $id;
    $page = isset($_GET['page'])&&$_GET['page']!=""?$_GET['page']:"";
    $filter = isset($_GET['filter'])&&$_GET['filter']!=""?$_GET['filter']:"";
    $exhib = new exhibition($id,$page,$filter);
    //var_dump($news);
    $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/standard.tpl");
    //echo $news->to_content();
    $out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array($c->meta(),$ln->output.$exhib->for_leftnav(),$exhib->to_content()),$tpl);
    echo $out;


?>