function fade(element, userConfig) {
/*
	id = the element or element id
	conf = {
		start: int (0-100) // Start transparency level, default 100, range 0-100
		stop: int (0-100) // Stop transparency level, default 0, range 0-100
		step: int // Transparency change step in percentage, default 5, range 1-99
		time: int // Total time to change the transparency of object in msec default value is 400, range 1 - infinity
		handle: function // Handle to function executed at end fade job
	}
*/
	//return;
	element = $(element);


	/* if (typeof element != 'object') {
		alert(element);
		return;
	}
 */
	var
		config = extend({start: 100, stop: 0, step: 5, time: 400}, (userConfig || {})); // Extend the default config by user config

	// Calculate the time betwen the transparency changes
	config.time = Math.round(config.time / ((config.start - config.stop) / config.step));

	// Support fucntion for change the transparency in loop
	function fadeJob(element) {
		var
			fadeConf = element.fadeConf,
			nextTransparencyLevel = fadeConf.current + fadeConf.step
		;

		if (((nextTransparencyLevel < fadeConf.stop) && (fadeConf.step > 0)) || ((nextTransparencyLevel > fadeConf.stop) && (fadeConf.step < 0))) {
			// Is no end of job
			// Change the transparency level
			setTransparency(element, nextTransparencyLevel);
			// Update the current transparency level
			fadeConf.current = nextTransparencyLevel;
			// Shedule the next run
			setTimeout(function (){fadeJob(element);}, fadeConf.time);
		} else {
			// No more iteration, set the end level and clean
			setTransparency(element, fadeConf.stop);
			// Call user handle
			if (!!fadeConf.handle) {
				fadeConf.handle();
			}
			// Delete the configuration
			delete fadeConf.current;
			//delete element.fadeConf;
		}
	}

	// Reverse the step if start < stop
	if (config.start > config.stop) {
		config.step *= -1;
	}
	// Update the config
	element.fadeConf = extend((element.fadeConf || {}), config);

	// If no active frading job on element - start it
	if (!('current' in element.fadeConf)) {
		// Set the initial fade level
		setTransparency(element, config.start);

		// Save the fade start level
		element.fadeConf.current = config.start;

		// Start the frading job
		setTimeout(function (){fadeJob(element);}, config.time);
	}
}

function slide(element, userConfig) {
/*
	id = the element or element id
	conf = {
		start: int (0-100) // Start transparency level, default 100, range 0-100
		stop: int (0-100) // Stop transparency level, default 0, range 0-100
		step: int // Transparency change step in percentage, default 5, range 1-99
		time: int // Total time to change the transparency of object in msec default value is 400, range 1 - infinity
		handle: function // Handle to function executed at end fade job
	}
*/
	//return;
	element = $(element);


	/* if (typeof element != 'object') {
		alert(element);
		return;
	}
 */
	var
		config = extend({start: 100, stop: 0, step: 5, time: 400}, (userConfig || {})); // Extend the default config by user config

	// Calculate the time betwen the transparency changes
	config.time = Math.round(config.time / ((config.start - config.stop) / config.step));

	// Support fucntion for change the transparency in loop
	function fadeJob(element) {
		var
			fadeConf = element.fadeConf,
			nextTransparencyLevel = fadeConf.current + fadeConf.step
		;

		if (((nextTransparencyLevel < fadeConf.stop) && (fadeConf.step > 0)) || ((nextTransparencyLevel > fadeConf.stop) && (fadeConf.step < 0))) {
			// Is no end of job
			// Change the transparency level
			setTransparency(element, nextTransparencyLevel);
			// Update the current transparency level
			fadeConf.current = nextTransparencyLevel;
			// Shedule the next run
			setTimeout(function (){fadeJob(element);}, fadeConf.time);
		} else {
			// No more iteration, set the end level and clean
			setTransparency(element, fadeConf.stop);
			// Call user handle
			if (!!fadeConf.handle) {
				fadeConf.handle();
			}
			// Delete the configuration
			delete fadeConf.current;
			//delete element.fadeConf;
		}
	}

	// Reverse the step if start < stop
	if (config.start > config.stop) {
		config.step *= -1;
	}
	// Update the config
	element.fadeConf = extend((element.fadeConf || {}), config);

	// If no active frading job on element - start it
	if (!('current' in element.fadeConf)) {
		// Set the initial fade level
		setTransparency(element, config.start);

		// Save the fade start level
		element.fadeConf.current = config.start;

		// Start the frading job
		setTimeout(function (){fadeJob(element);}, config.time);
	}
}

//iGallery -> show -> build - > loadElements

/*
 * Missing functionaliy
 * 1) window hash history														+
 * 2) preload only visible thumbnails										+
 * 3) scrol the thumbnails														+
 * 4) auto hide only in slide show mode								+ - discused feature
 * 5) thumbnail overlay															+
 * 6) information messages													+
 * 7) info about file																	-
 * 8) Thumbnail scrolls show only if not all showed				+
 * 9) No loop thumbnail scrolls - more intuitive					+
 * 10) More clean exit																+
 * 11) Problem on gallery reload											+- (thumbnail left - if all showed - not alvays on center)
 * 12) Increase/Decrease tht slideshow timeout					+
 * 13) Show/Hide item info														+
 * 14) Rebuild all HTML on each show									+
 * 92) Can zoom lagre images												-
 *
 *
 *
 * If custom rotate index equal to thumbnail scroll index then thumbnailScrollUse is false
 *
 ****************************************
 * Image Gallery script                  *
 * Version: 0.01 (9:59 28.09.2010)      *
 * Author: dev@imglib.endofinternet.net *
 ****************************************
 */
