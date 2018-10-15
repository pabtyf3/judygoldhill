<?php

// Check of correct call
if (!isset($CFG) || empty($CFG)) {
	exit;
}

if (isset($_GET['getConfig'])) {
	if (isset($_GET['module']) && $_GET['module'] == 'imgtools') {
		/*
		 * Get configuration of the module
		 */

		// Script Messages
		$lang = load_translated_messages();

		 ob_start();
		?>
imageTools.init({
	uploadPath: '<?php echo $CFG['URL']; ?>',
	srcArg: 'src',
	dstArg: 'dst',
	previewArg: 'preview',
	resizeArg: 'resize',
	cropArg: 'crop',
	rotateArg: 'rotate',
	flipArg: 'flip',
	loadingIndicator: '../../img/loading.gif'<?php
	if ($lang !== 'en') { // Send only translated strings
	?>,
	msg: {
		errorLoadData: '<?php echo m('Error loading data!'); ?>',
		cropImageWait: '<?php echo m('Crop image. Please wait.'); ?>',
		resizeImageWait: '<?php echo m('Resize image. Please wait.'); ?>',
		rotateFlipImageWait: '<?php echo m('Rotate/Flip image. Please wait.'); ?>',
		loadingPreview: '<?php echo m('Loading preview....'); ?>',
		errorPrefix: '<?php echo m('Error: '); ?>',
		loading: '<?php echo m('Loading....'); ?>',
		labels: [
			{id: 'resize_content_tab', prop:'<?php echo m('Resize image'); ?>'},
			{id: 'crop_content_tab', prop: '<?php echo m('Crop image'); ?>'},
			{id: 'rotate_content_tab', prop: '<?php echo m('Rotate/Flip image'); ?>'},
			{id: 'close_button', prop: '<?php echo m('Close'); ?>'},
			{id: 'size_label', prop: '<?php echo m('Size'); ?>'},
			{id: 'apply_resize', prop: {value: '<?php echo m('Apply'); ?>', title: '<?php echo m('Save changes'); ?>'}},
			{id: 'reset_resize', prop: {value: '<?php echo m('Reset'); ?>', title: '<?php echo m('Reset to original size'); ?>'}},
			{id: 'save_prop_label', prop: '<?php echo m('Save proportions'); ?>'},
			{id: 'width_label', prop: {innerHTML: '<?php echo m('Width'); ?>', title: '<?php echo m('Width'); ?>'}},
			{id: 'height_label', prop: {innerHTML: '<?php echo m('Height'); ?>', title: '<?php echo m('Height'); ?>'}},
			{id: 'crop_sel_from_label', prop: {innerHTML: '<?php echo m('Selected area: from'); ?>'}},
			{id: 'crop_sel_to_label', prop: '<?php echo m('to'); ?>'},
			{id: 'apply_crop', prop: {value: '<?php echo m('Apply crop'); ?>'}},
			{id: 'rotate_label', prop: '<?php echo m('Rotate'); ?>'},
			{id: 'rotate_ccw_label', prop: {innerHTML: '<?php echo m('90&deg; CCW'); ?>', title: '<?php echo m('Rotate 90 degrees counterclockwise'); ?>'}},
			{id: 'rotate_cw_label', prop: {innerHTML: '<?php echo m('90&deg; CW'); ?>', title: '<?php echo m('Rotate 90 degrees clockwise'); ?>'}},
			{id: 'flip_label', prop: '<?php echo m('Flip'); ?>'},
			{id: 'flip_h_label', prop: {innerHTML: '<?php echo m('horisontal'); ?>', title: '<?php echo m('horisontal'); ?>'}},
			{id: 'flip_v_label', prop: {innerHTML: '<?php echo m('vertical'); ?>', title: '<?php echo m('vertical'); ?>'}},
			{id: 'reset_rotate_flip', prop: {value: '<?php echo m('Reset'); ?>'}},
			{id: 'apply_rotate_flip', prop: {value: '<?php echo m('Apply'); ?>'}},
			{id: 'cor_label', prop: '<?php echo m('Image Tools for'); ?>'}
		]
	}<?php
	}
	?>
});
<?php
		$config_text = ob_get_contents();
		ob_end_clean();
		if ($CFG['debug'] !== true) {
			$config_text = str_replace(array("\t", "\r", "\n"), '', $config_text);
		}
		echo $config_text;
	} else {
		/*
		 * The script require the configuration - get it
		 * Extend the current configuraton
		 */
		$CFG['contextItems'][] = array(
			'text' => m('Edit'), // The display item text
			'handle' => 'function (){var a=imgLib.getSelectedItem(),b,c=encodeURI;if(a&&a.type==2){a=c(HTMLDecode(imgLib.getItemInfo(a.type,a.index).localPath));b=imgLib.getConfig("confName");window.open("modules/imgtools/index.html#"+a+(b!=="default"?"|"+c(b):""),"imgtools","width=750, height=500, location=0, status=no, toolbar=no, menubar=no, scrollbars=yes, resizable=yes",true)}}', // Handle of function to extcute when the item click
			//'cssClass' => '', // css class of icons, empty or not set to disable
			'show' => 'function (context_element) {return context_element.type == 2;}', // When don't/show item
			'disabled' => 'function (context_element, isCanPaste, isElementSelected, dir_is_writable) {return !(isElementSelected && dir_is_writable);}', // When disable item
			//'defaultItem' => 'false', // Show item as default (bold text), dont use in users items
		);
	}
/*
// Open handle
function () {
	var
		selElement = imgLib.getSelectedItem(),
		path,
		confName,
		toURIComponent = encodeURIComponent
	;
	if (selElement && (selElement.type == 2)) {
		// Get the path to the edit file
		path = toURIComponent(imgLib.getItemInfo(selElement.type, selElement.index).localPath);
		confName = imgLib.getConfig('confName');

		// Open window
		var imgToolsWindow = window.open('modules/imgtools/index.html#' + path + ((confName !== 'default') ? ('|' + toURIComponent(confName)) : '' ), 'imgtools', 'width=750, height=500, location=0, status=no, toolbar=no, menubar=no, scrollbars=yes, resizable=yes', true);
	}
}
*/
} else {
	/*
	 * Image tools body
	 */

	// Require the image edit class
	require('imgtools_class.php');


	//Preview of image
	if (isset($_GET['preview']) && isset($_GET['src']) && (isset($_GET['flip']) || isset($_GET['rotate']) )) {

		// Normalize the varitable
		$src_img = (string) $_GET['src'];
		$flip_type = (isset($_GET['flip'])) ? (int) $_GET['flip'] : -1;
		$rotation_angle = (isset($_GET['rotate'])) ? (int) $_GET['rotate'] : 0;

		// Fix and check the path
		$src_img = realpath($CFG['uploadDir'] . $src_img);
		if (!check_file_ext($src_img)) {
			echo 'File not allow to edit: '.str_replace($CFG['uploadDir'], '', $src_img)."\n";
			exit;
		}

		// Check exist image
		if (!(file_exists($src_img) && is_file($src_img) && (is_subdir($CFG['uploadDir'], $src_img) === true))) {
			echo 'File not found: '.str_replace($CFG['uploadDir'], '', $src_img)."\n";
			exit;
		}

		$myImgTools = new imgTools();
		$myImgTools->setIncreaseSmallImage(false);
		$myImgTools->loadImage($src_img);

		if ($myImgTools->getReady()) {
			$myImgTools->resize(500, 500);
			// If image is ready
			if ($flip_type !== -1) {
				// Flip
				$myImgTools->flip($flip_type);
			}
			if ($rotation_angle !== 0) {
				// Rotate
				$myImgTools->rotate($rotation_angle);
			}

			// Save the image
			$myImgTools->outputImage('', 30);
		}
		$last_error = $myImgTools->getLastError();
		if (empty($last_error)) {
			echo 'OK';
		} else {
			echo 'Last error = '.$last_error;
		}
	}

	// Image process change
	if ( (isset($_POST['cmd']) && ($_POST['cmd'] === 'edit')) && isset($_POST['src']) && isset($_POST['dst'])) {

		// Normalize the varitable
		$src_img = (string) $_POST['src'];
		$dst_img = (string) $_POST['dst'];
		$flip_type = (isset($_POST['flip'])) ? (int) $_POST['flip'] : -1;
		$rotation_angle = (isset($_POST['rotate'])) ? (int) $_POST['rotate'] : 0;

		// Fix and check the path
		$src_img = realpath($CFG['uploadDir'] . $src_img);
		// Only edit exist image
		$dst_img = $src_img;

		if (!check_file_ext($src_img)) {
			echo 'File not allow to edit: '.str_replace($CFG['uploadDir'], '', $src_img)."\n";
			exit;
		}

		if (!(file_exists($src_img) && is_file($src_img) && (is_subdir($CFG['uploadDir'], $src_img) === true))) {
			echo 'File not found: '.str_replace($CFG['uploadDir'], '', $src_img)."\n";
			exit;
		}

		if (isset($_POST['resize'])) {
			// Input like "width,height"
			$resize_size = explode(',', $_POST['resize']);
			$resize_size = array_pad($resize_size, 2, 0);

			$resize_size[0] = (int) $resize_size[0];
			$resize_size[1] = (int) $resize_size[1];
			if (($resize_size[0] <= 0) && ($resize_size[1] <= 0)) {
				// Notfing to resize
				$resize_size = null;
			}
		}

		if (isset($_POST['crop'])) {
			// Input like "X1,Y1,width,height"
			$crop = explode(',', $_POST['crop']);
			$crop = array_pad($crop, 4, 0);

			for ($i=0; $i<4;$i++) {
				$crop[$i] = (int) $crop[$i];
				$crop[$i] = ($crop[$i] < 0) ? -$crop[$i] : $crop[$i];
			}

			// Check the width and height
			if ( ($crop[2] <= 0) || ($crop[3] <= 0) ) {
				// Notfing to resize
				$crop = null;
			}
		}

		$myImgTools = new imgTools();
		$myImgTools->setOverwrite(1);
		$myImgTools->setKeepProportions(0);
		$myImgTools->loadImage($src_img);

		if ($myImgTools->getReady()) {
			// If image is ready

			if (!empty($crop)) {
				// Crop
				$myImgTools->crop($crop[0], $crop[1], $crop[2], $crop[3]);
				$myImgTools->setKeepProportions(1);
			}

			if (!empty($resize_size)) {
				// Resize
				$myImgTools->resize($resize_size[0], $resize_size[1]);
			}

			if ($flip_type !== -1) {
				// Flip
				$myImgTools->flip($flip_type);
			}

			if ($rotation_angle !== 0) {
				// Rotate
				$myImgTools->rotate($rotation_angle);
			}

			// Save the image
			$myImgTools->outputImage($dst_img, $CFG['imgQuality']);

			// Create the thumbails if enabled in config
			if ($CFG['thmbAutoCreate'] === true) {
				create_file_thmb($dst_img);
			}
		}
		$last_error = $myImgTools->getLastError();
		if (empty($last_error)) {
			echo 'OK';
		} else {
			echo $last_error;
		}
	}
}
/* Thumbnail creation example
	$myImgTools = new imgTools();
	$myImgTools->setOverwrite(1);
	$myImgTools->setMaxImageSize(90);
	$myImgTools->loadImage($_GET['src']);
	$myImgTools->resize(90);
	$myImgTools->outputImage($_GET['dst'], 40);
*/
?>