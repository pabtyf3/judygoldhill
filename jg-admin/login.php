<?php include("/vhost/vhost18/j/u/d/judygoldhill.com/www/includes/config.inc");

if(isset($_SESSION['username'])&&$_SESSION['username']!=""){
    header("Location:/index.php");
    }else{

if(!isset($_POST['username'])){

$tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/standard.tpl");


$c = new admin();


//echo $adv->form();
  echo str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array("","",$c->loginForm()),$tpl);
}else{
    $c = new admin();
    $li = $c->try_login();
    if($li){
        header("Location:/jg-admin/index.php");
    }else{
        $tpl = file_get_contents($_SERVER['DOCUMENT_ROOT']."/templates/standard.tpl");
 echo str_replace(array("{%META%}","{%LEFTNAV%}","{%CONTENTS%}"),array("","",$c->loginForm("Please check your details and try again")),$tpl);
        //echo str_replace(array("{%TITLE%}","{%LEFTNAV%}","{%CONTENT%}"),array("Login","",$c->loginForm("Please check your details and try again")),$tpl);
    }
}
}
?>
