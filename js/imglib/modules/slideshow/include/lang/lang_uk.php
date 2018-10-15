<?php
/********************************************************************
 * imgLib v0.1.2 22.11.2009
 * Contact me at dev@jstoys.org.ua
 * Site: http://jstoys.org.ua/
 * This copyright notice MUST stay intact for use.
 *
 * This library gives you the possibility to upload, browse, manipulate and select
 * images on your webserver.
 *
 * Requirements:
 * - PHP 4.1.x or later
 ********************************************************************/

// If messages array not exit - try to import or create it
if (!isset($msg)) {
	// Import the messsges from global
	global $msg;
	// If still not extst - create it
	if (!isset($msg)) {
		$msg = array();
	}
}

// Create array with module messages
$module_msg = array(
	'Slideshow' => 'Слайдшоу'
);

// Merget the module messages with general messages
$msg = array_merge($module_msg, $msg);

// Free resources
unset($module_msg);
?>