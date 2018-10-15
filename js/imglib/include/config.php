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

 /*
 * Put here you user login verification function
 * Sompfing like this
 *	if (!isset($_SESSION['login']) || empty($_SESSION['login'])) {
 *		exit;
 *	}
 */

/*
 * Initialize config
 */
$CFG = array();
 $_SERVER['DOCUMENT_ROOT']="/vhost/vhost11/j/u/d/judygoldhill.com/www/";

 /*
 * Enable debug output to browser
 * In work configuration must be false with security reasons
 */
$CFG['debug'] = false;

/*
 * Full path to a directory which holds the upload files.
 */
$CFG['uploadDir'] = $_SERVER['DOCUMENT_ROOT'].'/uploaded_images/';

/*
 * An absolute or relative URL to the image folder WITHOUT end slash.
 * This url is used to generate the source URL of the image.
 *
 * If not specified or empty - will be calculated automatically based on data about the configuration of your Web server.
 */
//$CFG['URL'] = '/upload';

/*
 * Use all unicode symbols for file name like the й or else
 * Need the test to enable in each case
 * Enable at you risk, curently not work on MS Windows
 */
$CFG['unicodeNames'] = false;

/*
 * Define the extentions you want to
 * user can upload to your image folders and delete from it.
 */
$CFG['uploadExt'] = 'gif|png|jpeg|jpg|bmp';

/*
 * Define the extentions you want to show within the
 * directory listing.
 * For enable all files - set string empty
 */
$CFG['fileExt'] = 'gif|png|jpeg|jpg|bmp';

/*
 * Format who support the creating of thumbnail
 */
 $CFG['thmbFileExt'] = 'gif|png|jpeg|jpg';

/*
 * If enabled users will be able to upload
 * files to any viewable directory. You should really only enable
 * this if the area this script is in is already password protected.
 */
$CFG['enableUpload'] = true;

/*
 * Maximum size of upload file
 * Format:
 * 800000 - in bytes
 * '800k' - 800 kilo bytes
 * '1m' - 1 Mega bytes
 * '2g' - 2 Giga bytes
 * This options "overwrite" the 'upload_max_filesize' php directive.
 * Large value - large WWW-Server load
 * Set to 0 to user 'upload_max_filesize' php directive.
*/
$CFG['maxUploadFileSize'] = 0;

/*
 * Upload file name format in date() function format
 * If empty then using original file name (Danger)
 * Use '\n' to insert the urlencoded original file name
 * Or use this simple template to name files on date and time of upload 'Y_m_d_H_i_s'
 */
$CFG['uploadNameFormat'] = '\n';

/*
 * File name suffix added if the file is exist on upload or else file operation
 * You can use the date() function format string to add date or time to copy of file
 * %1$d - its iteration number
 * Examples:
 * 1) $CFG['fileNameSuffix'] = '_copy_of_Y.m.d_H.i.s_[%1$d]'; - create copy file of file "my_file.jpg" with date and time of copying and iteration number in name like "my_file_copy_of_2010.02.14_10.44.56_[1].jpg"
 * 2) $CFG['fileNameSuffix'] = '_copy_of_Y.m.d_H.i.s'; - create copy file of file "my_file.jpg" with  with date and time of copying in name like "my_file_copy_of_2010.02.14_10.44.56.jpg"
 */
$CFG['fileNameSuffix'] = '_[%1$d]';

/*
 * If a user uploads a file with the same
 * name as an existing file do you want the existing file
 * to be overwritten? Typical the script rename the upload files if exist.
 */
$CFG['overwriteFile'] = false;

/*
 * Bind keyboard shorcuts to some actions
 * Default actions is:
 * - 1) Open file in new window on 'Ctrl+Enter';
 * - 2) Choose file if it's selected on 'Enter';
 * - 3) Choose file thumbnails if available and if file is selected on 'Shift+Enter';
 * - 4) Rename file on 'F2';
 * - 5) Create directory on 'F7';
 * - 6) Show upload form on 'Insert';
 * - 7) Cut file on 'Ctrl+X';
 * - 8) Copy file on 'Ctrl+C';
 * - 9) Paste file on 'Ctrl+V'.
 * - 10) Delete element on 'Del';
 */
