# HockeyScoreboard

HockeyScoreboard ist eine moderne Webanwendung zum Verfolgen von Eishockey-Spielergebnissen in Echtzeit.

## Funktionen

- Erfassen von Toren, Strafen, Torschüssen und anderen Ereignissen während des Spiels
- Automatische Aktualisierung der Spielstatistiken und Ranglisten
- Responsive Benutzeroberfläche für Desktop und Mobilgeräte
- Öffentliche Spielübersicht für Fans zum Mitverfolgen der Ergebnisse
- Verwaltung von Mannschaften, Spielern und Ligen durch Administratoren
- Integration in OBS für Livestreaming von Spielergebnissen

## Installation

1. Klonen Sie dieses Repository auf Ihren lokalen Rechner.
2. Stellen Sie sicher, dass Node.js und npm installiert sind.
3. Navigieren Sie im Terminal zum Projektverzeichnis und führen Sie `npm install` aus, um die Abhängigkeiten zu installieren.
4. Erstellen Sie eine `.env`-Datei und konfigurieren Sie die erforderlichen Umgebungsvariablen.
5. Starten Sie den Entwicklungsserver mit `npm run dev`.

## Verwendung mit OBS

HockeyScoreboard kann in OBS für Livestreaming integriert werden. Aktuell unterstützt die Anwendung die Ausgabe von JSON-Dateien. Um Bilder wie Teamlogos anzuzeigen, muss der Pfad zu den Bildern manuell angepasst werden.

## Mitwirkung

Wir freuen uns über Beiträge zur Verbesserung von HockeyScoreboard. Bitte teilen Sie zunächst Ihre Verbesserungsvorschläge mit und implementieren Sie keine Änderungen direkt. Lesen Sie die [Mitwirkungsrichtlinien](CONTRIBUTING.md), bevor Sie einen Pull Request einreichen.

## Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert.
