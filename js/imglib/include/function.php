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
 * Get associative array from $_SERVER['HTTP_ACCEPT_LANGUAGE'] with lang name and weight
 * 	Array
 * 		(
 * 			[en] => 0.3
 * 			[en-us] => 0.5
 * 			[de] => 1
 * 		)
 * Using loop like this to select language
 * foreach($langs as $key => $val) {
 * 	if (strpos($key, 'de') === 0) {
 * 		$lang = 'de';
 * 	} else if (strpos($key, 'en') === 0) {
 * 		$lang = 'en';
 * 	}
 * }
 * $lang = (isset($lang)) ? $lang : 'en';
 *
 * @return void
*/
function get_http_langs () {

	$langs_t = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
	$langs = array();
	foreach($langs_t as $val) {
		// Set the default language name and weight
		$lang_name = $val;
		$lang_weight = 1;
		// Search the q=lang_weight
		if (($pos = strpos($val, ';')) !== false) {
			list($lang_name, $lang_weight) = explode(';q=', $val);
		}
		$langs[$lang_name] = $lang_weight;
	}
	// Sort array based on lang weight
	asort($langs, SORT_NUMERIC);
	return $langs;
}

/*
 * Return false if $path is not a sub dir of $root
 * Return true if $path = $root
 *
 * @param	string	$root	The path to the root folder in the hierarchy
 * @param	string	$path	Path to the folder which needs to check
 *
 * @return bool
 */
function is_subdir ($root = '', $path='') {
	return (strpos(realpath($path), realpath($root)) === 0) ? true : false;
}


/*
 * Fixing file name - remove the NUL, \t, \r, \n, \x0B, " / \ * ? < > | : symbols and set max length to 255 chars
 *
 * @param	string	$name	The file name to fix
 *
 * @return string
 */
function fix_name($name = '') {
	global $CFG;

	$illegalChars = array("\0", "\t", "\r", "\n", "\x0B", '"', '/', '\\', '*', '?', '<', '>', '|', ':');
	settype($name, 'string');

	// Remove illegal chars
	$name = str_replace($illegalChars, '', trim($name));



	// If unicode name per file is disabled - then urlencode() it
	if (!$CFG['unicodeNames']) {
		$name = str_replace(' ', '_', $name);
		$name = urlencode($name);
	}

	// Set max length to 255 chars
	if (strlen($name) > 255) {
		$file_ext = pathinfo($name, PATHINFO_EXTENSION);

		if (!$CFG['unicodeNames']) {
			$name = urldecode($name);
		}
		// Get only the file name without the extension
		$name = substr($name, 0, 255 - strlen($file_ext) + 1);

		// Check if the file name still is bigger that 255 alfer urlencode()
		if ((!$CFG['unicodeNames']) && (strlen(urlencode($name)) > (255 - (strlen($file_ext) + 1)))) {
			while ((strlen(urlencode($name)) > (255 - (strlen($file_ext) + 1))) && (strlen($name) > 0)) {
				// Delete one symbol at end and try again
				$name = substr($name, 0, -1);
			}
			$name = urlencode($name);
		}

		// Combine the file name and extension
		$name = $name . '.' . $file_ext;
	}


	return $name;
}


/*
 * Get the path to non exist file name in dir, if target file exist - then add the rotable suffix and try again
 * return the path to non exist file name or false
 * Work with clear path
 *
 * @param	string	$file_path	The desired path of the file like /tmp/my_file.txt
 *
 * @return mixed
 */
function get_free_file_name ($file_path = '') {
	global $CFG;

	$path = dirname($file_path) . DIRECTORY_SEPARATOR;
	$name = fix_name(u_basename($file_path));
	$file_ext = pathinfo($name, PATHINFO_EXTENSION);
	$name_wo_ext = substr($name, 0, -(strlen($file_ext) + 1)); // File name without the extension

	if (!file_exists($path) || !is_dir($path)) {
		return false;
	}
	if (!$CFG['unicodeNames']) {
		$name = urldecode($name);
	}

	// Rotate the file name and check if exist
	$i = 1;
	while (file_exists($path . $name) && $i < 2147483647) {
		$name_suffix = date(sprintf($CFG['fileNameSuffix'], $i));
		// If new file name bigger that the max then - trim it
		if (strlen($name_wo_ext . $name_suffix . '.' . $file_ext) > 255) {
			$name = fix_name(substr($name_wo_ext, 0, -strlen($name_suffix))) . $name_suffix . '.' . $file_ext;
		} else {
			$name = fix_name($name_wo_ext) . $name_suffix . '.' . $file_ext;
		}
		$i++;
	}


	if ($i >= 2147483647) {
		return false;
	}

	return $path . $name;
}

/*
 * Get the file name from file path. Work more fine with unicode strings. Also apply fix_name() to result name.
 * return the base name of file path
 * Work with clear path
 *
 * @param	string	$file_path	The file path to work
 *
 * @return string
 */
function u_basename ($file_path = '') {
	// Set varitable type
	$file_path = (string) $file_path;

	// Get position of last directory separator
	$last_slash = strrpos($file_path, DIRECTORY_SEPARATOR);

	if ($last_slash !== false) {
		/*
		 * Slash is found on some position
		 * If slash not found - the file_path containt only file name
		 */
		$file_path = substr($file_path, $last_slash);
	}
	// Return fixed name
	return fix_name($file_path);
}

/*
 * Remove file or folder from disk
 * Return code
 *		true - remove sucsess
 *		105 - Not standart type (Dir or File) or dir not empty and recursive = false
 *		107 - Bad names (empty name or "." or "..")
 *		110 - File is no deleted
 *		200 - Write protect
 *
 * @param	string	$path	Path to removing file or folder
 *
 * @return mixed
 */
function u_remove ($path = '') {

	if (!file_exists($path)) {
		return true;
	}

	if (empty($path) || ($path === '.') || ($path === '..')) {
		return 107;
	}

	if (is_file($path)) {
		if (unlink($path) === true) {
			return true;
		} else {
			return 110;
		}
	} else if (is_dir($path)) {
		if (is_writable($path)) {
			if ($handle = opendir($path)) {
				while (false !== ($file = readdir($handle))) {
					if ($file != '.' && $file != '..') {
						$result = u_remove($path . DIRECTORY_SEPARATOR . $file);
						if ($result !== true) {
							return $result;
						}
					}
				}
			}
			closedir($handle);
			// Delete empty directory
			if (rmdir($path) === true) {
				return true;
			} else {
				return 110;
			}
		} else {
			return 200;
		}
	} else {
		return 105;
	}
}

/*
 * Copy file or files from folder from $src to $dst
 *
 * Eplanation:
 * 	1) Copy file from "/var/some_file.txt" to dir "/home/bill/" transform to copy file from "/var/some_file.txt" to file "/home/bill/some_file.txt"
 * 	2) Copy file from "/var/some_file.txt" to file "/home/bill/other_file.txt" transform to copy file from "/var/some_file.txt" to file "/home/bill/other_file.txt" if owervrite is ALLOWED
 * 	3) Copy folder from "/var/some_dir/" to dir "/home/bill/" transform to copy all files from "/var/some_dir/" to "/home/bill/some_dir/" and create last if need
 *
 *
 * Return code
 *		true - remove sucsess
 *		100 - source not exist
 *		102 - copy folder to him subdir (sample copy /var/ to /var/tmp/)
 *		103 - cant create dst folder
 *		104 - if dst exist and copy file to folder or folder to file
 *		105 - Not standart type (Dir or File) or dir not empty and recursive = false
 *		106 - destination exist and owerwrite = false
 *		107 - Bad names (empty name or "." or "..")
 *		110 - File is no deleted
 *
 * @param	string	$src			Path to source file or folder
 * @param	string	$dst				Path to destination file or folder
 * @param	bool	$owerwrite		The destination files can be overwrite
 *
 * @return mixed
 */
