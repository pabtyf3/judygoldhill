<?php include_once("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */
    $c = new page(8);
    $ln = new leftnav();
    if(!isset($_GET['filter'])||$_GET['filter']==""){
    $pc = new projectcategories();
    $_GET['filter']=$pc->getFirst();
    }
    //echo ;
    $works = new project();
    $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/no_toppad.tpl");
    $wln = $works->forLeftnav();
  //  $shares = new shares();
    
    
    $out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array($c->meta(),$ln->output.$wln,$works->work_page()),$tpl);
    echo $out;


?>