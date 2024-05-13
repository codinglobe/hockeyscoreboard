<?php
// Verzeichnis für die JSON-Datei
$directory = 'settings/';

// Dateiname für die JSON-Datei
$filename = 'data.json';

// Den vollständigen Dateipfad erstellen
$file_path = $directory . $filename;

// Überprüfen, ob die JSON-Datei existiert, andernfalls erstellen
if (!file_exists($file_path)) {
    // Erstelle das Verzeichnis, falls es nicht existiert
    if (!is_dir($directory)) {
        mkdir($directory, 0777, true);
    }
    
    // Leeres JSON-Objekt erstellen
    $data = (object)[];

    // JSON-Objekt in eine Zeichenkette umwandeln
    $json_string = json_encode($data, JSON_PRETTY_PRINT);

    // JSON-Daten in die Datei schreiben
    file_put_contents($file_path, $json_string);
}

// Daten aus dem POST-Array abrufen
$jsonData = json_decode($_POST['jsonData']);

// JSON-Daten in die Datei schreiben
file_put_contents($file_path, json_encode($jsonData, JSON_PRETTY_PRINT));

// Erfolgsmeldung zurückgeben
echo 'JSON-Datei erfolgreich erstellt und gespeichert.';
?>