function u_copy ($src = '', $dst = '', $owerwrite = false) {

	global $CFG;
	if (!file_exists($src)) {
		return 100;
	}

	// Get file name
	$src_name = u_basename($src);
	// Check the owerwrite premission
	if (!$owerwrite && is_file($src)) {
		if (is_file($dst)) {
			return 106;
		}
		if (is_dir($dst)) {
			// Check if file exist in target dir
			if (file_exists($dst . DIRECTORY_SEPARATOR . $src_name)) {
				return 106;
			}
		}
	}

	if (is_file($src) && is_readable($src) && ((file_exists($dst) && is_file($dst)) || is_dir($dst) || !file_exists($dst))) {
		// If source is file, is readable and destination exist and its file, or its dir or its not exist
		if (is_dir($dst)) {
			// If destination is dir - copy file inside them. Example: copy file form "/var/some_file.txt" to dir "/home/bill/" transform to copy file form "/var/some_file.txt" to file "/home/bill/some_file.txt"
			$dst = $dst . DIRECTORY_SEPARATOR. $src_name;
		}

		// Copy single file
		if (copy($src, $dst) === true) {
			return true;
		} else {
			return 110;
		}
	} else if (is_dir($src) && (!file_exists($dst) || (file_exists($dst) && is_dir($dst)))) {
		// If source is dir and destination not exist or its dir

		if (is_subdir($src, $dst)) {
			// Not allow recursion copy
			return 102;
		}

		// Normalise the path
		$src = realpath($src) . DIRECTORY_SEPARATOR;
		$dst = realpath($dst) . DIRECTORY_SEPARATOR . $src_name . DIRECTORY_SEPARATOR;

		// Create the target dir
		if (file_exists($dst) || (u_mkdir($dst, $CFG['dirPremision']) === true)) {
			if ($handle = opendir($src)) {
				while (false !== ($file = readdir($handle))) {
					if ($file != "." && $file != "..") {
						$result = u_copy($src . $file, $dst, $owerwrite);
						if ($result !== true) {
							return $result;
						}
					}
				}
			}
			closedir($handle);
			return true;
		} else {
			return 103;
		}
	} else {
		// In other case - return error code
		return (file_exists($src) && file_exists($dst) && ((!is_file($src) && is_file($dst)) || (!is_dir($src) && is_dir($dst)))) ? 104 : 105;
	}
}

/*
 * Move file or files from folder from $src to $dst
 *
 * Eplanation:
 * 	1) Move file from "/var/some_file.txt" to dir "/home/bill/" transform to move file from "/var/some_file.txt" to file "/home/bill/some_file.txt"
 * 	2) Move file from "/var/some_file.txt" to file "/home/bill/other_file.txt" transform to move file from "/var/some_file.txt" to file "/home/bill/other_file.txt" if owervrite is ALLOWED
 * 	3) Move folder from "/var/some_dir/" to dir "/home/bill/" transform to move all files from "/var/some_dir/" to "/home/bill/some_dir/" and create last if need
 *
 * Return code
 *		true - remove sucsess
 *		100 - source not exist
 *		102 - move folder to him subdir (sample move /var/ to /var/tmp/)
 *		103 - cant create dst folder
 *		104 - if dst exist and move file to folder or folder to file
 *		105 - Not standart type (Dir or File) or dir not empty and recursive = false
 *		106 - destination exist and owerwrite = false
 *		110 - File is no deleted
 *
 * @param	string	$src			Path to source file or folder
 * @param	string	$dst				Path to destination file or folder
 * @param	bool	$owerwrite		The destination files can be overwrite
 *
 * @return mixed
 */
function u_move ($src = '', $dst = '', $owerwrite = false) {

	global $CFG;
	if (!file_exists($src)) {
		return 100;
	}
	// Get file name
	$src_name = u_basename($src);
	// Check the owerwrite premission
	if (!$owerwrite && is_file($src)) {
		if (is_file($dst)) {
			return 106;
		}
		if (is_dir($dst)) {
			// Check if file exist in target dir
			if (file_exists($dst . DIRECTORY_SEPARATOR . $src_name)) {
				return 106;
			}
		}
	}
	if (is_file($src) && is_readable($src) && ((file_exists($dst) && is_file($dst)) || is_dir($dst) || !file_exists($dst))) {
		// If source is file, is readable and destination exist and its file, or its dir or its not exist
		if (is_dir($dst)) {
			// If destination is dir - copy file inside them. Example: copy file form "/var/some_file.txt" to dir "/home/bill/" transform to copy file form "/var/some_file.txt" to file "/home/bill/some_file.txt"
			$dst = $dst . DIRECTORY_SEPARATOR . $src_name;
		}

		// Rename single file
		if (rename($src, $dst) === true) {
			return true;
		} else {
			return 110;
		}
	} else if (is_dir($src) && (!file_exists($dst) || (file_exists($dst) && is_dir($dst)))) {
		// If source is dir and destination not exist or its dir
		if (is_subdir($src, $dst)) {
			// Not allow recursion move
			return 102;
		}
		// Normalise the path
		$src = realpath($src) . DIRECTORY_SEPARATOR;
		$dst = realpath($dst) . DIRECTORY_SEPARATOR . $src_name . DIRECTORY_SEPARATOR;

		// Create the target dir
		if (file_exists($dst) || (u_mkdir($dst, $CFG['dirPremision']) === true)) {
			if ($handle = opendir($src)) {
				while (false !== ($file = readdir($handle))) {
					if ($file != '.' && $file != '..') {
						$result = u_move($src.$file, $dst, $owerwrite);
						if ($result !== true) {
							return $result;
						}
					}
				}
			}
			closedir($handle);

			// Try to remove the source (broken files and empty folders)
			u_remove($src);

			return true;
		} else {
			return 103;
		}
	} else {
		return (file_exists($src) && file_exists($dst) && ((!is_file($src) && is_file($dst)) || (!is_dir($src) && is_dir($dst)))) ? 104 : 105;
	}
}

/*
 * Create full path to $path with all folders
 * Return code
 *		true - remove sucsess
 *		103 - cant create dst folder
 *
 * @param	string	$path			Absolute path to end folder (example "/var/www/my_site/dir_1/dir_2/dir_3")
 * @param	oct	$premission	Premission of new dir
 *
 * @return mixed
 */
function u_mkdir ($path = '', $premission = 0755) {

	if (file_exists($path) && is_dir($path)) {
		return true;
	}
	/* Not Work
	if (!is_writable($path)) {
		return false;
	}
	*/

	if (intval(phpversion()) >= 5) {
		 if (!file_exists($path) && (mkdir($path, $premission, true) !== true)) {
			return 103;
		} else {
			return true;
		}
	} else {
		$paths_el = explode(DIRECTORY_SEPARATOR, $path);
		$paths_len = count($paths_el);
		$cur_path = DIRECTORY_SEPARATOR;
		for ($i=0; $i<$paths_len; $i++) {
			// Create each part or paths
			if (!((file_exists($cur_path . $paths_el[$i]) && is_dir($cur_path . $paths_el[$i])) || (!file_exists($cur_path . $paths_el[$i]) && is_writable($cur_path) && (mkdir($cur_path . $paths_el[$i], $premission) === true)))) {
				// Can create the part of path $cur_path . $paths_el[$i]
				return 103;
			}
			$cur_path = realpath($cur_path . DIRECTORY_SEPARATOR . $paths_el[$i]) . DIRECTORY_SEPARATOR;
		}
		return true;
	}
	return 103;
}


/*
 * Check if the file extension is suported by manager
 *
 * @param	string	$file		File to check
 *
 * @return bool
 */
function check_file_ext ($file = '') {
	global $CFG;

	if (in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), $CFG['fileExt'])) {
		return true;
	}
	return false;
}

