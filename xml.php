<?php include_once("/vhost/vhost18/j/u/d/judygoldhill.com/www/includes/config.inc");
//ini_set('display_errors',1);
//ini_set('display_startup_errors',1);
if(isset($_GET['videourl'])){
    //echo $_GET['videourl'];
$class = new projectvideo();

$vid = $class->fetchinfo($_GET['videourl']);
$ret = json_encode($vid);
//echo $ret;
//var_dump(unserialize($ret));
echo $ret;
}

    
?>