var frcApiBaseLink = "https://www.frc-api.firstinspires.org/v2.0/";
var TBAapiBaseLink = "https://www.thebluealliance.com/api/v2/";
var appID = "mlavrentyev:liveMatchSchedule:v1";
var timeToRefresh = 30;

var currentMatch = 1;
var year = (new Date()).getFullYear();
var eventKey = "ctwat";
var teamNumber = 4557;

// Main page functions
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
	httpsRequest.setRequestHeader("X-TBA-App-Id", appID);
	
	httpsRequest.send();
	
	httpsRequest.onreadystatechange = function (e) {

		if (this.readyState === XMLHttpRequest.DONE) {
			
			response = JSON.parse(httpsRequest.response);
			document.getElementById("eventName").innerHTML = response.name;
			console.log("All's good.");
			
		}
	};
}
function startOnMainPageLoad() {
	"use strict";
	setFootnoteInfo();
	refreshTimer();
}

// Introduction page functions
function getAllEvents() {
	"use strict";
	var allEventsRequest = new XMLHttpRequest(),
		response;
	allEventsRequest.open("GET", TBAapiBaseLink + "events/" + year);
	allEventsRequest.setRequestHeader("X-TBA-App-Id", appID);
	
	allEventsRequest.send();
	
	allEventsRequest.onreadystatechange = function(e) {
		if(this.readyState === XMLHttpRequest.DONE) {
			response = JSON.parse(allEventsRequest.response);
			for(var i = 0; i < response.length; i +=1) {
				response[i].short_name;
			}
		}
	}
}
