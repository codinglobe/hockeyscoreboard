// Function to fetch JSON data and update HTML fields
function fetchAndUpdateJSON() {
    fetch('../controlpanel/settings/data.json', {
        cache: 'no-store' // Zusätzlicher Parameter, um den Cache zu deaktivieren
    }) // Fetch JSON data from the specified URL
        .then(response => response.json()) // Parse the JSON response
        .then(jsonData => {
            console.log(jsonData); // Überprüfen Sie die abgerufenen JSON-Daten
            
            // Update timer and period display
            var timerDisplaySeconds = jsonData.otherSettings.timerDisplay || 0;
            var minutes = Math.floor(timerDisplaySeconds / 60);
            var seconds = timerDisplaySeconds % 60;
            document.getElementById("timerDisplay").innerText = padLeft(minutes) + ":" + padLeft(seconds);

            // Periode aus der JSON-Datenstruktur abrufen
            var period = jsonData.otherSettings.period;

            // Wenn die Periode "OT" ist, verwenden Sie einfach "OT", sonst fügen Sie "Period" hinzu
            var formattedPeriod = period === 'OT' ? period : period + ' Period';
            document.getElementById("periodDisplay").innerText = formattedPeriod;
            
            // Check if breakTimerRunning is true to determine if the break notification should be shown
            if (jsonData.otherSettings.breakTimerRunning === true) {
                // If breakTimerRunning is true, show the break notification with the break_time value from JSON data
                showBreakNotification(jsonData.otherSettings.break_time);
            } else {
                // If breakTimerRunning is false, hide the break notification
                hideBreakNotification();
            }

            // Check if showTimer is false
            if (!jsonData.otherSettings.showtimer) {
                document.querySelector('.scoreboard').classList.add('hide');
            } else {
                document.querySelector('.scoreboard').classList.remove('hide');
            }
            
            // Check if preGameInfo is true
            if (jsonData.otherSettings.preGameInfo) {
                showPreGameNotification(jsonData.teamA, jsonData.otherSettings, jsonData.teamB, jsonData.otherSettings.preGameInfo); // Zeige Benachrichtigung für Vorspielinformationen
            } else {
                showPreGameNotification(null, null, null, false); // Verstecke die Benachrichtigung, wenn preGameInfo false ist
            }

            // Check if teamGoals for Team A is true
            if (jsonData.otherSettings.teamGoals.teamA) {
                // Hier können Sie die Einblendung für Team A hinzufügen
                var teamAName = jsonData.teamA.shortname || "Team A";
                var teamALogoSrc = jsonData.teamA.logo || "";
                showNotification(teamAName, teamALogoSrc); // Zeige Benachrichtigung für Team A
            }

            // Check if teamGoals for Team B is true
            if (jsonData.otherSettings.teamGoals.teamB) {
                // Hier können Sie die Einblendung für Team B hinzufügen
                var teamBName = jsonData.teamB.shortname || "Team B";
                var teamBLogoSrc = jsonData.teamB.logo || "";
                showNotification(teamBName, teamBLogoSrc); // Zeige Benachrichtigung für Team B
            }

            // Update Team A information
            document.getElementById("team1Name").innerText = jsonData.teamA.shortname || "Team A";
            document.getElementById("team1Logo").src = jsonData.teamA.logo || "";
            document.getElementById("team1Score").innerText = jsonData.teamA.score || "0";
            // Update Penalty Timer for Team A
            var team1PenaltyTimer = jsonData.teamA.penaltyTimers || [];
            updatePenaltyTimer('team1PenaltyTimer', team1PenaltyTimer);
            
            // Check if Team A has empty net
            var team1EmptyNet = jsonData.otherSettings.emptyNet.teamA;
            if (team1EmptyNet) {
                document.getElementById("team1EmptyNet").style.display = "block"; // Show empty net for Team A
            } else {
                document.getElementById("team1EmptyNet").style.display = "none"; // Hide empty net for Team A
            }

            // Update Team B information
            document.getElementById("team2Name").innerText = jsonData.teamB.shortname || "Team B";
            document.getElementById("team2Logo").src = jsonData.teamB.logo || "";
            document.getElementById("team2Score").innerText = jsonData.teamB.score || "0";
            // Update Penalty Timer for Team B
            var team2PenaltyTimer = jsonData.teamB.penaltyTimers || [];
            updatePenaltyTimer('team2PenaltyTimer', team2PenaltyTimer);

            // Check if Team B has empty net
            var team2EmptyNet = jsonData.otherSettings.emptyNet.teamB;
            if (team2EmptyNet) {
                document.getElementById("team2EmptyNet").style.display = "block"; // Show empty net for Team B
            } else {
                document.getElementById("team2EmptyNet").style.display = "none"; // Hide empty net for Team B
            }

            // Update Team name underline color
            updateTeamNameUnderlineColor(jsonData.teamA.color, jsonData.teamB.color);
        })
        .catch(error => console.error('Error fetching JSON data:', error));
}