/*
 * Check if the directory is empty
 *
  * @param	string	$path	Path to the folder which needs to check
 *
 * @return bool
 */
function folder_is_empty ($path = '') {

	if (file_exists($path) && is_dir($path) && is_readable($path)) {
		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if ($file != "." && $file != "..") {
					return false;
				}
			}
			closedir($handle);
		}
		return true;
	} else if (file_exists($path) && !is_dir($path)) {
		return false;
	}
	return true;
}

/*
 * Get the last modification time of the parent directory
 *
 * @param	string	$path	Path to the folder which needs to check
 *
 * @return int	unix timestamp
 */
function get_dir_last_mod ($path) {

	$time = array();

	$time[] = max(filectime($path), filemtime($path));

	$path = realpath($path) . DIRECTORY_SEPARATOR;
	if (is_readable($path) && ($handle = opendir($path))) {
		while (false !== ($file = readdir($handle))) {
			if ($file === '.' || $file === '..') {
				continue;
			}
			if (is_dir($path . $file) || is_file($path . $file)) {
				// Save lastes time of modification and access
				$time[] = filectime($path . $file);
				$time[] = filemtime($path . $file);
			}
		}
		closedir($handle);
	}
	return max($time);
}

/*
 * Return translated text if found
 *
 * @param	string	$text	Text to translate
 *
 * @return string
 */
function m($text) {
	global $msg;

	if ((isset($msg[$text])) && !empty($msg[$text])) {
		return $msg[$text];
	} else {
		return $text;
	}
}

/*
 * Create new directory
 * Return code
 *		true - Sucsess сreate
 *		1 - Not enabled in config
 *		101 - Destination folder not exist or it not folder
 *		106 - Destination is exist and its file
 *		107 - Bad names (empty name or "." or "..")
 *		110 - some error
 *		200 - Write protect or file with the same name is exist
 *
 * @param	string	$path					The relative path to destination folder
 * @param	string	$name				Path name of new folder
 *
 * @return mixed
 */
function create_folder ($path = '', $name = '') {
	global $CFG;

	if ($CFG['allowCreateDir'] === true) {
		// Add end slash
		$path = realpath($CFG['uploadDir'] . $path) . DIRECTORY_SEPARATOR;
		$name = fix_name($name);

		// Checks
		if (is_subdir($CFG['uploadDir'], $path) === false) {
			return 107;
		}
		if (!file_exists($path) || !is_dir($path)) {
			return 101;
		}
		if (file_exists($path . $name)) {
			// Aready exist dir
			if (is_dir($path . $name)) {
				return true;
			} else {
				// Aready exist and its not dir
				return 106;
			}
		}
		// Check the premission
		if (!is_writable($path)) {
			return 200;
		}
		if (empty($name) || ($name === '.') || ($name === '..')) {
			return 107;
		}

		if (mkdir($path . $name, $CFG['dirPremision']) === true) {
			return true;
		} else {
			return 110;
		}
	}
	return 1;
}

/*
 * Reanme file or Folder
 * Dont lost file ext
 * Return code
 *		true - remove sucsess
 *		1 - rename not enable in config
 *		100 - source not exist
 *		105 - Not standart type (Dir or File) or dir not empty and recursive = false
 *		106 - destination exist and owerwrite = false
 *		107 - Bad names (empty name or "." or "..") or lost name for file and leave only ext
 *		110 - some error
 *		200 - Write protect
 *
 * @param	string	$src	path to renaming file or folder
 * @param	string	$new_name		new name of renaming element
 *
 * @return mixed
 */
function rename_file_obj ($src = '', $new_name = '') {
	global $CFG;

	if ($CFG['allowRename'] === true) {
		// Enable thumbnail operation
		$thmb_enabled = false;
		if (!empty($CFG['thmbDirName']) && (intval($CFG['thmbWidth']) > 0) && (intval($CFG['thmbHeight']) > 0)) {
			$thmb_enabled = true;
		}
		// Fix the input name
		$new_name = fix_name($new_name);

		$src = realpath($CFG['uploadDir'] . $src);
		$dst = dirname($src) . DIRECTORY_SEPARATOR . $new_name;

		$src_type = (is_file($src)) ? 'file' : ((is_dir($src)) ? 'folder' : 'unknown');

		// Checks
		if (is_subdir($CFG['uploadDir'], $src) === false) {
			return 107;
		}
		if (!file_exists($src)) {
			return 100;
		}
		// Rename file to itself
		if ($src === $dst) {
			return true;
		}
		if (!is_writable(dirname($src))) {
			return 200;
		}
		if (file_exists($dst)) {
			return 106;
		}
		if ($src_type === 'unknown') {
			return 105;
		}
		// Bed filename
		if (($src === realpath($CFG['uploadDir'])) || empty($new_name) || ($new_name === '.') || ($new_name === '..')) {
			return 107;
		}
		// Try to work with unsuported file type
		if (($src_type === 'file') && (check_file_ext($src) !== true)) {
			return 2;
		}


		if ($thmb_enabled) {
			// Source and destination of thumbnail files
			if ($src_type === 'file') {
				$thmb_src = dirname($src) . DIRECTORY_SEPARATOR . $CFG['thmbDirName'] . DIRECTORY_SEPARATOR . u_basename($src);
				$thmb_dst = dirname($src) . DIRECTORY_SEPARATOR . $CFG['thmbDirName'] . DIRECTORY_SEPARATOR . $new_name;
			} else {
				$thmb_src = $src;
				$thmb_dst = $dst;
			}


			// If thumbnail reolocating is enable - get the property path to thumbnail folder
			if ($CFG['thmbRelocating']) {
				$thmb_src = str_replace($CFG['uploadDir'], $CFG['thmbSaveDir'], $thmb_src);
				$thmb_dst = str_replace($CFG['uploadDir'], $CFG['thmbSaveDir'], $thmb_dst);
			}

			if (!file_exists($thmb_src)) {
				// If target thumbnail dir or file is not exist when is rename - skip it
				$thmb_enabled = false;
			}
		}


		if (rename($src, $dst) === true) {
			if ($thmb_enabled) {
				// Rename thumbnail files
				rename($thmb_src, $thmb_dst);
			}
			return true;
		} else {
			return 110;
		}
	}
	return 1;
}

/*
 * Move or copy file or dir to folder
 *
 * Can't copy/move file or folder to himself folder like "/some/paht/file.txt" to "/some/path/"
 *
 * Return code
 *		true - remove sucsess
 *		1 - rename not enable in config
 *		100 - source not exist
 *		102 - move folder to him subdir (sample copy /var/ to /var/tmp/)
 *		104 - Cant copy or move folder to file;
 *		105 - Not standart type (Dir or File) or dir not empty and recursive = false
 *		106 - destination exist and owerwrite = false
 *		107 - Bad names (empty name or "." or "..") or lost name for file and leave only ext
 *		110 - some error
 *		200 - Write protect
 *
 * @param	string	$src			source path to element
 * @param	string	$dst				path of destination dir
 * @param	string	$type			(copy or move) type of operation
 * @param	bool	$owerwrite		The destination files can be overwrite
 *
 * @return mixed
 */
