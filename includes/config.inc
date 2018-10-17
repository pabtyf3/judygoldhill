<?php session_start();

/**
 * @author pabtyf
 * @copyright 2011
 */
 $_SERVER['DOCUMENT_ROOT']="/vhost/vhost18/j/u/d/judygoldhill.com/www/";
 define("ERR",false,true);

if(ERR){
    ini_set("display_errors","2"); ERROR_REPORTING(E_ALL);
}


if(!defined(ML)){
define("ML",mysql_connect("mysql06.iomart.com","goldau965","judyj969"),true);
define("DB",mysql_select_db("goldau965"),true);
}

ini_set("include_path",$_SERVER['DOCUMENT_ROOT']."/includes");
define("PIM",$_SERVER['DOCUMENT_ROOT']."/projectImages/",true);
define("PIS","540x404",true);
define("PIT","300x225",true);
define("ITP",$_SERVER['DOCUMENT_ROOT']."/tempImages/",true);
define("CLPATH",$_SERVER['DOCUMENT_ROOT']."/classes/",true);
 function __autoload($class_name) {
    require_once CLPATH.$class_name . '.class';
}


function isValidEmail($email){  
 return filter_var(filter_var($email, FILTER_SANITIZE_EMAIL), FILTER_VALIDATE_EMAIL);  
}  





function flipdate($date=""){
    if($date!=""){
    $bits = explode("-",$date);
    return($bits[2]."-".$bits['1']."-".$bits[0]);
    }else{
        return("");
    }
}

if(strpos($_SERVER['REQUEST_URI'],"-admin")){
    //$adminCheck = new admin();
    if(!strpos($_SERVER['REQUEST_URI'],"login")){
        if(!isset($_SESSION['is_admin'])||$_SESSION['is_admin']!="Yep"){
            header("Location:/jg-admin/actions/login.php");
        }
    }
}

?>