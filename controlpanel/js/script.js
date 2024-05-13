// JavaScript code to handle control panel functionality

// Variables to store main timer state
var mainTimerUpRunning = false;
var mainTimerUpSeconds = 0;
var mainTimerUpInterval;
var mainTimerDownRunning = false;
var mainTimerDownSeconds = 0;
var mainTimerDownInterval;
// Variables to store penalty timer intervals
var teamAPenaltyTimers = [];
var teamBPenaltyTimers = [];
// Variable to store the current period
var currentPeriod = 1;
var maxTimeInSeconds = 0; // Global variable for maxTime
var breakTimeInSeconds = 0; // Global variable for breakTime
// Variables to store break timer state
var breakTimerRunning = false;
var breakTimerInterval;
// Flag, um zu überprüfen, ob JSON importiert wurde
var jsonImported = false;
// Globale Zählervariablen für die Penalty-IDs
var penaltyIdCounters = {
    'teamA': 0,
    'teamB': 0
};
var showTimer = true; // or false, depending on the initial state you want
var teamGoals = {
    teamA: false,
    teamB: false
};
var emptyNet = {
    teamA: false,
    teamB: false
}
// Variable, um den aktuellen Wert von pre-game-info zu speichern
var preGameInfo = false;

// Function to adjust score for a team
function adjustScore(team, delta) {
    var scoreElement = document.getElementById(team + '_score');
    var currentScore = parseInt(scoreElement.innerText);
    var newScore = currentScore + delta;
    if (newScore >= 0) {
        scoreElement.innerText = newScore;
    }
}

function addPenalty(team, minutes) {
    var penaltyElement = document.getElementById(team + '_penalty');
    var currentPenalty = penaltyElement.innerHTML;

    // Inkrementiere die Zählervariable für das Team
    penaltyIdCounters[team]++;

    // Erstelle eine eindeutige ID für den Penalty-Timer
    var penaltyId = team + '_penalty_' + penaltyIdCounters[team];

    // Formatiere Minuten und Sekunden für die Anzeige
    var formattedTime = formatTime(minutes);

    // Füge formatierte Zeit und Lösch-Schaltfläche hinzu
    penaltyElement.innerHTML += '<div id="' + penaltyId + '">' + formattedTime + ' <button onclick="deletePenaltyTimer(this)" penaltyId="' + penaltyId + '">Delete</button></div>';
}

// In der Funktion deletePenaltyTimer
function deletePenaltyTimer(button) {
    var penaltyElement = button.parentNode; // Get the parent div container
    var penaltyId = penaltyElement.id; // Get the penaltyId from the div container
    if (penaltyElement) {
        penaltyElement.parentNode.removeChild(penaltyElement);
        // Restart penalty timers
        var team = penaltyId.split('_')[0];
        if (team === 'teamA') {
            stopPenaltyTimers(teamAPenaltyTimers);
            // Restart penalty timers if main timer is running
            if (mainTimerUpRunning && teamAPenaltyTimers.length === 0) {
                startPenaltyTimers('teamA_penalty');
            }
        } else if (team === 'teamB') {
            stopPenaltyTimers(teamBPenaltyTimers);
            // Restart penalty timers if main timer is running
            if (mainTimerUpRunning && teamBPenaltyTimers.length === 0) {
                startPenaltyTimers('teamB_penalty');
            }
        }

        // Update penalty IDs and sort penalty timers
        updatePenaltyIdAndSort(team);
        
        console.log("Penalty timer deleted for", penaltyId);
    } else {
        console.log("Penalty timer element not found");
    }
}

// Hilfsfunktion zum Formatieren der Zeit
function formatTime(minutes) {
    var minutes = Math.floor(minutes);
    var seconds = (minutes * 60) % 60;
    return ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
}

// Function to pad a number with leading zeros
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

