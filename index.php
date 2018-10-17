<?php include_once("/vhost/vhost18/j/u/d/judygoldhill.com/www/includes/config.inc"); 


    $c = new page(1);
    $ln = new leftnav(1);
   // if($_GET['p']==1||!isset($_GET['p'])){
        $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/no_toppad.tpl");
   
    $out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array($c->meta(),$ln->output,$c->to_content()),$tpl);
    echo $out;
    
    

?>