function move_file_obj ($src = '', $dst = '', $type = 'copy', $overwrite = false) {
	global $CFG;

	if ($CFG['allowFileCopy'] === true) {
		// Enable thumbnail operation
		$thmb_enabled = false;
		if (!empty($CFG['thmbDirName']) && (intval($CFG['thmbWidth']) > 0) && (intval($CFG['thmbHeight']) > 0)) {
			$thmb_enabled = true;
		}

		// Convert relative paths into absolute
		$src = realpath($CFG['uploadDir'] . $src);
		$dst = realpath($CFG['uploadDir'] . $dst);

		// Get types of source and destinations
		$src_type = (is_file($src)) ? 'file' : ((is_dir($src)) ? 'folder' : 'unknown');
		$dst_type = (is_file($dst)) ? 'file' : ((is_dir($dst)) ? 'folder' : 'unknown');

		// Checks
		if (!is_subdir($CFG['uploadDir'], $src) || !is_subdir($CFG['uploadDir'], $dst)) {
			// Check the restrictions
			return 107;
		}
		if ($src === $dst) {
			// Nothing to do, but return OK if copy folder to himself
			return true;
		}
		if (!file_exists($src)) {
			return 100;
		}
		if (!is_writable($dst)) {
			return 200;
		}
		// Check the types of source and destination
		if (($src_type === 'unknown') || ($dst_type === 'unknown')) {
			return 105;
		}
		// Can't copy folder to file
		if (($src_type === 'folder') && ($dst_type === 'file')) {
			return 104;
		}
		// Recursion copy or copy dir to himself subdir
		if (($src_type === 'folder') && is_subdir($src, $dst)) {
			return 102;
		}
		// Try to work with unsuported file type
		if (($src_type === 'file') && (check_file_ext($src) !== true)) {
			return 2;
		}

		// Fix operation type if source dir is not writable
		$type = (($type === 'move') && !is_writable(dirname($src))) ? 'copy' : $type;

		if ($thmb_enabled) {
			// Source and destination of thumbnail files
			if ($src_type === 'file') {
				$thmb_src = dirname($src) . DIRECTORY_SEPARATOR . $CFG['thmbDirName'] . DIRECTORY_SEPARATOR . u_basename($src);
				$thmb_dst = $dst . DIRECTORY_SEPARATOR . $CFG['thmbDirName'];
			} else {
				$thmb_src = $src . DIRECTORY_SEPARATOR . $CFG['thmbDirName'];
				$thmb_dst = $dst . DIRECTORY_SEPARATOR . u_basename($src);
			}

			// If thumbnail reolocating is enable - get the property path to thumbnail folder
			if ($CFG['thmbRelocating']) {
				$thmb_src = str_replace($CFG['uploadDir'], $CFG['thmbSaveDir'], $thmb_src);
				$thmb_dst = str_replace($CFG['uploadDir'], $CFG['thmbSaveDir'], $thmb_dst);
			}

			if (file_exists($thmb_src)) {
					if (!file_exists($thmb_dst)) {
					// If target thumbnail dir is not exist when is copy/move - create it
					// Not create dir if source file not exist
					u_mkdir($thmb_dst, $CFG['dirPremision']);
				}
			} else {
				$thmb_enabled = false;
			}
		}

		if ($type === 'move') {
			if (true === ($result = u_move($src, $dst, $overwrite))) {
				if ($thmb_enabled) {
					// Move thumbnail files
					u_move($thmb_src, $thmb_dst, $overwrite);

					// Delete empty thumbnail folder
					if (folder_is_empty((($src_type === 'file') ? dirname($thmb_src) : $thmb_src))) {
						u_remove((($src_type === 'file') ? dirname($thmb_src) : $thmb_src));
					}
				}
				return $result;
			} else {
				return $result;
			}
		} else if ($type === 'copy') {
			if (true === ($result = u_copy($src, $dst, $overwrite))) {
				if ($thmb_enabled) {
					// Copy thumbnail files
					u_copy($thmb_src, $thmb_dst, $overwrite);
				}
				return $result;
			} else {
				return $result;
			}
		}
		return 110;
	}
	return 1;
}

/*
 * Remove dir or folder
 * Return code
 *		true - remove sucsess
 *		1 - rename not enable in config
 *		2 - File extension is not suported
 *		100 - non-exist file or directory
 *		105 - Not standart type (Dir or File) or dir not empty and recursive = false
 *		107 - Bad names (empty name or "." or "..") or lost name for file and leave only ext
 *		110 - some error
 *		200 - Write protect
 *
 * @param	string	$path	path to deleting folder with element
 * @param	bool	$rec		recursive delete folder
 *
 * @return bool
 */
function remove_file_obj ($path='', $rec = true) {
	global $CFG;

	if ($CFG['allowDelete'] === true) {
		$thmb_enabled = false;
		if (!empty($CFG['thmbDirName']) && (intval($CFG['thmbWidth']) > 0) && (intval($CFG['thmbHeight']) > 0)) {
			$thmb_enabled = true;
		}
		$path = realpath($CFG['uploadDir'] . $path);
		$src_type = (is_file($path)) ? 'file' : ((is_dir($path)) ? 'folder' : 'unknown');

		// Checks
		if (is_subdir($CFG['uploadDir'], $path) === false) {
			return 107;
		}
		if (!file_exists($path)) {
			return 100;
		}
		// Bed names
		if (($path === realpath($CFG['uploadDir'])) || empty($path) || ($path === '.') || ($path === '..')) {
			return 107;
		}
		// Check the premission
		if (!is_writable(dirname($path))) {
			return 200;
		}
		// Try to work with unsuported file type
		if (($src_type === 'file') && (check_file_ext($path) !== true)) {
			return 2;
		}

		if ($thmb_enabled) {
			// Source of thumbnail files
			if ($src_type === 'file') {
				$thmb_src = dirname($path) . DIRECTORY_SEPARATOR . $CFG['thmbDirName'] . DIRECTORY_SEPARATOR . u_basename($path);
			} else {
				$thmb_src = $path . DIRECTORY_SEPARATOR . $CFG['thmbDirName'];
			}

			// If thumbnail reolocating is enable - get the property path to thumbnail folder
			if ($CFG['thmbRelocating']) {
				$thmb_src = str_replace($CFG['uploadDir'], $CFG['thmbSaveDir'], $thmb_src);
			}

			if (!file_exists($thmb_src)) {
				// If target thumbnail dir or file is not exist when try to delete - skip it
				$thmb_enabled = false;
			}
		}

		// Delete the only empty folder if recursion is not selected
		if (($src_type === 'folder') && ($rec || folder_is_empty($path))) {
			if (true === ($result = u_remove($path))) {
				if ($thmb_enabled) {
					// Remove thumbnail directory
					u_remove($thmb_src);
				}
			}
			return $result;
		} else if ($src_type === 'file') {
			if (true === ($result = u_remove($path))) {
				if ($thmb_enabled) {
					// Remove thumbnail file
					u_remove($thmb_src);

					// Delete empty thumbnail folder
					if (folder_is_empty(dirname($thmb_src))) {
						u_remove(dirname($thmb_src));
					}
				}
				return $result;
			}
			return 110;
		}
		return 105;
	}
	return 1;
}

/*
 * Return the name of thumbnail file or empty string if file not found and support or path to file if not support
 * if thumbnail file not exist - try to create it
 * This function work with CLEAR path (check the path in outside the function)
 *
 * @param	string	$path	Path to the file which needs to check
 *
 * @return string
 */
function get_thmb_name ($path) {
	global $CFG;

	// Set initial values
	$thmb_file_name = '';

	// Check if thumbnail can be found
	if (!empty($CFG['thmbDirName']) && (intval($CFG['thmbWidth']) > 0) && (intval($CFG['thmbHeight']) > 0)) {
		// Generate the path to the thumbnail file
		$thmb_file = dirname($path) . DIRECTORY_SEPARATOR . $CFG['thmbDirName'] . DIRECTORY_SEPARATOR . u_basename($path);

		// If thumbnail reolocating is enable - get the property path to thumbnail folder
		if ($CFG['thmbRelocating']) {
			$thmb_file = str_replace($CFG['uploadDir'], $CFG['thmbSaveDir'], $thmb_file);
		}

		/*
		 *	Conditions to run creating thumbnail
		 *		1) thumbnail file not exist
		 *		2) auto create is enable
		 *		3) file type is support to creating the thumbnails
		 *		4) the function of creation the thumbnail return true
		 */


		if (file_exists($thmb_file)) {
			$thmb_file_name = u_basename($path);
		} else if (!file_exists($thmb_file) && ($CFG['thmbAutoCreate'] === true) && in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), $CFG['thmbFileExt']) && (create_file_thmb($path) === true)) {
			$thmb_file_name = u_basename($path);
		}
	}
	return $thmb_file_name;
}

