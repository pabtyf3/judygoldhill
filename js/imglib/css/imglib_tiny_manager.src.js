/********************************************************************
 * imgLib v0.1.2 09.04.2011
 * Contact me at dev@jstoys.org.ua
 * Site: http://jstoys.org.ua/
 * This copyright notice MUST stay intact for use.
 ********************************************************************/

var imgLibManager = {
	init: function (conf) {
		/*
			conf = {
				width: 600, // Open window width
				height: 500, // Open window height
				returnTo: 'src' // Calback function name or element id to insert the selected file path
				url: '/scripts/imglib/index.html', // Path to the imgLIb start html file
				configName: '' // The imgLib configuration name. Default empty.
			}
		*/
		conf = conf || {};

		this.width = conf.width || 600;
		this.height = conf.height || 500;
		this.returnTo = conf.returnTo || '';
		this.url = conf.url || '/scripts/imglib/index.html';
		this.configName = conf.configName || '';
	},
	open: function (field_name, url, type, win) {
		var searchString = window.location.search; // possible parameters
		if (searchString.length < 1) {
			// add "?" to the URL to include parameters (in other words: create a search string because there wasn't one before)
			searchString = "?";
		}

		this.url = this.url + searchString + "&type=" + type + ((!!this.configName) ? ('#configName=' + this.configName) : '' );

		tinyMCE.activeEditor.windowManager.open({
			file: this.url,
			title: 'ImgLib v.0.1.2',
			width: this.width, // Your dimensions may differ - toy around with them!
			height: this.height,
			resizable: "yes",
			inline: "no", // This parameter only has an effect if you use the inlinepopups plugin!
			close_previous: "no",
			popup_css: false // Disable TinyMCE's default popup CSS
		}, {
			window: win,
			input: field_name
		});
		return false;
	}
};