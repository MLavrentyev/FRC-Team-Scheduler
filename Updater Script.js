var frcApiBaseLink = "https://frc-api.firstinspires.org/v2.0/";

var timeToRefresh = 30;


function refreshSchedule() {
    "use strict";
}

function refreshTimer() {
	"use strict";
	timeToRefresh -= 1;
	document.getElementById("refreshTime").innerHTML = timeToRefresh;
	setTimeout(refreshTimer, 1000);
}