/*
 * Create thumbnail for file
 * Return code
 *		true - Sucsess сreate
 *		1 - rename not enable in config
 *		100 - non-exist file or directory
 *		105 - Not standart type (Dir or File) or dir not empty and recursive = false
 *		110 - some error
 *
 * @param	string	$path	The real path to file
 *
 * @return mixed
 */
function create_file_thmb ($path = '') {
	global $CFG;

	if (!empty($CFG['thmbDirName']) && (intval($CFG['thmbWidth']) > 0) && (intval($CFG['thmbHeight']) > 0)) {
		if (!file_exists($path)) {
			return 100;
		}

		$sc_type = (is_file($path)) ? 'file' : ((is_dir($path)) ? 'folder' : 'unknown');
		if ($sc_type !== 'file') {
			return 105;
		}


		require_once('img_function.php');
		// Destination of thumbnail files
		$thmb_file = dirname($path) . DIRECTORY_SEPARATOR . $CFG['thmbDirName'] . DIRECTORY_SEPARATOR . u_basename($path);
		$thmb_dir = dirname($path) . DIRECTORY_SEPARATOR . $CFG['thmbDirName'] . DIRECTORY_SEPARATOR;

		// If thumbnail reolocating is enable - get the property path to thumbnail folder
		if ($CFG['thmbRelocating']) {
			$thmb_file = str_replace($CFG['uploadDir'], $CFG['thmbSaveDir'], $thmb_file);
			$thmb_dir = str_replace($CFG['uploadDir'], $CFG['thmbSaveDir'], $thmb_dir);
		}

		// Delete exist thumbnail file
		if (file_exists($thmb_file) && is_writable(dirname($thmb_file))) {
			unlink($thmb_file);
		}

		if ((u_mkdir($thmb_dir, $CFG['dirPremision']) === true) && (create_thmb($path, $thmb_file, $CFG['thmbWidth'], $CFG['thmbHeight'], $CFG['thmbQuality']) === true)) {
			// Increase the time limit
			// set_time_limit(10);
			return true;
		} else {
			return 110;
		}
	}
	return 1;
}

/*
 * Get the content from dir
 * Options
 *		options[dirs] - bool get information about folders default true
 *		options[dir_col] - array specify information to get for dir, posible values - empty, readable, sample - array('empty', 'readable', 'date') default null
 *		options[files] - bool get information about files default true
 *		options[file_col] - array specify information to get for file, posible values - filesize, date, img_size, thmb, sample - array('filesize', 'date', 'img_size', 'thmb') default null
 *			options[file_col][thmb] - path to thumbnail of file accerding of curent configuration, if file not found and it support - return empty strinf, if not support - return path to file
 *		options[sort] - string sort type (date, filesize) default null
 *		options[sort_r] - bool Descending of sorting default false
 *		options[allowed_ext] - array containt the extension of files to out, sample - array('gz', 'zip') default all out
 *		options[clear] - bool using clearstatcache(); function before read the dir default true
 *		options['extra_inf'] - associative array with additional info to out
 *			extra_inf['is_writable'] - get the write premission on current path, default false
 *
 * return a array('dir', 'files', 'inf') or if the options[file_col] specify the out array('dirs', 'files'=>array('name', specified colum)), where 'extra_inf' array key - key containt additional info such as write premmision as 'inf'=>array('is_writable'=>1, 'option_name'=>option_value,...)
 *
 * @param	string	$path			The path to directory
 * @param	string	$options		Associative array with options to out
 *
 * @return array
 */
function get_dir_content ($path = '', $options='') {
	// Apply options
	if (isset($options) && !empty($options) && is_array($options)) {
		$get_dirs = array_key_exists('dirs', $options) ? (bool) $options['dirs'] : true;
		$dir_col = (array_key_exists('dir_col', $options) && (is_array($options['dir_col']) || is_string($options['dir_col']))) ? $options['dir_col'] : null;
		$get_files = array_key_exists('files', $options) ? (bool) $options['files'] : true;
		$file_col = (array_key_exists('file_col', $options) && (is_array($options['file_col']) || is_string($options['file_col']))) ? $options['file_col'] : null;
		$sort_type = array_key_exists('sort', $options) ? $options['sort'] : null;
		$sort_reverse = array_key_exists('sort_r', $options) ? (bool) $options['sort_r'] : false;
		$allowed_ext = (array_key_exists('allowed_ext', $options) && is_array($options['allowed_ext']) && !empty($options['allowed_ext'])) ? $options['allowed_ext'] : null;
		$clear_cache = array_key_exists('clear', $options) ? (bool) $options['clear'] : true;
		// Additional info array
		if (isset($options['extra_inf']) && !empty($options['extra_inf']) && is_array($options['extra_inf'])) {
			$extra_inf = $options['extra_inf'];
			$extra_inf['is_writable'] = array_key_exists('is_writable', $extra_inf) ? (bool) $extra_inf['is_writable'] : false;
		}
	} else {
		$get_dirs = true;
		$dir_col = null;
		$get_files = true;
		$file_col = null;
		$sort_type = null;
		$sort_reverse = false;
		$allowed_ext = null;
		$clear_cache = true;
		$extra_inf['is_writable'] = false;
	}
	if ($clear_cache) {
		clearstatcache();
	}

	$dirs = array(); // Direcrotys in dir
	$files = array(); // Files in dir
	$inf= array(); // Additional information array

	$files_size = array(); // File size information array
	$files_date = array(); // File date information array
	$imgs_size = array(); // Image size information array
	$thmb = array(); // Image thumbnail information array

	/*------- Check must be a external and function must accept evrefing - in theory -----------------*/
	global $CFG;
	$path = realpath($path) . DIRECTORY_SEPARATOR;
	if (!is_subdir($CFG['uploadDir'], $path)) {
		// Exit if try to read above root dir
		return;
	}


	if (is_readable($path) && ($handle = opendir($path))) {
		$n = 0;
		while (false !== ($file = readdir($handle))) {
			if ($file === '.' || $file === '..') continue;
			$n++;
			if ($get_dirs && is_dir($path.$file)) {
				if (isset($sort_type) && $sort_type == 'date') {
					$key = filemtime($path.$file).'_'.$n;
				} else {
					$key = $n;
				}
				$dirs[$key] = $file;
				if (isset($dir_col)) {
					if ((is_array($dir_col) && in_array('empty', $dir_col)) || ($dir_col === 'empty')) {
						$dirs_empty[$file] = intval(folder_is_empty($path.$file));
					}
					if ((is_array($dir_col) && in_array('readable', $dir_col)) || ($dir_col === 'readable')) {
						$dirs_readable[$file] = intval(is_readable($path.$file));
					}
					if ((is_array($dir_col) && in_array('date', $dir_col)) || ($dir_col === 'date')) {
						$dirs_date[$file] = intval(filemtime($path.$file));
					}
				}
			} else if ($get_files && is_file($path.$file) && (!isset($allowed_ext) || in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), $allowed_ext))) {
				if (isset($sort_type) && $sort_type == 'date') {
					$key = filemtime($path.$file).'_'.$n;
				} else if (isset($sort_type) && $sort_type == 'filesize') {
					$key = filesize($path.$file).'_'.$n;
				} else {
					$key = $n;
				}
				$files[$key] = $file;
				if (isset($file_col)) {
					if ((is_array($file_col) && in_array('filesize', $file_col)) || ($file_col === 'filesize')) {
						$files_size[$file] = filesize($path.$file);
					}
					if ((is_array($file_col) && in_array('date', $file_col)) || ($file_col === 'date')) {
						$files_date[$file] = filemtime($path.$file);
					}
					if ((is_array($file_col) && in_array('img_size', $file_col)) || ($file_col === 'img_size')) {
						if (is_readable($path.$file) && extension_loaded('gd') && function_exists('getimagesize')) {
							$img_size = getimagesize($path.$file);
							if ($img_size !== false) {
								$imgs_size[$file] = $img_size;
							}
						}
					}
					if ((is_array($file_col) && in_array('thmb', $file_col)) || ($file_col === 'thmb')) {
						$file_thmb = get_thmb_name($path.$file);
						if (!empty($file_thmb)) {
							$thmb[$file] = $file_thmb;
						}
					}
				}
			}
		}
		closedir($handle);
	}

	// Sort
	if (isset($sort_type) && $sort_type === 'date') {
		ksort($dirs, SORT_NUMERIC);
		ksort($files, SORT_NUMERIC);
	} else if (isset($sort_type) && $sort_type === 'filesize') {
		natcasesort($dirs);
		ksort($files, SORT_NUMERIC);
	} else {
		natcasesort($dirs);
		natcasesort($files);
	}
	// Order
	if ($sort_reverse && isset($sort_type) && $sort_type !== 'filesize') {
		$dirs = array_reverse($dirs);
	}
	if ($sort_reverse) {
		$files = array_reverse($files);
	}
	// Rebild index
	$dirs = array_values($dirs);
	if (isset($dir_col)) {
		$n=0;
		$dir = array();
		foreach($dirs as $key=>$val) {
			$dir[$n]['name'] = $dirs[$key];
			if ((is_array($dir_col) && in_array('empty', $dir_col)) || ($dir_col === 'empty')) {
				$dir[$n]['empty'] = $dirs_empty[$val];
			}
			if ((is_array($dir_col) && in_array('readable', $dir_col)) || ($dir_col === 'readable')) {
				$dir[$n]['readable'] = $dirs_readable[$val];
			}
			if ((is_array($dir_col) && in_array('date', $dir_col)) || ($dir_col === 'date')) {
				$dir[$n]['date'] = $dirs_date[$val];
			}
			$n++;
		}
	$dirs = $dir;
	unset($dir);
	}
	$files = array_values($files);
	if (isset($file_col)) {
		$n=0;
		 $file= array();
		foreach($files as $key => $val) {
			$file[$n]['name'] = $files[$key];
			if (isset($files_size[$val])) {
				$file[$n]['filesize'] = $files_size[$val];
			}
			if (isset($files_date[$val])) {
				$file[$n]['date'] = $files_date[$val];
			}
			if (isset($imgs_size[$val]) && is_array($imgs_size[$val])) {
				$file[$n]['img_size'] = $imgs_size[$val][0].'x'.$imgs_size[$val][1];
			}
			if (isset($thmb[$val]) && !empty($thmb[$val])) {
				$file[$n]['thmb'] = $thmb[$val];
			}
			$n++;
		}
	$files = $file;
	unset($file);
	}

	if (isset($extra_inf) && !empty($extra_inf) && is_array($extra_inf)) {
			if ((in_array('is_writable', $extra_inf)) && ($extra_inf['is_writable'] === true)) {
				$inf['isWritable'] = (int) is_writable($path);
			}
	unset($extra_inf);
	}

	return array('dirs' => $dirs, 'files' => $files, 'inf' => $inf);
}