// Function to update penalty ID and sort penalty timers every second
function updatePenaltyIdAndSort(team) {
    var penaltyElementId = team + '_penalty';
    var penaltyElement = document.getElementById(penaltyElementId);
    if (penaltyElement) {
        var penaltyTimers = penaltyElement.querySelectorAll('[id^="' + penaltyElementId + '_"]');

        // Sort penalty timers by their IDs
        var sortedPenaltyTimers = Array.from(penaltyTimers).sort((a, b) => {
            var idA = parseInt(a.id.split('_')[2]);
            var idB = parseInt(b.id.split('_')[2]);
            return idA - idB;
        });

        // Update penalty ID and sort penalty timers
        sortedPenaltyTimers.forEach(function (penaltyTimer, index) {
            var penaltyId = team + '_penalty_' + (index + 1);
            penaltyTimer.id = penaltyId;
        });

        // Re-append sorted penalty timers to the penalty element
        penaltyElement.innerHTML = '';
        sortedPenaltyTimers.forEach(function (penaltyTimer) {
            penaltyElement.appendChild(penaltyTimer);
        });
    }
}

// In der Funktion startStopTimer
function startStopTimer() {
    if (!mainTimerUpRunning) {
        console.log("Starting main timer...");
        mainTimerUpInterval = setInterval(function() {
            updateMainTimer(maxTimeInSeconds);
            // Update penalty ID and sort penalty timers for both teams every second
            updatePenaltyIdAndSort('teamA');
            updatePenaltyIdAndSort('teamB');
        }, 1000);
        mainTimerUpRunning = true;
        startPenaltyTimers('teamA_penalty');
        startPenaltyTimers('teamB_penalty');
        mainTimerDownRunning = true; // Set mainTimerDownRunning to true
    } else {
        console.log("Stopping main timer...");
        clearInterval(mainTimerUpInterval);
        mainTimerUpRunning = false;
        clearInterval(mainTimerDownInterval); // Clear mainTimerDownInterval
        mainTimerDownRunning = false;
        stopPenaltyTimers(teamAPenaltyTimers);
        stopPenaltyTimers(teamBPenaltyTimers);
    }
}

// Function to start penalty timers
function startPenaltyTimers(penaltyElementId) {
    var penaltyElement = document.getElementById(penaltyElementId);
    var penaltyTimers = penaltyElement.querySelectorAll('[id^="' + penaltyElementId + '_"]');

    // Sort penalty timers by their IDs
    var sortedPenaltyTimers = Array.from(penaltyTimers).sort((a, b) => {
        var idA = parseInt(a.id.split('_')[2]);
        var idB = parseInt(b.id.split('_')[2]);
        return idA - idB;
    });

    // Start only the first two penalty timers if they are not already running
    for (var i = 0; i < 2 && i < sortedPenaltyTimers.length; i++) {
        var timerId = setInterval(updatePenaltyTimer, 1000, sortedPenaltyTimers[i].id);
        if (penaltyElementId === 'teamA_penalty') {
            // Check if the timerId is not already in the teamAPenaltyTimers array and if the timer is not already running
            if (!teamAPenaltyTimers.includes(timerId) && !teamAPenaltyTimers.includes(sortedPenaltyTimers[i].id)) {
                teamAPenaltyTimers.push(timerId);
            }
        } else if (penaltyElementId === 'teamB_penalty') {
            // Check if the timerId is not already in the teamBPenaltyTimers array and if the timer is not already running
            if (!teamBPenaltyTimers.includes(timerId) && !teamBPenaltyTimers.includes(sortedPenaltyTimers[i].id)) {
                teamBPenaltyTimers.push(timerId);
            }
        }
    }

    console.log("Penalty timers started for", penaltyElementId);
}

