<?php
	/* Read the input variables */
	
	//Person that submitted the track
	$partierToSubmit = $_POST["partierToSubmit"];
	//Party to add the track to
	$partyToSubmitTo = $_POST["partyToSubmitTo"];
	//The ID of the track (the Spotify URI)
	$trackID = "\"" . $_POST["trackID"] . "\"";
	/* Format the following to go directly into an SQL query */
	$trackName = "\"" . $_POST["trackName"] . "\"";
	$trackArtist = "\"" . $_POST["trackArtist"] . "\"";
	$trackAlbum = "\"" . $_POST["trackAlbum"] . "\"";
	
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
	
	/* Check if the track is currently on the playlist */
	$query = "SELECT " . $trackName . " FROM playlist WHERE track_id = " . $trackID . " AND party_id = " . $partyToSubmitTo;
	$result = mysql_query($query);

	/* If the row exists, quit */
	if(mysql_num_rows($result) > 0) {
		die("false");
	}
	
	/* Insert a new track into the party playlist */
	$new_track_entry = "INSERT INTO playlist VALUES(" . $partyToSubmitTo . ", " . $trackID . ", 0, " . 
		$trackName . ", " . $trackArtist . ", " . $trackAlbum . ", 0)";
	$insertion_success = mysql_query($new_track_entry, $link);
	
	/* Return an error if insertion fails */
	if (!insertion_success) {
		die("Failed trying to add a new song to the playlist.");
	}
	
	/* Insert a new event into the activities table */
	$new_activity_entry = "INSERT INTO activity VALUES (" . $partyToSubmitTo . ", " . $partierToSubmit . ", \"Submit\", " . 
		$trackID . ", NULL)";
	$activity_insertion_success = mysql_query($new_activity_entry, $link);
	
	/* Return an error if insertion fails */
	if (!$activity_insertion_success) {
		die("Failed trying to insert into activity");
	}
	
	/* Close db connection */ 
	mysql_close($link);
	
	echo "true";
?>