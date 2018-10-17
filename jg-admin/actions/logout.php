<?php include("/vhost/vhost18/j/u/d/judygoldhill.com/www/includes/config.inc");

/**
 * @author dotnet works
 * @copyright 2013
 */

$av = new admin();
$av->logout();

header("Location:/jg-admin/actions/login.php");

?>