// Function to update penalty timer
function updatePenaltyTimer(penaltyElementId) {
    var penaltyElement = document.getElementById(penaltyElementId);
    if (penaltyElement) { // Check if the element exists
        var penaltyTimes = penaltyElement.querySelectorAll('button');

        // Update each penalty time and button
        penaltyTimes.forEach(function (button) {
            var penaltyTimeElement = button.previousSibling;
            if (penaltyTimeElement) { // Check if penaltyTimeElement exists
                var penaltyTime = penaltyTimeElement.textContent.trim();
                var penaltyParts = penaltyTime.split(':');
                var minutes = parseInt(penaltyParts[0]);
                var seconds = parseInt(penaltyParts[1]);

                if (seconds > 0 || minutes > 0) {
                    var penaltyId = button.previousElementSibling ? button.previousElementSibling.id : null; // Check if previous element exists
                    if (seconds === 0 && minutes === 0) {
                        // Delete the penalty timer button
                        button.parentNode.removeChild(button);
                        // Execute deletePenaltyTimer function if penaltyId exists
                        if (penaltyId) {
                            deletePenaltyTimer(penaltyId);
                        }
                    } else {
                        if (seconds === 0 && minutes > 0) {
                            minutes--;
                            seconds = 59;
                        } else if (seconds > 0) {
                            seconds--;
                        }
                        penaltyTimeElement.textContent = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
                    }

                    // Update the penalty timer text
                    var penaltyTimerText = penaltyElement.querySelector('.penalty-timer-text');
                    if (penaltyTimerText) {
                        penaltyTimerText.textContent = "Strafzeit " + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
                    }
                }
            }
        });

        // Check if all penalty times are over and stop the timers
        var allZero = Array.from(penaltyElement.querySelectorAll('button')).every(function (button) {
            var penaltyTimeElement = button.previousSibling;
            if (penaltyTimeElement) { // Check if penaltyTimeElement exists
                var penaltyTime = penaltyTimeElement.textContent.trim();
                var penaltyParts = penaltyTime.split(':');
                var minutes = parseInt(penaltyParts[0]);
                var seconds = parseInt(penaltyParts[1]);
                return minutes === 0 && seconds === 0;
            }
            return false;
        });

        if (allZero) {
            penaltyElement.parentNode.removeChild(penaltyElement); // Remove the penalty element
            // Restart penalty timers if main timer is running
            if (mainTimerUpRunning) {
                var team = penaltyElementId.split('_')[0];
                // Check if penalty timers for the team are not already running
                if (team === 'teamA' && teamAPenaltyTimers.length === 0) {
                    startPenaltyTimers(team + '_penalty');
                } else if (team === 'teamB' && teamBPenaltyTimers.length === 0) {
                    startPenaltyTimers(team + '_penalty');
                }
            }
        }
    }

    console.log("Penalty timer updated for", penaltyElementId);
}

// Function to stop penalty timers
function stopPenaltyTimers(timerArray) {
    timerArray.forEach(function (timerId) {
        clearInterval(timerId);
    });
}

// Function to reset both main timers and break timer
function resetTimer() {
    clearInterval(mainTimerUpInterval);
    clearInterval(mainTimerDownInterval);
    mainTimerUpRunning = false;
    mainTimerDownRunning = false;
    mainTimerUpSeconds = 0;
    mainTimerDownSeconds = maxTimeInSeconds; // Set main timer down to max time
    updateMainTimerDisplay('main_timer_up_display', mainTimerUpSeconds);
    updateMainTimerDisplay('main_timer_down_display', mainTimerDownSeconds);
}

// Function to adjust the period
function adjustPeriod(delta) {
    // Increment or decrement the current period by the given delta
    currentPeriod += delta;

    // Define an array to store the period suffixes
    var periodSuffixes = ['1st', '2nd', '3rd', 'OT'];

    // Calculate the length of the period suffixes array
    var numPeriods = periodSuffixes.length;

    // Calculate the index of the current period within the period suffixes array
    var index = (currentPeriod - 1) % numPeriods;

    // Ensure the index is within the bounds of the period suffixes array
    if (index < 0) {
        index += numPeriods;
    }

    // Update the period display with the appropriate suffix
    document.getElementById('period_display').innerText = periodSuffixes[index];
}

// Function to update both main timers
function updateMainTimer(maxTime) {
    if (mainTimerUpRunning) {
        mainTimerUpSeconds++;
        if (mainTimerUpSeconds >= maxTime) { // Check if main timer exceeds max time
            mainTimerUpSeconds = maxTime; // Set main timer to max time
            clearInterval(mainTimerUpInterval); // Stop the main timer
            startBreakTimerCountdown(); // Start the break timer countdown
        }
        updateMainTimerDisplay('main_timer_up_display', mainTimerUpSeconds);
    }

    if (mainTimerDownRunning && mainTimerDownSeconds > 0) {
        mainTimerDownSeconds--;
        updateMainTimerDisplay('main_timer_down_display', mainTimerDownSeconds);
    }

    // Check if main timers should stop
    if (mainTimerUpSeconds == maxTimeInSeconds && mainTimerDownSeconds == 0) {
        clearInterval(mainTimerUpInterval);
        mainTimerUpRunning = false;
        clearInterval(mainTimerDownInterval); // Clear mainTimerDownInterval
        mainTimerDownRunning = false;
        stopPenaltyTimers(teamAPenaltyTimers);
        stopPenaltyTimers(teamBPenaltyTimers);
    }
}

