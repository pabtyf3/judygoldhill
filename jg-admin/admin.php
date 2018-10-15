<?php include("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");
//$admin = new admin;
//$admin->sub="course";
//if(!$admin->shouldbehere()){
  // header("Location:login.php");
//}
 ?>

        <?php
      //  $projectI = new projectimage();
       // echo $projectI->detailsEdit($_GET['id']);
  if(isset($_GET['class'])){
    
    $c = new $_GET['class']();
    
    $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/standard.tpl");
    $leftnav = new leftnav();
    
    $out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array("",$leftnav->adminMenu(),$c->admin()),$tpl);
    echo $out;
    
}

       
        ?>
