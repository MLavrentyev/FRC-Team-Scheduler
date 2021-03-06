<?php 
	$teamNum = $_GET["teamNum"];
	$eventCode = $_GET["eventCode"];
?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/scheduleStylesheet.css">
        <title>FRC Live Match Schedule</title>
		<meta charset="utf-8" />
		<script src="js/updaterScript.js"></script>
		<script type="text/javascript">
			teamNumber = <?php echo $teamNum ?>;
			eventKey = "<?php echo $eventCode ?>";
		</script>
    </head>
    
    <body onload="startOnMainPageLoad()">
        <div id="header">
            <h1 id="title"></h1>
			<a id="backButton" href="index.html"><img border="0" alt="Back" src="img/backArrow.png" width="20" height="20"></a>
        </div>
        <div id="dataSection">
            <table>
                <tbody id="scheduleTable">
                    <tr>
                        <td>#</td>
                        <td>Red 1</td>
                        <td>Red 2</td>
                        <td>Red 3</td>
                        <td>Blue 1</td>
                        <td>Blue 2</td>
                        <td>Blue 3</td>
						<td>Starts in</td>
                    </tr>
                </tbody>
            </table>
			<p style="display:none" id="concludedMessage">The event is not currently active.</p>
        </div>
        <div id="footnotes">
            <div id="eventNameDiv">
				<marquee behavior="scroll" direction="left" width="200px" id="eventName">NE District - Granite State Event</marquee>
            </div>
            <div id="teamNumberDiv">
				<p id="teamNumber"></p>
            </div>
            <div id="refreshDiv">
				<div id="loaderContainer"><div id="loader"></div></div>
                <p id="refreshTime">Refreshing in: 30 seconds</p>
            </div>
        </div>
		<div id="whitespace"></div>
    </body>
</html>