/*
 * Get dir content in JSON format
 * Return JSON string
 *
 * @param	string	$path			The path to directory
 * @param	string	$options		Associative array with options to out
 *
 * @return string
 */
function get_json_dir_content ($path = '', $options = '') {
	global $CFG;

	// Send the appropriate header
	header('Content-Type: text/javascript');

	// Check the path
	$path = realpath($CFG['uploadDir'] . $path);
	// Check path to target dir
	if (((file_exists($path) && is_dir($path) && (is_subdir($CFG['uploadDir'], $path) === true)) === false) || ($CFG['browseSubDir'] === false)) {
		$path = $CFG['uploadDir'];
	}
	if (($CFG['browseSubDir'] === false) && isset($options) && is_array($options)) {
		$options['dirs'] = false;
	}

	if ($CFG['enableCache']) {
		/*
		 * Cache checks
		 */
		// Get the dir modification time
		if (($CFG['browseSubDir'] === true) && isset($options) && is_array($options) && isset($options['dir_col']) && is_array($options['dir_col']) && in_array('empty', $options['dir_col'])) {
			// If browse subdirs and get sub dir empty information - then check the subdir modification time
			$modTime = get_dir_last_mod($path);
		} else {
			// Else - check only dir modification time
			$modTime = max(filectime($path), filemtime($path));
		}

		// Send the cache headers
		set_last_modified($modTime);

		// Check the cache header
		check_modified_since($modTime);
		/*
		 * End cache checks
		 */
	}

	// If not debug - compact the JSONs
	if ($CFG['debug'] === true) {
		$eol = "\n";
		$tab ="\t";
		$return_str = '         ';
	} else {
		$eol = '';
		$tab = '';
		$return_str = 'while(1);';
	}

	// Get path to current call directory
	$dirs = explode(DIRECTORY_SEPARATOR, str_replace($CFG['uploadDir'], '', realpath($path)));
	// Delete empty items
	foreach ($dirs as $key => $val) {
		if (empty($val)) {
			unset($dirs[$key]);
		}
	}
	// Get indexed array
	$dirs = array_values($dirs);

	$dir_content = get_dir_content($path, $options);
	//print_r($dir_content);

	// Use htmlentities() to protect the output
	foreach($dirs as $key => $val) {
		$dirs[$key] = htmlentities($val, ENT_QUOTES, 'UTF-8');
	}
	foreach($dir_content['inf'] as $key => $val) {
		$dir_content['inf'][$key] = is_string($val) ? htmlentities($val, ENT_QUOTES, 'UTF-8') : $val;
	}
	foreach($dir_content['dirs'] as $key => $val) {
		$dir_content['dirs'][$key]['name'] = htmlentities($val['name'], ENT_QUOTES, 'UTF-8');
	}
	foreach($dir_content['files'] as $key => $val) {
		$dir_content['files'][$key]['name'] = htmlentities($val['name'], ENT_QUOTES, 'UTF-8');
		if (isset($dir_content['files'][$key]['thmb'])) {
			$dir_content['files'][$key]['thmb'] = htmlentities($val['thmb'], ENT_QUOTES, 'UTF-8');
		}
	}

	if (function_exists('json_encode')) {
		$dir_content['path'] = $dirs;
		$return_str .= json_encode($dir_content);
		unset($dirs, $path, $options);
	} else {

		$return_str .= '{';

		$return_str .= $eol . $tab . '"path":[';
		foreach($dirs as $key => $val) {
			$dirs[$key] = $eol . $tab . $tab . '"' . $val . '"';
		}
		$return_str .= implode($dirs, ',');
		$return_str .= $eol . $tab . '],';

		unset($dirs, $path, $options);

		if (!empty($dir_content['inf'])) {
			// Process additional info
			$return_str .= $eol . $tab . '"inf":{';
			foreach ($dir_content['inf'] as $key => $val) {
				$dir_content['inf'][$key] = $eol . $tab . $tab . '"' . $key . '":' . (is_string($val) ? '"' . $val . '"' : $val);
			}
			$return_str .= implode($dir_content['inf'], ',');
			$return_str .= $eol . $tab . '},';
		}

		// Process dir
		$return_str .= $eol . $tab . '"dirs":[';

		foreach ($dir_content['dirs'] as $key => $val) {
			foreach ($val as $k => $v) {
				$dir_content['dirs'][$key][$k] = $eol . $tab . $tab . '"' . $k . '":'. (is_string($v) ? '"' . $v . '"' : $v);
			}
			$dir_content['dirs'][$key] = $eol . $tab . $tab . '{' . implode($dir_content['dirs'][$key], ',') . '}';
		}

		$return_str .= implode($dir_content['dirs'], ',');
		$return_str .= $eol . $tab . '],';

		// Process files
		$return_str .= $eol . $tab . '"files":[';

		foreach ($dir_content['files'] as $key => $val) {
			foreach ($val as $k => $v) {
				$dir_content['files'][$key][$k] = $eol . $tab . $tab . '"' . $k . '":'. (is_string($v) ? '"' . $v . '"' : $v);
			}
			$dir_content['files'][$key] = $eol . $tab . $tab . '{' . implode($dir_content['files'][$key], ',') . '}';
		}

		$return_str .= implode($dir_content['files'], ',');
		$return_str .= $eol . $tab . ']';

		$return_str .= $eol . '}';

	}
	return $return_str;
}

