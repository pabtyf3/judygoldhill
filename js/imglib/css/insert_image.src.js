/********************************************************************
 * imgLib v0.1.2 09.04.2011
 * Contact me at dev@jstoys.org.ua
 * Site: http://jstoys.org.ua/
 * This copyright notice MUST stay intact for use.
 ********************************************************************/

//First process the image chose to get potential dir to browse
addEvent(window, "load", function () {
	loadImage();
});
var imgLibManager = {
	init: function (conf) {
		/*
			conf = {
				width: 600, // Open window width
				height: 600, // Open window height
				returnTo: 'src' // Calback function name or element id to insert the selected file path
			}
		*/
		conf = conf || {};
		this.width = conf.width || 600;
		this.height = conf.height || 500;
		this.returnTo = conf.returnTo || '';
	},
	open: function () {
		var url = 'index.html' + ((this.returnTo !== '') ? ('?returnto=' + this.returnTo) : '');
		window.open(url, 'imglib', 'width=' + this.width + ', height=' + this.height + ', location=0, status=no, toolbar=no, menubar=no, scrollbars=yes, resizable=yes');
	}
};
imgLibManager.init({returnTo: 'selectImage'});


function showPreview() {
	$('preview').src = $('src').value;
	$('preview').style.visibility = 'visible';
}

function selectImage(url, info) {
	$('src').value = url;
	// Show preview image
	if (!info) {
		showPreview();
	} else {
		var
			img_size = info.img_size.split('x'),
			file_info = $('file_info'),
			file_date = getDateF(info.date * 1000, 1),
			file_size = getHumanSize(info.filesize),
			preview_img = new Image()
		;
		$('width').value = img_size[0];
		$('height').value = img_size[1];

		$('preview').setAttribute('src', info.wwwThumbPath);
/*
	preview.style.width = 'auto';
	preview.style.height = 'auto';
*/
		$('file_size').innerHTML = file_size;
		$('file_date').innerHTML = file_date;

		preview_img.onload = function () {
			var
				preview = $('preview'),
				src_w = preview_img.width,
				src_h = preview_img.height,
				dst_ratio = (src_w / 200 > src_h / 150) ? (src_w / 200) : (src_h / 150),
				dst_w = Math.round(src_w / dst_ratio),
				dst_h = Math.round(src_h / dst_ratio)
			;
			if ((src_w !== dst_w) || (src_h !== dst_h)) {
				preview.style.width = dst_w + 'px';
				preview.style.height = dst_h + 'px';
			}
			file_info.style.display = 'block';
			setTransparency(file_info.getElementsByTagName('div')[1], 80);
			preview.setAttribute('src', info.wwwThumbPath);
			$('preview').style.visibility = 'visible';
			//Redraw bug
			preview.parentNode.innerHTML = preview.parentNode.innerHTML;
		};
		preview_img.src = info.wwwThumbPath;
	}
}

/* ---------------------------------------------------------------------- *\
  Function    : insertImage()
  Description : Inserts image into the WYSIWYG.
\* ---------------------------------------------------------------------- */
function insertImage() {
	var
		n = WYSIWYG_Popup.getParam('wysiwyg'),
		// get values from form fields
		src = document.getElementById('src').value,
		alt = document.getElementById('alt').value,
		width = document.getElementById('width').value,
		height = document.getElementById('height').value,
		border = document.getElementById('border').value,
		align = document.getElementById('align').value,
		vspace = document.getElementById('vspace').value,
		hspace = document.getElementById('hspace').value
	;

	// insert image
	WYSIWYG.insertImage(src, width, height, align, border, alt, hspace, vspace, n);
	window.close();
}

/* ---------------------------------------------------------------------- *\
  Function    : loadImage()
  Description : load the settings of a selected image into the form fields
\* ---------------------------------------------------------------------- */
function loadImage() {
	var n = WYSIWYG_Popup.getParam('wysiwyg');
	if (!n || !WYSIWYG) return;
	// get selection and range
	var sel = WYSIWYG.getSelection(n);
	var range = WYSIWYG.getRange(sel);

	// the current tag of range
	var img = WYSIWYG.findParent("img", range);

	// if no image is defined then return
	if(img == null) return;

	// assign the values to the form elements
	for(var i = 0;i < img.attributes.length;i++) {
		var attr = img.attributes[i].name.toLowerCase();
		var value = img.attributes[i].value;
		if(attr && value && value != "null") {
			switch(attr) {
				case "src":
					// strip off urls on IE
					if(WYSIWYG_Core.isMSIE) value = WYSIWYG.stripURLPath(n, value, false);
					document.getElementById('src').value = value;
					/*---------- imgLib support ------*/
					selectImage(value);
					/*------- End imgLib support ------*/
				break;
				case "alt":
					document.getElementById('alt').value = value;
				break;
				case "align":
					selectItemByValue(document.getElementById('align'), value);
				break;
				case "border":
					document.getElementById('border').value = value;
				break;
				case "hspace":
					document.getElementById('hspace').value = value;
				break;
				case "vspace":
					document.getElementById('vspace').value = value;
				break;
				case "width":
					document.getElementById('width').value = value;
				break;
				case "height":
					document.getElementById('height').value = value;
				break;
			}
		}
	}

	// get width and height from style attribute in none IE browsers
	if(!WYSIWYG_Core.isMSIE && document.getElementById('width').value == "" && document.getElementById('width').value == "") {
		document.getElementById('width').value = img.style.width.replace(/px/, "");
		document.getElementById('height').value = img.style.height.replace(/px/, "");
	}
}

/* ---------------------------------------------------------------------- *\
  Function    : selectItem()
  Description : Select an item of an select box element by value.
\* ---------------------------------------------------------------------- */
function selectItemByValue(element, value) {
	if(element.options.length) {
		for(var i=0;i<element.options.length;i++) {
			if(element.options[i].value == value) {
				element.options[i].selected = true;
			}
		}
	}
}