$CFG['bindKeys'] = true;

/*
 * Complex parameters affected to opportunity of window history navigation and indicate the current path in window title.
 * If enabled then you can return to previsious dir by press the "Back" in you browser.
 *
 * Note: if imgLib not only on the page (other scripts and "widjets") and one of them also uses window history navigation to save stat you will fail in the work of both. In this case - disable this. Typically is enabled.
 */
$CFG['historyNavigation'] = true;

/*
 * Specifies whether to save the state between window calls.
 * If localStorage or sessionStorage is aviable:
 * 		*	true - use localStorage to save current state betven cals.
 * 		*	false - use sessionStorage - that allows to keep state for each window, but does not keep state when you close the window and not share state between windows that lets you copy a file in one window and paste it into another.
 * if localStorage or sessionStorage is not aviable:
 * 		*	true - use cookies
 * 		*	false - not save, even in cookes
 *
 * Default - enabled.
 *
 * Clent-side options
 */
$CFG['saveState'] = true;

/*
 * Type of files or folders sort, the posible options is:
 * 		1) - name
 * 		2) - size
 * 		3) - date
 *
 * Default - 1.
 *
 * Clent-side options
 */
$CFG['sortType'] = 1;

/*
 * Direction of sort, the posible options is:
 * 		0) - ASC
 * 		1) - DESC
 *
 * Default - 0.
 *
 * Clent-side options
 */
$CFG['sortOrder'] = 0;

/*
 * Allow your users to browse the subdir of the defined basedir.
 * This only disable browse notfing more!
 */
$CFG['browseSubDir'] = true;

/*
 * If enabled users will be able to create new directory.
 * You should really only enable this if the area this script
 * is in is already password protected.
 */
$CFG['allowCreateDir'] = true;

/*
 * Premission to new created directory
 * Default 0755 - you good, oters - only view
 * On 744 you can not see thumbnails
 */
$CFG['dirPremision'] = 0755;

/*
 * Premission to new uploaded file
 * Default 0644 - you can read and write, oters - only read
 */
$CFG['uploadFilePremision'] = 0644;

/*
 * If enabled users will be able to delete directory and files.
 * You should really only enable this if the area this script
 * is in is already password protected.
 */
$CFG['allowDelete'] = true;

/*
 * If enabled users will be able to rename directory and files.
 * You should really only enable this if the area this script
 * is in is already password protected.
 */
$CFG['allowRename'] = true;

/*
 * If enabled browse sub directory users will be able to copy or move directory and files.
 * You should really only enable this if the area this script
 * is in is already password protected.
 * If you want to disable this use false as value
 */
$CFG['allowFileCopy'] = ($CFG['browseSubDir']) ? true : false;

/*
 * Image quality 0-100 for JPEG and PNG files on save
 */
$CFG['imgQuality'] = 90;

/*
 * Maximum size to resized images
 * Large value - large WWW-Server load
 * Set to 0 to disable image resize
 */
$CFG['maxImgResize'] = 4096;

/*
 * Length of file or folder name string on file list
 */
$CFG['fileNameLen'] = 25;

/*
 * Default view type of file list in imgLib
 * Posible options: list, thumbnail, table
 */
$CFG['defaultViewType'] = 'thumbnail';

/*
 * Thumbnail directory name, if empty the creating of thumbnail is disabled
 */
$CFG['thmbDirName'] = 'thmb';

/*
 * Auto create thumbnail for file if no exist
 */
$CFG['thmbAutoCreate'] = true;

/*
 * Thumbnail max width in px
 * Zero value disable the thumbnails
 */
$CFG['thmbWidth'] = 150;

/*
 * Thumbnail max height in px
 * Zero value disable the thumbnails
 */
$CFG['thmbHeight'] = 112;

/*
 * Thumbnail quality 0-100 for JPEG and PNG files
 */