var iGallery = (function () {
	var
		config = {
			//height: 'auto',
			elements: [], // The array of elements to show in gallery
/* 			[
				{
					src: Source of image
					th: Source of thumbnail
					title: Item title
					width: Image width
					height: Image height
					srcL: Source loaded flag. 0 - Downloading starting. 1 - Download complete.
					thL: Thumbnail loaded flag
				},
				......
			] */
			imgFillLevel: 1, // level of filling the screen image, range 0 - 1
			thmbShow: true, // Show the thumbnail of the elements
			thmbTransparency: 50, // Thumbnail transparency
			thmbWidth: 80, // Thumbnail width
			thmbHeight: 60, // Thumbnail height
			enlargeSmallImages: false, // Enlarge the small images to flit of screen
			autoShow: true, // Auto show the slideshow on initialiasing
			autoPlay: true, // Auto start slideshow
			loopPlay: true, // Loop the play slideshow
			startIndex: 0, // Start elements index to show. Range 0 - (element count -1). Default 0;
			slideshowDelay: 3, // Delay to show the next item on slideshow in seconds. Default 3 sec
			showItemInfo: true, // Show short item info like description or file name.
			stateCheckInterval: .2, // Interval betwen the checks of the window hash state in seconds. Default 200 msec
			smartPreload: true, // Preload next image in list for decrease loading time
			onShow: false, // Handle to function executed on show the iGallery
			onExit: false, // Handle to function executed on exit from the iGallery
			empty: true
		},
		version = .1, // The gallery version to show
		active = false, // Is gallery aready active
		elements = config.elements, // The short link to elements
		elementsCount, // Total elements count
		body, // The page body element
		hiddenElement = [], // Array with elements who has been hidded on initialisation
		galleryElement, // The main gallery element
			thumbnailElement, // The thumbnail main element
				thumbnailScrollBox, // The thumbnail scrolls element
				thumbnailListElement, // The thumbnail list element
			bodyElement, // The main body element
				loadingElement, // The loading element
				imageElement, // The image element
			bottomContainerElement, // The
				infoElement, // The item info element
					infoBodyElement, // The element who containt the info body
				controlElement,
					playElement,
			msgElement, // The element to show the some info about current work or state messages

		windowWidth, // Current window width
		windowHeight, // Current window height
		thumbnailListItemWidht, // Thumbnail item width
		thumbnailListLeft, // Thumbnail list left offset
		thumbnailVisibleCount, // Thumbnail max visible count
		thumbnailDownloadQueue = [], // Thumbnail queue to download
		thumbnailDownloadActive = false, // Thumbnail download is active

		hideCotrollsTimer, // Timer to hide the controlls
		cotrollsIsShow, // Cotrols curent is show
		controllsInUse, // Control element or thumbnail element in use
		controllsHideTimeout = 3e3, // Control element hide timeout
		thumbnailScrollUse, // Using thumbnail scroll
		currentItemHighligted, // Is current thumbnail item is highlighted

		messagesHideTimeout = 3e3, // Information messages hide timeout


		slideShowTimer, // The slideshow timer
		slideShowActive, // Is slideshow is active

		galleryIndex, // Current gallery item index to show
		galleryPrevIndex, // Prev gallery item index to show
		thumbnailScrollIndex, // Current thumbnail gallery item index to show

		stateCheckTimer, // Timer to check the window hash state
		windowHash, // Saved window hash
		//prevWindowHash, // Previsious window hash

		// Frequently used strings
		pxStr = 'px',
		autoStr = 'auto',
		buttonClass = 'button ', // Button CSS class name
		buttonSmallClass = 'small ', // Small button CSS class name

		// Short access to Math function
		round = Math.round,
		floor = Math.floor,
		strings = [
			'seconds',
			'Exit',
			'Show help',
			'<b class="s1 f"></b><b class="s2"></b><b class="s3"></b><b class="s4"></b><b class="s5"></b><b class="s6"></b><b class="s7"></b><b class="s8"></b><b class="s9"></b><b class="s8"></b><b class="s7"></b><b class="s6"></b><b class="s5"></b><b class="s4"></b><b class="s3"></b><b class="s2"></b><b class="s1"></b>',
			'No items found!',
			'Press F11 to fulscreen mode',
			'<div class="thmbBox" style="width: %1%3; height: %2%3;"><div class="overlay"></div><img title="%4" alt="%4" /></div>',
			'Error on loading &quot;%1&quot;, skip.',
			'Play',
			'Pause',
			'Loading.....',
			'iGallery ver: %1 [<a href="http://jstoys.org.ua/" target="_blank">jstoys.org.ua</a>]<br /><br /><b>Keyboard shortcut:</b><ul><li>Left/Up/Page Up/Mouse Whell Up - Previous image</li><li>Right/Down/Page Down/Mouse Whell Down - Next image</li><li>Space - Play/Stop slideshow</li><li>H - This help</li><li>I - Toggle the information about the item</li><li>Esc - Exit</li></ul>',
			'Captions'
		]
	;

	/*
	 * Preload the image
	 *
	 * @param	string		src			The image src property
	 * @param	function	callback	The function handle to call with image object as first argument on image is loaded
	 * @param	function	onerror		The function handle to call on some load error
	 *
	 * @return image object
	 */
	function preloadImg(src, callback, onerror) {
		var img = new Image();
		if (!!callback) {
			img.onload = function() {
				callback(img);
				// Free the resourse
				// img.onload = null; ?????
				img.onload = function() {};
			}
		}
		if (!!onerror) {
			img.onerror = onerror;
		}
		img.src = src;
		return img;
	}

	/*
	 * Add event to mouse whell
	 * Bed realisation becouse the handle can not be removed and cant remove the events
	 *
	 * delta > 0 - scroll up
	 * delta < 0 - scroll down
	 *
	 * @param	object		evt			The mouse whell event objectHighlight the some thumbnailHighlight the some thumbnail
	 * @param	fucntion	callback	User fucntion who call with mouse delta as first argument
	 *
	 * @return void
	 */
	function onMouseWheel(callback) {
		// If not specified callback - exit
		if (!!callback) {
			// Create the support handle to process the mouse whell event
			function handle(evt, callback) {
				if (!active) {
					return;
				}
				// Fix event for IE
				evt = fixEvent(evt);
				var delta;
				if (evt.wheelDelta) { // IE, Opera, safari, chrome, delta is multiple of 120
					delta = evt.wheelDelta / 120;
					/*
					if (window.opera) { // For Opera 9, but not 10 the delta have reverse sign
						delta = -delta;
					}
					*/
				} else if (evt.detail) { // Mozilla, delta is multiple of 3.
					delta = -evt.detail / 3;
				}
				// If the delta is assigned - to do something
				if (!!delta) {
					callback(delta);
					// Cancell default actions
					cancelEvent(evt);
				}
			};
			// Add events to:
			// Mozilla, Safari, Chrome
			addEvent(window, 'DOMMouseScroll', function(evt) {handle(evt, callback)});
			// IE, Opera.
			addEvent(window, 'mousewheel', function(evt) {handle(evt, callback)});
			addEvent(document, 'mousewheel', function(evt) {handle(evt, callback)});
		};
	}

	/*
	 * Build the core of HTML, apply the events
	 *
	 * @return void
	 */
	function build() {
		var
			thumbnailScrollLeftElement = createElement('div', {className: 'scrollLeft', innerHTML: '&larr;', href: '#'}),
			thumbnailScrollRightElement = createElement('div', {className: 'scrollRight', innerHTML: '&rarr;', href: '#'}),
			prevElement = createElement('div', {className: buttonClass + 'prev', href: '#', innerHTML: '&larr;'}),
			nextElement = createElement('div', {className: buttonClass + 'next', href: '#', innerHTML: '&rarr;'}),
			inputsElement = createElement('div', {className: 'inputs'}),
			toggleItemInfoElement = createElement('div', {className: 'caption'}),
			toggleItemInfoCheckbox = createElement('input', {type: 'checkbox', id: 'toggle_item_info', defaultChecked: config.showItemInfo}),
			toggleItemInfoLabel = createElement('label', {innerHTML: strings[12], htmlFor: 'toggle_item_info'}),
			delayElement = createElement('div', {className: 'delay'}),
			delayValElement = createElement('span', {className: 'delay_val', innerHTML: config.slideshowDelay}),
			timeElement = createElement('span', {innerHTML: strings[0] + ':'}),
			incDelayElement = createElement('div', {className: buttonClass + buttonSmallClass + 'inc', href: '#', innerHTML: '+'}),
			decDelayElement = createElement('div', {className: buttonClass + buttonSmallClass + 'dec', href: '#', innerHTML: '-'}),
			exitElement = createElement('div', {className: buttonClass + buttonSmallClass + 'exit', href: '#', innerHTML: 'X', title: strings[1]}),
			helpElement = createElement('div', {className: buttonClass + buttonSmallClass + 'help', href: '#', innerHTML: '?', title: strings[2]}),
			controllOverlayElement = createElement('div', {className: 'overlay'}),
			infoBoxElement = createElement('span', {className: 'box'});
			infoOverlayElement = controllOverlayElement.cloneNode(1)
		;

		// Create the main gallery element
		galleryElement = createElement('div', {className: 'igallery'});

		// Create top level elements
		thumbnailElement = createElement('div', {className: 'thumbnail'});
		bodyElement = createElement('div', {className: 'body'});
		bottomContainerElement = createElement('div', {className: 'bottomContainer'});
		msgElement = createElement('ul', {className: 'messages'});


		// Thumbnail section
		thumbnailScrollBox = createElement('div');
		thumbnailScrollBox.appendChild(thumbnailScrollLeftElement);
		thumbnailScrollBox.appendChild(thumbnailScrollRightElement);

		thumbnailElement.appendChild(thumbnailScrollBox);

		thumbnailListElement = createElement('ul');

		thumbnailElement.appendChild(thumbnailListElement);

		// Body section
		imageElement = createElement('img');
		bodyElement.appendChild(imageElement);


		// Controll section
		infoElement = createElement('div', {className: 'info'});
		infoBodyElement = createElement('span', {className: 'text'});

		infoBoxElement.appendChild(infoOverlayElement);
		infoBoxElement.appendChild(infoBodyElement);
		infoElement.appendChild(infoBoxElement);

		// Controll section
		playElement = createElement('div', {href: '#', className: buttonClass + 'play', innerHTML: strings[3]});
		controlElement = createElement('div', {className: 'controll'});


		toggleItemInfoElement.appendChild(toggleItemInfoCheckbox);
		toggleItemInfoElement.appendChild(toggleItemInfoLabel);

		delayElement.appendChild(timeElement);
		delayElement.appendChild(delayValElement);
		delayElement.appendChild(incDelayElement);
		delayElement.appendChild(decDelayElement);

		inputsElement.appendChild(delayElement);
		inputsElement.appendChild(toggleItemInfoElement);


		controlElement.appendChild(prevElement);
		controlElement.appendChild(playElement);
		controlElement.appendChild(nextElement);
		controlElement.appendChild(inputsElement);
		controlElement.appendChild(exitElement);
		controlElement.appendChild(helpElement);
		controlElement.appendChild(controllOverlayElement);
		controlElement.appendChild(createElement('div', {className: 'clear'}));

		bottomContainerElement.appendChild(infoElement);
		bottomContainerElement.appendChild(controlElement);

		// Set transparency alfter append the elements to document
		/*
		setTransparency(thumbnailScrollLeftElement, 75);
		setTransparency(thumbnailScrollRightElement, 75);
		*/
		setTransparency(controllOverlayElement, 75);
		setTransparency(infoOverlayElement, 75);


		/*
		 * add Events
		 */

		// Prevent the text selection on click of the thumbnail scrolls elements
		addEvent(thumbnailScrollBox, 'mousedown', function (evt) {cancelEvent(fixEvent(evt));});
		addEvent(thumbnailScrollBox, 'click', function (evt) {cancelEvent(fixEvent(evt));});

		addEvent(thumbnailListElement, 'click', function (evt) {
			evt = fixEvent(evt);
			var target = evt.target;
			//showMsg(evt.target);
			while (target) {
				if ('galleryIndex' in target) {
					// Update current index of element
					galleryIndex = target.galleryIndex;
					// Show the selected element
					showElement();
					break;
				} else {
					target = target.parentNode;
				}
			}
		});

		addEvent(thumbnailListElement, 'mouseover', function (evt) {
			evt = fixEvent(evt);
			var target = evt.target;
			while (target) {
				if ('galleryIndex' in target) {
					highlightThumbnail(target.galleryIndex);
					break;
				} else {
					target = target.parentNode;
				}
			}
		});
		addEvent(thumbnailListElement, 'mouseout', function (evt) {
			evt = fixEvent(evt);
			var target = evt.target;
			while (target) {
				if ('galleryIndex' in target) {
					deselectThumbnail(target.galleryIndex);
					break;
				} else {
					target = target.parentNode;
				}
			}
		});

		// Apeend Events
		addEvent(thumbnailScrollLeftElement, 'click', scrollThumbnailLeft);
		addEvent(thumbnailScrollRightElement, 'click', scrollThumbnailRight);

		// Apeend Events
		addEvent(prevElement, 'click', showPrevElement);
		addEvent(playElement, 'click', toogleSlideshow);
		addEvent(nextElement, 'click', showNextElement);
		addEvent(exitElement, 'click', exit);
		addEvent(helpElement, 'click', showHelp);

		//If mouse moved on controllBox or thumbnailElement - clear timeout and cancelEvents
		//addEvent(controlElement, 'mousemove', function () {clearTimeout(hideCotrollsTimer);});
		//addEvent(thumbnailElement, 'mousemove', function () {clearTimeout(hideCotrollsTimer);});
		addEvent(controlElement, 'mousemove', function (evt) {clearTimeout(hideCotrollsTimer); cancelEvent(fixEvent(evt));});
		addEvent(thumbnailElement, 'mousemove', function (evt) {clearTimeout(hideCotrollsTimer); cancelEvent(fixEvent(evt));});
		//addEvent(controlElement, 'mouseover', function () {controllsInUse = true;});
		//addEvent(controlElement, 'mouseout', function () {controllsInUse = false;});

		// Increase and decrease the slideshow timeout
		addEvent(incDelayElement, 'click', function () {delayValElement.innerHTML = ++config.slideshowDelay;});
		addEvent(decDelayElement, 'click', function () {if (config.slideshowDelay > 1) {delayValElement.innerHTML = --config.slideshowDelay;};});

		// Add event to controll the autoCloseUploadForm
		addEvent(toggleItemInfoCheckbox, 'click', function () {
				config.showItemInfo = toggleItemInfoCheckbox.checked;
				// Call the function to show or hide the item info
				showInfo();
			});

		// Prevent the text selection on click of the controll elements
		addEvent(controlElement, 'mousedown', function (evt) {cancelEvent(fixEvent(evt));});
		//addEvent(controlElement, 'click', function (evt) {cancelEvent(fixEvent(evt));});

		// Adjust the gallery height
		addEvent(window, 'resize', updateGallerySize);

		// Rotating images events (keypress)
		addEvent(document, 'keydown', function (evt) {
			// If Alt or Ctrl is press - ignore
			evt = fixEvent(evt);
			if (!active || (evt.ctrlKey || evt.altKey)) {
				return;
			}
			
			if (evt.keyCode == 32 || evt.charCode == 32) { // charCode - Special for Opera
				// Start/Stop slideshow on press the space
				toogleSlideshow();
			} else if (evt.keyCode == 34 || evt.keyCode == 39  || evt.keyCode == 40) {
				// Show next image on press the cursor right, cursor down, cursor left, or page down keys
				showNextElement();
			} else if (evt.keyCode == 33 || evt.keyCode == 37 || evt.keyCode == 38) {
				// Show prev image on press the cursor left, cursor up or page up keys
				showPrevElement();
			} else if (evt.keyCode == 27) {
				// Exit on press the Esc
				exit();
			} else if (evt.keyCode == 72) {
				// Show help message on press the H
				showHelp();
			} else if (evt.keyCode == 73) {
				// Toggle the information about item on press the I
				toggleItemInfoCheckbox.checked = config.showItemInfo = !config.showItemInfo;
				// Call the function to show or hide the item info
				showInfo();
			} else {
				//showMsg('keydown event:' +evt.charCode + '/' + evt.keyCode);
			}
		});

		// Click on image show next image
		//addEvent(imageElement, 'click', showNextElement);

		// Add mouse event
		onMouseWheel(function (delta) {
			if (delta > 0) {
				showPrevElement();
			} else {
				showNextElement();
			}
		});

		// Hide/Show controls on mouse move
		addEvent(galleryElement, 'mousemove', showControlls);

		// Finaly append top level elements
		galleryElement.appendChild(thumbnailElement);
		galleryElement.appendChild(bodyElement);
		galleryElement.appendChild(bottomContainerElement);
		galleryElement.appendChild(msgElement);
	}

	/*
	 * Build the core of HTML, apply the events
	 *
	 * @return void
	 */
	function show() {
		//showMsg('build()');

		// If not curently get the body element - get it
		if (!body) {
			body = document.getElementsByTagName('body')[0];
		}


		// If gallery element not created
		if (!galleryElement) {
			build();
		}


		// Reset the thumbnail list offset
		thumbnailListElement.style.right = 0;
		// Hide all the exist page elements
		hidePageElements();

		// Append the gallery element to document
		body.appendChild(galleryElement);

		active = true;
		// Adjust gallery size now
		updateGallerySize();

		// Save the window hash
		var hash = window.location.hash;
		if (hash.indexOf('slideshow') !== 1) {
			windowHash = hash;
		} else {
			windowHash = '';
		}

		// Load the thumbnails of the elements
		loadElements();
	}

	/*
	 * Hide the current exist page elements and save the state
	 *
	 * @return void
	 */
	function hidePageElements() {
		//showMsg('hidePageElements()');
		hiddenElement = [];
		var
			bodyElements = body.childNodes,
			i
		;
		for (i = bodyElements.length; i-- > 0;) {
			// Hide only DOM elements vith style attribute
			if (!!bodyElements[i].style) {
				// Save the hiddedn elements list and hide element
				hiddenElement.push([bodyElements[i], bodyElements[i].style.display]);
				bodyElements[i].style.display = 'none';
			}
		}
	}

	/*
	 * Exit from the gallery
	 * This function restore the page elements visibility and clean the timers
	 *
	 * @return void
	 */
	function exit() {
		var i;
		for (i = hiddenElement.length; i-- > 0;) {
			// Restore the previsious hidden elements
			hiddenElement[i][0].style.display = hiddenElement[i][1];
		}

		// Clear timers
		clearTimeout(hideCotrollsTimer);
		clearInterval(slideShowTimer);
		//clearInterval(stateCheckTimer);

		// Clean the elements list on exit
		// elements = config.elements = [];

		// Delete the thumbnail loaded flags
		for (i = elementsCount; i-- > 0;) {
			// If no item title - get it from file name
			if ('thL' in elements[i]) {
				delete elements[i].thL;
			}
		}

		// Remove the main element
		//if (galleryElement)
			body.removeChild(galleryElement);
		active = false;

		// Update the state
		stateUpdate();

		// Execute on exit fucntions
		if (config.onExit) {
			config.onExit(config);
		}
	}

	/*
	 * Load the images to the gallery, start build the thumbnails, initialise the indexes
	 *
	 * @return void
	 */
	function loadElements() {
		//showMsg('loadElements()');
		// Create the short link to the elements
		elements = config.elements;
		elementsCount = elements.length;

		if (elementsCount == 0) {
			alert(strings[4]);
			exit();
		}

		var
			i,
			hashIndex
		;

		// Clean the thumbnails
		//thumbnailListElement.innerHTML = '';

		// Set the index to first element
		galleryIndex = config.startIndex || 0;

		// Try to get the hash index
		hashIndex = getHahsIndex();
		if (hashIndex !== false) {
			galleryIndex = hashIndex - 1;
		}

		//galleryPrevIndex = ((galleryIndex - 1) < 0) ? elementsCount - 1 : (galleryIndex - 1)
		galleryPrevIndex = -1; // Set the previsious index to not exist elements on start. For correct rotating and error loading work.
		thumbnailScrollIndex = galleryIndex;
		active = true;

		// Update the state
		stateUpdate();


		for (i = elementsCount; i-- > 0;) {
			// If no item title - get it from file name
			if (!elements[i].title) {
				elements[i].title = elements[i].src.substr(elements[i].src.lastIndexOf('/') + 1);
			}
		}
		showElement();
		buildThumbnails();
		// Start the autoplay slideshow
		if (config.autoPlay) {
			toogleSlideshow();
			showMsg(strings[5]);
		}

		// Execute on show fucntions
		if (config.onShow) {
			config.onShow(config);
		}
	}

	/*
	 * Build the thumbnails
	 *
	 * @return void
	 */
	function buildThumbnails() {
		//showMsg('buildThumbnails()');
		var
			item,
			listItem,
			i
		;
		// Clear the thumbnail element
		thumbnailListElement.innerHTML = '';
		// Clear the offset
		thumbnailListElement.style.right = 0;

		for (i = 0; i < elementsCount; i++) {
			item = elements[i];
			// Create image-cap
			listItem = createElement('li', {innerHTML: sprintf(strings[6], config.thmbWidth, config.thmbHeight, pxStr, item.th), galleryIndex: i, className: 'loading'});


			// Add to list
			thumbnailListElement.appendChild(listItem);
			// Set the initial transparency
			setTransparency(listItem, config.thmbTransparency);

			if (i == 0) {
				thumbnailListItemWidht = getElPos(listItem).width;
				thumbnailListLeft = getElPos(thumbnailListElement).left;
				thumbnailVisibleCount = floor((windowWidth - (thumbnailListLeft * 2)) / thumbnailListItemWidht);
				thumbnailListElement.style.width = thumbnailListItemWidht * elementsCount + pxStr;
				highlightThumbnail(galleryIndex);

				// Show thumbnail if posible
				scrollThumbnailToView();
			}
		}
	}

	/*
	 * Preload and display the thumbnails
	 *
	 * @return void
	 */
	function loadThumbnails() {
		// If find files in queue and no active download and gallery is stil active
		if ((thumbnailDownloadQueue.length > 0) && !thumbnailDownloadActive && active) {
			// Get first item to download
			//var item = elements[thumbnailDownloadQueue.shift()];
			var
				itemIndex = thumbnailDownloadQueue.shift(),
				item = elements[itemIndex]
			;
			// Check if the selected item is not loaded
			if (!('thL' in item) && thumbnailListElement.childNodes[itemIndex]) {
				// Set download flag to true
				thumbnailDownloadActive = true;

				preloadImg(item.th, function (img) {
					//showMsg('loadThumbnails('+itemIndex+')');
					var
						imgProportions = img.width / img.height,
						imgWidht = autoStr,
						imgHeight = autoStr,
						imgTop = 0,
						listItem = thumbnailListElement.childNodes[itemIndex],
						imageElement = listItem.getElementsByTagName('img')[0] // Thumbnail image element
					;
					// Check if image proptortions is biger that the box proportios
					if (imgProportions > (config.thmbWidth / config.thmbHeight)) {
						imgWidht = config.thmbWidth + pxStr;
						imgTop = round((config.thmbHeight - (config.thmbWidth / imgProportions)) / 2);
					} else {
						imgHeight = config.thmbHeight + pxStr;
					}

					// Update the thumbnail preload status
					item.thL = 1;

					imageElement.src = img.src;
					imageElement.style.width = imgWidht;
					imageElement.style.height = imgHeight;
					imageElement.style.top = imgTop + pxStr;
					listItem.className = '';

					// Set flag to no active downloads
					thumbnailDownloadActive = false;

					// Load next item
					//loadThumbnails();
					setTimeout(loadThumbnails, 50);
				}, function () {
					// Set flag to no active downloads
					thumbnailDownloadActive = false;

					// Load next item if error hapened
					loadThumbnails();
					//setTimeout(loadThumbnails, 100);
				});
			} else {
				// Load next item if current is loaded
				loadThumbnails();
			}
		}
	}

	/*
	 * Show the current element
	 *
	 * This function preload the element, show it and highlight the thumbnail
	 *
	 * @return void
	 */
	function showElement() {
		if (!active) {
			return;
		}
		if (galleryPrevIndex === galleryIndex) {
			return;
		}
		//showMsg('showElement('+galleryIndex+')');
		// If scroll thumbnail index equal to the current index - disable scrolls
		if (thumbnailScrollIndex === galleryIndex) {
			thumbnailScrollUse = false;
		}
		// If scroll not use - sync to the current item
		if (!thumbnailScrollUse) {
			thumbnailScrollIndex = galleryIndex;
		}
		currentItemHighligted = false;

		// Update the window hash
		stateUpdate();

		var item = elements[galleryIndex];
		// If no preload image - loading it
		if (!('srcL' in item)) {
			//showMsg('item '+galleryIndex+' not loaded - load it');
			// Set flag to indicate the start downloading and prevent the 
			item.srcL = 0;
			showLoading();
			preloadImg(item.src, function (img) {
				// Set preload flag
				item.srcL = 1;
				// Save the image sizes
				item.width = img.width;
				item.height = img.height;
				hideLoading();
				rotateElements();
			}, function (e) {
				showMsg(sprintf(strings[7], item.title));
				hideLoading();
				// If error on loading - show the next or prev element based on last change
				if (getRotationDirection()) {
					showNextElement();
				} else {
					showPrevElement();
				}
				// Delete loading flag to try load element in next iteration
				delete item.srcL;
			});
		} else if (!!('srcL' in item) && !item.srcL) {
			// If element is not complety loaded - then show loading and wait
			showLoading();
		} else {
			// Show preloaded image
			rotateElements();
		}
	}

	/*
	 * Smart preload the next element in list
	 *
	 * This function preload the element, and show it if it selectd
	 *
	 * @return void
	 */
	function smartPreload() {
		if (config.smartPreload) {
			var
				preloadIndex,
				item
			;
			if (getRotationDirection()) {
				//showMsg('forward');
			} else {
				//showMsg('backward');
			}

			if (getRotationDirection()) {
				// Look forward
				preloadIndex = ((galleryIndex + 1 == elementsCount) ? -1 : galleryIndex) + 1;
			} else {
				// Look backward
				preloadIndex = ((galleryIndex == 0) ? elementsCount : galleryIndex) - 1;
			}
			//showMsg('preload img ' + preloadIndex + '<br />' + galleryIndex + ' - ' + galleryPrevIndex);

			item = elements[preloadIndex];

			// If no preload image - loading it
			if (!('srcL' in item)) {
				//showMsg('item '+galleryIndex+' not loaded');
				// Set flag to indicate the start downloading and prevent the 
				item.srcL = 0;
				preloadImg(item.src, function (img) {
					// Set preload flag
					item.srcL = 1;
					// Save the image sizes
					item.width = img.width;
					item.height = img.height;
					if (galleryIndex == preloadIndex) {
						// The element must be show
						rotateElements();
					}
					//showMsg('preload img for ' + preloadIndex + ' is complete');
				}, function (e) {
					// If canot load - show error message
					showMsg(sprintf(strings[7], item.title));
					// Delete loading flag to try load element in next iteration
					delete item.srcL;
				});
			}
		}
	}

	/*
	 * Switch the old image to new image adn update the image size
	 *
	 * @return void
	 */
	function rotateElements() {
		//showMsg('rotateElements() to ' + galleryIndex);
		// Show thumbnail if posible
		scrollThumbnailToView();

		// Preload next element based on current rotation direction
		smartPreload();

		// Highlight item anyway, not wait until the main image loaded
		deselectThumbnail(galleryPrevIndex);
		highlightThumbnail(galleryIndex);

		// Save pre
		galleryPrevIndex = galleryIndex;

		//var prevImageElement = createElement('div', {className: 'prev'});
		//prevImageElement.appendChild(imageElement.cloneNode(true));

		//bodyElement.appendChild(prevImageElement);
		//fade(prevImageElement, {time: 100, step: 10, handle: function(){bodyElement.removeChild(prevImageElement);}});
		//fade(imageElement, {start: 0, stop: 100, time: 250});

		// Show the element title
		showInfo();

		// Update the state
		stateUpdate();

		//imageElement.src = elements[galleryIndex].src;

		// Hide loading indicator
		hideLoading();

 		imageElement.parentNode.removeChild(imageElement);
		imageElement = createElement('img', {src: elements[galleryIndex].src});
		bodyElement.appendChild(imageElement);

/*

		nimageElement = createElement('img', {src: elements[galleryIndex].src});
		bodyElement.appendChild(nimageElement);
		imageElement.parentNode.removeChild(imageElement);
		imageElement = nimageElement;
*/
/*
		nimageElement = createElement('img', {src: elements[galleryIndex].src});
		imageElement.parentNode.replaceChild(nimageElement, imageElement);
		imageElement = nimageElement;

*/

		updateItemSize();

		//msgElement.insertBefore(item, msgElement.firstChild);

		//width = imageElement.style.width;
		//imageElement.style.width = '2px';
		//imageElement.style.width = width;
		//imageElement.style.zIndex = 1;
		//imageElement.style.zIndex = 2;
		//showMsg('visibility');

		// if slideshow is active - shedule show the next item and cancel the current shedule
		clearTimeout(slideShowTimer);
		if (slideShowActive) {
			slideShowTimer = setTimeout(showNextElement, config.slideshowDelay * 1e3);
		}
	}

	/*
	 * Get the rotation direction
	 *
	 * Return iteger true for forward rotation and false for backward rotation
	 *
	 * @return bool
	 */
	function getRotationDirection() {
		/*
		 * Move forward if
		 * - Current index biger that prev index but if prev is not first element and next is last element
		 * - Current index is first element and prew is last element
		 * In other case - move backward
		 */
		return !!(((galleryIndex == 0) && (galleryPrevIndex + 1 == elementsCount)) || ((galleryIndex > galleryPrevIndex) && !((galleryPrevIndex == 0) && (galleryIndex + 1 == elementsCount))));
	}

	/*
	 * Show the next element in list
	 *
	 * @return void
	 */
	function showNextElement() {
		// Check the end conditions of slideshow
		if (slideShowActive && (galleryIndex == (elementsCount - 1)) && !config.loopPlay) {
			// Stop slideshow on end element
			toogleSlideshow();
		}

		// Save the previsious index
		galleryPrevIndex = galleryIndex;
		// Rotate the curent index
		if (galleryIndex + 1 == elementsCount) {
			galleryIndex = 0;
		} else {
			galleryIndex++;
		}
		showElement();
	}

	/*
	 * Show the previsious element in list
	 *
	 * @return void
	 */
	function showPrevElement() {
		// Save the previsious index
		galleryPrevIndex = galleryIndex;
		// Rotate the curent index
		if (galleryIndex == 0) {
			galleryIndex = elementsCount - 1;
		} else {
			galleryIndex--;
		}
		showElement();
	}

	/*
	 * Start or stop the slideshow
	 * Note: becouse the slideshow status toggle at function start - in function conditions user reverse bool logic
	 *
	 * @return void
	 */
	function toogleSlideshow() {
		slideShowActive = !slideShowActive;

		if (!!slideShowActive) {
			showMsg(strings[8]);
			playElement.className = buttonClass + 'pause';
			// Shedule the items shwitch
			slideShowTimer = setTimeout(showNextElement, config.slideshowDelay * 1e3);
			// Hide controls even if mouse not moved
			hideCotrollsTimer = setTimeout(hideControlls, round(controllsHideTimeout * 1.5e3));
		} else {
			showMsg(strings[9]);
			playElement.className = buttonClass + 'play';
			clearTimeout(slideShowTimer);
			// If slideshow end - show the controls
			showControlls();
		}
	}

	/*
	 * Show the controll and thumbnail layers
	 *
	 * @return void
	 */
	function showControlls() {
		clearTimeout(hideCotrollsTimer);
		try {
			//clearTimeout(ee);
			//clearTimeout(ee3);
			//controlElement.style.top = '0px';
			//thumbnailElement.style.top = '0px';
			//alert('dd');
		} catch (e) {
			//alert(e + 'ds');
		}
		if (!cotrollsIsShow) {
			fade(controlElement, {start: 0, stop: 100});
			fade(thumbnailElement, {start: 0, stop: 100});
			//controlElement.style.visibility = '';
			//thumbnailElement.style.visibility = '';
			cotrollsIsShow = true;
		}

		hideCotrollsTimer = setTimeout(hideControlls, controllsHideTimeout);
	}

	/*
	 * Hide the controll and thumbnail layers
	 *
	 * @return void
	 */
	function hideControlls() {
		if (!!controllsInUse) {
			return;
		}
		//return;
		try {
			//ee = setInterval(function(){controlElement.style.top = ((isNaN(parseInt(controlElement.style.top))) ? 0 : (parseInt(controlElement.style.top) + 2)) + pxStr;}, 50);
			//ee3 = setInterval(function(){thumbnailElement.style.top = ((isNaN(parseInt(thumbnailElement.style.top))) ? 0 : (parseInt(thumbnailElement.style.top) - 2)) + pxStr;}, 50);
			//alert('dd');
		} catch (e) {
			//alert(e + 'ds');
		}
		fade(controlElement);
		fade(thumbnailElement);
		//controlElement.style.visibility = 'hidden';
		//thumbnailElement.style.visibility = 'hidden';
		cotrollsIsShow = false;
	}

	/*
	 * Highlight the some thumbnail
	 *
	 * @param	int		index			The index of element in list to highlight thumbnail
	 *
	 * @return void
	 */
	function highlightThumbnail(index) {
		if (!!thumbnailListElement.childNodes[index]) {
			//thumbnailListElement.childNodes[galleryIndex].scrollIntoView(true);

			/*
			 * if index of current highlighted element equal to curent gallery index - scroll to this element
			 * So you must call this function after the set the galleryIndex
			 */
			//showMsg('highlightThumbnail('+index+')');
			if (((index == galleryIndex) && !currentItemHighligted) || (index != galleryIndex)) {
				fade(thumbnailListElement.childNodes[index], {start: config.thmbTransparency, stop: 100, time: 200});
				// Bed code but it working
				if ((index == galleryIndex) && !currentItemHighligted) {
					// Set flag to current element is highlighted
					currentItemHighligted = !currentItemHighligted;
				}
			}
		}
	}

	/*
	 * Deselect the some thumbnail
	 *
	 * @param	int		index			The index of element in list to deselect thumbnail
	 *
	 * @return void
	 */
	function deselectThumbnail(index) {
		// -1 - initial state of the galleryPrevIndex
		if ((index != -1) && (index < thumbnailListElement.childNodes.length) && !!thumbnailListElement.childNodes[index]) {
			/*
			 * if index of current deselected element equal to curent galleryPrevIndex - dont deselect it
			 * So you must call this function before the overwriting the gallery previous index
			 */
			//showMsg('deselectThumbnail('+index+')');
			if (index != galleryIndex) {
				fade(thumbnailListElement.childNodes[index], {start: 100, stop: config.thmbTransparency, time: 800});
			}
		}
	}

	/*
	 * Scroll the thumbnail list to view the current element or scrcolled element
	 * This fucntion also controll the visibility of the thumbnail scroll elements
	 *
	 * @return void
	 */
	function scrollThumbnailToView() {
		var
			index = (thumbnailScrollUse ? thumbnailScrollIndex : galleryIndex),
			elementOffsetLeft = (thumbnailListElement.childNodes[index] || {}).offsetLeft, // Safe get the left offset
			offset, // Thumbnail list left offset
			thumbnailScrollVisible = true, // Is thumbnail scrolls is need to show
			firstItem = 0, // The first visible thumbnail index
			lastItem = elementsCount - 1 // The last visible thumbnail index
		;
		if (!thumbnailListElement.childNodes[index]) {
			return;
		}
		//showMsg('scrollThumbnailToView()');
		if (thumbnailVisibleCount >= elementsCount) {
			// If all thumbnails is show - no need the scrolls, and hide the scrolls elements
			offset = -round((windowWidth - (thumbnailListItemWidht * elementsCount) - (thumbnailListLeft * 2)) / 2);
			thumbnailScrollVisible = false;
		} else if (((elementOffsetLeft + (thumbnailListItemWidht / 2) + thumbnailListLeft) > (windowWidth / 2)) && (elementOffsetLeft < ((thumbnailListItemWidht * (elementsCount))) - (windowWidth / 2))) {
			// Show the middle of thumbnil list
			offset = (elementOffsetLeft + (thumbnailListItemWidht / 2) + thumbnailListLeft) - (windowWidth / 2);

			firstItem = index - round(thumbnailVisibleCount / 2);
			lastItem = index + round(thumbnailVisibleCount / 2);;
		} else if (elementOffsetLeft > ((thumbnailListItemWidht * elementsCount) - (windowWidth / 2))) {
			// Show the end of thumbnil list
			/*
			 * (thumbnailListLeft * 2) - neutralise's the left margin and add the same thing to right side
			 */
			offset = (thumbnailListItemWidht * elementsCount) + (thumbnailListLeft * 2) - windowWidth;
			firstItem = elementsCount - thumbnailVisibleCount - 1;
		} else {
			// Show the start of thumbnil list
			offset = 0;
			lastItem = thumbnailVisibleCount;
		}
		thumbnailScrollBox.style.display = (thumbnailScrollVisible) ? '' : 'none';
		thumbnailListElement.style.right = offset + pxStr;

		// Add visible thumbnail to download queue
		for (var i = firstItem; i <= lastItem; i++) {
			thumbnailDownloadQueue.push(i);
		}
		// Start downloadig queue
		loadThumbnails();
	}

	/*
	 * Scroll the thumbnail list left
	 *
	 * @return void
	 */
	function scrollThumbnailLeft() {
		// Set flag to using scrolls
		thumbnailScrollUse = true;

		if (thumbnailScrollIndex <= floor(thumbnailVisibleCount / 2)) {
			// On end scroll
			//thumbnailScrollIndex = elementsCount - floor(thumbnailVisibleCount / 2);
			thumbnailScrollIndex = 0;
		} else if (thumbnailScrollIndex >= elementsCount - floor(thumbnailVisibleCount / 2)) {
			//thumbnailScrollIndex = elementsCount - floor(thumbnailVisibleCount / 2) - 1;
			thumbnailScrollIndex = elementsCount - floor(thumbnailVisibleCount / 2) - 1;
		} else {
			// On scroll
			// Scroll to 1/2 display left
			thumbnailScrollIndex -= floor(thumbnailVisibleCount / 2);
			//thumbnailScrollIndex--;
		}
		// Check the min value
		if (thumbnailScrollIndex < 0) {
			thumbnailScrollIndex = 0;
		}
		//playElement.innerHTML = thumbnailScrollIndex;
		scrollThumbnailToView();
	}

	/*
	 * Scroll the thumbnail list right
	 *
	 * @return void
	 */
	function scrollThumbnailRight() {
		// Set flag to using scrolls
		thumbnailScrollUse = true;

		if (thumbnailScrollIndex >= elementsCount - floor(thumbnailVisibleCount / 2)) {
			// On end scroll
			//thumbnailScrollIndex = elementsCount - floor(thumbnailVisibleCount / 2);
			//thumbnailScrollIndex = floor(thumbnailVisibleCount / 2) - 1;
			thumbnailScrollIndex = elementsCount - 1;
		} else if (thumbnailScrollIndex < floor(thumbnailVisibleCount / 2)) {
			// On start scroll
			thumbnailScrollIndex = floor(thumbnailVisibleCount / 2) + 1 ;
		} else {
			// On scroll
			// Scroll to 1/2 display left
			thumbnailScrollIndex += floor(thumbnailVisibleCount / 2);
			//thumbnailScrollIndex++;
		}
		// Check the max value
		if (thumbnailScrollIndex >= elementsCount) {
			thumbnailScrollIndex = elementsCount - 1;
		}
		//playElement.innerHTML = thumbnailScrollIndex;
		scrollThumbnailToView();
	}

	/*
	 * Show the loading indicator on load the image
	 *
	 * @return void
	 */
	function showLoading() {
		// If no loading elemnt created - create it
		if (!loadingElement) {
			loadingElement = createElement('div', {className: 'loading', innerHTML: sprintf('<div class="box"><div class="text">%1</div></div>', strings[10])});
			var overlay = createElement('div', {className: 'overlay'});
			loadingElement.firstChild.appendChild(overlay);
			bodyElement.appendChild(loadingElement);
			setTransparency(overlay, 75);
		}
		loadingElement.style.display = '';
	}

	/*
	 * Hide the loading indicator on load the image
	 *
	 * @return void
	 */
	function hideLoading() {
		// If no loading elemnt exist - hide it
		if (loadingElement) {
			loadingElement.style.display = 'none';
		}
	}

	/*
	 * Show the system messages
	 *
	 * @param	string		msg			The message text
	 * @param	int		delayMult			The hidden delay multiplier
	 *
	 * @return void
	 */
	function showMsg(msg, delayMult) {
		if (!msg || msg.length < 1 || !msgElement) {
			return;
		}
		// Add the message to the list
		var item = createElement('li', {innerHTML: msg})
		msgElement.insertBefore(item, msgElement.firstChild);
		//msgElement.appendChild(item);
		fade(item, {start: 0, stop: 85});
		//msgElement.innerHTML = msg;

		// Shedule the hidding of the info
		setTimeout(function () {
			//return;
			fade(item, {
				start: 85,
				handle: function () {
					//msgElement.style.display = 'none';
					//msgElement.innerHTML = '';

					msgElement.removeChild(item);
				}
			});
		}, (delayMult) ? messagesHideTimeout * delayMult : messagesHideTimeout);
	}

	/*
	 * Show the info about file
	 *
	 * @param	string		msg			The message text
	 *
	 * @return void
	 */
	function showInfo() {
		var infoText = elements[galleryIndex].title;
		if (config.showItemInfo && (!infoText || infoText.length > 0)) {
			infoBodyElement.innerHTML = infoText;
			infoElement.style.display = '';
		} else {
			infoElement.style.display = 'none';
		}
	}

	/*
	 * Show help message
	 *
	 * @return void
	 */
	function showHelp() {
		showMsg(sprintf(strings[11], version), 3);
	}

	/*
	 * Recalculate the gallery size according to new window size
	 * Also this function update the image size and thumbnail list state
	 *
	 * @return void
	 */
	function updateGallerySize() {
		if (active) {
			//showMsg('updateGallerySize()');
			var windowSize = getWindowGeometry();
			// Save the new sizes
			windowWidth = windowSize.width;
			windowHeight = windowSize.height;
			//galleryElement.style.width = windowWidth + pxStr;
			//galleryElement.style.width = windowWidth + pxStr;
			//thumbnailElement.style.width = windowWidth + pxStr;
			galleryElement.style.height = windowHeight + pxStr;

			// Have potensial error but becouse not even time the varitables is accesible....
			if (elements[galleryIndex]) {
				// If current element is exist/set/not undefined then scrol to them and update item size
				thumbnailVisibleCount = floor((windowWidth - (thumbnailListLeft * 2)) / thumbnailListItemWidht);
				scrollThumbnailToView();
				updateItemSize();
			}
		}
	}

	/*
	 * Recalculate the item size to fill the gallery according to setings and window size
	 *
	 * @return void
	 */
	function updateItemSize() {
		var
			item = elements[galleryIndex],
			imageWidth = item.width,
			imageHeight = item.height,
			imgProportions = imageWidth / imageHeight,
			windowProportions = (windowWidth / windowHeight) * config.imgFillLevel,
			bigImage = ((imageWidth > (windowWidth * config.imgFillLevel)) || (imageHeight > (windowHeight * config.imgFillLevel))),
			width = autoStr,
			height = autoStr,
			top = 0,
			//left = 0,
			imageElementStyle = imageElement.style
		;
		/*
		 * Work only with preloaded images
		 * I check the windowHeight becouse the IE have strange bug - on some time the windowHeight is set as undefined
		 */
		if (!!('srcL' in item) && !!windowHeight) {
			//showMsg('updateItemSize()');
			if ((config.enlargeSmallImages && !bigImage) || bigImage) {
				if (imgProportions > windowProportions) {
					// Wide image
					width = round(windowWidth * config.imgFillLevel) + pxStr;
					top = round((windowHeight - ((windowWidth * config.imgFillLevel) / imgProportions)) / 2);
					//left = round((windowWidth - width) / 2) + pxStr;
				} else {
					//
					height = round(windowHeight * config.imgFillLevel) + pxStr;
					top = round((windowHeight - (windowHeight * config.imgFillLevel)) / 2);
					//left = round((windowWidth - imageWidth) / 2) + pxStr;
				}
			} else {
				top = round((windowHeight - imageHeight) / 2);
				//left = round((windowWidth - imageWidth) / 2) + pxStr;
			}
			// Apply styles
			imageElementStyle.width = width;
			imageElementStyle.height = height;
			imageElementStyle.top = top + pxStr;
			//imageElementStyle.left = left;
		}
	}

	/*
	 * Check the current state of gallery
	 *
	 * @param	bool		updateIndexOnly			Not show the element, only update the galleryIndex
	 *
	 * @return void
	 */
	function stateCheck() {
		var
			hashIndex
		;
		// Save previsous state if not exist
		/* if (prevWindowHash != hash) {
			prevWindowHash = hash;
		} */

		// Try to get the hash index
		hashIndex = getHahsIndex();

		if (hashIndex !== false) {
			if (!active) {
				show();
			}
			if ((hashIndex - 1) !== galleryIndex) {
				// Update current index of element
				galleryIndex = hashIndex - 1;
				// Show the selected element
				showElement();
			}
		} else {
			if (active) {
				//showMsg('Must be closed');
				exit();
			}
		}
	}

	/*
	 * Get the index of element from window hash and return it or return false if cannot get it
	 *
	 * @return mixed
	 */
	function getHahsIndex() {
		var
			hash = window.location.hash,
			result = false // Set result default to false
		;
		if (hash.indexOf('slideshow') == 1) {
			// Split the hash by slash "/"
			hash = hash.split('/');

			if (hash.length > 1) {
				// If he has more than one item - continue
				hash = parseInt(hash[1]);
				// Check if index is not a NaN and not out of range (1 <= hash <= elementsCount)
				if (!isNaN(hash) && (!elementsCount || ((hash <= elementsCount) &&  (hash > 0)))) {
					result = hash;
				}
			} else {
				// If not index selected - return 1
				result = 1;
			}
		}
		return result;
	}

	/*
	 * Update the current state of gallery in window hash
	 *
	 * @return void
	 */
	function stateUpdate() {
		var
			hash
		;
		// If hash changed science last check
		if (active) {
			// If current hash index equal to gallery index - do nothing
			if (getHahsIndex() !==  (galleryIndex + 1)) {
				window.location.hash =  'slideshow/' + (galleryIndex + 1) + '/' + encodeURI(encodeURI(elements[galleryIndex].src));
			}
		} else {
			window.location.hash =  windowHash;
		}
	}

	return {
		init: function(userConfig) {
			/*
			 * Initialise the gallery
			 *
			 * return void
			 */
			//showMsg('init()');
			extend(config, userConfig || {});

			// Start check the window hash
			stateCheckTimer = setInterval(stateCheck, config.stateCheckInterval * 1e3);

			if (config.autoShow) {
				// Build HTML and attach the events
				show();
			}
		},
		show: function(elements) {
			/*
			 * Show the gallery
			 *
			 *
			 *
			 * return void
			 */
			//showMsg('show()');

			// Load new elements
			if (elements) {
				config.elements = elements;
			}

			// Build HTML and attach the events
			show();
		},
		exit: function() {
			/*
			 * Exit the gallery
			 *
			 * return void
			 */
			exit();
		}
	}
})()

