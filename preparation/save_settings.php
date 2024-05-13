<?php

// Empfange JSON-Daten von der POST-Anfrage
$json = file_get_contents('php://input');

// Konvertiere JSON in ein PHP-Array
$data = json_decode($json, true);

// Extrahiere die erforderlichen Informationen aus den Daten
$date = date("Y-m-d", strtotime($data['otherSettings']['date']));
$championship = $data['otherSettings']['championship'];
$teamA_shortname = $data['teamA']['shortname'];
$teamB_shortname = $data['teamB']['shortname'];

// Erstelle den Dateinamen
$filename = $date . '_' . $championship . '_' . $teamA_shortname . '_' . $teamB_shortname . '.json';

// Erstelle den vollständigen Dateipfad im Unterverzeichnis 'settings'
$filepath = __DIR__ . '/settings/' . $filename;

// Hier kannst du die empfangenen Daten verarbeiten und speichern
// Zum Beispiel könntest du die Daten in einer Datei speichern

// Beispiel für das Ausgeben der empfangenen Daten
echo "Empfangene Daten:\n";
print_r($data);

// Beispiel für das Speichern der Daten in einer Datei
file_put_contents($filepath, $json);

// Gib eine Antwort zurück (optional)
echo "Daten wurden erfolgreich in '$filepath' gespeichert.";

?>
