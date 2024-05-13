<?php
// Pfad zur JSON-Datei
$jsonFile = 'settings/data.json';

// Standard JSON-Daten, die zurückgesetzt werden sollen
$defaultData = '{"teamA":{"fullname":"","logo":"","shortname":"","color":"","ranking":"","league":"","score":0,"penaltyTimers":[]},"teamB":{"fullname":"","logo":"","shortname":"","color":"","ranking":"","league":"","score":0,"penaltyTimers":[]},"otherSettings":{"break_time":0,"period":"","date":"","time":"","location":"","championship":"","showtimer":false,"teamGoals":[],"timerDisplay":0}}';

// JSON-Daten zurücksetzen
file_put_contents($jsonFile, $defaultData);

// Erfolgsmeldung ausgeben
echo "JSON-Daten wurden erfolgreich zurückgesetzt.";
?>
