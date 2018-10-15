<!DOCTYPE html PUBLIC "-//W3C//DsTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="shortcut icon" type="image/ico" href="img/favicon.ico" />
<title>ImgLib v.0.1.2</title>
<link href="css/imglib.css" type="text/css" rel="stylesheet" />
<link rel="shortcut icon" type="image/ico" href="img/favicon.ico" />
</head>
<body>
<div id="imgLibContainer">
	<div id="imgLib">
		<noscript>imgLib requires JavaScript to run!</noscript>
	</div>
</div>
<div id="controls">
	<div id="info"><span id="select_file_label">Selected file</span>: <span id="file_path_label"></span></div>
	<a href="#" id="select" class="gray_btn" onclick="return imgLibManager.select();">Select</a>
	<a href="#" id="cancel" class="red_btn" onclick="window.close();">Cancel</a>
</div>

<script type="text/javascript" src="css/core.js"></script>
<script type="text/javascript" src="css/imglib.js"></script>
<script type="text/javascript">
/*
 * Create the simple object to accept the file selections in imgLIb
 */
var imgLibManager = (function () {
	var
		params = getURLArg(), // Get window arguments as object
		firstSctipt = document.getElementsByTagName('script')[0], // Link to first script on page
		selectedFile
	;

	// Init on window load
	function init() {
		// Set start dir
		if (params.path) {
			imgLib.setStartPath(params.path);
		}
		// Append script for load configuration
		firstSctipt.parentNode.insertBefore(createElement('script', {type: 'text/javascript', async: true, src: 'imglib.php?getConfig' + ((!!params.configName) ? ('=' + params.configName) : '' )}), firstSctipt);

		adjustHeight();
		imgLibManager.init();
	}

	// Adjust the imgLib layer height
	function adjustHeight() {
		var
			winGeom = getWindowGeometry(),
			controlsEl = $('controls'),
			controlsGeom = getElPos(controlsEl)
		;
		$('imgLib').style.height = (winGeom.height - controlsGeom.height - 14) + 'px';
	}

	// Add events
	addEvent(window, 'resize', adjustHeight);
	addEvent(window, 'load', init);

	// Return the imgLibManager object
	return {
		selectedFile: selectedFile,
		init: function () {
			// Here goes your code for setting your custom things onLoad.
		},
		onSelect: function (file) {
			// Save selected file and indicate the selection
			selectedFile = file;
			$('select').className = 'gren_btn';
			$('file_path_label').innerHTML = file.localPath + ' (' + file.humanSize + ')';
		},
		onDeselect: function () {
			// Clear selected file
			selectedFile = null;
			$('select').className = 'gray_btn';
			$('file_path_label').innerHTML = '';
		},
		select: function (file) {
			// Direct select file
			if (file) {
				selectedFile = file;
			}
			// If notfing selected - exit
			if (!selectedFile) {
				return false;
			}
			// Insert selected file
			if (params.returnto) {
				if ( (typeof opener[params.returnto] == 'function') || (typeof opener[params.returnto] == 'object') ) {
					// window.returnto - function (or object in IE) created by opener window to get the selected file path
					opener[params.returnto](selectedFile.path, selectedFile);
				} else if (opener.document.getElementById(params.returnto)) {
				// returnto - some element to insert the selected file path
					var return_element = opener.document.getElementById(params.returnto);
					// Set the value property if returnto is input element, and innerHTML if it a regular HTML tag
					return_element.innerHTML =  selectedFile.path;
					return_element.value = selectedFile.path;
				}
				window.close();
			} else {
			// Else do nothing
				return false;
			}
		}
	}
}());
//<script type="text/javascript" src="imglib.php?getConfig"></script>
</script>
</body>
</html>