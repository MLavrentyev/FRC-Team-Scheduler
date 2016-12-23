var frcApiBaseLink = "https://frc-api.firstinspires.org/v2.0/";

var timeToRefresh = 30;


function refreshSchedule() {
    "use strict";
}

function refreshTimer() {
	"use strict";
	
	if (timeToRefresh === 0) {
		timeToRefresh = 30;
		document.getElementById("refreshTime").innerHTML = "Refreshing...";
		refreshSchedule();
	}
	document.getElementById("refreshTime").innerHTML = timeToRefresh;
	timeToRefresh -= 1;
	
	setTimeout(refreshTimer, 1000);
}