$CFG['thmbQuality'] = 100;

/*
 * This group of options controll the location of the thumbnail files
 *
 * If "$CFG['config_name']['thmbRelocating'] = false;" then thumbnail files saved in $CFG['config_name']['uploadDir'] + current browsing path in $CFG['config_name']['thmbDirName'] subfolder.
 * else it stored in $CFG['config_name']['thmbSaveDir'] + current browsing path in $CFG['config_name']['thmbDirName'] subfolder.
 * Example:
 * 	1)
 * 		$CFG['config_name']['thmbRelocating'] = true;
 * 		$CFG['config_name']['thmbSaveDir'] = '/var/www/site_name/tmp';
 * 		$CFG['config_name']['thmbSaveURL'] = '/tmp';
 * 		$CFG['config_name']['thmbDirName'] = 'thmb';
 * 		Current browsing dir is '/nature/cuba'
 * 		Result - thumbnail files has ben stored in '/var/www/site_name/tmp/nature/cuba/thmb/' and available here http://site_name/tmp/nature/cuba/thmb/
 * 	2)
 * 		$CFG['config_name']['thmbRelocating'] = true;
 * 		$CFG['config_name']['thmbSaveDir'] = $CFG['config_name']['uploadDir'] . DIRECTORY_SEPARATOR . $CFG['config_name']['thmbDirName'];
 * 		$CFG['config_name']['thmbSaveURL'] = $CFG['config_name']['URL'] . DIRECTORY_SEPARATOR . $CFG['config_name']['thmbDirName'];
 * 		$CFG['config_name']['thmbDirName'] = 'thmb';
 * 		Current browsing dir is '/animals/flamingo'
 * 		Result - thumbnail files has ben stored in '/var/www/site_name/path_to_upload_folder/thmb/animals/flamingo/thmb/' and available here http://site_name/path_to_upload_folder/thmb/animals/flamingo/thmb/
 *
 * Note:
 * 	1) If you select as save directory some subfolder of $CFG['config_name']['uploadDir'] then it can be be visible among the list of directories. To prevent this put this folder to $CFG['config_name']['thmbDirName'] subfolder. Example: $CFG['config_name']['thmbSaveDir'] = $CFG['config_name']['uploadDir'] . DIRECTORY_SEPARATOR . $CFG['config_name']['thmbDirName'];
 * 	2) The $CFG['config_name']['thmbSaveURL'] calculated like $CFG['config_name']['URL']. If selected thumbnail directory can't be acceptable from web - you have the problem and you need to reconfigure it.
 * 	3) Recomended to set this options only to default configuration.
 * 	4) NOT RECOMENDED to use this options. Only if you understand what they do and know what you want.
 *		5) If $CFG['config_name']['thmbSaveURL'] not specified or empty - will be calculated automatically based on data about the configuration of your Web server.
 *
 */
$CFG['thmbRelocating'] = false;
$CFG['thmbSaveDir'] = '../upload/img_thmb/';
//$CFG['thmbSaveURL'] = '/upload/img_thmb';

/*
 * Enable the addionals modules
 * 	imgtools
 * 			Enable the imgTools - simple image edit tool integrated to context meny
 * 			Indication of the order affects the order of display items in shortcut menu
 */
$CFG['modules'] = array('imgtools', 'slideshow');

/*
 * Enable the cache - enable cache the result of operation
 */
$CFG['enableCache'] = true;

/*
 * Default lang code if notfing is found even English. Posible codes is 'en', 'de', 'fr', 'ru', 'uk'.
 * Dont use code for non-exist lang files.
 */
$CFG['defaultLang'] = 'en';

/*
 * The array with custum context items elements.
 * Each items - its array with maned index
 *
 * $CFG['contextItems'] = array(
 * 	array(
 * 		'text' => 'some text', // The display item text
 * 		'handle' => 'someFunctionHandle', // Handle of function to extcute when the item click
 * 		'cssClass' => '', // css class of icons, empty or not set to disable
 * 		'show' => 'function (context_element) {return context_element.type == 2;}', // When don't/show item
 * 		'disabled' => 'function (context_element, isCanPaste, isElementSelected, dir_is_writable) {return !(isElementSelected && dir_is_writable);}', // When disable item
 * 		'defaultItem' => 'false', // Show item as default (bold text), dont use in users items
 * 	)
 * );
 */