// Function to update the main timer display
function updateMainTimerDisplay(elementId, seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    document.getElementById(elementId).innerText = ('0' + minutes).slice(-2) + ':' + ('0' + remainingSeconds).slice(-2);
}

// Function to adjust main timer and penalty timer minutes
function adjustMainTimerMinutes(delta) {
    console.log("adjustMainTimerMinutes called with delta:", delta);

    mainTimerUpSeconds += delta * 60;
    if (mainTimerUpSeconds < 0) {
        mainTimerUpSeconds = 0;
    }
    console.log("Updating main_timer_up_display with seconds:", mainTimerUpSeconds);
    updateMainTimerDisplay('main_timer_up_display', mainTimerUpSeconds);

    mainTimerDownSeconds -= delta * 60;
    if (mainTimerDownSeconds < 0) {
        mainTimerDownSeconds = 0;
    }
    console.log("Updating main_timer_down_display with seconds:", mainTimerDownSeconds);
    updateMainTimerDisplay('main_timer_down_display', mainTimerDownSeconds);

    // Adjust penalty timer minutes as well
    var teamAPenaltyElement = document.getElementById('teamA_penalty');
    var teamBPenaltyElement = document.getElementById('teamB_penalty');
    adjustPenaltyTimerMinutes(delta, teamAPenaltyElement);
    adjustPenaltyTimerMinutes(delta, teamBPenaltyElement);
}

// Function to adjust penalty timer minutes
function adjustPenaltyTimerMinutes(delta, penaltyElement) {
    var penaltyTimes = penaltyElement.querySelectorAll('button');

    penaltyTimes.forEach(function (button) {
        var penaltyTimeElement = button.previousSibling;
        var penaltyTime = penaltyTimeElement.textContent.trim();
        var penaltyParts = penaltyTime.split(':');
        var minutes = parseInt(penaltyParts[0]);
        var seconds = parseInt(penaltyParts[1]);

        minutes -= delta;

        if (minutes < 0) {
            minutes = 0;
        }

        penaltyTimeElement.textContent = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    });

    console.log("Penalty timer minutes adjusted by", delta, "for penalty element:", penaltyElement.id);
}

// Function to adjust main timer and penalty timer seconds
function adjustMainTimerSeconds(delta) {
    console.log("adjustMainTimerSeconds called with delta:", delta);

    mainTimerUpSeconds += delta;
    if (mainTimerUpSeconds < 0) {
        mainTimerUpSeconds = 0;
    }
    console.log("Updating main_timer_up_display with seconds:", mainTimerUpSeconds);
    updateMainTimerDisplay('main_timer_up_display', mainTimerUpSeconds);

    mainTimerDownSeconds -= delta;
    if (mainTimerDownSeconds < 0) {
        mainTimerDownSeconds = 0;
    }
    console.log("Updating main_timer_down_display with seconds:", mainTimerDownSeconds);
    updateMainTimerDisplay('main_timer_down_display', mainTimerDownSeconds);

    // Adjust penalty timer seconds as well
    var teamAPenaltyElement = document.getElementById('teamA_penalty');
    var teamBPenaltyElement = document.getElementById('teamB_penalty');
    adjustPenaltyTimerSeconds(delta, teamAPenaltyElement);
    adjustPenaltyTimerSeconds(delta, teamBPenaltyElement);
}

