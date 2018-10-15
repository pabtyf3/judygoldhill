<?php

// Check of correct call
if (!isset($CFG) || empty($CFG)) {
	exit;
}

if (isset($_GET['getConfig'])) {
		$CFG['contextItems'][] = array(
			'text' => m('Slideshow'), // The display item text
			//width=100%, height=100%, 
			'handle' => 'function (){window.open("modules/slideshow/index.html","slideshow","location=0, status=no, toolbar=no, menubar=no, scrollbars=no, resizable=yes",true)}', // Handle of function to extcute when the item click
			//'cssClass' => '', // css class of icons, empty or not set to disable
			'show' => 'function (context_element) {return context_element.type != 1;}', // When don't/show item
		);
	}
/*

// Open handle
function () {
	var url = 'modules/slideshow/index.html';
	// Open window
	window.open(url, 'slideshow', 'width=100%, height=100%, location=0, status=no, toolbar=no, menubar=no, scrollbars=no, resizable=yes', true);
}
*/
?>