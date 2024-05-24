HockeyScoreboard

HockeyScoreboard ist eine moderne Webanwendung zum Verfolgen von Eishockey-Spielergebnissen in Echtzeit.
Funktionen

    Erfassen von Toren, Strafen, Torschüssen und anderen Ereignissen während des Spiels
    Automatische Aktualisierung der Spielstatistiken und Ranglisten
    Responsive Benutzeroberfläche für Desktop und Mobilgeräte
    Öffentliche Spielübersicht für Fans zum Mitverfolgen der Ergebnisse
    Verwaltung von Mannschaften, Spielern und Ligen durch Administratoren
    Integration in OBS für Livestreaming von Spielergebnissen

Installation
Mit XAMPP

    XAMPP installieren
    Laden Sie XAMPP von der offiziellen Website herunter und installieren Sie es auf Ihrem System.

    Repository klonen
    Klonen Sie das Repository in ein Verzeichnis Ihrer Wahl:

    bash

git clone https://github.com/Benutzername/hockeyscoreboard.git

XAMPP öffnen und konfigurieren
Starten Sie XAMPP und konfigurieren Sie es für Ihr System. Stellen Sie sicher, dass Apache und MySQL laufen.

Repository-Ordner entpacken und verschieben
Entpacken Sie den geklonten Repository-Ordner (falls notwendig) und verschieben Sie ihn in den htdocs-Ordner Ihrer XAMPP-Installation. Der Pfad sollte in etwa so aussehen:

makefile

C:\xampp\htdocs\hockeyscoreboard

Projekt im Browser öffnen
Öffnen Sie Ihren Webbrowser und navigieren Sie zu:

arduino

    http://localhost/hockeyscoreboard

    Hier können Sie das Projekt auf Ihrem lokalen Server betrachten und testen.

Verwendung mit OBS

HockeyScoreboard kann in OBS für Livestreaming integriert werden. Aktuell unterstützt die Anwendung die Ausgabe von JSON-Dateien. Um Bilder wie Teamlogos anzuzeigen, muss der Pfad zu den Bildern manuell angepasst werden.
Mitwirkung

Wir freuen uns über Beiträge zur Verbesserung von HockeyScoreboard. Bitte teilen Sie zunächst Ihre Verbesserungsvorschläge mit und implementieren Sie keine Änderungen direkt. Lesen Sie die Mitwirkungsrichtlinien, bevor Sie einen Pull Request einreichen.
Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
