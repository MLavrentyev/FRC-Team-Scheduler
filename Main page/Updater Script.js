var frcApiBaseLink = "https://www.frc-api.firstinspires.org/v2.0/";
var TBAapiBaseLink = "https://www.thebluealliance.com/api/v2/";
var timeToRefresh = 30;

var currentMatch = 1;
var year = (new Date()).getFullYear();
var eventKey = "ctwat";
var teamNumber = 4557;


function refreshSchedule() {
    "use strict";
	var httpsRequest = new XMLHttpRequest();
	
	httpsRequest.open("GET", frcApiBaseLink + year + "/schedule/" + eventKey + "?tournamentLevel=&teamNumber=" + teamNumber + "&start=" + currentMatch, true);
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
function setFootnoteInfo() {
	"use strict";
	
	document.getElementById("teamNumber").innerHTML = "FRC " + teamNumber;
	var httpsRequest = new XMLHttpRequest(),
		response;
	httpsRequest.open("GET", TBAapiBaseLink + "event/" + year + eventKey, true);
	httpsRequest.setRequestHeader("X-TBA-App-Id", "mlavrentyev:liveMatchSchedule:v1");
	
	httpsRequest.send();
	
	httpsRequest.onreadystatechange = function (e) {

		if (this.readyState === XMLHttpRequest.DONE) {
			
			response = JSON.parse(httpsRequest.response);
			document.getElementById("eventName").innerHTML = response.name;
			console.log("All's good.");
			
		}
	};
}
function startOnPageLoad() {
	"use strict";
	setFootnoteInfo();
	refreshTimer();
}