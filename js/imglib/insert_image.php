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
 * - openWYSIWYG v1.4.6 or later
 ********************************************************************/
 
require('include'.DIRECTORY_SEPARATOR.'config.php');
require('include'.DIRECTORY_SEPARATOR.'function.php');

// Get the identifier of the editor
$wysiwyg = isset($_GET['wysiwyg']) ? $_GET['wysiwyg'] : '';

/*------------------------------ Script Messages -------------------------------------------------*/


$lang_inc_path = 'include'.DIRECTORY_SEPARATOR.'lang'.DIRECTORY_SEPARATOR;
// Chose language
$langs = get_http_langs();
foreach($langs as $key => $val) {
	if (strpos($key, 'uk') === 0) {
		$lang_file = $lang_inc_path.'lang_uk.php';
	} else if (strpos($key, 'ru') === 0) {
		$lang_file = $lang_inc_path.'lang_ru.php';
	} else if (strpos($key, 'fr') === 0) {
		$lang_file = $lang_inc_path.'lang_fr.php';
	} else if (strpos($key, 'de') === 0) {
		$lang_file = $lang_inc_path.'lang_de.php';
	} else if (strpos($key, 'en') === 0) {
		$lang_file = $lang_inc_path.'lang_en.php';
	}
}
// Use default language if nothing find
$lang_file = (isset($lang_file)) ? $lang_file : $lang_inc_path.'lang_en.php';
// Include language file
if (file_exists($lang_file) && is_file($lang_file)) {
	global $msg;
	include($lang_file);
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>openWYSIWYG | Insert Image</title>
<link href="css/insert_image.css" type="text/css" rel="stylesheet" />
<script type="text/javascript" src="../../scripts/wysiwyg-popup.js"></script>
<script src="css/core.js" type="text/javascript"></script>
<script src="css/insert_image.js" type="text/javascript"></script>
</head>
<body>

<form method="post" action="" enctype="multipart/form-data" onsubmit="insertImage(); return false;">
	<table id="main" border="0" cellpadding="0" cellspacing="0" style="">
		<tr>
			<td style="vertical-align:top;"  colspan="2">
				<span id="ins_id"><?php echo m('Insert Image:'); ?></span>
				<div id="ins">
					<table width="100%" id="url_tbl" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td width="30%"><?php echo m('Image URL:'); ?></td>
							<td width=""><input type="text" name="src" id="src" value="" onchange="showPreview();" /><noscript>Your browser does not support or blocks JavaScript!</noscript><input type="button" onclick="imgLibManager.open(); return false;" value="<?php echo m('Browse'); ?>" style="width:auto; float:right; padding: 0 10px;" /></td>
						</tr>
						<tr>
							<td ><?php echo m('Alternate Text:'); ?></td>
							<td><input type="text" name="alt" id="alt" value="" /></td>
						</tr>
					</table>
					<table width="100%" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<td style="vertical-align:top;">
								<span style="font-weight: bold;"><?php echo m('Layout:'); ?></span>
								<table id="layout_tbl" border="0" cellpadding="0" cellspacing="0">
									<tr>
										<td><?php echo m('Width:'); ?></td>
										<td style="width:60px;"><input type="text" name="width" id="width" value="" /></td>
									</tr>
									<tr>
										<td><?php echo m('Height:'); ?></td>
										<td><input type="text" name="height" id="height" value="" /></td>
									</tr>
									<tr>
										<td><?php echo m('Border:'); ?></td>
										<td><input type="text" name="border" id="border" value="0" /></td>
									</tr>
								</table>
							</td>
							<td width="10" colspan="1" rowspan="2">&nbsp;</td>
							<td style="vertical-align:top;" align="left" colspan="1" rowspan="2">
								<span style="font-weight: bold;"><?php echo m('Preview:'); ?></span>
								<div id="file_info"><div><div><?php echo m('File size:'); ?> <span id="file_size"></span><br /><?php echo m('File date:'); ?> <span id="file_date"></span></div></div></div>
								<table id="preview_tbl" border="0" cellpadding="0" cellspacing="0">
									<tr>
										<td>
											<img id="preview" src="" />
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td style="vertical-align:bottom;">
								<table id="align_tbl" border="0" cellpadding="0" cellspacing="0">
									<tr>
										<td><?php echo m('Alignment:'); ?></td>
										<td style="width:60px;">
											<select name="align" id="align" style="width:100%;">
												<option value=""><?php echo m('Not Set'); ?></option>
												<option value="left"><?php echo m('Left'); ?></option>
												<option value="right"><?php echo m('Right'); ?></option>
												<option value="texttop"><?php echo m('Texttop'); ?></option>
												<option value="absmiddle"><?php echo m('Absmiddle'); ?></option>
												<option value="baseline"><?php echo m('Baseline'); ?></option>
												<option value="absbottom"><?php echo m('Absbottom'); ?></option>
												<option value="bottom"><?php echo m('Bottom'); ?></option>
												<option value="middle"><?php echo m('Middle'); ?></option>
												<option value="top"><?php echo m('Top'); ?></option>
											</select>
										</td>
									</tr>
									<tr>
										<td><?php echo m('Horizontal Space:'); ?></td>
										<td><input type="text" name="hspace" id="hspace" value="" /></td>
									</tr>
									<tr>
										<td><?php echo m('Vertical Space:'); ?></td>
										<td><input type="text" name="vspace" id="vspace" value="" /></td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</div>
			</td>
		</tr>
		<tr>
			<td align="left" style="padding-top: 5px;">
				<div id="about">
					<?php echo m('imgLib for'); ?> <a href="http://www.openwebware.com/" target="_blank">openWYSIWYG</a> (ver. 0.1.2). <br /><a href="http://jstoys.org.ua/" target="_blank">jstoys.org.ua</a>
				</div>
			</td>
			<td align="right" style="padding-top: 5px;">
				<button type="button" onclick="insertImage(); return false;">&nbsp;&nbsp;<?php echo m('Submit'); ?>&nbsp;&nbsp;</button>
				<button type="button" onclick="window.close();">&nbsp;&nbsp;<?php echo m('Cancel'); ?>&nbsp;&nbsp;</button>
			</td>
		</tr>
		<tr>
			<td align="left" style="padding-top: 5px;">
			</td>
		</tr>
	</table>
</form>
</body>
</html>