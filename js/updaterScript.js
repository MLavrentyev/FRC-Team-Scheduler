var frcApiBaseLink = "https://www.frc-api.firstinspires.org/v2.0/";
var TBAapiBaseLink = "https://www.thebluealliance.com/api/v2/";
var appID = "mlavrentyev:liveMatchSchedule:v1";
var timeToRefresh = 30;
var lastModified;

var currentMatch = 1;
var year = (new Date()).getFullYear();
var eventKey = "ctwat"; // Key without the year, e.g. ctwat
var teamNumber = 4557;

// Main page functions
function sortAllMatches(allMatches) {
	var somethingSwapped = true;
	
	for(var j=0; j< allMatches.length; j++) {
		// Replace 'f', 'sf', 'qf', and 'qm' with numbers to easier distinguish
		/* QM - 0
		*  EF - 1
		*  QF - 2
		*  SF - 3
		*   F - 4
		*/
		var comp_level_int = -1;
		switch(allMatches[j]["comp_level"]) {
			case "f":
				comp_level_int = 4;
				break;
			case "sf":
				comp_level_int = 3;
				break;
			case "qf":
				comp_level_int = 2;
				break;
			case "ef":
				comp_level_int = 1;
				break;
			case "qm":
				comp_level_int = 0;
				break;
		}
		allMatches[j]["comp_level_int"] = comp_level_int;
	}
	
	while(somethingSwapped) {
		somethingSwapped = false;
		for(var i=0; i<allMatches.length-1; i++) {
			if(allMatches[i].comp_level_int > allMatches[i+1].comp_level_int) { // Primarily, sort by match type
				var temp = allMatches[i];
				allMatches[i] = allMatches[i+1];
				allMatches[i+1] = temp;
				somethingSwapped = true;
			} else if(allMatches[i].comp_level_int === allMatches[i+1].comp_level_int && allMatches[i].match_number > allMatches[i+1].match_number) {
				// If both are qualifying matches and it needs sorting
				var temp = allMatches[i];
				allMatches[i] = allMatches[i+1];
				allMatches[i+1] = temp;
				somethingSwapped = true;
			}
		}
	}
	return allMatches;
}
function refreshSchedule() {
    "use strict";
	var httpsRequest = new XMLHttpRequest();
	
	httpsRequest.open("GET", TBAapiBaseLink + "team/frc" + teamNumber + "/event/" + year + eventKey + "/matches", true);
	httpsRequest.setRequestHeader("X-TBA-App-Id", appID);
	console.log(lastModified);
	if(lastModified) { //Only do this if it's not null
		httpsRequest.setRequestHeader("If-Modified-Since", lastModified);
	}
	
	httpsRequest.send();
	
	httpsRequest.onreadystatechange = function(e) {
		if(httpsRequest.status !== 304 && httpsRequest.readyState === 4 && httpsRequest.response !== "") {
			lastModified = httpsRequest.getResponseHeader("Last-Modified");
			var allMatches = JSON.parse(httpsRequest.response);
			allMatches = sortAllMatches(allMatches);
			for(var row=1; row<document.getElementById("scheduleTable").rows.length;) {
				document.getElementById("scheduleTable").deleteRow(row);
			}
			for(var i=0; i<allMatches.length; i++) {
				var table = document.getElementById("scheduleTable");
				var addedRow = table.insertRow();
				
				var matchCell = addedRow.insertCell();

				if(allMatches[i].comp_level_int === 1) {
					//If it's an octofinal match
					matchCell.innerHTML = "EF " + allMatches[i].set_number + "-" + allMatches[i].match_number;
					
				}else if(allMatches[i].comp_level_int === 2) {
					//If it's a quarterfinal match
					matchCell.innerHTML = "QF " + allMatches[i].set_number + "-" + allMatches[i].match_number;
					
				}else if(allMatches[i].comp_level_int === 3) {
					//If it's a semifinal match
					matchCell.innerHTML = "SF " + allMatches[i].set_number + "-" + allMatches[i].match_number;
					
				}else if(allMatches[i].comp_level_int === 4) {
					//If it's a final match
					matchCell.innerHTML = "F " + allMatches[i].set_number + "-" + allMatches[i].match_number;
				}else {
					matchCell.innerHTML = allMatches[i].match_number;
				}
				var red1Cell = addedRow.insertCell();
				var red2Cell = addedRow.insertCell();
				var red3Cell = addedRow.insertCell();
				
				var blue1Cell = addedRow.insertCell();
				var blue2Cell = addedRow.insertCell();
				var blue3Cell = addedRow.insertCell();

				red1Cell.innerHTML = allMatches[i].alliances.red.teams[0].replace("frc","");
				red2Cell.innerHTML = allMatches[i].alliances.red.teams[1].replace("frc","");
				red3Cell.innerHTML = allMatches[i].alliances.red.teams[2].replace("frc","");

				blue1Cell.innerHTML = allMatches[i].alliances.blue.teams[0].replace("frc","");
				blue2Cell.innerHTML = allMatches[i].alliances.blue.teams[1].replace("frc","");
				blue3Cell.innerHTML = allMatches[i].alliances.blue.teams[2].replace("frc","");
				
				red1Cell.style.color = red1Cell.innerHTML == teamNumber ? "#c80000" : "#000000";
				red2Cell.style.color = red2Cell.innerHTML == teamNumber ? "#c80000" : "#000000";
				red3Cell.style.color = red3Cell.innerHTML == teamNumber ? "#c80000" : "#000000";
				
				blue1Cell.style.color = blue1Cell.innerHTML == teamNumber ? "0000c8" : "#000000";
				blue2Cell.style.color = blue2Cell.innerHTML == teamNumber ? "#0000c8" : "#000000";
				blue3Cell.style.color = blue3Cell.innerHTML == teamNumber ? "#0000c8" : "#000000";

				
				var timeLeft = addedRow.insertCell();
				var sec = (allMatches[i].time - new Date().getTime()/1000);
				var min = Math.floor(sec/60);
				sec -= 60*min;
				var hrs = Math.floor(min/60);
				min -= 60*hrs;
				
				var secStr = sec,
					minStr = min,
					hrsStr = hrs;
				
				if(sec < 0 || min < 0 || hrs < 0) {
					addedRow.parentNode.removeChild(addedRow);
				} 
				
				if(sec < 10) secStr = "0" + secStr;
				if(min < 10 && hrs > 0) minStr = "0" + minStr;
				
				if(hrs > 0) {
					timeLeft.innerHTML = hrsStr + ":" + minStr + ":" + secStr;
				} else {
					timeLeft.innerHTML = minStr + ":" + secStr;
				}
			}
			if(document.getElementById("scheduleTable").rows.length === 1) {
				document.getElementById("concludedMessage").style.display = "block";
			}
		}
	}
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
	
	//Now, modify time left in schedule
	for(var i = 1; i < document.getElementById("scheduleTable").rows.length; i++) {
		var timeCell = document.getElementById("scheduleTable").rows[i].cells[7];
		
		var splitTimeStr = timeCell.innerHTML.split(":"); // Splits it by the colons
		if (splitTimeStr.length === 3) { //If hours are included
			var hrs = parseInt(splitTimeStr[0]),
				min = parseInt(splitTimeStr[1]),
				sec = parseInt(splitTimeStr[2]);
			
			sec--;
			if(sec < 0) {
				sec = 59;
				min--;
			}
			if(min < 0) {
				min = 59;
				hrs--;
			}
			var hrsStr = hrs,
				minStr = min,
				secStr = sec;
			
			if(sec < 10) secStr = "0" + sec;
			if(min < 10 && hrs > 0) minStr = "0" + min;
			
			if(hrs === 0) {
				timeCell.innerHTML = minStr + ":" + secStr;
			} else {
				timeCell.innerHTML = hrsStr + ":" + minStr + ":" + secStr;
			}
		} else {
			var min = parseInt(splitTimeStr[0]),
				sec = parseInt(splitTimeStr[1]);
			
			sec--;
			if(sec < 0) {
				sec = 59;
				min--;
			}
			var secStr = sec;
			if(sec < 10) secStr = "0" + sec;
			
			if(min < 0) {
				var row = document.getElementById("scheduleTable").rows[i];
				row.parentNode.removeChild(row);
				i--;
			} else {
				timeCell.innerHTML = min + ":" + secStr;
			}
		}
	}
	
	setTimeout(refreshTimer, 1000);
}
function setFootnoteInfo() {
	"use strict";

	//TODO: Get data from side-server
	
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
		}
	};
}
function startOnMainPageLoad() {
	"use strict";
	refreshSchedule();
	setFootnoteInfo();
	refreshTimer();
}
