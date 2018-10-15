<?php include("../includes/config.inc");
header('Content-type: text/javascript'); // browser will now recognize the file as a valid JS file

// prevent browser from caching
header('pragma: no-cache');
header('expires: 0'); // i.e. contents have already expired

/**
 * @author dotnet works
 * @copyright 2012
 */

$page = new project;
echo $page->linkList();

?>