// Function to adjust penalty timer seconds
function adjustPenaltyTimerSeconds(delta, penaltyElement) {
    var penaltyTimes = penaltyElement.querySelectorAll('button');

    penaltyTimes.forEach(function (button) {
        var penaltyTimeElement = button.previousSibling;
        var penaltyTime = penaltyTimeElement.textContent.trim();
        var penaltyParts = penaltyTime.split(':');
        var minutes = parseInt(penaltyParts[0]);
        var seconds = parseInt(penaltyParts[1]);

        seconds -= delta;

        if (seconds >= 60) {
            minutes += Math.floor(seconds / 60); // Add excess seconds to minutes
            seconds %= 60; // Update seconds to be less than 60
        } else if (seconds < 0) {
            if (minutes > 0) {
                minutes--; // Decrement minutes if seconds are less than 0
                seconds += 60; // Add 60 seconds to adjust negative seconds
            } else {
                seconds = 0; // Set seconds to 0 if minutes are already 0
            }
        }

        penaltyTimeElement.textContent = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    });

    console.log("Penalty timer seconds adjusted by", delta, "for penalty element:", penaltyElement.id);
}

// Function to start the break timer countdown when the main timer up reaches max time and the main timer down is at 00:00
function startBreakTimerCountdown() {
    if (!breakTimerRunning) {
        var breakTimerSeconds = breakTimeInSeconds; // Start break timer from the value in the JSON file
        breakTimerInterval = setInterval(function () {
            if (breakTimerSeconds > 0) {
                console.log("Remaining break timer seconds:", breakTimerSeconds); // Log remaining break timer seconds
                breakTimerSeconds--;
                updateMainTimerDisplay('break_timer_display', breakTimerSeconds);
            } else {
                clearInterval(breakTimerInterval);
                updateMainTimerDisplay('break_timer_display', 0);
                resetBreakTimer(); // Reset the break timer
            }
        }, 1000);
        breakTimerRunning = true;
    }
}

function resetBreakTimer() {
    breakTimerRunning = false; // Set break timer to false
    updateMainTimerDisplay('break_timer_display', breakTimeInSeconds); // Update main timer display to 00:00
    clearInterval(breakTimerInterval); // Clear the break timer interval
}

