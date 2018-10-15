<?php  include_once("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author phpdes
 * @copyright 2013
 */
   // $c = new page(8);
   $c = new pmeta($_GET['id'],"project");
   //var_dump($c);
    $ln = new leftnav();
    $works = new project($_GET['id']);
    $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/no_toppad.tpl");
    $wln = $works->single_project_leftnav();
    
      $cat = new projectcategories($works->category);
    $contout = $works->work_as_thumbs();
       $contout.="<script type='text/javascript'>$(function(){
        $('#work_nav').attr('href','/work/".str_replace(" ","_",strtolower($cat->category))."/');
    })</script>";
  // $shares = new shares();
    
    
    $out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array($c->meta(),$ln->output.$wln,$contout),$tpl);
    echo $out;


?>