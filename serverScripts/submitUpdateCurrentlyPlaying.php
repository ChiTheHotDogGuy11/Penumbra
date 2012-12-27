<?php
	/* Read the input variables */
	
	//Party to modify the playlist of
	$partyToChange = $_POST["partyToChange"];
	//The ID of the track to start playing
	$trackToMakeCurrent = "\"" . $_POST["trackToMakeCurrent"] . "\"";
	
	/* Connect to the db */
	$hostname = "db441544297.db.1and1.com";
	$database = "db441544297";
	$username = "dbo441544297";
	$password = "penumbra1";

	/* Connect to database and return error if it doesn't work */
	$link = mysql_connect($hostname, $username, $password);
	if (!$link) {
		die("Connection failed: " . mysql_error());
	}
	
	$db_selected = mysql_select_db($database, $link);
	if (!db_selected) {
		die ("Can\'t select database: " . mysql_error());
	}
	
	/* Delete the song that just finished from the playlist */
	$deleteQuery = "DELETE FROM playlist WHERE party_id = " . $partyToChange . " AND currently_playing = 1";
	$deleteResult = mysql_query($deleteQuery);
	
	/* Update the playlist to reflect that a new song is playing */
	$updateTrackEntry = "UPDATE playlist SET currently_playing = 1 WHERE party_id = " . $partyToChange . " AND track_id = " . $trackToMakeCurrent;
	$updateSuccess = mysql_query($updateTrackEntry, $link);
	
	
	/* Close db connection */ 
	mysql_close($link);
	
	echo "true";
?>