// Function to import JSON data and update HTML fields
function importJSON() {
    // Flag, um zu überprüfen, ob JSON importiert wurde
    var jsonImported = false;

    var input = document.getElementById('json_file_input');
    var file = input.files[0];
    
    if (file) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var jsonData = JSON.parse(e.target.result);

            // Update Team A information
            document.getElementById("teamA_fullname").innerText = jsonData.teamA.fullname || document.getElementById("teamA_fullname").innerText;
            document.getElementById("teamA_logo").src = jsonData.teamA.logo || document.getElementById("teamA_logo").src;
            document.getElementById("teamA_shortname").innerText = jsonData.teamA.shortname || document.getElementById("teamA_shortname").value;
            document.getElementById("teamA_color_input").value = jsonData.teamA.color; // Set value of input field
            document.getElementById("teamA_color_input").readOnly = true; // Make input field read-only
            document.getElementById("teamA_ranking").innerText = jsonData.teamA.ranking || document.getElementById("teamA_ranking").value;
            document.getElementById("teamA_league").innerText = jsonData.teamA.league || document.getElementById("teamA_league").value;

            // Update Team B information
            document.getElementById("teamB_fullname").innerText = jsonData.teamB.fullname || document.getElementById("teamB_fullname").innerText;
            document.getElementById("teamB_logo").src = jsonData.teamB.logo || document.getElementById("teamB_logo").src;
            document.getElementById("teamB_shortname").innerText = jsonData.teamB.shortname || document.getElementById("teamB_shortname").value;
            document.getElementById("teamB_color_input").value = jsonData.teamB.color; // Set value of input field
            document.getElementById("teamB_color_input").readOnly = true; // Make input field read-only
            document.getElementById("teamB_ranking").innerText = jsonData.teamB.ranking || document.getElementById("teamB_ranking").value;
            document.getElementById("teamB_league").innerText = jsonData.teamB.league || document.getElementById("teamB_league").value;

            // Set maxtime to main_timer_down_display and break_timer_display
            maxTimeInSeconds = parseInt(jsonData.otherSettings.max_time) * 60; // Convert maxtime to seconds
            breakTimeInSeconds = parseInt(jsonData.otherSettings.break_time) * 60; // Convert break time to seconds
            mainTimerDownSeconds = maxTimeInSeconds; // Update mainTimerDownSeconds
            updateMainTimerDisplay('main_timer_down_display', maxTimeInSeconds);
            updateMainTimerDisplay('break_timer_display', breakTimeInSeconds);

            // Import "Date", "Time", "Location" and "Championship" from JSON to HTML
            var dateParts = jsonData.otherSettings.date.split("-");
            var formattedDate = dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
            document.getElementById("date").innerText = formattedDate;
            document.getElementById("time").innerText = jsonData.otherSettings.time;
            document.getElementById("location").innerText = jsonData.otherSettings.location;
            document.getElementById("championship").innerText = jsonData.otherSettings.championship;

            // Setze das Flag für den Import auf true
            jsonImported = true;

            // Starte die automatische Aktualisierung, wenn JSON importiert wurde
            if (jsonImported) {
                setInterval(function() {
                    // Erstelle JSON-Daten mit den aktuellen Werten aus dem HTML
                    // Basierend auf der Timer-Richtung den Haupttimer-Wert aktualisieren
                    var mainTimerDirection = jsonData.otherSettings.timer_direction;
                    var currentMainTimerValue = mainTimerDirection === 'up' ? mainTimerUpSeconds : mainTimerDownSeconds;
                    var currentData = {
                        teamA: {
                            fullname: document.getElementById("teamA_fullname").innerText,
                            logo: document.getElementById("teamA_logo").src,
                            shortname: document.getElementById("teamA_shortname").innerText,
                            color: document.getElementById("teamA_color_input").value, // Get color value from input field
                            ranking: document.getElementById("teamA_ranking").innerText,
                            league: document.getElementById("teamA_league").innerText,
                            score: parseInt(document.getElementById("teamA_score").innerText),
                            penaltyTimers: getPenaltyTimers("teamA_penalty"), // Annahme einer Funktion zur Erfassung von Strafzeiten
                        },
                        teamB: {
                            fullname: document.getElementById("teamB_fullname").innerText,
                            logo: document.getElementById("teamB_logo").src,
                            shortname: document.getElementById("teamB_shortname").innerText,
                            color: document.getElementById("teamB_color_input").value, // Get color value from input field
                            ranking: document.getElementById("teamB_ranking").innerText,
                            league: document.getElementById("teamB_league").innerText,
                            score: parseInt(document.getElementById("teamB_score").innerText),
                            penaltyTimers: getPenaltyTimers("teamB_penalty"), // Annahme einer Funktion zur Erfassung von Strafzeiten
                        },
                        otherSettings: {
                            break_time: document.getElementById("break_timer_display").innerText,
                            period: document.getElementById("period_display").innerText,
                            date: document.getElementById("date").innerText,
                            time: document.getElementById("time").innerText,
                            location: document.getElementById("location").innerText,
                            championship: document.getElementById("championship").innerText,
                            showtimer: showTimer, // Hinzufügen des showtimer-Eintrags
                            teamGoals: teamGoals,
                            emptyNet: emptyNet,
                            timerDisplay: currentMainTimerValue, // Timerwert entsprechend der Richtung setzen
                            preGameInfo: preGameInfo, // Hinzufügen des preGameInfo-Eintrags
                            breakTimerRunning: breakTimerRunning // Hinzufügen des breakTimerRunning-Eintrags
                        }
                    };

                    // JSON-Daten in einen String umwandeln
                    var jsonString = JSON.stringify(currentData, null, 2);

                    // AJAX-Anfrage zum Speichern der JSON-Datei
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', 'controlpaneldata.php', true); // Pfad zum PHP-Skript anpassen
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                //console.log(xhr.responseText); // Erfolgsmeldung anzeigen
                            } else {
                                console.error('Fehler beim Speichern der JSON-Datei.'); // Fehlermeldung anzeigen
                            }
                        }
                    };
                    xhr.send('jsonData=' + encodeURIComponent(jsonString));
                }, 1000);
            }

            // Weitere Aktualisierungen hier durchführen, falls erforderlich
        };
        
        reader.readAsText(file);
    } else {
        alert('Bitte wählen Sie eine Datei aus.');
    }
}

