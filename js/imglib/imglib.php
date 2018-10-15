<?php
/********************************************************************
 * imgLib v0.1.2 09.04.2011
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

// Require config and functions files
require('include' . DIRECTORY_SEPARATOR . 'config.php');
require('include' . DIRECTORY_SEPARATOR . 'function.php');

// Create the upload dir if it not exist - not work
/* if (!file_exists($CFG['uploadDir'])) {
	u_mkdir($CFG['uploadDir'], $CFG['dirPremision']);
} */


// Select the module to process
if (isset($_GET['module']) && !empty($_GET['module']) && in_array($_GET['module'], $CFG['modules']) && ($_GET['module'] !== 'core')) {
	$module_name = urlencode($_GET['module']);
	// The module extend the current configuration and define self function with module name prefix
	if (file_exists('./modules/' . $module_name . '/index.php')) {
		include('./modules/' . $module_name . '/index.php');
	}

} else {
/*-------------------------------- Core functions ---------------------------------------------------*/
	/*-------------------------------- GET request ------------------------------------------------------*/
	if (isset($_GET['cmd']) && !empty($_GET['cmd'])) {
		$command = $_GET['cmd'];
	/*----------------------------- Get dir content in XML -------------------------------*/
		if ( ($command === 'list') && isset($_GET['src']) && !empty($_GET['src'])) {
			// Directory to list
			echo get_json_dir_content($_GET['src'], array('allowed_ext' => $CFG['fileExt'], 'file_col' => array('filesize', 'date', 'img_size', 'thmb'), 'dir_col' => array('empty', 'readable', 'date'), 'extra_inf' => array('is_writable' => 1)));
		}
	} else if (isset($_GET['getConfig'])) {
	/*------------------------ Client-side configuration --------------------------------*/
		echo get_client_config();
	} else if (empty($_GET) && empty($_POST)) {
	/*-------------------------- Notfing selected --------------------------------*/
	}
	/*------------------------------- End GET request ----------------------------------------------*/

	/*------------------------------- POST Request -----------------------------------------------------*/
	if (isset($_POST['cmd']) && !empty($_POST['cmd'])) {
		// Send the appropriate header
		header('Content-Type: text/javascript');

		$command = $_POST['cmd'];
		// Set initial stat of the operation result
		$result = true;

		if (($command === 'copy' || $command === 'move') && isset($_POST['src']) && !empty($_POST['src'])) {
		/*----------------------------- Copy or move file or directory -----------------------*/
			$result = move_file_obj($_POST['src'], $_POST['dst'], $command);
		} else if (($command === 'rename') && isset($_POST['src']) && !empty($_POST['src'])) {
		/*----------------------------- Rename file or directory -----------------------------*/
			$result = rename_file_obj($_POST['src'], $_POST['new_name']);
		} else if (($command === 'mkdir') && isset($_POST['dst']) && !empty($_POST['dst'])) {
		/*--------------------------------- Create dir ------------------------------------------------*/
			$result = create_folder($_POST['dst'], $_POST['name']);
		} else if (($command === 'rm') && isset($_POST['dst']) && !empty($_POST['dst'])) {
		/*---------------------------------- Remove dir or folder ---------------------------------*/
			$result = remove_file_obj($_POST['dst'], ((isset($_POST['rec'])) ? true : false));
		}

		// If error happens then output the error code, else return successful code
		if ($result !== true) {
			echo  '{"result": ' . intval($result) . '}';
		} else {
			echo '{"result": 0}';
		}

		// Exit form script
		exit;
	}
	/*------------------------------ End POST request --------------------------------------------------*/


	/*------------------------------ Upload requests ----------------------------------------------------*/
	if ($CFG['enableUpload']) {
	/*------------------------------ Standart file upload --------------------------------------------------*/
		if (isset($_FILES['file']) && !empty($_FILES['file'])) {
			// Upload file
			process_upload();
		} else if ($CFG['enableUpload'] && isset($_GET['upload']) && !empty($_GET['name'])) {
		/*------------------------------ RAW upload request ----------------------------------------------------*/
			accept_raw_post();
		}
	}
	/*-------------------------- End upload requests -------------------------------*/
}
/*------------------------------- THE END  -------------------------------------------------------*/
?>