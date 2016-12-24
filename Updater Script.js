var frcApiBaseLink = "https://frc-api.firstinspires.org/v2.0/";
var timeToRefresh = 30;
var refreshing = false;

var year;
var eventKey;
var teamNumber;


function refreshSchedule() {
    "use strict";
	var httpsRequest = new XMLHttpRequest();
	
	httpsRequest.open("GET", frcApiBaseLink + year + "/schedule/" + eventKey + "?tournamentLevel=&teamNumber=" + teamNumber, true);
	httpsRequest.setRequestHeader("Accept", "application/json");
	httpsRequest.setRequestHeader("User-Agent", "");
}

function refreshTimer() {
	"use strict";
	
	if (timeToRefresh === 0) {
		timeToRefresh = 30;
		document.getElementById("refreshTime").innerHTML = "Refreshing...";
		document.getElementById("loader").style.visibility = "visible";
		refreshSchedule();
		document.getElementById("loader").style.visibility = "hidden";
	}
	document.getElementById("refreshTime").innerHTML = "Refreshing in: " + timeToRefresh + " seconds";
	timeToRefresh -= 1;
	
	setTimeout(refreshTimer, 1000);
}