<?php include_once("/vhost/vhost18/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */
    
    $ln = new leftnav();
    $id = isset($_GET['id'])&&$_GET['id']!=""?$_GET['id']:"";
    
    if($id==""){
        $c = new page(6);
    }else{
        $c=new pmeta($id,"news");
    }
    
    
    //echo $id;
    $page = isset($_GET['page'])&&$_GET['page']!=""?$_GET['page']:"";
    $filter = isset($_GET['filter'])&&$_GET['filter']!=""?$_GET['filter']:"";
    $news = new news($id,$page,$filter);
    //var_dump($news);
    $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/standard.tpl");
    //echo $news->to_content();
    $out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array($c->meta(),$ln->output.$news->for_leftnav(),$news->to_content()),$tpl);
    echo $out;


?>