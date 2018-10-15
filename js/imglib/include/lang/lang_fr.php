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
'Insert Image:'=>'Insérer Image:',
'Image URL:'=>'Image URL:',
'Alternate Text:'=>'Texte secondaire:',
'Layout:'=>'Disposition:',
'Width:'=>'Largeur:',
'Height:'=>'Hauteur:',
'Border:'=>'Bordure:',
'Preview:'=>'Prévisualisation:',
'File size:'=>'Taille:',
'File date:'=>'Date:',
'Alignment:'=>'Alignement:',
'Not Set'=>'Non fixé',
'Left'=>'Gauche',
'Right'=>'Droite',
'Texttop'=>'Haut du texte',
'Absmiddle'=>'Milieu absolu',
'Baseline'=>'Bas du texte',
'Absbottom'=>'Bas absolu',
'Bottom'=>'Bas',
'Middle'=>'Milieu',
'Top'=>'Haut',
'Horizontal Space:'=>'Espacement Horizontal:',
'Vertical Space:'=>'Espacement Vertical:',
'imgLib for'=>'imgLib pour',
'Please enable JavaScript to display files.'=>'Veuillez activer JavaScript pour afficher les fichiers.',
'Submit'=>'Envoyer',
'Cancel'=>'Annuler',

/*JavaScript Messages*/
'b'=>'b',
'Kb'=>'Kb',
'Mb'=>'Mb',
'Gb'=>'Gb',
'Tb'=>'Tb',
'Eb'=>'Eb',
'Root'=>'Racine',
'Enter name of new directory'=>'Nom du nouveau dossier',
'Loading...'=>'Chargement...',
'Up'=>'Up',
'Remove not empty folder "%1"?'=>'Supprimer le dossier non vide "%1"?',
'Remove "%1"?'=>'Supprimer "%1"?',
'Enter name of new directory:'=>'Nom du nouveau dossier:',
'New Folder'=>'Nouveau dossier',
'Enter new name of "%1":\n(file extension is add automatic)'=>'Nouveau nom de "%1":\n(l\\\'extension est ajoutée automatiquement)',
'Operation failed. Error code is %1.'=>'Echec de l\\\'opération. Code erreur %1.',
'This script reguire browser that support the AJAX tehnology!'=>'Ce script requiert que le navigateur supporte la technologie AJAX!',
'No change!'=>'Pas de changement!',
'Create folder'=>'Créer dossier',
'Select thumbnail'=>'Sélectionner la vignette',
'Open'=>'Ouvrir',
'Browse'=>'Naviguer',
'Copy'=>'Copier',
'Cut'=>'Couper',
'Paste'=>'Coller',
'Delete'=>'Effacer',
'Rename'=>'Renommer',
'Reload curent directory'=>'Rafraîchir le dossier actuel',
'File name'=>'Nom',
'File size'=>'Taille',
'File date'=>'Date',
'Date'=>'Date',
'Size'=>'Size',
'Image size'=>'Taille image',
'View'=>'Affichage',
'Thumbnail'=>'Vignette',
'List'=>'Liste',
'Table'=>'Table',
'Search'=>'Chercher',
'Enter part of file name:'=>'Saisir une partie du nom:',
'Sort'=>'Trier',
'By name'=>'Par nom',
'By size'=>'Par taille',
'By date'=>'Par date',
'Upload'=>'Upload',
'Cancel'=>'Annuler',
'Directory is write protected!'=>'Dossier protégé en écriture!',
'Add more field'=>'Add more field',
'Delete field'=>'Delete field',
'Select first file'=>'Sélectionner le premier fichier',
'Allowed extension: %1.'=>'Extensions permises: %1.',
'Max upload size (total/file): %1/%2.'=>'Taille max d&#39;envoi (total/fichier): %1/%2.',
'Path: %1'=>'Chemin: %1',
'Your browser supports multiple selection of files to upload. Try it.'=>'Votre navigateur prend en charge la sélection multiple de fichiers à télécharger. Essayez-le.',
'Uploaded files: %1. Name(s): %2.'=>'Fichiers téléchargés: %1. Nom(s): %2.',
'Automatically close the form after upload is finished.' => 'Fermer automatiquement la forme après l&#39;upload est terminé.',
'No file selected!' => 'Aucun fichier sélectionné!',

