/********************************************************************
 * imgLib v0.1.2 09.04.2011
 * Contact me at dev@jstoys.org.ua
 * Site: http://jstoys.org.ua/
 * This copyright notice MUST stay intact for use.
 ********************************************************************/

var imgLib = (function () {
	var
		version = '0.1.2',
		/*
			Browser check
		*/
		userAgent = navigator.userAgent.toLowerCase(), // Short access to navigator.userAgent
		isLinux = (userAgent.indexOf('linux') != -1) ? 1 : 0, // The linux using flag
		isIE6 = (((isIE6 = userAgent.indexOf('msie')) != -1) && (parseInt(userAgent.substr((isIE6 + 5), 1)) < 8)) ? 1 : 0, // My best love - Microsoft Internet Explorer 6.0. First search if userAgent containt the MSIE and save the position of them in isIE6, next get major version number. 5 = length of 'msie '
		isFirefox = (userAgent.indexOf('firefox') != -1) ? 1 : 0, // The Firefox browser using flag
		isOpera = (window.opera) ? 1 : 0, // Is Opera
		isWebkit = (userAgent.indexOf('webkit') != -1) ? 1 : 0, // The Webkit based browser using flag
		// Check if support the HTML5 Features
		isMultipleUpload = 'multiple' in createElement('input'), // Check if multiple files uploads in one fields is suported
		isStorage = (function () {try {return 'sessionStorage' in window && window['sessionStorage'] !== null;} catch(e) {return false}}()), // Session or localStorage object for save the state (fileBuffer, curent path etc.). If exist sessionStorage there should exist and localStorage
		isDraggable = 'draggable' in createElement('span'), // Drag & Drop support for easy upload files
		isXHRUpload = ('upload' in getXHR()), // XMLHttpRequest object support the file upload to server
		isFileAPI = (typeof FileReader != 'undefined'), // Is have the File API to access to local files
		isHTML5DragAndDropSupport = (isDraggable && isXHRUpload && isFileAPI) ? 1 : 0, // Check the features to enable Drag & Drop support
		uploadList = [], /* The array with information about the uploaded files
							uploadList = [
								[	// uploadFileItem object
									{
										state: integer
													The state of the upload item, can be
														0: new
														1: ready
														2: upload
														3: uploaded
														4: error
														5: cancel
														6: abort
														7: aborted by server
										file: object // The File object provides information about files
										size: integer // The file size in bytes
										name: string // The file name
										type: string // The file mime type or 'unknow'
										xhr: object // The XMLHTTPReques object who corespond for this uploading
										uploadEvent: object // The XMLHTTPReques.upload event object
										mainContainer: DOMElement // The link to the list item with all elements
										indicatorBox: DOMElement // The link to the progress bar box layer
										indicatorLabel: DOMElement // The link to the progress bar label element
										indicator: DOMElement // The link to the progress bar element
										controllLink: DOMElement // The link to controll link element
										startTime: integer // The XMLHTTPRequest start time
										endTime: integer // The The XMLHTTPRequest end time time
										response: object // The request response parsed as JSON
										errorMsg: string // If the error happens, this property contains the error message
									}
								],
								[
									.....
								],
								........
							]
		*/
		uploadActive = false, // The uploading is active
		/*
			Property of element on context
			object {
				type:, // "1" if folder or "2" if file
				index: 1, // Index in array of dirContent.files or dirContent.dirs
				name: 'file name'// Name of file or folder
				time: time in miliseconds on show menu
			}
		*/
		contextElement,
		fileBuffer, //Information about files or folders to paste - object{cmd: "copy" or "move", src: "/path/to/selected/file" }
		treeTimer, // Timer object to hide folder tree element
		tooltipsTimer, // Timer object to show tooltips element
		uploadFormShow, // Indicate if upload form show
		filesIsUploaded, // Indicates whether the file(s) was uploaded
		erroOnUpload, // Indicates whether there was an error uploaded file
		autoCloseUploadForm = true, // Save the setting about automatic close upload form
		ready = false, // Flag that indicate imgLib to ready to work (set to try alfer the all initialisation)
		folderTreeExpanded, // Flag that indicate folder tree is expanded
		tooltipsItemIndex, // Index of file to show tooltips
	/*
		AJAX section
	*/
		curPath = '/', // Path to current dir
	/*
		Current dir content
		dirContent = {
			path: ['dir', 'subDir', 'subSubDir'], // Path to current dir
			inf: {
					isWritable: true // The current dir is writable (true) or not (false)
				},
			dirs: [
					{
						name: 'fauna', // Dir name
						empty: 0, // Directory is empty (1) or not (0)
						readable: 1, // Directoy is readable
						date: 1253824760 // Dir date as unix timestamp
					},
					{name: 'flora', empty: 1, readable: 1},
					{name: 'biiiiiig foldeeeeeeeer nameeeeeeeeeeeeee ', empty: 1, readable: 1}
				]
			},
			files: [
					{
						name: 'filename', // File name
						filesize: 100, // File size in bytes
						date: 1253824760, // File date as unix timestamp
						img_size: '1024x768', // If file is image contains the image size
						thmb: '/thmb/filename.jpg' // If file is image contains the path to image thumbnail
					}
			]
		}
	*/
		dirContent = {}, // Curent dir content object
		/*
			Configuration varitables
		*/
		idName,
		reqURL,
		confName,
		immediateStart,
		bindKeys,
		historyNavigation,
		hashRecheckInterval,
		bSaveState,
		useLocalStorage,
		updateTitle,
		enableUpload,
		uploadPath,
		allowedExt,
		maxUploadSize,
		maxUploadFileSize,
		saveInfCookie,
		sortType,
		sortOrder,
		maxFileNameLen,
		enableBrowseSubdir,
		enableFileOperation,
		enableCreateDir,
		enableRename,
		enableDelete,
		thmbPath,
		thmbDir,
		tooltipsDelay,
		overlayOpacity,
		tooltipOverlayOpacity,
		dbclickDelay,
		onSelect,
		onDblSelect,
		onDeselect,
		viewType,
		messages = {},  //Script messages
		contextMenuItems, // Context menu items array
		userContextMenuItems, // User defined context menu items array
		/*
			Elements
		*/
		imgLibElement, // Main element who contains the imgLib elements
		ajaxLoadElement, // Element who contains the AJAX loading indicator
		contextMenuElement, // Element who contains the context menu
		tulbarElement, // Element who contains the tulbar
		fileListElement, // Element who contains the file list
		uploadInputs, // Element with upload form
		tooltipsElement, // Element who contains the file tooltips
		dropTarget, // The drop target layer
		/*
			Short access to math functions
		*/
		abs = Math.abs,
		round = Math.round,
		config = {} // The configuraiton of imgLib to get outside
	;

	/*
		Aply the settings
		Waring! Some change like change idName require change also the css file to property display the file list
	*/
	function setSettings(settings) {
		// Set the defaut options
		var defaultConfig = {
				idName: 'imgLib', // id of elements to use as root element, if not set, create new
				reqURL: 'imglib.php', // URL to script for request the AJAX data and upload files
				confName: 'default', // The current configuration name. Default not set or set to 'default'.
				immediateStart: false, // Run onLoad immediate on init call. Not add event to window load
				bindKeys: true, /*
											Bind keyboard shorcuts to some actions. Default actions is:
												1) Open file in new window on 'Ctrl+Enter';
												2) Choose file if it's selected on 'Enter';
												3) Choose file thumbnails if available and if file is selected on 'Shift+Enter';
												4) Rename file on 'F2';
												5) Create directory on 'F7';
												6) Show upload form on 'Insert';
												7) Cut file on 'Ctrl+X';
												8) Copy file on 'Ctrl+C';
												9) Paste file on 'Ctrl+V'.
												10) Delete element on 'Del';
										*/
				historyNavigation: true, // Use window history to navigation. This feature use location hash so if other script use it - trouble can be happens.
				hashRecheckInterval: .1, // Location hash recheck interval in seconds. It use to provide history navigation work property.
				saveState: true, /*
										Specifies whether to save the state between window calls.
											If localStorage or sessionStorage is aviable:
												*	true - use localStorage to save current state betven cals.
												*	false - use sessionStorage - that allows to keep state for each window, but does not keep state when you close the window and not share state between windows that lets you copy a file in one window and paste it into another.
											if localStorage or sessionStorage is not aviable:
												*	true - use cookies
												*	false - not save, even in cookes
										*/
				updateTitle: true, // Enable or disable the window title updating on browsing
				enableUpload: true, // Enable or disable the file upload
				uploadPath: '/upload/', // Path to upload folder from root
				startDir: curPath, // Path to some folder for start browsing. Default its equal to curPath that by default equal '/'. Example: "some_folder".
				allowedExt: ['jpеg', 'jpg', 'gif', 'png'], // Array with displayed allowed extension in upload dialog (only display, not check)
				maxUploadSize: 0, // Display max upload size (in bytes) in upload dialog (only display, not check)
				maxUploadFileSize: 0, // Display max file size (in bytes) to upload in upload dialog (only display, not check)
				saveInfCookie: 'imglibInf', // Name of cookie to save/restore information like path and view type, sorting and file buffer
				sortType: 1, // Type of files or folders sort, the posible options is name (1), size (2), date(3)
				sortOrder: 0, // Direction of sort, the posible options is 0 (asc) or 1 (desc)
				maxFileNameLen: 30, // Maximum file name length
				enableBrowseSubdir: true, // Enable browse sub folder
				enableFileOperation: true, // Enable copy or move file or folder
				enableCreateDir: true, // Enable create new folder
				enableRename: true, // Enable rename file or folder
				enableDelete: true, // Enable delete file or folder
				thmbPath: '', // Path to created thumbnail. Default not used.
				thmbDir: 'thmb', // Name of thumbnail directory, this directory no show
				tooltipsDelay: 400, // Delay to show tooltips
				overlayOpacity: 75, // Overlay opacity in ajax loading layer
				tooltipOverlayOpacity: 90, // Overlay opacity in tootltip layer
				dbclickDelay: 400, // Delay betwen the click to consider as double click
				onSelect: undefined, // Function to execute when file is selected, file - the item of array dirContent.files[] with additional attributes: localPath - path to file; path - path to file for browser; thmbPath - path to thumbnail file for browser. Example:"function(file) {alert(file.name);}";
				onDblSelect: undefined, // Function to execute when file is selected by double click, file - the item of array dirContent.files[] with additional attributes: localPath - path to file; path - path to file for browser; thmbPath - path to thumbnail file for browser. Example:"function(file) {alert(file.name);}";
				onDeselect: undefined, // Function to execute when selection is lost. Example:"function() {alert('deselect file');}";
				viewType: 'thumbnail', // Default view type, the posible options is list, thumbnail, table
				messages: {
							rootPathName: 'Root',
							ajaxLoading: 'Loading...',
							moveToUpDir: 'Up',
							delNonEmptyDir: 'Remove not empty folder "%1"?',
							delFile: 'Remove "%1"?',
							enterNewDirName: 'Enter name of new directory:',
							defaultNewDirName: 'New Folder',
							enterNewNameWOExt: 'Enter new name of "%1":\n(file extension is add automatic)',
							operationFailed: 'Operation failed. Error code is %1.',
							ajaxIsReguire: 'This script reguire browser that support the AJAX tehnology!',
							noChange: 'No change!',
							// Context Menu
							newDir: 'Create folder',
							select: 'Select',
							selectThmb: 'Select thumbnail',
							open: 'Open',
							browse: 'Browse',
							copy: 'Copy',
							cut: 'Cut',
							paste: 'Paste',
							del: 'Delete', // Using short name becouse the "delete" is reserved word
							rename: 'Rename',
							reloadDir: 'Reload curent directory',
							fileName: 'File name',
							fileSize: 'File size',
							fileDate: 'File date',
							date: 'Date',
							size: 'Size',
							imageSize: 'Image size',
							view: 'View',
							thumbnail: 'Thumbnail',
							list: 'List',
							table: 'Table',
							search: 'Search',
							enterSearch: 'Enter part of file name:',
							sort: 'Sort',
							sortByName: 'By name',
							sortBySize: 'By size',
							sortByDate: 'By date',
							upload: 'Upload',
							cancel: 'Cancel',
							writeProtect: 'Directory is write protected!',
							addField: 'Add more field',
							delField: 'Delete field',
							allowExt: 'Allowed extension: %1.',
							maxUploadSize: 'Max upload size (total/file): %1/%2.',
							path: 'Path: %1',
							close: 'Close',
							error: 'Error: ',
							multipleUpload: 'Your browser supports multiple selection of files to upload. Try it.',
							dragAndDropSupport: 'Your browser supports easy &quot;drag &amp; drop&quot; files upload. Try it - select file and drag it to browser.',
							uploadResult: 'Uploaded files: %1. Name(s): %2.',
							savedAs: 'Saved as: %1.',
							autoCloseForm: 'Automatically close the form after upload is finished.',
							noFileSelected: 'No file selected!',
							// HTML5 File API
							dropTargetText: 'Drop your files here',
							speed: 'Speed',
							speedUnit: '/s',
							timeLeft: 'Time left',
							time: 'Time',
							second: 's',
							waitInQueue: 'Waiting in queue',
							canceled: 'Canceled',
							abort: 'Abort',
							aborted: 'Aborted',
							tryAgain: 'Try again',
							errorUpload: 'Error on upload',
							errorOnResponse: 'Error on response: ',
							fileType: 'File type: ',
							unknownMime: 'unknown',
							// Error code description
							ec107: 'Bad file name.',
							ec200: 'Folder is not writable.',
							ec500: 'Can not get free file name.',
							ec501: 'Illegal file type.',
							ec502: 'File size limit exceeded.',
							ec503: 'Some error when move upload file.',
							ec504: 'No free space left.',
							ec506: 'Local and remote file sizes do not match.',
							// The file size dimension
							fileSizeDim: ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Eb']
				}, // New messages string to replace original (for localisation)
				contextMenuItems: [ // Arrays with the users context menu items objects
					/*
					{
						text: 'Custom item', // The display item text
						handle: function(){alert('custom item click');}, // Handle of function to extcute when the item click
						cssClass: 'my_item_icon', // css class of icons, empty or not set to disable
						show: true, // This property controll the show of menu items. It can be boolean or function. The function call with this arguments ( 1) current context element, 2) isCanPaste, 3) isElementSelected, 4) dir is writable). Default true;
						disabled: false, // Controll the disabling items. It can be boolean or function. The function call with this arguments ( 1) current context element, 2) isCanPaste, 3) isElementSelected, 4) dir is writable). Default false;
						defaultItem: 1 // Show item as default (bold text), dont use in users items
					},
					{....}
					*/
				]
			},
			i
		;

		// Apply new settings
		settings = extend(defaultConfig, settings || {});

		// Copy the configuration
		extend(config, settings);

		idName = settings.idName;
		reqURL = settings.reqURL;
		confName = settings.confName;
		immediateStart = !!settings.immediateStart;
		bindKeys = !!settings.bindKeys;
		historyNavigation = !!settings.historyNavigation;
		hashRecheckInterval = settings.hashRecheckInterval;
		bSaveState = !!settings.saveState;
		updateTitle = !!settings.updateTitle;
		//enableUpload = (typeof settings.enableUpload != 'undefined') ? settings.enableUpload : true;
		enableUpload = !!settings.enableUpload;
		uploadPath = settings.uploadPath;
		curPath = settings.startDir || curPath;
		allowedExt = settings.allowedExt.sort();
		maxUploadSize = settings.maxUploadSize;
		maxUploadFileSize = settings.maxUploadFileSize;

		saveInfCookie = settings.saveInfCookie;
		sortType = parseInt(settings.sortType);
		sortOrder = parseInt(settings.sortOrder);
		maxFileNameLen = settings.maxFileNameLen;
		enableBrowseSubdir = !!settings.enableBrowseSubdir;
		enableFileOperation = !!settings.enableFileOperation;
		enableCreateDir = !!settings.enableCreateDir;
		enableRename = !!settings.enableRename;
		enableDelete = !!settings.enableDelete;
		thmbPath = settings.thmbPath || settings.uploadPath;
		thmbDir = settings.thmbDir;
		tooltipsDelay = settings.tooltipsDelay;
		overlayOpacity = settings.overlayOpacity;
		tooltipOverlayOpacity = settings.tooltipOverlayOpacity;
		dbclickDelay = settings.dbclickDelay;
		onSelect = settings.onSelect;
		onDblSelect = settings.onDblSelect;
		onDeselect = settings.onDeselect;
		viewType = settings.viewType;

		// Normalize the uploadPath (delete last slash)
		uploadPath = (uploadPath.lastIndexOf('/') == (uploadPath.length - 1)) ? uploadPath.substring(0, uploadPath.length - 1) : uploadPath;

		// Normalize the sort options
		sortType = (sortType == 3) ? 3 : ((sortType == 2) ? 2 : 1) ;
		sortOrder = (sortOrder != 0) ? 1 : 0;

		// Apply the selected configuration name
		if (confName && confName.length > 0 && confName !== 'default') {
			reqURL = reqURL + ((reqURL.indexOf('?') != -1) ? '&' : '?') + 'setConfig=' + confName;
		}

		// Make short access to messages strings && Load messages
		messages = settings.messages;
/*
		for (i in settings.messages) {
			if (typeof settings.messages[i] == 'string') {
				//messages[i] = HTMLDecode(settings.messages[i]);
				messages[i] = settings.messages[i];
			}
		}
*/
		// Generate the default context elements items
		contextMenuItems = [
			{
				text: messages.select, // Select the file
				handle: function () {onDblSelect(getFileProperties(contextElement.index))},
				show: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return onDblSelect && contextElement.type == 2;}, // Element type: 1 - folder, 2 - file
				defaultItem: 1,
				hotkeyText: (bindKeys ? 'Enter' : '')
			},
			{
				text: messages.selectThmb, // Select the thumbnail
				handle: function() {var file = getFileProperties(contextElement.index); file.path = file.thmbPath; onDblSelect(file);}, // Overwriteh the path property by thumbnail path
				show: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return onDblSelect && (contextElement.type == 2) && getFileProperties(contextElement.index).thmbPath;}, // Element type: 1 - folder, 2 - file
				hotkeyText: (bindKeys ? 'Shift + Enter' : '')
			},
			{
				text: messages.open, // Open file in new window
				handle: openFileInList,
				show: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return contextElement.type == 2;}, // Element type: 1 - folder, 2 - file
				hotkeyText: (bindKeys ? 'Ctrl + Enter' : '')
			},
			{
				text: messages.browse, // Browse subdirectory
				handle: browseDirectory,
				cssClass: 'folder',
				show: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return ((contextElement.type == 1) && enableBrowseSubdir);},
				defaultItem: 1
			},
			{
				text: messages.newDir, // Create new dir
				handle: createDirectory,
				cssClass: 'newFolder',
				show: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return (!isElementSelected && enableCreateDir);},
				disabled: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return !dirIsWritable;},
				defaultItem: 1,
				hotkeyText: (bindKeys ? 'F7' : '')
			},
			{
				// The separator
			},
			{
				text: messages.copy,
				handle: function () {saveInFileBuffer(false);},
				cssClass: 'copy',
				show: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return (/* isElementSelected &&  */enableFileOperation);},
				disabled: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return !isElementSelected;},
				hotkeyText: (bindKeys ? 'Ctrl + C' : '')
			},
			{
				text: messages.cut,
				handle: function () {saveInFileBuffer(true);},
				cssClass: 'cut',
				show: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return (/* isElementSelected &&  */enableFileOperation);},
				disabled: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return !(isElementSelected && dirIsWritable);},
				hotkeyText: (bindKeys ? 'Ctrl + X' : '')
			},
			{
				text: messages.paste,
				handle: pasteFromFileBuffer,
				cssClass: 'paste',
				show: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return (/* isElementSelected &&  */enableFileOperation);},
				disabled: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return !isCanPaste;},
				hotkeyText: (bindKeys ? 'Ctrl + V' : '')
			},
			{
				text: messages.del,
				handle: removeFileObj,
				cssClass: function () {return (contextElement.type == 1) ? 'delFolder' : 'del';},
				show: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return enableDelete;},
				disabled: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return !(isElementSelected && dirIsWritable);},
				hotkeyText: (bindKeys ? 'Del' : '')
			},
			{
				text: messages.rename,
				handle: renameFileObj,
				cssClass: 'rename',
				show: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return (/* isElementSelected &&  */enableRename);},
				disabled: function (contextElement, isCanPaste, isElementSelected, dirIsWritable) {return !(isElementSelected && dirIsWritable);},
				hotkeyText: (bindKeys ? 'F2' : '')
			}
		];

		// Append the users items to context menu
		if ((settings.contextMenuItems instanceof Array) && (settings.contextMenuItems.length > 0)) {

			// Add the custom property to recognize the custom items
			for (i in settings.contextMenuItems) {
				settings.contextMenuItems[i].custom = true;
			}

			// Merge the default context items with custom
			contextMenuItems = contextMenuItems.concat(settings.contextMenuItems);
		}
	}
	/*
		Process add event and build the out on AJAX
	*/
	function onLoad() {
		//Restore the prev state
		restoreState();

		// Create the HTML core using exist element or create new
		if (!$(idName)) {
			imgLibElement = createElement('div');
			document.getElementsByTagName('body')[0].appendChild(imgLibElement);
		} else {
			imgLibElement = $(idName);
		}
		// Set the property CSS class name
		addClass(imgLibElement, 'imgLib');

		// For IE add special class
		if (isIE6 && !isOpera) {
			addClass(imgLibElement, 'ie');
		}

		// Clear element
		imgLibElement.innerHTML = '';
/*
		var mDivHeight = getElPos(imgLibElement);
		mDivHeight = mDivHeight.height;
*/
		tulbarElement = createElement('div', {className: 'tulbar'});
		fileListElement = createElement('div', {className: 'fileList'});
		imgLibElement.appendChild(tulbarElement);
		imgLibElement.appendChild(fileListElement);


		// Add events to elements
		addEvent(imgLibElement, 'click', hideContextMenu);

		// Context menu
		addEvent(fileListElement, 'click', function (evt) {
			evt = fixEvent(evt);
			if (evt.shiftKey) {
				showContextMenu(evt);
				cancelEvent(evt);
			} else {
				selectFile(evt);
			}
		});

		// Tooltips events
		addEvent(fileListElement, 'mouseover', onTooltipsEvent);
		addEvent(fileListElement, 'mousemove', showTooltips);
		addEvent(fileListElement, 'mouseout', hideTooltips);

		addEvent(fileListElement, 'contextmenu', showContextMenu);
		// Context menu in opera if enable capture mouse right click
		if (isOpera) {
			addEvent(fileListElement, 'mousedown', function (evt) {
				if (evt.which == 3) {
					showContextMenu(evt);
				}
			});
		}
		addEvent(window, 'resize', fixFileListHeight);


		// HTML5 Drag & Drop Support
		if (isHTML5DragAndDropSupport) {
			// Insert the drop target layer to page
			dropTarget = createElement('div', {className: 'droptarget', innerHTML: messages.dropTargetText});
			imgLibElement.appendChild(dropTarget);
			// Hide the drop layer
			addClass(dropTarget, 'hide');


			// Add events to accept draggable files

			// Add event to the document
			// When the mouse is first moved over an document while a drag is occuring - check the drag type and if is file - show the drop layer
			addEvent(window, 'dragenter', function(e) {
				cancelEvent(e);
				if (isLinux && isFirefox) {
					remClass(dropTarget, 'hide');
				} else {
					var dt = e.dataTransfer;
					if (!!dt) {
						// Check the drop type to show drop layer
						if (dragFileCheck(dt.types)) {
							remClass(dropTarget, 'hide');
						} else {
							addClass(dropTarget, 'hide');
						}
					}
				}
			});
			// If mouse leave the document and it off the document body - hide the drop layer
			addEvent(window, 'dragleave', function(e) {
				//cancelEvent(e);
				// Check the cursor position, if it not on document - hide the drop layer
				if (e.pageX <= 0 || e.pageY <= 0) {
					addClass(dropTarget, 'hide');
				}
			});
			// Prevent the drop outside the drop layer - cancel event, and indicate
			addEvent(window, 'dragover', function(e) {
				cancelEvent(e);
				if (!(isLinux && isFirefox)) {
					var dt = e.dataTransfer;
					if (!!dt) {
						// Show stop mouse cursor on drag
						dt.dropEffect = 'none';
					}
				}
			});
			// In linux version of Mozilla Firefox the document.ondragover event work incorrect
			if (isLinux && isFirefox) {
				addEvent(document, 'drop', function(e) {
					cancelEvent(e);
					addClass(dropTarget, 'hide');
				});
			}

			// Add event to the drop layer
			// Highlight the element when mouse first move above them
			addEvent(dropTarget, 'dragenter', function(e) {
				cancelEvent(e);
				if (isLinux && isFirefox) {
					addClass(dropTarget, 'hover');
				} else {
					var dt = e.dataTransfer;
					if (!!dt) {
						// Check the drop type
						if (dragFileCheck(dt.types)) {
							// Highligt the drop layer
							addClass(dropTarget, 'hover');
						}
					}
				}
			});
			// Hide highlight when mouse leave the drop layer
			addEvent(dropTarget, 'dragleave', function(e) {
				cancelEvent(e);
				remClass(dropTarget, 'hover');
				// Check the cursor position, if it not on document - hide the drop layer
				if (e.pageX <= 0 || e.pageY <= 0) {
					addClass(dropTarget, 'hide');
				}
			});
			// When mouse move over the drag layer - then check the drag type
			addEvent(dropTarget, 'dragover', function(e) {
				cancelEvent(e);
				// For WebKit based browsers (Apple Safari & Google Chrome) set special flag
				if (!(isLinux && isFirefox) && isWebkit) {
					var dt = e.dataTransfer;
					if (!!dt) {
						// Check the drop type
						if (dragFileCheck(dt.types)) {
							//dt.dropEffect = 'copy';
						}
					}
				}
			});
			// Process the drop event, and if drop file - display it list
			addEvent(dropTarget, 'drop', function(e) {
				// Hide the drop layer
				addClass(dropTarget, 'hide');
				cancelEvent(e);

				var dt = e.dataTransfer;
				if (!!dt && dragFileCheck(dt.types)) {
					// Check files
					if (!!dt.files) {
						// Add files to queue
						addFilesToQueue(dt.files);

						// if upload form not curently show - show it
						if (!uploadFormShow) {
							showUploadForm();
						}
						// Process upload the new added files
						sendFiles();
					}
				}
			});
		}

		// Bind keyboard shorcuts
		if (bindKeys) {
			addEvent(document, 'keydown', function (evt) {
				evt = fixEvent(evt);
				if ((evt.keyCode == 113) && enableRename) {
					// Rename file on 'F2'
					renameFileObj();
				} else if ((evt.keyCode == 118) && enableCreateDir) {
					// Create directory on 'F7'
					createDirectory();
				} else if ((evt.keyCode == 45) && enableUpload) {
					// Show upload form on 'Insert' if upload is enabled
					showUploadForm();
				} else if (evt.ctrlKey) {
					// Combinations with Ctrl key
					if ((evt.keyCode == 88) && enableFileOperation) {
						// Cut file on 'Ctrl+X'
						saveInFileBuffer(true);
					} else if ((evt.keyCode == 67) && enableFileOperation) {
						// Copy file on 'Ctrl+C'
						saveInFileBuffer();
					} else if ((evt.keyCode == 86) && enableFileOperation) {
						// Paste file on 'Ctrl+V'
						pasteFromFileBuffer();
					} else if (evt.keyCode == 13) {
						// Open file in new window on 'Ctrl+Enter'
						openFileInList();
					}
				} else if ((evt.keyCode == 46) && enableDelete) {
					// Delete element on 'Del'
					removeFileObj();
				} else if ((evt.keyCode == 13) && onDblSelect && (contextElement.type == 2)) {
					// Combinations with "Enter" key
					if ((evt.shiftKey) && getFileProperties(contextElement.index).thmbPath) {
						// Choose file thumbnails if available and if file is selected on 'Shift+Enter'
						var file = getFileProperties(contextElement.index);
						file.path = file.thmbPath;
						onDblSelect(file);
					} else {
						// Choose file if is selected on 'Enter'
						onDblSelect(getFileProperties(contextElement.index));
					}
				}
			});
		}
/*
		addEvent(document, 'click', hideContextMenu);

*/
		// Start check the window hash
		if (historyNavigation) {
			if ('onhashchange' in window) {
				// The browser supports the hashchange event
				addEvent(window, 'hashchange', hashCheck);
			} else {
				// Else - use older tehcnick
				//hashCheckTimer =
				setInterval(hashCheck, hashRecheckInterval * 1e3);
			}
		}

		// Load start dir content
		getDirContent(curPath);

		// Set imgLIb to ready
		ready = true;
	}
	/*
		Initialise context menu - build a root element
	*/
	function initContextMenu() {
		contextMenuElement = createElement('div', {className: 'contextMenu'});
		imgLibElement.appendChild(contextMenuElement);
	}
	/*
		Show context menu on event "evt"
	*/
	function showContextMenu(evt) {
		// If upload form show - not show the context menu
		if (!!uploadFormShow) {
			return;
		}
		// If context menu element not exist - create it
		if (!contextMenuElement) {
			initContextMenu();
		}

		hideTooltips();
		// Clear context menu
		contextMenuElement.innerHTML = '';

		// Determine the type of element on context
		contextElement = getSelectdElelementInfo(evt);
		if (contextElement.type == 2) {
			highlightFileItem(contextElement.index);
		}
		buildContextMenu();
		// Show context menu with time out
		//setTimeout(function() {
			contextMenuElement.style.display = 'block';
			fixMouseEventElementPosition(evt, contextMenuElement, 0);
		//	}, 20);
		//contextMenuElement.style.display = 'block';
		cancelEvent(evt);
	}
	/*
		Hide context menu
	*/
	function hideContextMenu() {
		if (contextMenuElement) {
			contextMenuElement.style.display = 'none';
		}
	}
	/*
		Bild the out of context menu
	*/
	function buildContextMenu() {
		var
			isElementSelected = (contextElement.type == 1 || contextElement.type == 2) ? true : false, // Check if element is selected, not empty space
			isCanPaste = (!!fileBuffer && (contextElement.type != 2) && ((!isElementSelected && !!dirContent.inf.isWritable) || (contextElement.type == 1))) ? true: false, // Check if can paste - if have it and target is not file and is empty space with writable dir or its is folder
			listElement = createElement('ul'), // Context menu list element
			i,
			len,
			separatorBeforeCustom // is separator show before the custom item(s)
		;

		// Add elements to context menu
		for (i = 0, len = contextMenuItems.length; i < len; i++) {
			// Check the show property
			if ((('show' in contextMenuItems[i]) && (typeof contextMenuItems[i].show == 'function') ? contextMenuItems[i].show(contextElement, isCanPaste, isElementSelected, dirContent.inf.isWritable) : !!contextMenuItems[i].show) || !('show' in contextMenuItems[i])) {

				// Add separator on begin of users items
				if (!separatorBeforeCustom && !!contextMenuItems[i].custom) { // or ('custom' in contextMenuItems)
					separatorBeforeCustom = 1;
					listElement.appendChild(addToContextMenu());
				}

				listElement.appendChild(
					addToContextMenu(
						contextMenuItems[i].text,
						contextMenuItems[i].handle,
						contextMenuItems[i].cssClass,
						(('disabled' in contextMenuItems[i]) ?
							(
								(typeof contextMenuItems[i].disabled == 'function') ?  contextMenuItems[i].disabled(
									contextElement,
									isCanPaste,
									isElementSelected,
									dirContent.inf.isWritable
								) : !!contextMenuItems[i].disabled
							) : false
						),
						contextMenuItems[i].defaultItem,
						contextMenuItems[i].hotkeyText
					)
				);
			}
		}

		contextMenuElement.appendChild(listElement);
	}
	/*
		Return element to add to context menu
			@itemText - displayed text
			@action - handle to the JS function executed on click
			@className - css class name on displayed item
			@disabled - disable this item
			@defaultItem - this item is default action
			@hotkeyText - text with hot key assigned to this action
	*/
	function addToContextMenu(itemText, action, cssClass, disabled, defaultItem, hotkeyText) {
		var
			listItemElement = createElement('li', {className: (((disabled) ? ' disabled' : '') + ((defaultItem) ? ' default' : ''))}), // List item li element
			iconElement = createElement('div', {className: 'icon ' + ((typeof cssClass == 'function') ? cssClass() : (cssClass || ''))}), // Item icon element
			nameElement = createElement('div', {innerHTML: itemText, className: 'name'}), // Item name span element
			hotkeyElement = createElement('span', {innerHTML: hotkeyText, className: 'hotkey'}) // Item hotkey span element
		;

		// If text not specified then insert a separator
		if (!itemText) {
			// Overwrite the class name to "separator"
			listItemElement.className = 'separator';
		} else {
			// Add events
			// Internet Explorer dont understant the ":hover" pseudo class
			if (isIE6) {
				addEvent(listItemElement, 'mouseover', function () {addClass(listItemElement, 'hover');});
				addEvent(listItemElement, 'mouseout', function () {remClass(listItemElement, 'hover');});
			}
			// If item not disabled and action is specified
			if (!disabled && action) {
				addEvent(listItemElement, 'click', function (evt) {hideContextMenu(); action(evt);});
			}

			// Build the menu item
			listItemElement.appendChild(iconElement);
			listItemElement.appendChild(nameElement);
			// If hotkey text is present - add hotkey element
			if (!!hotkeyText) {
				listItemElement.appendChild(hotkeyElement);
			}
		}
		// Return the created element
		return listItemElement;
	}
	/*
		Get the information of element on context event 'target' and return the object
	*/
	function getSelectdElelementInfo(target) {
		// Get the event target element
		target = (fixEvent(target)).target;
		var
			targetType,
			targetIndex,
			targetName
		;
		// For Safari
		if (target.nodeType == 3) {
			target = target.parentNode;
		}

		// Find item index
		while (target && target.parentNode && !('index' in target)) {
			target = target.parentNode;
		}

		// The element has the required property, so this is our client
		if ('index' in target) {
			targetType = target.itemType;
			targetIndex = target.index;
			// We check targetIndex, because in the folder tree it can be less than zero, and it is impossible for the array index
			targetName = (targetType == 1) ? ((targetIndex >= 0) ? dirContent.dirs[targetIndex].name : '') : ((targetType == 2) ? dirContent.files[targetIndex].name : '');
		} else {
			targetType = -1;
		}
		return {type: targetType, index: targetIndex, name: targetName, time: (new Date()).getTime(), target: target};
	}
	/*
		Create the object with extended propertys of selectd file
	*/
	function getFileProperties(index) {
		if (dirContent.files[index]) {
			var fileProperties = extend({}, dirContent.files[index]);
			// Generate additional field
			// Local path containts the safe to use as innerHTML path to file
			fileProperties.localPath = ('/' + ((dirContent.path.length > 0) ? dirContent.path.join('/') + '/' : '')) + fileProperties.name;
			fileProperties.path = getURIEncPath(HTMLDecode(uploadPath + curPath + fileProperties.name));

			// Add the human size of file
			fileProperties.humanSize = getHumanSize(fileProperties.filesize, messages.fileSizeDim);

			// If thumbnail exist, set the www path to him
			if (fileProperties.thmb && fileProperties.thmb !== '') {
				fileProperties.thmbPath = getURIEncPath(HTMLDecode(thmbPath + curPath + thmbDir + '/' + fileProperties.thmb));
			}
			return fileProperties;
		}
	}
	/*
		Rename file object
	*/
	function renameFileObj() {
		// Check if rename is posible
		if (!dirContent.inf.isWritable) {
			return alert(messages.writeProtect);
		}

		var
			oldName = HTMLDecode(contextElement.name),
			fileExt,
			newName
		;
		if (oldName && oldName != '') {
			if (contextElement.type == 2) {
				// Remove file extension
				oldName = oldName.split('.');
				// Delete last item of array - file extension, and return it
				fileExt = oldName.pop();
				oldName = oldName.join('.');
			}
			;

			if (newName = prompt(sprintf(messages.enterNewNameWOExt, HTMLDecode(contextElement.name)), oldName)) {
				if (newName != oldName) {
					// Get the new file name with extension
					if (contextElement.type == 2) {
						newName = newName + '.' + fileExt;
					}
					showLoading();
					sendXMLHttpReq(reqURL, {
						mode: 'POST',
						parameters: 'cmd=rename&src=' + encodeURIComponent(curPath + contextElement.name) + '&new_name=' + encodeURIComponent(newName),
						onsuccess: function (req) {
							hideLoading();
							// Get result code of operation
							var result = (JSON.parse(req.responseText)).result;
							if (result != 0) {
								alert(sprintf(messages.operationFailed, result));
							}
							getDirContent(curPath);
						}
					});
				} else {
					alert(messages.noChange);
				}
			}
		}
	}
	/*
		Remove file object
	*/
	function removeFileObj() {
		// Check if remove is posible
		if (!dirContent.inf.isWritable) {
			return alert(messages.writeProtect);
		}

		var
			objName = HTMLDecode(contextElement.name),
			confirmMsg = sprintf((((contextElement.type == 1) && (dirContent.dirs[contextElement.index].empty == '0')) ? messages.delNonEmptyDir : messages.delFile), objName) // Check if folder is not empty and select property messages
		;
		if (objName && objName != '') {
			if (confirm(confirmMsg)) {
				showLoading();
				sendXMLHttpReq(reqURL, {
					mode: 'POST',
					parameters: 'cmd=rm&dst=' + encodeURIComponent(curPath + objName) + '&rec=1',
					onsuccess: function (req) {
						hideLoading();
						// Get result code of operation
						var result = (JSON.parse(req.responseText)).result;
						if (result != 0) {
							alert(sprintf(messages.operationFailed, result));
						}
						getDirContent(curPath);
					}
				});
			}
		}
	}
	/*
		Create a new directory
	*/
	function createDirectory() {
		// Check if create dir is posible
		if (!dirContent.inf.isWritable) {
			return alert(messages.writeProtect);
		}

		var newDir = prompt(messages.enterNewDirName, messages.defaultNewDirName);
		if (newDir) {
			showLoading();
			sendXMLHttpReq(reqURL, {
				mode: 'POST',
				parameters: 'cmd=mkdir&dst=' + encodeURIComponent(curPath) + '&name=' + encodeURIComponent(newDir),
				onsuccess: function (req) {
					hideLoading();
					// Get result code of operation
					var result = (JSON.parse(req.responseText)).result;
					if (result != 0) {
						alert(sprintf(messages.operationFailed, result));
					}
					getDirContent(curPath);
				}
			});
		}
	}
	/*
		Do sompfing in slected filelist element
		@evt - event object
	*/
	function selectFile(evt) {
		var lastFile = {};
		if (contextElement && (contextElement.type == 2)) {
			lastFile = contextElement;
		}
		contextElement = getSelectdElelementInfo(evt);
		if ((contextElement.type == 1) && enableBrowseSubdir) {
			// If select directory then open the directory
			// if index >= 0 then select subfolde, if index < 0 - then select up folder
			if (contextElement.index >= 0) {
				getDirContent(curPath + contextElement.name + '/');
			} else {
				var sliceEnd = dirContent.path.length + contextElement.index + 1;
				// Delete the path end array item, and join it by "/". If delete all item - skip join
				getDirContent('/' + ((sliceEnd > 0) ? dirContent.path.slice(0, sliceEnd).join('/') + '/' : ''));
			}
		} else if (contextElement.type == 2) {
			// Іf select the file then highlight and execute the external functions with the file properties
			highlightFileItem(contextElement.index);
			// If set the external function - then execute it
			if (onSelect || onDblSelect) {
				var file = getFileProperties(contextElement.index);
				if (onSelect) {
					onSelect(file);
				}
				// If double click on file then chose them by onDblSelect() function
				if ( onDblSelect && (lastFile.index == contextElement.index) && ((contextElement.time - lastFile.time) < dbclickDelay) ) {
					onDblSelect(file);
				}
			}
		} else {
			// No selections

			// Clean the highlight
			highlightFileItem();
			// Hide the tooltips
			hideTooltips();
			// If set the external function - then execute it
			if (onDeselect) {
				onDeselect();
			}
		}
	}
	/*
		Browse slected directory
	*/
	function browseDirectory() {
		if (contextElement.type == 1) {
			getDirContent(curPath + contextElement.name + '/');
		}
	}
	/*
		Open slected file
	*/
	function openFileInList() {
		if (contextElement.type == 2) {
			window.open(getURIEncPath(HTMLDecode(uploadPath + curPath + contextElement.name)), '_blank');
		}
	}
	/*
		Save information about selectd files or dir for copy or move
		@move - (boolean) cut the file or dir
	*/
	function saveInFileBuffer(move) {
		// Save only the selected elements
		if (contextElement.type == 1 || contextElement.type == 2) {
			// Update the object with information about selected file to copy/move
			fileBuffer = {cmd: ((move && (!!dirContent.inf.isWritable)) ? 'move' : 'copy'), name: curPath + contextElement.name};
			saveState();
		}
	}
	/*
		Paste file or folder from bufer fileBuffer
	*/
	function pasteFromFileBuffer() {
		if (!!fileBuffer) {
			// Check if paste is posible
			if (!dirContent.inf.isWritable) {
				return alert(messages.writeProtect);
			}

			showLoading();
			sendXMLHttpReq(reqURL, {
				mode: 'POST',
				parameters: 'cmd=' + fileBuffer.cmd + '&src=' + encodeURIComponent(fileBuffer.name) + '&dst=' + encodeURIComponent(curPath + ((contextElement.type == 1) ? contextElement.name : '')), // If dir selected - paste into it
				onsuccess: function (req) {
					hideLoading();
					// Get result code of operation
					var result = (JSON.parse(req.responseText)).result;
					if (result != 0) {
						alert(sprintf(messages.operationFailed, result));
					}
					// Clean the object
					fileBuffer = null;
					// Update the state
					saveState();

					getDirContent(curPath);
				}
			});
		}
	}
	/*
		Save information about file object and curent dir to cookies or sesionStorage
	*/
	function saveState() {
		// String with saved information
		var infoString = [encodeURIComponent(curPath), encodeURIComponent(viewType), sortType, sortOrder, ((!!fileBuffer) ? encodeURIComponent([encodeURIComponent(fileBuffer.cmd), encodeURIComponent(fileBuffer.name)].join(',')) : '')].join();

		// Use sessionStorage or localStorage if available otherwise - use cookies
		if (isStorage) {
			// Save current state
			((!!bSaveState) ? localStorage : sessionStorage).setItem(saveInfCookie, infoString);
		} else if (!!bSaveState) {
			// Save the cookies
			setCookie(saveInfCookie, infoString);
		}
		if (historyNavigation) {
			// Get current hash object
			var hash = (getURLArg()).hash;
			// Update value
			hash.path = encodeURI(curPath);
			// Set location hash
			setLocationHash(hash);
		}

/* 		if (updateTitle) {
			// Update the window title to indicate the navigation progress
			document.getElementsByTagName('title')[0].innerHTML = sprintf('imgLib v.%1 - /%2', version, ((dirContent.path.length > 0) ? (dirContent.path.join('/') + '/') : ''));
		} */
	}
	/*
		Restore information about file object and curent dir from cookies or sesionStorage
	*/
	function restoreState() {
		// String with saved information
		var infoString;
		// Use sessionStorage or localStorage if available otherwise - use cookies
		if (isStorage) {
			infoString = ((!!bSaveState) ? localStorage : sessionStorage).getItem(saveInfCookie);
			//infoString = sessionStorage.getItem(saveInfCookie);
		} else if (!!bSaveState) {
			infoString = getCookie(saveInfCookie);
		}

		// Restore current path from location hash
		if (historyNavigation) {
			// Update the current path if it changed in location hash
			hashCheck(0,1);
		}
		
		if (!!infoString && infoString.length > 0) {
			infoString = infoString.split(',');
			if ((infoString[0].length > 0) && (infoString[0] != '/')) {
				curPath = decodeURIComponent(infoString[0]);
			}
			// Restore the view type
			viewType = decodeURIComponent(infoString[1]);

			// Restore the sorting state
			sortType = parseInt(infoString[2]);
			sortOrder = parseInt(infoString[3]);

			// If file buffer is empty and exist in saved info - try to restore previous value
			if (!fileBuffer && !!infoString[4]) {
				infoString = decodeURIComponent(infoString[4]).split(',');
				fileBuffer = {cmd: decodeURIComponent(infoString[0]), name: decodeURIComponent(infoString[1])};
			}
		}
	}
	/*
		Check the location hash and get the dir content if change
		@evt - Event object
		@updateOnly - dont change the current directory to new. Just update the current dir.
	*/
	function hashCheck(evt, updateOnly) {
		// String with saved information
		var pathFromHash = (getURLArg()).hash.path;

		// If the received path from hash is not empty and not equal to current path - goto to new location
		if (!!pathFromHash && (pathFromHash.length > 0) && ((pathFromHash = decodeURI(pathFromHash)), (pathFromHash !== curPath))) {
			if (!!updateOnly) {
				curPath = pathFromHash;
			} else {
				getDirContent(pathFromHash);
			}
		}
	}
	/*
		Get content of dir
		@path - relative path to directory
	*/
	function getDirContent(path) {
		showLoading();
		contextElement = {};
		path = HTMLDecode(path || curPath);
		sendXMLHttpReq(reqURL + ((reqURL.indexOf('?') != -1) ? '&' : '?') + 'cmd=list&src=' + encodeURIComponent(path), {
			mode: 'GET',
			//parameters: ,
			onsuccess: function (req) {
				dirContent = JSON.parse(req.responseText.substr(9));
				updateHTML();
				hideLoading();
			}
		});
	}
	/*
		Reload curent dir
	*/
	function reloadDirContent() {
		getDirContent(curPath);
	}
	/*
		Upate the HTML from the curent dir object
	*/
	function updateHTML() {
		var
			path = dirContent.path,
			treeMargin = 1,
			folderTreeElement = createElement('div', {className: 'folderTree'}),
			folderTreeBox = createElement('div', {className: 'box'}),
			dirs = dirContent.dirs,
			files = dirContent.files,
			buttonsEl = createElement('div', {className: 'controls'}), // Clean the tulbar buttons
			folderTreeLabel = createElement('div', {className: 'label curent'}), // Label to indicate the folder tree
			folderTreeLabelIcon = createElement('div', {className: 'icon openFolder'}), // Icon on folder tree label
			folderTreeExpandIcon = createElement('div', {className: 'icon dropDown'}), // Icon to show possibility to expand folder tree
			folderTreeLabelText = createElement('span'), // Label with current dir name
			folderTree = createElement('ul', {className: 'tree'}), // Folder tree elements
			updirEl,
			chViewElement = createElement('div', {className: 'contextMenu'}),
			listElement, // Generaly list element uses in work
			sortElement = createElement('div', {className: 'contextMenu'}), // Sort files element
			searchElement = createElement('div', {className: 'searchBox', innerHTML: messages.enterSearch}), // Create search element
			inputElement = createElement('input', {type: 'text'}), // Create search input element
			i,
			len
		;

		// Initialise the varitables
		curPath = '/';

		// Hide element to speed up
		tulbarElement.style.display = 'none';
		fileListElement.style.display = 'none';

		// Clear the tulbar element
		tulbarElement.innerHTML = '';

		// Set the initial state of folder treen expand state
		folderTreeExpanded = false;

		// Add event to show and hide folder tree
		addEvent(folderTreeLabel, 'click', function(evt) {
			hideContextMenu();
			hideTooltips();
			//cancelEvent(evt);
			if (folderTreeExpanded) {
				remClass(folderTreeElement, 'expanded');
			} else {
				addClass(folderTreeElement, 'expanded');
			}
			// Toggle the state of expanded
			folderTreeExpanded = !folderTreeExpanded;
		});
		addEvent(folderTreeElement, 'mouseover', function () {clearTimeout(treeTimer); hideTooltips();});
		addEvent(folderTreeElement, 'mouseout', function () {
			treeTimer = setTimeout(function () {
				remClass(folderTreeElement, 'expanded');
				// Toggle the state of expanded
				folderTreeExpanded = !folderTreeExpanded;
			}, tooltipsDelay);
		});


		// If path.length = 0 -> the root dir, else - some subdir
		if (path.length == 0) {
			folderTreeLabelText.innerHTML = messages.rootPathName;
			folderTreeLabel.title = '/';
		} else {
			folderTreeLabelText.innerHTML = truncateName(path[path.length - 1]);
			folderTreeLabel.title = HTMLDecode(path[path.length - 1]);
		}
		// Build the folder tree label
		folderTreeLabel.appendChild(folderTreeLabelIcon);
		folderTreeLabel.appendChild(folderTreeLabelText);
		folderTreeLabel.appendChild(folderTreeExpandIcon);

		// Generate the folder tree
		addEvent(folderTree, 'click', function (evt) {selectFile(evt);});

		if (path.length > 0) {
			for (i = 0, len = path.length; i < len; i++) {
				// Generate the up dir button
				if (i == len - 1) {
					// Using clousure to save path to current folder in loop
					updirEl = createTulbarButton(messages.moveToUpDir, (function (dir) {return function () {return getDirContent(dir);};})(curPath), 'upFolder');
				}
				curPath += path[i] + '/';
				// Create the root element
				if (i == 0) {
					folderTree.appendChild(createFolderTreeElement(messages.rootPathName, '/', -(len + 1), 'openFolder', 0));
				}
				folderTree.appendChild(createFolderTreeElement(truncateName(path[i]), path[i], i - len, 'openFolder' + ((i == len - 1) ? ' curent':''), treeMargin++, ((i == len - 1) ? ' curent':'')));
			}
		}
		curPath = HTMLDecode(curPath);

		// Sort items
		// Normalize the sort type and direction
		/*
		sortType = (sortType > 3 || sortType <1) ? 1 : sortType;
		sortOrder = (sortOrder != 1) ? 0 : 1;
		*/

		// Dirs sort only by date or name
		dirs = dirs.sort(function (a, b) {
			if (sortType == 3) {
				// Sort by date
				return a.date - b.date;
			} else {
				// Sort by file name
				return ((a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0));
			}
		});

		files = files.sort(function (a, b) {
			if (sortType == 2) {
				// Sort by file size
				return a.filesize - b.filesize;
			} else if (sortType == 3) {
				// Sort by date
				return a.date - b.date;
			} else {
				// Sort by file name
				return ((a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0));
			}
		});

		// If ordering is desc then reverse the arrays
		if (!!sortOrder) {
			dirs.reverse();
			files.reverse();
		}

		// Add current dirs to folder tree
		for (i = 0; i < dirs.length; i++) {
			// Hide the thumbnail directory
			if (dirs[i].name != thmbDir) {
				folderTree.appendChild(createFolderTreeElement(truncateName(dirs[i].name), dirs[i].name, i, ((dirs[i].empty == 0) ? 'full':''), treeMargin));
			}
		}
		// Build the folder tree

		folderTreeBox.appendChild(folderTreeLabel);
		folderTreeBox.appendChild(folderTree);
		folderTreeElement.appendChild(folderTreeBox);

		/*
			End folder tree
		*/

		// Button controls

		// Append if exist the updir element who createw earlier if (path.length > 0)
		if (!!updirEl) {
			buttonsEl.appendChild(updirEl);
		}
		// Reload Folder
		buttonsEl.appendChild(createTulbarButton(messages.reloadDir, reloadDirContent, 'reload'));

		// Create element to change view of file list
		listElement = createElement('ul');
		listElement.appendChild(addToContextMenu(messages.thumbnail, function () {viewType = 'thumbnail'; updateHTML();}, 'viewThumbnail', 0, (viewType == 'thumbnail')));
		listElement.appendChild(addToContextMenu(messages.list, function () {viewType = 'list'; updateHTML();}, 'viewList', 0, (viewType == 'list')));
		listElement.appendChild(addToContextMenu(messages.table, function () {viewType = 'table'; updateHTML();}, 'viewTable', 0, (viewType == 'table')));
		chViewElement.appendChild(listElement);
		buttonsEl.appendChild(createTulbarButton(messages.view, false, 'view', chViewElement));

		// Sort button
		listElement = createElement('ul');
		listElement.appendChild(addToContextMenu(messages.sortByName, function () {sortOrder = (sortType == 1) ? abs(sortOrder - 1) : 0; sortType = 1; updateHTML();}, 'sort ' + (sortType == 1 ? (!!sortOrder ? 'asc' : 'desc') : 'asc'), 0, (sortType == 1)));
		listElement.appendChild(addToContextMenu(messages.sortBySize, function () {sortOrder = (sortType == 2) ? abs(sortOrder - 1) : 0; sortType = 2; updateHTML();}, 'sort ' + (sortType == 2 ? (!!sortOrder ? 'asc' : 'desc') : 'asc'), 0, (sortType == 2)));
		listElement.appendChild(addToContextMenu(messages.sortByDate, function () {sortOrder = (sortType == 3) ? abs(sortOrder - 1) : 0; sortType = 3; updateHTML();}, 'sort ' + (sortType == 3 ? (!!sortOrder ? 'asc' : 'desc') : 'asc'), 0, (sortType == 3)));
		sortElement.appendChild(listElement);
		buttonsEl.appendChild(createTulbarButton(messages.sort, false, 'sort', sortElement));

		// Search button
		addEvent(inputElement, 'keyup', function () {searchFile(inputElement.value);});
		addEvent(inputElement, 'keypress', function () {searchFile(inputElement.value);});
		searchElement.appendChild(inputElement);
		buttonsEl.appendChild(createTulbarButton(messages.search, false, 'search', searchElement));

		// Create Folder
		if (enableCreateDir) {
			buttonsEl.appendChild(createTulbarButton(messages.newDir, createDirectory, 'newFolder'));
		}

		// Upload button - check if upload is enabled
		if (enableUpload) {
			buttonsEl.appendChild(createTulbarButton(messages.upload + (bindKeys ? '&nbsp;(Insert)' : ''), showUploadForm, 'upload'));
		}

		// Create the filelist
		createFileList();

		// Final build the tulbar
		tulbarElement.appendChild(folderTreeElement); // Add folder tree
		tulbarElement.appendChild(buttonsEl); // Add tulbar buttons

		// Visualise the changes
		tulbarElement.style.display = '';
		fileListElement.style.display = '';

		// Adjust the height of file list element
		fixFileListHeight();

		saveState();
	}
	/*
		Create the file or folder list from curent dir content or acepted dirContent
		@custumDirContent - some dir content to show
	*/
	function createFileList(custumDirContent) {
		var
			custumDirContent = custumDirContent || dirContent,
			dirs = custumDirContent.dirs,
			files = custumDirContent.files,
			elementOriginalName,
			rootElement = (viewType != 'table') ? createElement('ul') : createElement('table'), // Root element for filelist items
			i,
			elName
		;

		fileListElement.innerHTML = '';
		rootElement.className = viewType;

		// If set the external function - then execute it
		if (onDeselect) {
			onDeselect();
		}

		hideTooltips();

		// Cheate the table header
		if (viewType == 'table') {
			var
				itemElement = createElement('tr', {className: 'title'}),
				//itemIconElement = createElement('th', {className: 'icons'}),
				itemNameElement = createElement('th', {innerHTML: messages.fileName}),//(isIE6) ?
				itemSizeElement = createElement('th', {innerHTML: messages.size}),
				itemFileDateElement = createElement('th', {innerHTML: messages.date}),
				colgrupElement = createElement('colgroup'),
				colElement,
				sortIcon = createElement('div', {className: ('icon sort ' + (!!sortOrder ? 'desc' : 'asc'))})
			;

			// Add sort functions
			addEvent(itemNameElement, 'click', function (e) {sortOrder = (sortType == 1) ? abs(sortOrder - 1) : 0; sortType = 1; updateHTML(); cancelEvent(e);});
			addEvent(itemSizeElement, 'click', function (e) {sortOrder = (sortType == 2) ? abs(sortOrder - 1) : 0; sortType = 2; updateHTML(); cancelEvent(e);});
			addEvent(itemFileDateElement, 'click', function (e) {sortOrder = (sortType == 3) ? abs(sortOrder - 1) : 0; sortType = 3; updateHTML(); cancelEvent(e);});
			// Add visual efect to sorted colum
			if (sortType == 3) {
				//itemFileDateElement.className = 'sort';
				itemFileDateElement.appendChild(sortIcon);
			} else if (sortType == 2) {
				//itemSizeElement.className = 'sort';
				itemSizeElement.appendChild(sortIcon);
			} else {
				//itemNameElement.className = 'sort';
				itemNameElement.appendChild(sortIcon);
			}
			for (i = 1; i < 4; i++) {
				colElement = createElement('col');
				if (i == sortType) {
					colElement.className = 'sorted';
				}
				colgrupElement.appendChild(colElement);
			}
			rootElement.appendChild(colgrupElement);
			// Special for M$, IE dont display table without tbody element
			rootElement.appendChild(createElement('tbody'));

			//itemElement.appendChild(itemIconElement);
			itemElement.appendChild(itemNameElement);
			itemElement.appendChild(itemSizeElement);
			itemElement.appendChild(itemFileDateElement);

			rootElement.lastChild.appendChild(itemElement);
		}

		// Create the filelist
		/*
			Folders
		*/
		for (i = 0; i < dirs.length; i++) {
			// Skip if invalid item (example: on search not valid items is skiped)
			if (!dirs[i]) {
				continue;
			}
			elementOriginalName = dirs[i].name;
			// Hide the thumbnail directory
			if (elementOriginalName != thmbDir) {
				elName = truncateName(elementOriginalName);
				var
					itemElement = (viewType == 'table') ? createElement('tr') : createElement('li'),
					iconElement = createElement('div', {className: ('icon folder' + ((dirs[i].empty == 0) ? ' full' : ''))})
				;

				itemElement.title = HTMLDecode(elementOriginalName);
				// On hover animation for IE
				if (isIE6) {
					addEvent(itemElement, 'mouseover', (function (a) { return function() {addClass(a, 'hover')}})(itemElement));
					addEvent(itemElement, 'mouseout', (function (a) { return function() {remClass(a, 'hover')}})(itemElement));
				}

				if (viewType == 'thumbnail') {//margin: 0 auto;
					itemElement.innerHTML = '<div class="image"></div><div class="name">' + elName + '</div>';
					itemElement.firstChild.appendChild(iconElement);
				} else if (viewType == 'table') {
					var
						//itemIconElement = createElement('td'),
						nameContainer = createElement('span', {innerHTML: elName}),
						itemNameElement = createElement('td'),
						itemSizeElement = createElement('td'),
						itemFileDateElement = createElement('td', {innerHTML: (getDateF(dirs[i].date * 1000, 1))})
					;
					//itemIconElement.appendChild(iconElement);
					itemNameElement.appendChild(iconElement);
					itemNameElement.appendChild(nameContainer);
/*					Size for folders not calculated
					itemSizeElement.innerHTML = '';
*/

					//itemElement.appendChild(itemIconElement);
					itemElement.appendChild(itemNameElement);
					itemElement.appendChild(itemSizeElement);
					itemElement.appendChild(itemFileDateElement);
				} else {
					itemElement.innerHTML += elName;
					itemElement.insertBefore(iconElement, itemElement.firstChild);
				}

				// Append attribute to identificate the items
				itemElement.index = i;
				itemElement.itemType = 1;
				// Append to the file list
				if (viewType == 'table') {
					rootElement.lastChild.appendChild(itemElement);
				} else {
					rootElement.appendChild(itemElement);
				}
			}
		}

		/*
			Files
		*/
		if (files.length > 0) {
			for (i = 0; i < files.length; i++) {
				// Skip if invalid item (example: on search not valid items is skiped)
				if (!files[i]) continue;
				elementOriginalName = files[i].name;
				var
					ext = elementOriginalName.substring(elementOriginalName.lastIndexOf('.') + 1).toLowerCase(),
					itemElement = (viewType == 'table') ? createElement('tr') : createElement('li'),
					iconElement = createElement('div', {className: ('icon files ' + ext), style: {styleFloat: 'left'}})
				;
				elName = truncateName(elementOriginalName);

				// On hover animation for IE
				if (isIE6) {
					addEvent(itemElement, 'mouseover', (function (a) { return function() {addClass(a, 'hover')}})(itemElement));
					addEvent(itemElement, 'mouseout', (function (a) { return function() {remClass(a, 'hover')}})(itemElement));
				}
				/*
				// Add events
				addEvent(itemElement, 'mouseover', onTooltipsEvent);
				addEvent(itemElement, 'mousemove', showTooltips);
				addEvent(itemElement, 'mouseout', hideTooltips);

				// Add events to icon element
				addEvent(iconElement, 'mouseover', onTooltipsEvent);
				addEvent(iconElement, 'mousemove', showTooltips);
				addEvent(iconElement, 'mouseout', hideTooltips);
*/
/*				Title no need - tooltips is show
				itemElement.title = HTMLDecode(elementOriginalName);
*/
				if (viewType == 'thumbnail') {
					itemElement.innerHTML += sprintf('<div class="image">%1</div><div class="name">%2</div>', ((files[i].thmb && files[i].thmb != '') ? sprintf('<img class="loading" src="%1" alt="" />', getURIEncPath(HTMLDecode(thmbPath + curPath + thmbDir + '/' + files[i].thmb)), elName) : ''), elName);
					if (!files[i].thmb || files[i].thmb == '') {
						// No thumbnail -> show icon
						itemElement.firstChild.appendChild(iconElement);
					}
				} else if (viewType == 'table') {
					var
						//itemIconElement = createElement('td'),
						nameContainer = createElement('span', {innerHTML: elName}),
						itemNameElement = createElement('td'),
						itemSizeElement = createElement('td', {innerHTML: (getHumanSize(files[i].filesize, messages.fileSizeDim) + ((files[i].img_size) ? (' (' + files[i].img_size + ')') : ''))}),
						itemFileDateElement = createElement('td', {innerHTML: (getDateF(files[i].date * 1000, 1))})
					;
					itemNameElement.appendChild(iconElement);
					itemNameElement.appendChild(nameContainer);

					//itemElement.appendChild(itemIconElement);
					itemElement.appendChild(itemNameElement);
					itemElement.appendChild(itemSizeElement);
					itemElement.appendChild(itemFileDateElement);
				} else {
					itemElement.innerHTML += elName;
					itemElement.insertBefore(iconElement, itemElement.firstChild);
				}

				// Append attribute to identificate the items
				itemElement.index = i;
				itemElement.itemType = 2;

				// Append to the file list
				if (viewType == 'table') {
					rootElement.lastChild.appendChild(itemElement);
				} else {
					rootElement.appendChild(itemElement);
				}
			}
		}
		fileListElement.appendChild(rootElement);
	}
	/*
		Create and return the tulbar button element
		@title - a title property
		@onclick - onclick handle
		@cssClass - css class for button
		@addElement - additional element to insert alfer the icon
	*/
	function createTulbarButton(title, onclick, cssClass, addElement) {
		var
			button = createElement('div', {className: 'btn', title: HTMLDecode(title)}), // Tulbar A element
			buttonIcon = createElement('div', {className: ('icon ' + cssClass)}) // Tulbar a span icon element
		;
		if (typeof onclick == 'function') {
			addEvent(button, 'click', function (evt) {onclick(evt);});
		}

		// Add event to animate the button for IE, other browsers is normal and know about the :hover pseudoclass
		if (isIE6) {
			addEvent(button, 'mouseover', function () {addClass(button, 'hover');});
			addEvent(button, 'mouseout', function () {remClass(button, 'hover');});
		}

		// Append additional element
		if (addElement) {
			button.appendChild(addElement);
		}

		button.appendChild(buttonIcon);

		return button;
	}
	/*
		Create and return the folder tree element
		@name - display name
		@title - a title property
		@index - a array index in dirContent.dirs array
		@cssClass - css class for button
		@margin - style margin-left value in em
		@liCSSClass - css class name for li element
	*/
	function createFolderTreeElement(name, title, index, cssClass, margin, liCSSClass) {
		var
			listItemElement = createElement('li', {className: (liCSSClass || ''), title: HTMLDecode(title), index: index, itemType: 1}), // Folder tree ul item with additonal attribute to identificate the items
			iconElement = createElement('div', {className: ('icon folder ' + cssClass), style: {marginLeft: margin + 'em'}}), // Folder icon element
			nameElement = createElement('span', {innerHTML: name}) // Folder name span element
		;

		// Internet Explorer dont understant the ":hover" pseudo class
		if (isIE6) {
			addEvent(listItemElement, 'mouseover', function () {addClass(listItemElement, 'hover');});
			addEvent(listItemElement, 'mouseout', function () {remClass(listItemElement, 'hover');});
		}

		// Build all
		listItemElement.appendChild(iconElement);
		listItemElement.appendChild(nameElement);

		return listItemElement;
	};
	/*
		Truncate the file or folder name to max length
		@name - original name
		@length - owerwrite the default max lenght value
	*/
	function truncateName(name, length) {
		length = length || maxFileNameLen;
		if (name.length > length) {
			name = name.split('.');
			var ext = name.pop();

			// If extension not too long use new method of truncating
			if (length - ext.length > 5) {
				name = name.join('.').substring(0, length - ext.length - 3) + '...' + ext;
			} else {
				name = (name.join('.') + '.' + ext).substring(0, length - 3) + '...';
			}
		}
		return name;
	}
	/*
		Show the loading indicator
	*/
	function showLoading(noBlock) {
		// Create loading layer at first usage
		if (!ajaxLoadElement) {
			ajaxLoadElement = createElement('div', {className: 'ajaxLoad'});
			var
				overlay = createElement('div', {className: 'overlay'}),
				loadIndicator = createElement('div', {className: 'loadIcon', innerHTML: messages.ajaxLoading})
			;

			ajaxLoadElement.appendChild(overlay);
			ajaxLoadElement.appendChild(loadIndicator);

			imgLibElement.appendChild(ajaxLoadElement);
			setTransparency(overlay, overlayOpacity);
		}
		if (!!noBlock) {
			addClass(ajaxLoadElement, 'noBlock');
		} else {
			remClass(ajaxLoadElement, 'noBlock');
		}
		remClass(ajaxLoadElement, 'hide');
	}
	/*
		Hide the loading indicator
	*/
	function hideLoading() {
		if (ajaxLoadElement) {
			addClass(ajaxLoadElement, 'hide');
		}
	}
	/*
		Save the index of file to show the tooltips
			evt - mouse event
	*/
	function onTooltipsEvent(evt) {
		/*
		 * We must fix the event in addEvent function becose in IE evt is undefinned (single type) and passed to the function saveTooltipsIndex(evt) and showTooltips(evt) by value not by link
		 * but after the fixing the evt is object and passed to the function as link to object
		 */
		evt = fixEvent(evt);
		tooltipsTimer = setTimeout(function() {
			// Save the index of file to show the tooltips
			var targetElement = getSelectdElelementInfo(evt);

			// If selected item is file - continune
			if (targetElement.type == 2) {
				tooltipsItemIndex = targetElement.index;
			} else {
				tooltipsItemIndex = -1;
			}
			showTooltips(evt);
		}, tooltipsDelay);

	}
	/*
		Show file info box
			evt - mouse event
	*/
	function showTooltips(evt) {
		// Create tooltips element if not created yet
		if (!tooltipsElement) {
			tooltipsElement = createElement('div', {className: 'tooltips'});
			imgLibElement.appendChild(tooltipsElement);
		}

		// If tooltips created for diferrent element - recreate it
		if (tooltipsElement.tII !== tooltipsItemIndex) {
			// tII - tooltipsItemIndex
			var
				file = dirContent.files[tooltipsItemIndex],
				overlay = createElement('div', {className: 'overlay'})
			;
			// Check if files is correct
			if (!file) {
				return;
			}
			// Save the index of created element
			tooltipsElement.tII = tooltipsItemIndex;

			// Show it
			tooltipsElement.style.display = '';
			// Clear the tooltips body
			tooltipsElement.innerHTML = '';

			// Append overlay
			tooltipsElement.appendChild(overlay);
			// Set element transparency after it display (I like IE)
			setTransparency(overlay, tooltipOverlayOpacity);

			// Add tooltips body
			tooltipsElement.appendChild(createElement('span', {className: 'body', innerHTML: (((file.thmb && file.thmb !== '') && (viewType != 'thumbnail')) ? sprintf('<img class="loading" src="%1" alt="%2" />', getURIEncPath(HTMLDecode(thmbPath + curPath + thmbDir + '/' + file.thmb)), file.name) : '') + sprintf('<span>%1: %2<br />%3: %4<br />%5: %6 %7</span>', messages.fileName, file.name, messages.fileSize, getHumanSize(file.filesize, messages.fileSizeDim), messages.fileDate, getDateF(file.date * 1000, 1), ((file.img_size) ? ('<br />' + messages.imageSize + ': ' + file.img_size) : ''))}));
		}

		// Fix the position of the tooltips
		fixMouseEventElementPosition(evt, tooltipsElement);
	}
	/*
		Hide file info box
	*/
	function hideTooltips(evt) {
		// Clear the tooltips show timer
		clearTimeout(tooltipsTimer);
		// Set the illegal item index to prevent show tooltips before selected timeout
		tooltipsItemIndex = -1;
		if (tooltipsElement) {
			// Clear last used item
			tooltipsElement.tII = -1;
			// Hide it
			tooltipsElement.style.display = 'none';
		}
	}
	/*
		Fix element position from event to show in window without the scrool bars
		Element must be visible
			evt - mouse event
			element - element to show
			cursorSize - Size in pixels of cursor, default 20

	*/
	function fixMouseEventElementPosition(evt, element, cursorSize) {
		var
			eventPosition = fixEvent(evt),
			winGeom = getWindowGeometry(),
			eventPageX = eventPosition.pageX,
			eventPageY = eventPosition.pageY,
			top = 0,
			left = 0
		;

		if (typeof cursorSize == 'undefined') {
			cursorSize = 20;
		}
		if (eventPageX + element.offsetWidth + cursorSize - winGeom.xOffset > winGeom.width) {
			left = eventPageX - element.offsetWidth - cursorSize;
		} else {
			left = eventPageX;
		}

		if (eventPageY + element.offsetHeight + cursorSize - winGeom.yOffset > winGeom.height) {
			top = eventPageY - element.offsetHeight - cursorSize;
		} else {
			top = eventPageY;
		}

		element.style.top = top + cursorSize + 'px';
		element.style.left = left + cursorSize + 'px';
	}
	/*
		Fix the folder and files list height
	*/
	function fixFileListHeight() {
		var
			imgLibHeight = getElPos(imgLibElement),
			tulbarHeight
		;
		// 2 - top and bottom border height
		imgLibHeight = imgLibHeight.height - 2;
		// Apply height value
		if (imgLibHeight > 0) {
			tulbarHeight = getElPos(tulbarElement);
			tulbarHeight = tulbarHeight.height;

			// Litle trick for ie - its use crolbars -> the -1px for width fire the resize event in loop, and the end -> no scrol bars
			if (isIE6) {
				tulbarHeight++;
			}
			fileListElement.style.height = (imgLibHeight - tulbarHeight) + 'px';
		}
	}
	/*
		Highlight the file items or if not set - then clean
			index - a file index in dirContent.files array
	*/
	function highlightFileItem(index) {
		// Get all elements
		var
			fileItemsElements = fileListElement.getElementsByTagName(((viewType != 'table') ? 'li' : 'tr')),
			i
		;
		// Select the items
		for (i = fileItemsElements.length; i-- > 0;) {
			// First - clear the selection
			remClass(fileItemsElements[i], 'selected');
			// Next check if item must be a selected
			if ((typeof index != 'undefined') && (fileItemsElements[i].itemType == 2) && (fileItemsElements[i].index == index)) {
				addClass(fileItemsElements[i], 'selected');
			}
		}
	}
	/*
		Search file in list by mask
			@mask - file name mask
	*/
	function searchFile(mask) {
		var
			userDirContent = {dirs: [], files: []}, // custum dir content who containt the searced files
			dirs = dirContent.dirs,
			files = dirContent.files,
			i
		;
		if (mask.length > 0) {
			for (i = 0; i < dirs.length; i++) {
				if (dirs[i].name.toLowerCase().indexOf(mask.toLowerCase()) != -1) {
					userDirContent.dirs[i] = dirs[i];
				}
			}
			for (i = 0; i < files.length; i++) {
				if (files[i].name.toLowerCase().indexOf(mask.toLowerCase()) != -1) {
					userDirContent.files[i] = files[i];
				}
			}
			createFileList(userDirContent);
		} else {
			createFileList();
		}
	}
	/*
		Show form to upload files to server
		return void
	*/
	function showUploadForm() {
		// Check if upload is posible
		if (!dirContent.inf.isWritable) {
			return alert(messages.writeProtect);
		}

		// Check if upload form show and hide it
		if (!!uploadFormShow) {
			uploadFormShow = !uploadFormShow;
				// If browser support the XMLHttpRequest upload - cancel current uploads
				if (isXHRUpload && isFileAPI) {
					// Loop all items in upload queue and abort active of them
					for (var i = uploadList.length; i-- >0;) {
						if (uploadList[i].state == 2) {
							// Abort the current request
							uploadList[i].xhr.abort();
						}
					}
					// Clear all list
					uploadList = [];
				}

			// Hide the loading indicator if the uploading is not complete, but this is not reset the uploading
			hideLoading();
			// If one or more files has been uploaded - reload dir else rebuid file list
			return (filesIsUploaded) ? reloadDirContent() : createFileList();
		} else {
			// Show form
			uploadFormShow = !uploadFormShow;
			erroOnUpload = filesIsUploaded = false;
			hideContextMenu();
			hideTooltips();

			var
				uploadBox = createElement('div', {className: 'uploadBox'}),
				info = createElement('div', {className: 'info', innerHTML: '<div>' + [sprintf(messages.allowExt, allowedExt.join(', ')), sprintf(messages.maxUploadSize, getHumanSize(maxUploadSize, messages.fileSizeDim), getHumanSize(maxUploadFileSize, messages.fileSizeDim)), (isMultipleUpload ? messages.multipleUpload : ''), (isHTML5DragAndDropSupport ? messages.dragAndDropSupport : ''), sprintf(messages.path, ('/' + ((dirContent.path.length > 0) ? dirContent.path.join('/') + '/' : '')))].join('</div><div>') + '</div>'}),
				uploadControl = createElement('button', {innerHTML: '<div class="icon upload"></div><span class="text">' + messages.upload + '</span>', className: 'gren_btn'}),
				cancelControl = createElement('button', {innerHTML: '<div class="icon del"></div><span class="text">' + messages.close + '</span>', className: 'red_btn'}),
				addControl = createElement('div', {className: 'icon add', title: HTMLDecode(messages.addField)}),
				autoCloseBox = createElement('div'),
				autoCloseCheckbox = createElement('input', {type: 'checkbox', id: 'auto_close_form', defaultChecked: autoCloseUploadForm}),
				autoCloseLabel = createElement('label', {innerHTML: messages.autoCloseForm, htmlFor: 'auto_close_form'})
			;
			// Create main upload inputs
			uploadInputs = createElement('div', {className: 'inputs'}),


			// Add event to controll the autoCloseUploadForm
			addEvent(autoCloseCheckbox, 'click', function () {
				autoCloseUploadForm = autoCloseCheckbox.checked;
				// if changed - reset error flag
				erroOnUpload = false;
			});

			uploadInputs.appendChild(getFileInput());

			addEvent(addControl, 'click', function () {uploadInputs.appendChild(getFileInput(1));});

			// Cancell upload -- need add some to stop upolad
			addEvent(cancelControl, 'click', function() {showUploadForm();});

			addEvent(uploadControl, 'click', function() {
				// Disable the submit upload button and start uploading files
				uploadControl.disabled = true;
				uploadControl.className = 'gray_btn';
				sendFiles();
			});

			// Clear the fileListElement
			fileListElement.innerHTML = '';

			autoCloseBox.appendChild(autoCloseCheckbox);
			autoCloseBox.appendChild(autoCloseLabel);
			uploadBox.appendChild(info);
			uploadBox.appendChild(uploadInputs);
			uploadBox.appendChild(autoCloseBox);
			uploadBox.appendChild(uploadControl);
			uploadBox.appendChild(cancelControl);
			uploadBox.appendChild(addControl);
			// IE button layot fix
			uploadBox.appendChild(createElement('div', {className: 'clear'}));
			fileListElement.appendChild(uploadBox);

			// In IE checked not work untill append to document
			//autoCloseCheckbox.checked = autoCloseUploadForm;
		}
	}
	/*
		Return the element with file select input to add to form
		@canDelete - this field can be deleted by user
	*/
	function getFileInput(canDelete) {
		// Opera have support the multiply file select by add min and max attributes to input element (min="1" max="999"), but PHP currently not support format of sended data for multiply files.
		var
			form = createElement('form', {method: 'post', action: reqURL, enctype: 'multipart/form-data', encoding: 'multipart/form-data', innerHTML: sprintf('<input type="hidden" name="MAX_FILE_SIZE" value="%1" /><input type="hidden" name="dir" value="%2" /><label>%3:</label><input type="file" name="file[]" multiple />', maxUploadSize, encodeURIComponent(curPath), messages.fileName)}),
			container = createElement('div', {className: 'input'}),
			deleteControl = createElement('div', {className: 'icon del', title: HTMLDecode(messages.delField)}),
			clear = createElement('div', {className: 'clear'})
		;

/*
	Client-side file extension check
		addEvent(form.getElementsByTagName('input')[2], 'change', function () {
			var
				ext = this.value,
				valid = false,
				i
			;
			ext = ext.substring(ext.lastIndexOf('.') + 1);
			for (i = allowedExt.length; i-- > 0;) {
				if (ext === allowedExt[i]) {
					valid = !valid;
				}
			}
			if (!valid) {
				alert('File extension is not valid');
			}
		}); */

		// Add event to delete element
		addEvent(deleteControl, 'click', function() {container.parentNode.removeChild(container);});

		// Build
		container.appendChild(form);
		if (!!canDelete) {
			container.appendChild(deleteControl);
		}
		container.appendChild(clear);
		return container;
	}
	/*
	 * Send file(s) to server using pseudo ajax technique or XHR upload
	 *
	 * @param	bool	recursive	Flag to indicate the recursive call of function
	 */
	function sendFiles(recursive) {
		// Check if upload is posible
		if (!dirContent.inf.isWritable) {
			return;
		}

		// Find first form and check it forms
		var
			form = uploadInputs.getElementsByTagName('form'),
			uploadEnd, // Indicate the end of upload process
			i
		;
		// On first run - delete the empty forms
		if (!recursive) {
			// Delete the empty forms
			for (i = form.length; i-- > 0;) {
				if (form[i]["file[]"].value == '') {
					// Delete the empty forms from DOM tree
					uploadInputs.removeChild(form[i].parentNode);
				}
			}
			// Indicat the loading process
			showLoading(1);
		}

		// Update information about the aviable forms
		form = uploadInputs.getElementsByTagName('form');

		// If browser support the XMLHttpRequest upload - use it
		if (isXHRUpload && isFileAPI) {

			// Get files from all added form and add the files from theses form to queue
			for (i = form.length; i-- > 0;) {
				// There cannot be a empty form - checked earlier
				addFilesToQueue(form[i]["file[]"].files);
				// Delete form from page. The form will be replaced by special uploading indicator.
				uploadInputs.removeChild(form[i].parentNode);
			}

			// Processing files in a queue

	 		// Update list to show the new added files and clean list of canceled and completed items
			var
				i,
				uploadFileItem
			;
			for (i = 0; i < uploadList.length; i++) {
				uploadFileItem = uploadList[i];
				// Add only new items
				if (uploadFileItem.state == 0) {
					var
						file = uploadFileItem.file,
						mainContainer,
						indicatorBox= createElement('div', {className: 'progress'}), // Progress indicator main div
						indicator = createElement('div', {className: 'indicator'}),
						indicatorLabel = createElement('div', {className: 'label'}),
						controllLink = createElement('span', {className: 'link'}),
						clearLayer = createElement('div', {className: 'clear'})// Append the clear div
					;

					uploadFileItem.name = file.name || file.fileName;
					uploadFileItem.size = file.size || file.fileSize;
					uploadFileItem.type = file.type || messages.unknownMime;

					// Crealte the list item
					mainContainer = createElement('div', {className: 'input', innerHTML: sprintf('<span class="hint">%1 (%2)</span>', truncateName(uploadFileItem.name), getHumanSize(uploadFileItem.size, messages.fileSizeDim)), title: uploadFileItem.name + ' (' + messages.fileType + uploadFileItem.type + ')'});

					// If file is empty - delete them from list and continue
					if (uploadFileItem.size == 0) {
						uploadList.splice(i, 1);
						continue;
					}

					indicatorBox.appendChild(indicator);
					indicatorBox.appendChild(indicatorLabel);
					mainContainer.insertBefore(indicatorBox, mainContainer.firstChild);

					// Add controll link
					mainContainer.appendChild(controllLink);

					// Handle to controll the item
					addEvent(controllLink, 'click', (function(uploadFileItem) {
								return function(evt) {
									/*
									 * Controll the item upload process (cancel, abort, show the link to the file)
									 *
									 * @param	object	uploadFileItem	The object who contains the information about the uploaded file
									 * @param	object	evt	The event object
									 */
									if (uploadFileItem.state == 1) {
										// Set item state from ready to canceled
										uploadFileItem.state = 5;

										// Update information about the upload item
										updateUploadItemProgress(uploadFileItem);
									} else if (uploadFileItem.state == 2) {
										// Abort the current request
										uploadFileItem.xhr.abort();

										// Set item state from upload to aborted
										uploadFileItem.state = 6;

										// Change upload activity to false
										uploadActive = false;

										// Update information about the upload item
										updateUploadItemProgress(uploadFileItem);

										// Upload next file in list
										sendFiles(1);
									} else if (uploadFileItem.state == 3) {
										// File is uploaded. If click - open file in new window
										//window.open(encodeURI(uploadFileItem.response[2]), '_blank');
									}  else if (uploadFileItem.state == 4) {
										// Reset the upload state from error to the ready
										uploadFileItem.state = 1;

										// Update information about the upload item
										updateUploadItemProgress(uploadFileItem);

										// Initialise the uploading
										sendFiles(1);
									}
								}
						})(uploadFileItem));

					mainContainer.appendChild(clearLayer);

					// Save the links to related element
					uploadFileItem.indicatorBox = indicatorBox;
					uploadFileItem.mainContainer = mainContainer;
					uploadFileItem.controllLink = controllLink;
					uploadFileItem.indicator = indicator;
					uploadFileItem.indicatorLabel = indicatorLabel;

					// Update item state
					uploadFileItem.state = 1;

					// Update information about the state of upload file item
					updateUploadItemProgress(uploadFileItem);

					uploadInputs.appendChild(mainContainer);
				} else if  (uploadFileItem.state > 4) {
					// Delete the aborted or aborted by server or canceled item
					uploadList.splice(i, 1);
				} else if (uploadFileItem.state == 3) {
					// Clean aready completed items
					uploadFileItem.file = uploadFileItem.uploadEvent = uploadFileItem.xhr = undefined;
				}
			}

			// Check if upload is active
			if  (!uploadActive) {
				// Search the first ready file and upload it
				for (i = 0; i < uploadList.length; i++) {
					// Upload only ready and non empty file
					if (uploadList[i].state == 1) {
						// Start uploading
						uploadFile(uploadList[i]);
						// exit from loop
						break;
					}
				}
				if (i == uploadList.length) {
					// All file has ben uploaded
					uploadEnd = true;
				}
			}

		} else {
			// Using pseudo ajax technique

			// Have one or more forms - process upload
			if (form.length > 0) {
				// Get first form from list
				form = form[0];

				// Indicate active form
				addClass(form.parentNode, 'active');

				/*
				 * Crete iframe element
				 * src="about:blank" is not good for https connections, so use the empty scr attribute
				*/
				var
					frameName = 'if' + Math.floor(Math.random() * 1e9),
					iframeContainer = createElement('span', {innerHTML: '<iframe style="display:none;" name="' + frameName + '" id="' + frameName + '" src=""></iframe>'}),
					iframeElement
				;
				// Set the target to the iframe
				form.setAttribute('target', frameName);

				fileListElement.appendChild(iframeContainer);
				// Get link to created iframe
				iframeElement = $(frameName);
				addEvent(iframeElement, 'load', function () {onSendFile(form, iframeElement);});

				// Submit the form
				form.submit();
			} else {
				// No form to upload
				uploadEnd = true;
			}
		}

		// If upload end - restore the upload form
		if (uploadEnd) {
			//Append the empty uploadInputs an end of list of uploaded files
			uploadInputs.appendChild(getFileInput());
			// Unblock the upload button
			extend(fileListElement.getElementsByTagName('button')[0], {disabled: false, className: 'gren_btn'});
			hideLoading();

			if (!recursive) {
				// Show notes if not files selected
				alert(messages.noFileSelected);
			} else if  (!!autoCloseUploadForm && !!filesIsUploaded && !erroOnUpload) {
				// If all form is uploaded (form count = 0, and is recursive) - and no error happens and some file has ben uploaded and auto close form is enabled - close upload form
				showUploadForm();
			}
		}
	}
	/*
		Do something alfer file is uploaded
		@frame - frame to check
		@form - the upload form corresponding for this upload
	*/
	function onSendFile(form, iframeElement) {
		//Check if form loaded intro frame
		var
			frameDocument = iframeElement.contentDocument || iframeElement.contentWindow.document || window.frames[iframeElement.id].document,
			formContainer = form.parentNode,
			errorOnThisUpload
		;
		// Do something only if frame load real document
		if (!!frameDocument && frameDocument.location.href != "") {
			try {
				frameDocument = JSON.parse(frameDocument.body.innerText || frameDocument.body.textContent);
				var
					infoStrings = [],
					resultItem
				;
				for (resultItem in frameDocument.results) {
					// Show only oploaded files
					if (!!frameDocument.results[resultItem][0]) {
						// Some error happens
						// Save in resultItem the error code
						resultItem = frameDocument.results[resultItem][1];
						infoStrings.push(messages.error + (messages['ec' + resultItem] || resultItem));
						errorOnThisUpload = true;
					} else {
						// All ok
						infoStrings.push(frameDocument.results[resultItem][1]);
					}
				}
				formContainer.innerHTML = sprintf(messages.uploadResult, frameDocument.count, infoStrings.join(', '));
				// If one or more files has been uploaded - save information about this
				if (frameDocument.count > 0) {
					filesIsUploaded = true;
				}
			} catch(e) {
				formContainer.innerHTML = sprintf(messages.operationFailed, e);
				errorOnThisUpload = true;
			}

			if (!!errorOnThisUpload) {
				// On this upload error happens
				addClass(formContainer, 'error');
				erroOnUpload = true;
			} else {
				addClass(formContainer, 'success');
			}
			// Remove the active indication on uploaded items
			remClass(formContainer, 'active');

			// Send next files
			sendFiles(1);
		}
		// Delete the iframe after 1 sec (else firefox show loading pages indicator) - no need becose the filelist is overwrite it on show files
		//setTimeout(function() {fileListElement.removeChild(iframeElement.parentNode);}, 1e3);
	}

	/*
	 *
	 * HTML5 Uploading functions
	 *
	 */

	/*
		Add selected files to upload queue form FileList object
		@fileList - FileList object
	*/
	function addFilesToQueue(fileList) {
		// Add the file list to upload list array
		for (var i = 0; i < fileList.length; i++) {
			uploadList.push({state: 0, file: fileList[i]});
		}
	}
	/*
	 *
	 * Update the upload file item indicator state
	 * The function update the progress of upload based on the current item state
	 *
	 * @param	object	uploadFileItem	The object who contains the information about the uploaded file
	 * @return viod
	 */
	function updateUploadItemProgress (uploadFileItem) {
		var
			delimiter = ' | ',
			percent = '%',
			// Short access to most linked properties
			state = uploadFileItem.state,
			indicator = uploadFileItem.indicator,
			indicatorLabel = uploadFileItem.indicatorLabel,
			controllLink = uploadFileItem.controllLink
		;

		if (state == 1) {
			// File is ready for upload
			indicator.style.width = 0 + percent;
			indicatorLabel.innerHTML = indicatorLabel.title = messages.waitInQueue;

			// Update the controllLink text
			controllLink.innerHTML = messages.cancel;
		} else if (state == 2) {
			// Upload is active

			// Update ontroll link text only if diferent
			if (controllLink.innerHTML != messages.abort) {
				controllLink.innerHTML = messages.abort;
			}

			var uploadEvent = uploadFileItem.uploadEvent;
			// Progress indicator
			if (uploadEvent.lengthComputable) {
				var
					percentage = (uploadEvent.loaded / uploadEvent.total) * 100,
					speed = (uploadEvent.loaded / ((new Date()).getTime() - uploadFileItem.startTime)) * 1e3,
					timeLeft = round((uploadEvent.total - uploadEvent.loaded) / speed)
				;
				indicator.style.width = percentage + percent;

				// Progress indicator label
				indicatorLabel.innerHTML = indicatorLabel.title = round(percentage) + percent + delimiter + messages.speed + ': ' + getHumanSize(speed, messages.fileSizeDim) + messages.speedUnit + delimiter + messages.timeLeft + ': ' + timeLeft + messages.second;
			}
		} else if (state == 3) {
			// File is uploaded
			var
				time = (uploadFileItem.endTime - uploadFileItem.startTime) / 1e3,
				speed = (uploadFileItem.size / time)
			;
			indicatorLabel.innerHTML = indicatorLabel.title = getHumanSize(uploadFileItem.response[1], messages.fileSizeDim) + delimiter + messages.speed + ': ' + getHumanSize(speed, messages.fileSizeDim) + messages.speedUnit + delimiter + messages.time + ': ' + time + messages.second;

			// Update the controll link
			extend(controllLink, {innerHTML: sprintf(messages.savedAs, truncateName(uploadFileItem.response[2])), title: uploadFileItem.response[2], className: 'hint'});
		} else if (state == 4) {
			// Some error on upload happens

			// Update the controllLink text
			controllLink.innerHTML = messages.tryAgain;
			indicatorLabel.innerHTML = indicatorLabel.title = uploadFileItem.errorMsg || messages.error;
		} else if (state == 5) {
			// File is canceled for upload

			// Update the progress label text
			indicatorLabel.innerHTML = messages.canceled;
		} else if (state == 6) {
			// File is aborted for upload

			// Update the progress label text
			indicatorLabel.innerHTML = messages.aborted;
		} else if (state == 7) {
			// File is aborted by server

			// Update the progress label text
			indicatorLabel.innerHTML = indicatorLabel.title = uploadFileItem.errorMsg || messages.error;
		}

		// File is aborted or aborted by server or canceled item
		if (state > 4) {
			addClass(controllLink, 'hide')

			// Hide selected element after 3 sec
			setTimeout(function() {addClass(uploadFileItem.mainContainer, 'hide');}, 3e3);
			/*
				Next code delete the selected element from DOM tree
				setTimeout(function() {uploadFileItem.mainContainer.parentNode.removeChild(uploadFileItem.mainContainer);}, 3e3);
			*/
		}
		// Add cancell or reload icons
		controllLink.appendChild(createElement('div', {className: ((state < 3) ? 'icon del' : ((state == 4) ? 'icon reload' : ''))}));

		// Add the done or error class
		uploadFileItem.indicatorBox.className = 'progress' + ((state == 3) ? ' done' : ((state > 3) ? ' error' : ''));
	}
	/*
	 * Upload the files using the XMLHTTPRequest uploads
	 *
	 * @param	object	uploadFileItem	The object who contains the information about the uploaded file
	 * @return void
	 */
	function uploadFile (uploadFileItem) {

		uploadActive = true;
		// Update the item state
		uploadFileItem.state = 2;

		try {
			var xhr = getXHR();

			addEvent(xhr.upload, 'progress', function(e) {
				// Save the progress event object
				uploadFileItem.uploadEvent = e;
				updateUploadItemProgress(uploadFileItem);
			});

			// This event fire on (xhr.readyState == 4) - check the request state
			addEvent(xhr, 'load', function(e) {
				if (xhr.status == 200 || xhr.status == 304) {
					try {
						var
							response = JSON.parse(xhr.responseText),
							result = response[0];
						;
						// Check the respose result
						if (result == 0) {
							// Check the local and remote file size
							if (response[1] == uploadFileItem.size) {
								// All OK
								uploadFileItem.state = 3;
								// Save the response
								uploadFileItem.response = response;
								// Save the request finish time
								uploadFileItem.endTime = (new Date()).getTime();

								updateUploadItemProgress(uploadFileItem);

								// Set flag to files has been uploaded
								filesIsUploaded = true;
							} else {
								// Local and remote file size not match
								uploadFileItem.state = 4;
								uploadFileItem.errorMsg = messages.sizeNotMatch;
								updateUploadItemProgress(uploadFileItem);
							}
						} else {
							// Some error - get description from messages if exist, otherwise - show simple error message
							uploadFileItem.errorMsg = messages.errorUpload + ': ' + (messages['ec' + result] || result);
							// File aborted by server (various code) or some error happens (503)
							uploadFileItem.state = (result != 503) ? 7 : 4;
							updateUploadItemProgress(uploadFileItem);
						}
					} catch(e) {
						uploadFileItem.state = 4;
						uploadFileItem.errorMsg = messages.errorOnResponse + e.toString() + ' -- ' + xhr.responseText;
						updateUploadItemProgress(uploadFileItem);
					}
				} else {
					uploadFileItem.state = 4;
					uploadFileItem.errorMsg = messages.errorOnResponse + xhr.status + ' ' + xhr.statusText;
					updateUploadItemProgress(uploadFileItem);
				}
				if ((uploadFileItem.state == 4) || (uploadFileItem.state == 7)) {
					erroOnUpload = true;
				}

				// Start upload next file
				uploadActive = false;
				sendFiles(1);
			});

			addEvent(xhr, 'error', function() {
				uploadFileItem.state = 4;
				uploadFileItem.errorMsg = messages.errorUpload;
				updateUploadItemProgress(uploadFileItem);

				// Start upload next file
				uploadActive = false;
				sendFiles(1);
			});

			xhr.open('POST', reqURL + ((reqURL.indexOf('?') != -1) ? '&' : '?') + 'upload&name=' + encodeURIComponent(uploadFileItem.name) + '&dir=' + encodeURIComponent(curPath));

			// Save the start time of operation
			uploadFileItem.startTime = (new Date()).getTime();

			// Save the link to the XMLHttpRequest object
			uploadFileItem.xhr = xhr;

			// Send the file
			xhr.send(uploadFileItem.file);
		} catch (e) {
			uploadFileItem.state = 4;
			uploadFileItem.errorMsg = messages.errorEx + e.toString();
			updateUploadItemProgress(uploadFileItem);

			// Start upload next file
			uploadActive = false;
			sendFiles(1);
		}
	}
	/*
	 *
	 * Check the drag type and return true if drag file(s)
	 * Condition part one for FF and part two for Chrome
	 *
	 * @param	object	dataTransferTypes	the event.datTransfer.type object
	 * @return bool
	 */
	function dragFileCheck (dataTransferTypes) {
		return ((dataTransferTypes.contains && dataTransferTypes.contains('Files')) || (dataTransferTypes.indexOf && dataTransferTypes.indexOf('Files') != -1)) ? true : false;
	}

	return {
		init: function (settings) {
			/*
				Initialise first step
				@settings - object with configuration parametrs
			*/

			// Set the settings from curent call function init or from constructor call
			setSettings(settings);

			// Check the AJAX support
			if (!(getXHR())) {
				alert(messages.ajaxIsReguire);
				return false;
			}
			if (immediateStart){
				onLoad();
			} else {
				addEvent(window, 'load', onLoad);
			}
		},

		getSelectedItem: function () {
			/*
				Return a information from selected items
			*/
			if (contextElement) {
				return contextElement;
			}
		},

		getItemInfo: function (type, index) {
			/*
				Return a information for file or folder
			*/
			if (type == 1) {
				return dirContent.dirs[index];
			} else if (type == 2) {
				return getFileProperties(index);
			}
		},

		getDirContent: function () {
			/*
				Return a curent dir content
			*/
			return dirContent;
		},

		gotoPath: function (path) {
			/*
				Go to dir if ready
				path - path to target folder, start from "/" (example - "/documents")
			*/
			if (ready) {
				getDirContent(path);
			}
		},

		setStartPath: function (path) {
			/*
				Set the start dir for browsing, must be called before the imgLib initialization
				path - path to target folder, start from "/" (example - "/documents")
			*/
			if (!ready) {
				curPath = path;
			}
		},

		getConfig: function (key) {
			/*
				Get current configuration or single key of configuration
				key - the configuration key
			*/
			return (!!key) ? config[key] : config;
		}
	}
}());