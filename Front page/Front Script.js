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
				var selector = document.getElementById("eventSelector");
				if(response[i].official) {
					if(response[i].short_name == null) {
						selector.options[selector.options.length] = new Option(response[i].name, response[i].event_code);
					} else {
						selector.options[selector.options.length] = new Option(response[i].short_name, response[i].event_code);
					}
				}
			}
		}
	}
}
function validateEntries() {
	var enteredNumber = document.getElementById("teamNumEntry").value;
	var enteredEvent = document.getElementById("eventSelector").value;
	if(/^[0-9]{1,4}$/.test(enteredNumber) && enteredEvent !== "") { // If it's a valid 1 to 4-digit number and valid event choice
		var teamRequest = new XMLHttpRequest(),
			response;
		
		teamRequest.open("GET", TBAapiBaseLink + "team/frc" + enteredNumber + "/years_participated", true);
		teamRequest.setRequestHeader("X-TBA-App-Id", appID);
		
		teamRequest.send();
		
		teamRequest.onreadystatechange = function(e) {
			
			if (this.readyState == XMLHttpRequest.DONE) {
				response = JSON.parse(teamRequest.response);
				
				for(var i = 0; i < response.length; i++) {
					if(response[i] === year) {
						//TODO: Send data to server side language
						
						document.getElementById("choices").submit();
					}
				}
			}
		}
	}
}
function startFront() {
	getAllEvents();
}