/*
 * Process the upload file
 *
 * @return void
 */
function process_upload () {
	global $CFG;

	// Select the upload dir
	$upl_dir = realpath($CFG['uploadDir']) . DIRECTORY_SEPARATOR;
	if (isset($_POST['dir']) && $_POST['dir'] !== '') {
		$upl_dir = realpath($CFG['uploadDir'] . DIRECTORY_SEPARATOR . urldecode($_POST['dir'])) . DIRECTORY_SEPARATOR;

		// Check the target dir
		if (!file_exists($upl_dir) || !is_dir($upl_dir) || (is_subdir($CFG['uploadDir'], $upl_dir) !== true)) {
			$upl_dir = realpath($CFG['uploadDir']) . DIRECTORY_SEPARATOR;
		}
	}

	// Create the list of uploaded files, support the one and couple files inputs as array (name like "file[1]")
	if (!is_array($_FILES['file']['name'])) {
		$upl_files[1] =$_FILES['file'];
	} else {
		//$arr_len = count($_FILES['file']['name']);
		foreach($_FILES['file'] as $key => $val) {
			$i = 1;
			foreach($val as $v) {
				$upl_files[$i][$key] = $v;
				$i++;
			}
		}
	}

	$upload_files_count = 0;
	$upload_result = array();

	// Process upload for all uploaded files
	foreach ($upl_files as $key => $upl_file) {
			$result = process_upload_single_file($upl_file, $upl_dir);

			if ($result[0] == 0) {
				// Increase the count of uploaded files
				$upload_files_count++;
				$upload_file_path = $result[1];

				// Post upload processing
				// Resize section
				if (isset($_POST['resize'][$key]) && $_POST['resize'][$key] !== '') {
					$newsize = $_POST['resize'][$key] ;
					settype($newsize, 'integer');
					$newsize = ($newsize < 0) ? ($newsize * -1) : $newsize;
					if ($newsize > $CFG['maxImgResize']) {
						$newsize = $CFG['maxImgResize'];
					}
					if ($newsize > 0) {
						if (!function_exists('resize_img')) {
							require_once('img_function.php');
						}
						if (function_exists('resize_img')) {
							resize_img($upload_file_path, $upload_file_path, $newsize);
						}
					}
				}
			}
			// Return only file name, not full path
			$result[1] = '"' . htmlentities(u_basename($result[1]), ENT_QUOTES, 'UTF-8') . '"';

			$upload_result[] = '[' . implode(',' ,$result) . ']';
	}
	// Send the correct content type header - error in IE
	//header('Content-Type: application/x-javascript');

	// Return to user the result of upload in JSON
	echo '{"count": ' . $upload_files_count . ', "results": [' . implode(',', $upload_result) . ']}';
}

/*
 * Process single the upload file
 *
 * The return array contains the operation result (0 - successful, 1 - fail) and the error code if fail or path to saved file otherwise
 *
 * @param	array	$upl_file			Associative array with information about file. This array is part of $_FILES.
 * @param	string	$upl_dir			The path to save file dir
 * @param	string	$no_check		No check if file has been uploaded - need for XHR uploaded files
 * @return array
 */
function process_upload_single_file ($upl_file, $upl_dir, $no_check = false) {
	global $CFG;

	// Set error code to 0
	$error_code = 0;
	// Allow process upload for new file in list
	$upload = true;

	// Fix the upload file name
	//mb_strtolower
	//$upload_file = fix_name(strtolower(u_basename($upl_file['name'])));
	//$upload_file = fix_name(u_basename($upl_file['name']));
	$upload_file = fix_name($upl_file['name']);
	$file_ext = pathinfo($upload_file, PATHINFO_EXTENSION);

	// Get file name without the ext
	$name_wo_ext = (empty($file_ext)) ? $upload_file : substr($upload_file, 0, -(strlen($file_ext) + 1));

	// Get the target upload file path
	if (!empty($CFG['uploadNameFormat'])) {
		$upload_file_path = $upl_dir . str_replace('n', $name_wo_ext, date($CFG['uploadNameFormat'])) . '.' . $file_ext;
	} else {
		$upload_file_path = $upl_dir . $upload_file;
	}

	// Check if tagret file exist and create owerwrite is disabled - then grenerate the new file name
	if (!$CFG['overwriteFile'] && file_exists($upload_file_path)) {
		$upload_file_path = get_free_file_name($upload_file_path);
		// If can't get free file name - stop upload
		if ($upload_file_path === false) {
			$upload = false;
			$error_code = 500;
		}
	}

	// Check file extension
	if (!in_array(strtolower(pathinfo($upload_file, PATHINFO_EXTENSION)), $CFG['uploadExt'])) {
		$upload = false;
		$error_code = 501;
	}

	// Get max upload file size
	$phpmaxsize = trim(ini_get('upload_max_filesize'));
	$last = strtolower($phpmaxsize{strlen($phpmaxsize) - 1});
	switch($last) {
		case 'g':
			$phpmaxsize *= 1024;
		case 'm':
			$phpmaxsize *= 1024;
		case 'k':
			$phpmaxsize *= 1024;
	}
	$cfgmaxsize = trim($CFG['maxUploadFileSize']);
	$last = strtolower($cfgmaxsize{strlen($cfgmaxsize) - 1});
	switch($last) {
		case 'g':
			$cfgmaxsize *= 1024;
		case 'm':
			$cfgmaxsize *= 1024;
		case 'k':
			$cfgmaxsize *= 1024;
	}
	$cfgmaxsize = (int) $cfgmaxsize;
	// Check upload file size
	if ((($cfgmaxsize > 0) && ($upl_file['size'] > $cfgmaxsize)) || ($upl_file['size'] > $phpmaxsize)) {
		$upload = false;
		$error_code = 502;
	}
	// Check the free space on device
	if (is_float(disk_free_space($upl_dir)) && ($upl_file['size'] > disk_free_space($upl_dir))) {
		$upload = false;
		$error_code = 504;
	}
	// Check upload dir is writable
	if (!is_writable($upl_dir)) {
		$upload = false;
		$error_code = 200;
	}


	// If all OK then try  to move upload file, othervise - set the error code
	if ($upload) {
		if (((move_uploaded_file($upl_file['tmp_name'], $upload_file_path) === true) || (($no_check === true) && (rename($upl_file['tmp_name'], $upload_file_path) === true)))) {
			// On some systems the file created with permision 0600 - change it to 0644. 0644 - default value ot $CFG['uploadFilePremision']
			chmod($upload_file_path, $CFG['uploadFilePremision']);
		} else {
			// Some error on upload
			$error_code = 503;
		}
	}

	// Store the upload information in JSON like style string (first argument - result status (0 - ok, 1 - some error), second - additional result info (file name or error code))
	return ($error_code === 0) ? array(0, $upload_file_path) : array(1, $error_code);
}