// Function to update Team name underline color
function updateTeamNameUnderlineColor(colorTeamA, colorTeamB) {
    var teamANameElement = document.getElementById("team1Name");
    var teamBNameElement = document.getElementById("team2Name");
    
    var teamAUnderlineElement = document.getElementById("team1Underline");
    var teamBUnderlineElement = document.getElementById("team2Underline");
    
    teamAUnderlineElement.style.backgroundColor = colorTeamA || "#e70202"; // Set default color if not provided
    teamBUnderlineElement.style.backgroundColor = colorTeamB || "#e70202"; // Set default color if not provided
}

// Function to format penalty timer
function formatPenaltyTimer(penaltyTimerArray) {
    if (penaltyTimerArray === null) {
        return "";
    }
    return penaltyTimerArray.join(", "); // Anzeige von Strafzeiten als kommaseparierte Liste
}

// Function to pad left with zeros for single-digit numbers
function padLeft(value) {
    return value < 10 ? '0' + value : value;
}

// Function to update Penalty Timer visibility and content
function updatePenaltyTimer(id, penaltyTimerArray) {
    var penaltyTimerElement = document.getElementById(id);
    if (penaltyTimerArray && penaltyTimerArray.length > 0) {
        penaltyTimerElement.classList.add('active'); // Zeige den Penalty Timer an
        penaltyTimerElement.innerHTML = penaltyTimerArray.slice(0, 2).map(timer => `<span class="penalty-box">${timer}</span>`).join(''); // Füge die ersten beiden Penalty Timer ein
    } else {
        penaltyTimerElement.classList.remove('active'); // Verstecke den Penalty Timer, wenn kein Wert vorhanden ist
        penaltyTimerElement.innerHTML = ''; // Leeren Sie den Inhalt des Penalty Timers
    }
}

// Function to show notification
function showNotification(team, logoSrc) {
    // Erstellen Sie ein neues Element für die Benachrichtigung
    var notification = document.createElement('div');
    notification.classList.add('notification'); // Fügen Sie eine Klasse hinzu, um die Benachrichtigung zu stylen
    
    // Erstellen Sie den Inhalt der Benachrichtigung
    var notificationContent = document.createElement('div');
    notificationContent.classList.add('notification-content');
    
    // Erstellen Sie den Text der Benachrichtigung
    var notificationText = document.createElement('span');
    notificationText.innerText = "GOAL " + team;
    
    // Erstellen Sie das Bild des Teamlogos
    var logo = document.createElement('img');
    logo.src = logoSrc;
    
    // Fügen Sie den Text und das Bild zur Benachrichtigung hinzu
    notificationContent.appendChild(notificationText);
    notificationContent.appendChild(logo);
    
    // Fügen Sie die Benachrichtigung zum DOM hinzu
    notification.appendChild(notificationContent);

    // Fügen Sie die Benachrichtigung anstelle des Scoreboard-Elements im DOM hinzu
    var scoreboardElement = document.querySelector('.scoreboard');
    var containerElement = scoreboardElement.parentElement;
    containerElement.insertBefore(notification, scoreboardElement);
    containerElement.removeChild(scoreboardElement);

    // Nach einer bestimmten Zeit das Scoreboard-Element wieder einfügen und die Benachrichtigung entfernen
    setTimeout(function() {
        containerElement.insertBefore(scoreboardElement, notification);
        containerElement.removeChild(notification);
    }, 5000); // 5000 Millisekunden = 5 Sekunden (passen Sie dies nach Bedarf an)
}

