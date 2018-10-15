<?php include("/vhost/vhost11/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author dotnet works
 * @copyright 2013
 */

$av = new admin();
$av->logout();

header("Location:/actions/login.php");

?>