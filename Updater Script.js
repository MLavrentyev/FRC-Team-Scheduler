var frcApiBaseLink = "https://frc-api.firstinspires.org/v2.0/";

function countOneDown(sec) {
    "use strict";
    document.getElementById("refreshTime").innerHTML = sec;
}
function refreshSchedule() {
    "use strict";
}

function setCountdown() {
    "use strict";
    var sec;
    for (sec = 30; sec > 0; sec -= 1) {
        setTimeout(countOneDown(sec), 1000);
    }
    refreshSchedule();
}

window.onload = function start() {
    "use strict";
    setInterval(setCountdown(), 0);
};