// HTML5 File API
'Your browser supports easy &quot;drag &amp; drop&quot; files upload. Try it - select file and drag it to browser.' => 'Votre navigateur prend en charge facile &quot;drag &amp; drop&quot; upload de fichiers. Essayez - sélectionnez le fichier et faites-la glisser vers le navigateur.',
'Saved as: %1.' => 'Enregistré en tant que: %1.',
'Drop your files here' => 'Déposez vos fichiers ici',
'Speed' => 'Vitesse',
'/s' => '/s',
'Time left' => 'Reste du temps',
'Time' => 'Temps',
's' => 's',
'Waiting in queue' => 'Attente dans la file d&#39;attente',
'Canceled' => 'Annulés',
'Abort' => 'Avorter',
'Aborted' => 'Abandon',
'Try again' => 'Essayez encore',
'Error on upload' => 'Erreur sur upload',
'Error on response: ' => 'Erreur sur la réponse: ',
'File type: ' => 'Type de fichier: ',
'unknown' => 'inconnue',
// Error code description
'Bad file name.' => 'Nom de fichier incorrect.',
'Folder is not writable.' => 'Dossier n&#39;est pas accessible en écriture.',
'Can not get free file name.' => 'Impossible d&#39;obtenir le nom de fichier libre.',
'Illegal file type.' => 'Type de fichier illégal.',
'File size limit exceeded.' => 'Fichier limite de taille dépassé.',
'Some error when move upload file.' => 'Certains d&#39;erreur lorsque déplacer télécharger le fichier.',
'No free space left.' => 'Pas d&#39;espace libre à gauche.',
'Local and remote file sizes do not match.' => 'La taille des fichiers locaux et distants ne correspondent pas.',



'Edit'=>'Modifier',
'Select'=>'Sélectionner',
'Selected file'=>'Fichier sélectionné',
'No return callback'=>'No return callback',

/*JavaScript Image Tools*/
'Error loading data!'=>'Erreur chargement des données!',
'Crop image. Please wait.'=>'Recadrage image. Veuillez patienter.',
'Resize image. Please wait.'=>'Changement de taille image. Veuillez patienter.',
'Rotate/Flip image. Please wait.'=>'Rotation/Symétrie image. Veuillez patienter.',
'Loading preview....'=>'Chargement de la prévisualisation....',
'Error: '=>'Erreur: ',
'Loading....'=>'Chargement....',


'Resize image'=>'Taille de l&#39;image',
'Crop image'=>'Recadrage image',
'Rotate/Flip image'=>'Rotation/Symétrie image',
'Close'=>'Fermer',
'Size'=>'Taille',
'Apply'=>'Appliquer',
'Save changes'=>'Enregistrer les changements',
'Reset'=>'Remise à zéro',
'Reset to original size'=>'Revenir à la taille originale',
'Save proportions'=>'Conserver les proportions',
'Width'=>'Largeur',
'Height'=>'Hauteur',
'Selected area: from'=>'Aire sélectionnée: de',
'to'=>'à',
'Apply crop'=>'Appliquer recadrage',
'Rotate'=>'Rotation',
'90&deg; CCW'=>'90&deg; CCW',
'Rotate 90 degrees counterclockwise'=>'Rotation 90 degrés anti-horaire',
'90&deg; CW'=>'90&deg; CW',
'Rotate 90 degrees clockwise'=>'Rotation 90 degrés horaire',
'Flip'=>'Flip',
'horisontal'=>'horizontal',
'vertical'=>'vertical',
'Image Tools for'=>'Outils Image pour'
);
?>