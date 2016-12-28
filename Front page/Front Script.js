var appID = "mlavrentyev:liveMatchSchedule:v1";
var TBAapiBaseLink = "https://www.thebluealliance.com/api/v2/";
var year = (new Date()).getFullYear();


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
function validateEntries() {
	var enteredNumber = document.getElementById("teamNumEntry").value;
	if(/^[0-9]{1,4}$/.test(enteredNumber)) { // If it's a valid 1 to 4-digit number
		var teamRequest = new XMLHttpRequest(),
			response;
		
		teamRequest.open("GET", TBAapiBaseLink + "team/frc" + enteredNumber + "/years_participated", true);
		teamRequest.setRequestHeader("X-TBA-App-Id", appID);
		
		teamRequest.send();
		
		teamRequest.onreadystatechange = function(e) {
			
			if (this.readyState == XMLHttpRequest.DONE) {
				response = JSON.parse(teamRequest.response);
				console.log(response.length);
				for(var i = 0; i < response.length; i++) {
					console.log(response[i] === year);
					if(response[i] === year) {
						teamNumber = parseInt(enteredNumber);
						console.log(teamNumber);
						document.getElementById("choices").submit();
					}
				}
			}
		}
	}
}