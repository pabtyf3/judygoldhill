<?php include("../../includes/config.inc");
/*
Uploadify
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

// Define a destination
$targetFolder = '/_temp'; // Relative to the root
/*
if (!empty($_FILES)) {
	$tempFile = $_FILES['Filedata']['tmp_name'];
	$targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;
	$targetFile = rtrim($targetPath,'/') . '/' .$_POST['id']."_" .$_FILES['Filedata']['name'];
	$fName = $_POST['id']."_" .$_FILES['Filedata']['name'];
	// Validate the file type
	$fileTypes = array('jpg','jpeg','gif','png','pdf','doc','docx','xls','xlsx'); // File extensions
	$fileParts = pathinfo($_FILES['Filedata']['name']);
	
	if (in_array($fileParts['extension'],$fileTypes)) {
		move_uploaded_file($tempFile,$targetFile);
        
        $im = new projectimage();
        $im->add($fName,$_POST['id']);
       
        
        
		echo '1';
	} else {
		echo 'Invalid file type.';
	}
}
*/
//$fName = $_POST['id']."_" .$_FILES['Filedata']['name'];
//$im = new image();
//$tim = $im->upload($targetFolder);
$f = new pdfFile();
$f->upload();
       

?>