$CFG['contextItems'] = array();

/*
 * End configuration sets
 */

/*
 * Time zone and charser settings - one for all configurations
 */
if (function_exists('date_default_timezone_set')) {
	date_default_timezone_set('Europe/London');
}
ini_set('default_charset', 'UTF-8');


// Get the refer page get query
if (isset($_SERVER['HTTP_REFERER'])) {
	$referQuery = parse_url($_SERVER['HTTP_REFERER']);
	$referQuery = isset($referQuery['query']) ? $referQuery['query'] : '';
	parse_str($referQuery, $referQuery);
} else {
	// Use empty refer querry if not selected
	$referQuery = array();
}

/*
	Temporary disable prevent access to thumbnail directory
	Waring in this mode for the uploaded pictures thumbnail not created so this mode ONLY FOR CLEAR or other jobs NOT FOR STANDART USE
*/
/*-------------------------------- Show thumbail dir -----------------------------------------------*/
if ( (isset($_GET['showthmb']) && ($_GET['showthmb'] == 1)) || (isset($referQuery['showthmb']) && $referQuery['showthmb'] == 1) ) {
	$CFG['thmbDirName'] = '';
	$CFG['thmbAutoCreate'] = false;
}

/*
 * Aply some configuration options
 */

 // If upload directory not exist - try to create it
 if (!file_exists($CFG['uploadDir'])) {
	mkdir($CFG['uploadDir'], $CFG['dirPremision']);
}

$CFG['uploadDir'] = realpath($CFG['uploadDir']);
$CFG['thmbDirName'] = urlencode(trim(urldecode($CFG['thmbDirName'])));

// If the $CFG['URL'] not set - calculate it
if (!isset($CFG['URL']) || empty($CFG['URL'])) {
	$CFG['URL'] = str_replace(realpath($_SERVER['DOCUMENT_ROOT']), '', $CFG['uploadDir']);

	// In Windows replace "\" to "/"
	if (stripos(PHP_OS, 'win') !== false) {
		$CFG['URL'] = str_replace('\\', '/', $CFG['URL']);
	}
}

// Apply thumbnail reolocation settings
if ($CFG['thmbRelocating']) {
	// If dir not exist - try to create it
	if (!file_exists($CFG['thmbSaveDir'])) {
		mkdir($CFG['thmbSaveDir'], $CFG['dirPremision']);
	}
	$CFG['thmbSaveDir'] = realpath($CFG['thmbSaveDir']);

	// If the $CFG['thmbSaveURL'] not set - calculate it
	if (!isset($CFG['thmbSaveURL']) || empty($CFG['thmbSaveURL'])) {
		$CFG['thmbSaveURL'] =  str_replace(realpath($_SERVER['DOCUMENT_ROOT']), '', $CFG['thmbSaveDir']);
	}
}

// Create the allowed extension arrays
$CFG['uploadExt'] = explode('|', $CFG['uploadExt']);
if (!empty($CFG['fileExt'])) {
	$CFG['fileExt'] = explode('|', $CFG['fileExt']);
} else {
	$CFG['fileExt'] = array();
}
$CFG['thmbFileExt'] = explode('|', $CFG['thmbFileExt']);

// Get upload premision from php.ini file
if (!((bool) ini_get('file_uploads'))) {
	$CFG['enableUpload'] = false;
}

// Apply the debug settings
if ( (isset($CFG['debug'])) && ($CFG['debug'] === true) ) {
	error_reporting(E_ALL | E_STRICT | E_NOTICE);
	ini_set('display_errors', '1');
	$CFG['enableCache'] = false;
} else {
	error_reporting(0);
	ini_set('display_errors', '0');
}
?>