document.addEventListener('keydown', async function(event) {
    // Check which key is pressed
    if (event.altKey && event.ctrlKey && event.shiftKey && event.key.startsWith('F')) {
        // Wenn Alt, Strg und Umschalt gleichzeitig mit einer Funktionstaste gedrückt sind
        const functionKey = parseInt(event.key.substr(1));
        switch (functionKey) {
            case 1: // Alt+Strg+Umschalt+F1 für Toggle Show Timer
                toggleShowTimer();
                break;
            case 2: // Alt+Strg+Umschalt+F2 für Toggle Empty Net für Team A
                toggleEmptyNet('teamA');
                break;
            case 3: // Alt+Strg+Umschalt+F3 für Toggle Empty Net für Team B
                toggleEmptyNet('teamB');
                break;
            case 4: // Alt+Strg+Umschalt+F4 um den Haupt-Timer zu starten/stoppen
                startStopTimer();
                break;
            case 5: // Alt+Strg+Umschalt+F5 um die Haupt-Timer zurückzusetzen
                resetTimer();
                break;
            case 6: // Alt+Strg+Umschalt+F6 um die Haupt-Timer und Straf-Timer-Minuten zu erhöhen
                adjustMainTimerMinutes(1);
                break;
            case 7: // Alt+Strg+Umschalt+F7 um die Haupt-Timer und Straf-Timer-Minuten zu verringern
                adjustMainTimerMinutes(-1);
                break;
            case 8: // Alt+Strg+Umschalt+F8 um die Haupt-Timer und Straf-Timer-Sekunden zu erhöhen
                adjustMainTimerSeconds(1);
                break;
            case 9: // Alt+Strg+Umschalt+F9 um die Haupt-Timer und Straf-Timer-Sekunden zu verringern
                adjustMainTimerSeconds(-1);
                break;
            case 10: // Alt+Strg+Umschalt+F10 für Period +1
                adjustPeriod(1);
                break;
            case 11: // Alt+Strg+Umschalt+F11 für Period -1
                adjustPeriod(-1);
                break;
            case 12: // Alt+Strg+Umschalt+F12 für Score + für Team A
                toggleTeamGoal('teamA', 1);
                break;
            case 13: // Alt+Strg+Umschalt+F13 für Score - für Team A
                adjustScore('teamA', -1);
                break;
            case 14: // Alt+Strg+Umschalt+F14 für 2 Minuten Strafe für Team A
                addPenalty('teamA', 2);
                break;
            case 15: // Alt+Strg+Umschalt+F15 für 4 Minuten Strafe für Team A
                addPenalty('teamA', 4);
                break;
            case 16: // Alt+Strg+Umschalt+F16 für 5 Minuten Strafe für Team A
                addPenalty('teamA', 5);
                break;
            case 17: // Alt+Strg+Umschalt+F17 für Score + für Team B
                toggleTeamGoal('teamB', 1);
                break;
            case 18: // Alt+Strg+Umschalt+F18 für Score - für Team B
                adjustScore('teamB', -1);
                break;
            case 19: // Alt+Strg+Umschalt+F19 für 2 Minuten Strafe für Team B
                addPenalty('teamB', 2);
                break;
            case 20: // Alt+Strg+Umschalt+F20 für 4 Minuten Strafe für Team B
                addPenalty('teamB', 4);
                break;
            case 21: // Alt+Strg+Umschalt+F21 für 5 Minuten Strafe für Team B
                addPenalty('teamB', 5);
                break;
        }
    }
});

// Function to get penalty timers for a team
function getPenaltyTimers(penaltyElementId) {
    var penaltyElement = document.getElementById(penaltyElementId);
    if (penaltyElement) {
        var penaltyTimes = penaltyElement.querySelectorAll('button');
        var timers = [];
        penaltyTimes.forEach(function (button) {
            var penaltyTimeElement = button.previousSibling;
            var penaltyTime = penaltyTimeElement.textContent.trim();
            timers.push(penaltyTime);
        });
        return timers; // Immer ein Array zurückgeben, auch wenn es leer ist
    }
    return []; // Immer ein leeres Array zurückgeben, wenn keine Penalty-Timer vorhanden sind
}

