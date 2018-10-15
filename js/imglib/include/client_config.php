<?php
/*
 * Simple check the enviroment
 */
	if (!isset($CFG) || empty($CFG)) {
		exit;
	}

?>
imgLib.init({
	reqURL: '<?php echo $_SERVER['SCRIPT_NAME']; ?>',
<?php
	// Select the active configuration
	if (isset($CFG['configName']) && ($CFG['configName'] !== 'default')) {
	?>
	confName : '<?php echo $CFG['configName']; ?>',
<?php
	}
?>
	immediateStart: 1,
	bindKeys: <?php echo (int) $CFG['bindKeys']; ?>,
<?php
	// Select the active configuration
	if ($CFG['historyNavigation']) {
	?>
	historyNavigation: true,
	updateTitle: true,
<?php
	} else {
	?>
	historyNavigation: false,
	updateTitle: false,
<?php
	}
?>
	saveState: <?php echo (int) $CFG['saveState']; ?>,
	sortType: <?php echo (int) $CFG['sortType']; ?>,
	sortOrder: <?php echo (int) $CFG['sortOrder']; ?>,
	enableUpload: <?php echo (int) $CFG['enableUpload']; ?>,
	uploadPath: '<?php echo $CFG['URL']; ?>',
	allowedExt: ['<?php echo implode('\', \'', $CFG['uploadExt']); ?>'],
	maxUploadSize: <?php echo (int) $phpmaxsize; ?>,
	maxUploadFileSize: <?php echo (int) $maxsize; ?>,
	maxFileNameLen: <?php echo (int) $CFG['fileNameLen']; ?>,
	enableBrowseSubdir: <?php echo (int) $CFG['browseSubDir']; ?>,
	enableFileOperation: <?php echo (int) $CFG['allowFileCopy']; ?>,
	enableCreateDir: <?php echo (int) $CFG['allowCreateDir']; ?>,
	enableRename: <?php echo (int) $CFG['allowRename']; ?>,
	enableDelete: <?php echo (int) $CFG['allowDelete']; ?>,
<?php
	// If thumbnail reolocating is enable - set the property path and url
		if ($CFG['thmbRelocating']) {
?>
	thmbPath: '<?php echo $CFG['thmbSaveURL']; ?>',
<?php
		}
	?>
	thmbDir: '<?php echo (!empty($CFG['thmbDirName']) && (intval($CFG['thmbWidth']) > 0) && (intval($CFG['thmbHeight']) > 0)) ? $CFG['thmbDirName']: ''; ?>',
	onSelect: imgLibManager.onSelect,
	onDblSelect: imgLibManager.select,
	onDeselect: imgLibManager.onDeselect,
	viewType: '<?php echo $CFG['defaultViewType']; ?>'<?php

	if (isset($lang) && ($lang !== 'en')) {
	// Load the translated messages
	?>,
	messages: {
		rootPathName: '<?php echo m('Root'); ?>',
		ajaxLoading: '<?php echo m('Loading...'); ?>',
		moveToUpDir: '<?php echo m('Up'); ?>',
		delNonEmptyDir: '<?php echo m('Remove not empty folder "%1"?'); ?>',
		delFile: '<?php echo m('Remove "%1"?'); ?>',
		enterNewDirName: '<?php echo m('Enter name of new directory:'); ?>',
		defaultNewDirName: '<?php echo m('New Folder'); ?>',
		enterNewNameWOExt: '<?php echo m('Enter new name of "%1":\n(file extension is add automatic)'); ?>',
		operationFailed: '<?php echo m('Operation failed. Error code is %1.'); ?>',
		ajaxIsReguire: '<?php echo m('This script reguire browser that support the AJAX tehnology!'); ?>',
		noChange: '<?php echo m('No change!'); ?>',
		/* Context Menu */
		newDir: '<?php echo m('Create folder'); ?>',
		select: '<?php echo m('Select'); ?>',
		selectThmb: '<?php echo m('Select thumbnail'); ?>',
		open: '<?php echo m('Open'); ?>',
		browse: '<?php echo m('Browse'); ?>',
		copy: '<?php echo m('Copy'); ?>',
		cut: '<?php echo m('Cut'); ?>',
		paste: '<?php echo m('Paste'); ?>',
		del: '<?php echo m('Delete'); ?>',
		rename: '<?php echo m('Rename'); ?>',
		reloadDir: '<?php echo m('Reload curent directory'); ?>',
		fileName: '<?php echo m('File name'); ?>',
		fileSize: '<?php echo m('File size'); ?>',
		fileDate: '<?php echo m('File date'); ?>',
		date: '<?php echo m('Date'); ?>',
		size: '<?php echo m('Size'); ?>',
		imageSize: '<?php echo m('Image size'); ?>',
		view: '<?php echo m('View'); ?>',
		thumbnail: '<?php echo m('Thumbnail'); ?>',
		list: '<?php echo m('List'); ?>',
		table: '<?php echo m('Table'); ?>',
		search: '<?php echo m('Search'); ?>',
		enterSearch: '<?php echo m('Enter part of file name:'); ?>',
		sort: '<?php echo m('Sort'); ?>',
		sortByName: '<?php echo m('By name'); ?>',
		sortBySize: '<?php echo m('By size'); ?>',
		sortByDate: '<?php echo m('By date'); ?>',
		upload: '<?php echo m('Upload'); ?>',
		cancel: '<?php echo m('Cancel'); ?>',
		writeProtect: '<?php echo m('Directory is write protected!'); ?>',
		addField: '<?php echo m('Add more field'); ?>',
		delField: '<?php echo m('Delete field'); ?>',
		allowExt: '<?php echo m('Allowed extension: %1.'); ?>',
		maxUploadSize: '<?php echo m('Max upload size (total/file): %1/%2.'); ?>',
		path: '<?php echo m('Path: %1'); ?>',
		close: '<?php echo m('Close'); ?>',
		multipleUpload: '<?php echo m('Your browser supports multiple selection of files to upload. Try it.'); ?>',
		dragAndDropSupport: '<?php echo m('Your browser supports easy &quot;drag &amp; drop&quot; files upload. Try it - select file and drag it to browser.'); ?>',
		uploadResult: '<?php echo m('Uploaded files: %1. Name(s): %2.'); ?>',
		savedAs: '<?php echo m('Saved as: %1.'); ?>',
		autoCloseForm: '<?php echo m('Automatically close the form after upload is finished.'); ?>',
		noFileSelected: '<?php echo m('No file selected!'); ?>',
		error: '<?php echo m('Error: '); ?>',
		dropTargetText: '<?php echo m('Drop your files here'); ?>',
		speed: '<?php echo m('Speed'); ?>',
		speedUnit: '<?php echo m('/s'); ?>',
		timeLeft: '<?php echo m('Time left'); ?>',
		time: '<?php echo m('Time'); ?>',
		second: '<?php echo m('s'); ?>',
		waitInQueue: '<?php echo m('Waiting in queue'); ?>',
		canceled: '<?php echo m('Canceled'); ?>',
		abort: '<?php echo m('Abort'); ?>',
		aborted: '<?php echo m('Aborted'); ?>',
		tryAgain: '<?php echo m('Try again'); ?>',
		errorUpload: '<?php echo m('Error on upload'); ?>',
		errorOnResponse: '<?php echo m('Error on response: '); ?>',
		fileType: '<?php echo m('File type: '); ?>',
		unknownMime: '<?php echo m('unknown'); ?>',
		ec107: '<?php echo m('Bad file name.'); ?>',
		ec200: '<?php echo m('Folder is not writable.'); ?>',
		ec500: '<?php echo m('Can not get free file name.'); ?>',
		ec501: '<?php echo m('Illegal file type.'); ?>',
		ec502: '<?php echo m('File size limit exceeded.'); ?>',
		ec503: '<?php echo m('Some error when move upload file.'); ?>',
		ec504: '<?php echo m('No free space left.'); ?>',
		ec506: '<?php echo m('Local and remote file sizes do not match.'); ?>',
		fileSizeDim: ['<?php echo m('b'); ?>', '<?php echo m('Kb'); ?>', '<?php echo m('Mb'); ?>', '<?php echo m('Gb'); ?>', '<?php echo m('Tb'); ?>', '<?php echo m('Eb'); ?>']
	}<?php
	}

	// Load the user deffined context menu
	/* Arrays with the image tools context menu items objects */
	if (is_array($CFG['contextItems']) && !empty($CFG['contextItems'])) {
		echo ",\n\tcontextMenuItems: [";
		for( $i = 0; $i < count($CFG['contextItems']); $i++) {
			$item = $CFG['contextItems'][$i];

			echo sprintf("\n\t\t" . '{"text": "%1$s","handle": %2$s,"cssClass": "%3$s","show": %4$s,"disabled": %5$s,"defaultItem": "%6$s"}%7$s', (isset($item['text']) ? addslashes($item['text']) : ''), (isset($item['handle']) ? $item['handle'] : ''), (isset($item['cssClass']) ? addslashes($item['cssClass']) : ''), (isset($item['show']) ? $item['show'] : ''), (isset($item['disabled']) ? $item['disabled'] : '0'), (isset($item['defaultItem']) ? addslashes($item['defaultItem']) : ''), (($i < count($CFG['contextItems']) - 1) ? "," : ''));
		}
		echo "\n\t]";
	}
	?>

});

/* Translate page labels */
translateLabels([{id: 'select_file_label', prop:'<?php echo m('Selected file'); ?>'},{id: 'select', prop: '<?php echo m('Select'); ?>'},{id: 'cancel', prop: '<?php echo m('Cancel'); ?>'}]);