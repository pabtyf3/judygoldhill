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
 * Note - Charset replace
 * 	ß - &szlig;
 * 	ä - &auml;
 * 	ü - &uuml;
 * 	' - &#39;
 *
 *
 * Requirements:
 * - PHP 4.1.x or later
 ********************************************************************/

$msg = array(

/*HTML Messages*/
'Insert Image:'=>'Bild einf&uuml;gen:',
'Image URL:'=>'Bild URL:',
'Alternate Text:'=>'Alternativ Text:',
'Layout:'=>'Layout:',
'Width:'=>'Breite:',
'Height:'=>'H&ouml;he:',
'Border:'=>'Rahmen:',
'Preview:'=>'Vorschau:',
'File size:'=>'Dateigr&ouml;&szlig;e:',
'File date:'=>'Hochgeladen am:',
'Alignment:'=>'Ausrichtung:',
'Not Set'=>'nicht festgelegt',
'Left'=>'links',
'Right'=>'rechts',
'Texttop'=>'Text oben',
'Absmiddle'=>'Absatz mittig',
'Baseline'=>'Grundlinie',
'Absbottom'=>'Absatz unten',
'Bottom'=>'unten',
'Middle'=>'mitte',
'Top'=>'oben',
'Horizontal Space:'=>'horizontaler Zwischenraum:',
'Vertical Space:'=>'vertikaler Zwischenraum:',
'imgLib for'=>'imgLib f&uuml;r',
'Please enable JavaScript to display files.'=>'Bitte aktivieren Sie Javascript zum Anzeigen der Dateien.',
'Submit'=>'Abschicken',
'Cancel'=>'Abbrechen',

/*JavaScript Messages*/
'b'=>'b',
'Kb'=>'Kb',
'Mb'=>'Mb',
'Gb'=>'Gb',
'Tb'=>'Tb',
'Eb'=>'Eb',
'Root'=>'Root',
'Enter name of new directory'=>'neuen Ordnernamen eingeben',
'Loading...'=>'Lade...',
'Up'=>'Auf',
'Remove not empty folder "%1"?'=>'In dem Ordner "%1" befinden sich Dateien, soll dieser Ordner wirklich gel&ouml;scht werden?',
'Remove "%1"?'=>'L&ouml;sche "%1"?',
'Enter name of new directory:'=>'neuen Ordnernamen eingeben:',
'New Folder'=>'neuer Ordner',
'Enter new name of "%1":\n(file extension is add automatic)'=>'neuen Namen von "%1" eingeben:\n(Dateierweiterung wird automatisch hinzugef&uuml;gt)',
'Operation failed. Error code is %1.'=>'Vorgang fehlgeschlagen. Fehlercode %1.',
'This script reguire browser that support the AJAX tehnology!'=>'Dieses Skript ben&ouml;tigt einen Browser der die Ajax-Technoligie unterst&uuml;tzt!',
'No change!'=>'keine &Auml;nderung!',
'Create folder'=>'Ordner erstellen',
'Select thumbnail'=>'W&auml;hlen thumbnaill',
'Open'=>'&Ouml;ffnen',
'Browse'=>'Durchsuchen',
'Copy'=>'Kopieren',
'Cut'=>'Ausschneiden',
'Paste'=>'Einf&uuml;gen',
'Delete'=>'L&ouml;schen',
'Rename'=>'Umbenennen',
'Reload curent directory'=>'Verzeichnis aktualisieren',
'File name'=>'Dateiname',
'File size'=>'Dateigr&ouml;&szlig;e',
'File date'=>'Hochgeladen am',
'Date'=>'Datum',
'Size'=>'Gr&ouml;&szlig;e',
'Image size'=>'Bild Abmessungen',
'View'=>'Ansicht',
'Thumbnail'=>'Miniaturansicht',
'List'=>'Liste',
'Table'=>'Tabelle',
'Search'=>'Suchen',
'Enter part of file name:'=>'Geben Sie einen Teil des Dateinamens ein:',
'Sort'=>'Sortieren nach',
'By name'=>'Name',
'By size'=>'Gr&ouml;&szlig;e',
'By date'=>'Datum',
'Upload'=>'Hochladen',
'Cancel'=>'Abbrechen',
'Directory is write protected!'=>'Verzeichnis ist Schreibgesch&uuml;tzt!',
'Add more field'=>'Zus&auml;tzliches Feld hinzuf&uuml;gen',
'Delete field'=>'Feld entfernen',
'Select first file'=>'Erste Datei ausw&auml;hlen',
'Allowed extension: %1.'=>'Zugelassene Dateierweiterungen: %1.',
'Max upload size (total/file): %1/%2.'=>'Maximale Dateigr&ouml;&szlig;e (Insgesamt/Datei): %1/%2.',
'Path: %1'=>'Verzeichnis: %1',
'Your browser supports multiple selection of files to upload. Try it.'=>'Ihr Browser unterst&uuml;tzt die Mehrfachauswahl von dateien zum hochladen. Probieren Sie es aus.',
'Uploaded files: %1. Name(s): %2.'=>'Hochgeladene dateien: %1. Name(n): %2.',
'Automatically close the form after upload is finished.' => 'Automatisch schlie&szlig;en Sie das formular nach dem upload abgeschlossen ist.',
'No file selected!' => 'Keine datei ausgew&auml;hlt!',

// HTML5 File API
'Your browser supports easy &quot;drag & drop&quot; files upload. Try it - select file and drag it to browser.' => 'Ihr browser unterst&uuml;tzt die einfache &quot;drag & drop&quot; dateien hochladen. Probieren Sie es aus - w&auml;hlen Sie datei und ziehen Sie an den browser.',
'Saved as: %1.' => 'Gespeichert als: %1.',
'Drop your files here' => 'Lassen Sie Ihre dateien hier',
'Speed' => 'Speed',
'/s' => '/s',
'Time left' => 'Zeit bleibt',
'Time' => 'Zeit',
's' => 's',
'Waiting in queue' => 'Warten in der warteschlange',
'Canceled' => 'Abgesagt',
'Abort' => 'Abbrechen',
'Aborted' => 'Abgebrochen',
'Try again' => 'Versuchen Sie es erneut',
'Error on upload' => 'Fehler beim upload',
'Error on response: ' => 'Fehler bei der antwort: ',
'File type: ' => 'Dateiformat: ',
'unknown' => 'unbekannt',
// Error code description
'Bad file name.' => 'Bad dateinamen.',
'Folder is not writable.' => 'Folder ist nicht beschreibbar.',
'Can not get free file name.' => 'Can&#39;t get free dateinamen.',
'Illegal file type.' => 'Illegale dateityp.',
'File size limit exceeded.' => 'Dateigrö&szlig;e &uuml;berschritten.',
'Some error when move upload file.' => 'Einige fehler beim upload-datei zu bewegen.',
'No free space left.' => 'Kein freier platz mehr.',
'Local and remote file sizes do not match.' => 'Lokale und remote-dateigrö&szlig;en stimmen nicht &uuml;berein.',


'Edit'=>'Bearbeiten',
'Select'=>'Ausw&auml;hlen',
'Selected file'=>'Datei ausw&auml;len',
'No return callback'=>'R&uuml;ckg&auml;ngig nicht m&ouml;glich',

/*JavaScript Image Tools*/
'Error loading data!'=>'Fehler beim Laden der Daten!',
'Crop image. Please wait.'=>'Bild wird freigestellt. Bitte warten.',
'Resize image. Please wait.'=>'Bild wird skaliert. Bitte warten.',
'Rotate/Flip image. Please wait.'=>'Bild wird gedreht/gespiegelt. Bitte warten.',
'Loading preview....'=>'Lade Vorschau....',
'Error: '=>'Fehler: ',
'Loading....'=>'Lade....',


'Resize image'=>'Bild skalieren',
'Crop image'=>'Bild freistellen',
'Rotate/Flip image'=>'Bild drehen/spiegeln',
'Close'=>'Schlie&szlig;en',
'Size'=>'Gr&ouml;&szlig;e',
'Apply'=>'Anwenden',
'Save changes'=>'&Auml;nderungen speichern',
'Reset'=>'Zur&uuml;cksetzen',
'Reset to original size'=>'Originalgr&ouml;&szlig;e wiederherstellen',
'Save proportions'=>'Proportionen beibehalten',
'Width'=>'Breite',
'Height'=>'H&ouml;he',
'Selected area: from'=>'Bereich ausw&auml;hlen: von',
'to'=>'bis',
'Apply crop'=>'Freistellung anwenden',
'Rotate'=>'Drehen',
'90&deg; CCW'=>'90&deg; GUZS',
'Rotate 90 degrees counterclockwise'=>'90 Grad gegen Uhrzeigersinn drehen',
'90&deg; CW'=>'90&deg; UZS',
'Rotate 90 degrees clockwise'=>'90 Grad im Uhrzeigersinn drehen',
'Flip'=>'Spiegeln',
'horisontal'=>'horizontal',
'vertical'=>'vertikal',
'Image Tools for'=>'Bildbearbeitungswerkzeuge f&uuml;r'


);
?>