// Funktion zum Umschalten des showTimer-Werts
function toggleShowTimer() {
    showTimer = !showTimer; // Umschalten zwischen true und false
}
// Function to toggle team goal value
function toggleTeamGoal(team) {
    // Toggle between true and false for the specified team
    teamGoals[team] = !teamGoals[team];

    // Call adjustScore function with delta based on team goal status
    var delta = teamGoals[team] ? 1 : -1;
    adjustScore(team, delta);

    // Wenn das Teamziel auf true gesetzt ist, setze es nach 10 Sekunden wieder auf den Standardwert zurück
    if (teamGoals[team]) {
        setTimeout(() => {
            teamGoals[team] = false;
            // Hier können Sie weitere Aktionen hinzufügen, wenn das Teamziel zurückgesetzt wird
        }, 5000); // 10 Sekunden
    }
}

// Function to toggle empty net status for a team
function toggleEmptyNet(team) {
    // Toggle empty net status for the specified team
    emptyNet[team] = !emptyNet[team];
}

// Funktion zum Löschen der JSON-Daten und Zurücksetzen auf den Standardwert
function resetToDefault() {
    // Daten in der JSON-Datei löschen
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'resetjsondata.php', true); // Passe den Pfad zum PHP-Skript an
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("JSON-Daten wurden zurückgesetzt."); // Erfolgsmeldung anzeigen
            } else {
                console.error('Fehler beim Zurücksetzen der JSON-Daten.'); // Fehlermeldung anzeigen
            }
        }
    };
    xhr.send(); // Keine Daten übergeben, da die Funktion nur zum Löschen verwendet wird
    
    // Zurücksetzen der HTML-Felder auf Standardwerte
    document.getElementById("teamA_fullname").innerText = "Team A";
    document.getElementById("teamA_logo").src = "default_logo_a.png"; // Passe den Pfad zum Standardlogo an
    document.getElementById("teamA_shortname").innerText = "A";
    document.getElementById("teamA_color_input").value = "#ff0000"; // Standardfarbe für Team A
    document.getElementById("teamA_color_input").readOnly = false; // Machen Sie das Eingabefeld wieder editierbar
    document.getElementById("teamA_ranking").innerText = "1";
    document.getElementById("teamA_league").innerText = "League";
    document.getElementById("teamA_score").innerText = "0";
    document.getElementById("teamA_penalty").innerText = ""; // Setze den Penalty-Timer für Team A auf "null"

    document.getElementById("teamB_fullname").innerText = "Team B";
    document.getElementById("teamB_logo").src = "default_logo_b.png"; // Passe den Pfad zum Standardlogo an
    document.getElementById("teamB_shortname").innerText = "B";
    document.getElementById("teamB_color_input").value = "#0000ff"; // Standardfarbe für Team B
    document.getElementById("teamB_color_input").readOnly = false; // Machen Sie das Eingabefeld wieder editierbar
    document.getElementById("teamB_ranking").innerText = "1";
    document.getElementById("teamB_league").innerText = "League";
    document.getElementById("teamB_score").innerText = "0";
    document.getElementById("teamB_penalty").innerText = ""; // Setze den Penalty-Timer für Team B auf "null"

    document.getElementById("period_display").innerText = "1st"
    document.getElementById("date").innerText = ""
    document.getElementById("time").innerText = ""
    document.getElementById("location").innerText = ""
    document.getElementById("championship").innerText = ""

    // Setze den Timer-Wert zurück
    mainTimerUpSeconds = 0;
    mainTimerDownSeconds = maxTimeInSeconds;
    updateMainTimerDisplay('main_timer_up_display', 0);
    updateMainTimerDisplay('main_timer_down_display', maxTimeInSeconds);

    // Setze das Flag für den Import auf false zurück
    jsonImported = false;

    // Löschen des Dateieingabefelds
    document.getElementById('json_file_input').value = '';

    console.log("Daten wurden auf den Standard zurückgesetzt.");
}

// Funktion zum Umschalten des pre-game-info-Werts zwischen true und false
function togglePreGameInfo() {
    preGameInfo = !preGameInfo; // Umkehren des aktuellen Werts
    console.log('pre-game-info:', preGameInfo); // Konsolenausgabe zur Überprüfung
}