/*
 * Realise the main logic of the script and run on script execute
 *
 * Posible return codes is
 * 0 - no error
 * 107 - Bed file name. File without the name or extension is not allowed.
 * 200 - The directory is write protected.
 * 501 - File type is not allowed. Based on file extension.
 * 502 - File size limit exceeded.
 * 503 - File save failure.
 * 504 - No free space left on device.
 * 505 - File type is restricted. Based on file extension.
 *
 *
 * @return void
 */
function accept_raw_post() {
	global $CFG;

	// Select the upload dir
	$upl_dir = realpath($CFG['uploadDir']) . DIRECTORY_SEPARATOR;
	if (isset($_GET['dir']) && $_GET['dir'] !== '') {
		$upl_dir = realpath($CFG['uploadDir'] . DIRECTORY_SEPARATOR . $_GET['dir']) . DIRECTORY_SEPARATOR;

		// Check the target dir
		if (!file_exists($upl_dir) || !is_dir($upl_dir) || (is_subdir($CFG['uploadDir'], $upl_dir) !== true)) {
			$upl_dir = realpath($CFG['uploadDir']) . DIRECTORY_SEPARATOR;
		}
	}

	$result = false;
	$file_size = 0;
	$error_code = 0;

	// Set the max time to infinity
	ini_set('max_execution_time', 0);
	ini_set('max_input_time', 0);

	// Create a temporary file in the temporary files directory using sys_get_temp_dir()
	$temp_file = tempnam(ini_get('upload_tmp_dir'), 'php');

	// Copy file to temporary folder from PHP input stream
	if (copy('php://input', $temp_file) === true) {
		// Get file size
		$file_size = filesize($temp_file);

		// Create $_FILES like array
		$upl_file = array('name' => $_GET['name'], 'tmp_name' => $temp_file, 'size' => $file_size);

		$result = process_upload_single_file($upl_file, $upl_dir, true);
		if ($result[0] == 0) {
			$file_path = htmlentities(u_basename($result[1]), ENT_QUOTES, 'UTF-8');
		} else {
			$error_code = $result[1];
		}

		// move uploaded file to new location
		/* if (rename($temp_file, $file_path) === true) {
			$result = true;
		} */
	}
	if ($error_code !== 0) {
		// Try to delete the temporary file if error happens
		unlink($temp_file);
	}

	// Send property header
	header('Content-Type: application/x-javascript');

	// Send the response
	$result_str = '[' . $error_code;
	if ($error_code === 0) {
		// Send the path if file is saved
		$result_str .= ', ' . intval($file_size) . ', "' . $file_path . '"';
	}
	echo $result_str . ']';
}

/*
 * Send the Expires header to browser
 *
 * @param	int	$sec	The time in seconds when the document is expires
 *
 * @return void
 */
function set_expires($sec = 0) {
	if (!headers_sent()) {
		header('Expires: '.gmdate('D, d M Y H:i:s \G\M\T', time() + intval($sec)));

		//header('Pragma: private');
		//header('Cache-Control: private');
		//header('Cache-control: max-age=864000, must-revalidate');
	}
}

/*
 * Check the If-Modified-Since headers and if $lastModified <= If-Modified-Since header then return code 304 and exit
 *
 * @param	int	$last_mod	The unix timestamp of last modified of document
 *
 * @return void
 */
function check_modified_since ($last_mod) {
	// Check if headers not send and we have needed headers
	if (!headers_sent() && isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])) {

		// Get the unix timestamp from
		$if_modified_since = explode(';', $_SERVER['HTTP_IF_MODIFIED_SINCE']);
		$if_modified_since = strtotime($if_modified_since[0]);

		if ($last_mod <= $if_modified_since) {
			 header('HTTP/1.1 304 Not Modified');
			 exit();
		}
	}
	return false;
}

/*
 * Send the Last-Modified header to browser
 *
 * @param	int	$time	The time in seconds when the document is expires
 *
 * @return void
 */
function set_last_modified($time) {
	if (!headers_sent()) {
		if (!isset($time)) {
			$time = time();
		} else {
			$time = intval($time);
		}

		header('Cache-control: private, must-revalidate');
		header('Last-Modified: ' . gmdate('D, d M Y H:i:s \G\M\T', $time));
	}
}

/*
 * Get JavaScript configuration for client-side part
 * Return selected lang
 *
 * @return string
 */
function load_translated_messages () {
	global $CFG;

	$lang_inc_path = 'include' . DIRECTORY_SEPARATOR . 'lang' . DIRECTORY_SEPARATOR;
	// Chose language
	$langs = get_http_langs();
	foreach($langs as $key => $val) {
		if (strpos($key, 'uk') === 0) {
			$lang = 'uk';
		} else if (strpos($key, 'ru') === 0) {
			$lang = 'ru';
		} else if (strpos($key, 'fr') === 0) {
			$lang = 'fr';
		} else if (strpos($key, 'de') === 0) {
			$lang = 'de';
		} else if (strpos($key, 'en') === 0) {
			$lang = 'en';
		}
	}
	// Use default language if nothing find
	if (!isset($lang)) {
		$lang = $CFG['defaultLang'];
	}
	$lang_file = $lang_inc_path . 'lang_'. $lang . '.php';
	// Include language file
	if (file_exists($lang_file) && is_file($lang_file)) {
		global $msg;
		if (empty($msg)) {
			include($lang_file);
		}
	}
	return $lang;
}

/*
 * Get JavaScript configuration for client-side part
 *
 * @return string
 */
function get_client_config () {
	global $CFG;

	// Send the appropriate header
	header('Content-Type: text/javascript');

	if ($CFG['enableCache']) {
		// Get the config midification time
		$modTime = filemtime('include' . DIRECTORY_SEPARATOR . 'config.php');

		set_expires(1800);

		// Send the cache headers
		set_last_modified($modTime);

		// Check the cache header
		check_modified_since($modTime);
	}


	if ($CFG['enableUpload']) {
		// Get the upload limits for configuraion
		$phpmaxsize = trim(ini_get('upload_max_filesize'));
		$last = strtolower($phpmaxsize{strlen($phpmaxsize) - 1});
		switch($last) {
			case 'g':
				$phpmaxsize *= 1024;
			case 'm':
				$phpmaxsize *= 1024;
			case 'k':
				$phpmaxsize *= 1024;
		}
		$cfgmaxsize = trim($CFG['maxUploadFileSize']);
		$last = strtolower($cfgmaxsize{strlen($cfgmaxsize) - 1});
		switch($last) {
			case 'g':
				$cfgmaxsize *= 1024;
			case 'm':
				$cfgmaxsize *= 1024;
			case 'k':
				$cfgmaxsize *= 1024;
		}
		$cfgmaxsize = (int) $cfgmaxsize;
		if ($cfgmaxsize > 0) {
			$maxsize = $cfgmaxsize;
		} else {
			$maxsize = $phpmaxsize;
		}
	} else {
		$maxsize = 0;
		$phpmaxsize = 0;
	}

	// Script Messages
	$lang = load_translated_messages();

	// Include the modules files
	foreach ($CFG['modules'] as $val) {
		// First include the translate messages file if exist
		if (file_exists('./modules/' . $val . '/include/lang/lang_' . $lang . '.php')) {
			// Include modules translation files to extend exit translated messages
			include('./modules/' . $val . '/include/lang/lang_' . $lang . '.php');
		}
		if (file_exists('./modules/' . $val . '/index.php')) {
			// Include modules index files
			include('./modules/' . $val . '/index.php');
		}
	}


	// Get configuration for clients scripts
	ob_start();
	// Include file who output client-side configuration
	require('client_config.php');
	// Get text output
	$script_text = ob_get_contents();
	ob_end_clean();
	if ($CFG['debug'] !== true) {
		$script_text = str_replace(array("\t", "\r", "\n"), '', $script_text);
	}
	return $script_text;
}
?>