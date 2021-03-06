var appID = "mlavrentyev:liveMatchSchedule:v1";
var TBAapiBaseLink = "https://www.thebluealliance.com/api/v2/";
var year = (new Date()).getFullYear();

var officialEventsOnly = false;


function getAllEvents() {
	"use strict";
	document.getElementById("loadingDiv").style.visibility = "visible";
	var allEventsRequest = new XMLHttpRequest(),
		response,
		teamNum = parseInt(document.getElementById("teamNumEntry").value);

	allEventsRequest.open("GET", TBAapiBaseLink + "team/frc" + teamNum + "/" + year + "/events");
	allEventsRequest.setRequestHeader("X-TBA-App-Id", appID);
	
	allEventsRequest.send();
	console.log("Sent");
	
	allEventsRequest.onreadystatechange = function(e) {
		if(this.readyState === XMLHttpRequest.DONE) {
			response = JSON.parse(allEventsRequest.response);
			for(var i = 0; i < response.length; i +=1) {
				var selector = document.getElementById("eventSelector");
				if(response[i].official || !officialEventsOnly) {
					if(response[i].short_name == null) {
						selector.options[selector.options.length] = new Option(response[i].name, response[i].event_code);
					} else {
						selector.options[selector.options.length] = new Option(response[i].short_name, response[i].event_code);
					}
				}
			}
			document.getElementById("loadingDiv").style.visibility = "hidden";
		}
	}
	var selectBox = document.getElementById("eventSelector");
	for(var i=selectBox.options.length - 1; i >= 0; i--) {
		selectBox.remove(i); // Remove all of the old events
	}
	var defaultOption = new Option("Choose Event","")
	defaultOption.setAttribute("style","display:none");
	defaultOption.setAttribute("disabled","disabled");
	defaultOption.setAttribute("selected","selected");
	
	selectBox.options[selectBox.options.length] = defaultOption;
}


function validateEntries() {
	var enteredNumber = document.getElementById("teamNumEntry").value;
	var enteredEvent = document.getElementById("eventSelector").value;
	
	var errorMessages = document.getElementsByClassName("errorMessage");
	for(var i=0; i<errorMessages.length; i++) {
		errorMessages[i].style.display = "none";
	} // Make all invisible to start
	document.getElementById("errorDiv").style.display = "none";
	
	if(/^[0-9]{1,4}$/.test(enteredNumber) && enteredEvent !== "") { // If it's a valid 1 to 4-digit number and valid event choice
		var teamRequest = new XMLHttpRequest(),
			response;
		
		teamRequest.open("GET", TBAapiBaseLink + "team/frc" + enteredNumber + "/years_participated", true);
		teamRequest.setRequestHeader("X-TBA-App-Id", appID);
		
		teamRequest.send();
		
		teamRequest.onreadystatechange = function(e) {
			
			if (this.readyState == XMLHttpRequest.DONE) {
				response = JSON.parse(teamRequest.response);
				var inactive = true;
				for(var i = 0; i < response.length; i++) {
					if(response[i] === year) {
						return true;
						inactive = false;
					}
				}
				if(inactive) {
					document.getElementById("inactiveTeam").style.display = "list-item";
					document.getElementById("errorDiv").style.display = "block";
					return false;
				}
			}
		}
	}
	else if(!/^[0-9]{1,4}$/.test(enteredNumber)){
		document.getElementById("invalidTeamEntry").style.display = "list-item";
		document.getElementById("errorDiv").style.display = "block";
		return false;
	}
	if(enteredEvent == "") {
		document.getElementById("noEvent").style.display = "list-item";
		document.getElementById("errorDiv").style.display = "block";
		return false;
	}
}
function startOnFrontLoad() {
	document.getElementById("teamNumEntry").onkeyup = function(event) {
		if(event.keyCode == 13) {
			validateEntries();
		}
	}
}