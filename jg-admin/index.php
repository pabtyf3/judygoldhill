<?php include("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");
 
    
    //$c = new $_GET['class']();
    
    $content = "<p>Welcome to the Judy Goldhill Website Administration System.</p><br /><p>Please use the links on the left to navigate.</p>";
    $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/standard.tpl");
    $leftnav = new leftnav();
    
    $out = str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array("",$leftnav->adminMenu(),$content),$tpl);
    echo $out;
    


       
        ?>