// Function to show pre-game notification with additional information
function showPreGameNotification(teamAData, otherSettingsData, teamBData, preGameInfo) {
    // Überprüfen, ob preGameInfo vorhanden und auf true gesetzt ist
    if (preGameInfo) {
        // Entfernen Sie den bestehenden preGameInfo-Container, falls vorhanden
        var existingNotification = document.querySelector('.pre-game-notification-container');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Erstellen Sie ein neues Element für den Benachrichtigungscontainer
        var notificationContainer = document.createElement('div');
        notificationContainer.classList.add('pre-game-notification-container'); // Fügen Sie eine Klasse hinzu, um den Container zu stylen
        
        // Erstellen Sie die Benachrichtigungsinhalte für jedes Team
        var teamAContent = createContent(teamAData);
        var otherSettingsContent = createOtherSettingsContent(otherSettingsData);
        var teamBContent = createContent(teamBData);
    
        // Fügen Sie die Benachrichtigungsinhalte zum Container hinzu
        notificationContainer.appendChild(teamAContent);
        notificationContainer.appendChild(otherSettingsContent);
        notificationContainer.appendChild(teamBContent);
    
        // Fügen Sie den Container zum DOM hinzu
        var body = document.querySelector('body');
        body.appendChild(notificationContainer);

        // Fügen Sie die hide-Klasse zum Scoreboard-Element hinzu
        var scoreboardElement = document.querySelector('.scoreboard');
        scoreboardElement.classList.add('hide');
    } else {
        // Entfernen Sie den preGameInfo-Container, falls vorhanden
        var existingNotification = document.querySelector('.pre-game-notification-container');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Entfernen Sie die hide-Klasse vom Scoreboard-Element, um es anzuzeigen
        var scoreboardElement = document.querySelector('.scoreboard');
        scoreboardElement.classList.remove('hide');
    }
}

// Hilfsfunktion zur Erstellung von Benachrichtigungsinhalten für ein Team
function createContent(teamData) {
    var content = document.createElement('div');
    content.classList.add('column-content');

    // Fügen Sie den vollständigen Namen des Teams hinzu
    var fullName = document.createElement('div');
    fullName.innerText = teamData.fullname;
    content.appendChild(fullName);

    // Fügen Sie das Logo des Teams hinzu
    var logo = document.createElement('img');
    logo.src = teamData.logo;
    content.appendChild(logo);

    // Fügen Sie das Ranking des Teams hinzu
    var ranking = document.createElement('div');
    ranking.innerText = "Rang: " + teamData.ranking;
    content.appendChild(ranking);

    return content;
}

// Hilfsfunktion zur Erstellung von Benachrichtigungsinhalten für die Einstellungen
function createOtherSettingsContent(otherSettingsData) {
    var content = document.createElement('div');
    content.classList.add('column-content');

    // Fügen Sie den Titel für die Einstellungen hinzu
    var title = document.createElement('div');
    title.innerText = otherSettingsData.championship;
    title.classList.add('notification-title'); // Klasse für den Titel hinzufügen
    content.appendChild(title);

    // Fügen Sie Datum, Zeit und Ort jeweils auf eine eigene Zeile hinzu
    var date = document.createElement('div');
    date.innerText = otherSettingsData.date;
    content.appendChild(date);

    var time = document.createElement('div');
    time.innerText = otherSettingsData.time;
    content.appendChild(time);

    var location = document.createElement('div');
    location.innerText = otherSettingsData.location;
    content.appendChild(location);

    return content;
}

// Funktion zum Anzeigen der Benachrichtigung über die Pause
function showBreakNotification(break_time) {
    // Erstellen Sie ein neues Element für die Benachrichtigung
    var breakNotification = document.createElement('div');
    breakNotification.classList.add('break-notification'); // Fügen Sie eine Klasse hinzu, um die Benachrichtigung zu stylen
    
    // Erstellen Sie Inhalt für die Benachrichtigung
    var breakNotificationContent = document.createElement('div');
    breakNotificationContent.classList.add('break-notification-content');
    
    // Erstellen Sie Text für die Benachrichtigung
    var breakNotificationText = document.createElement('span');
    breakNotificationText.innerText = "Pause: " + break_time; // Verwenden Sie den Wert break_time aus dem Parameter
    
    // Fügen Sie den Text zur Benachrichtigung hinzu
    breakNotificationContent.appendChild(breakNotificationText);
    
    // Fügen Sie den Benachrichtigungsinhalt zur Benachrichtigung hinzu
    breakNotification.appendChild(breakNotificationContent);
    
    // Fügen Sie die Benachrichtigung zum DOM hinzu
    var body = document.querySelector('body');
    body.appendChild(breakNotification);
}

// Funktion zum Ausblenden der Benachrichtigung über die Pause
function hideBreakNotification() {
    var breakNotification = document.querySelector('.break-notification');
    if (breakNotification) {
        breakNotification.remove();
    }
}

// Call fetchAndUpdateJSON function initially and then every second
fetchAndUpdateJSON(); // Call initially
setInterval(fetchAndUpdateJSON, 1000); // Call every seconds
