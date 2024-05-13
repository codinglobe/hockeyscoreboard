// Function to save settings
function saveSettings() {
    // Prepare the settings object
    var settings = {
        teamA: {
            fullname: document.getElementById("teamA_fullname").value,
            shortname: document.getElementById("teamA_shortname").value,
            logo: '../assets/images/', // Relativer Pfad zum Logo von Team A
            color: document.getElementById("teamA_color").value,
            ranking: document.getElementById("teamA_ranking").value,
            league: document.getElementById("teamA_league").value
        },
        teamB: {
            fullname: document.getElementById("teamB_fullname").value,
            shortname: document.getElementById("teamB_shortname").value,
            logo: '../assets/images/', // Relativer Pfad zum Logo von Team B
            color: document.getElementById("teamB_color").value,
            ranking: document.getElementById("teamB_ranking").value,
            league: document.getElementById("teamB_league").value
        },
        otherSettings: {
            timer_direction: document.getElementById("timer_direction").value,
            max_time: document.getElementById("max_time").value,
            break_time: document.getElementById("break_time").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            location: document.getElementById("location").value,
            championship: document.getElementById("championship").value
        }
    };

    var jsonSettings = JSON.stringify(settings);

    // Send JSON data to PHP script for processing
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "save_settings.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Handle response from PHP script if needed
            console.log(xhr.responseText);
        }
    };
    xhr.send(jsonSettings);
}
