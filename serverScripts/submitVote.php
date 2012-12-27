<?php
	/* Read the input variables */
	
	//Person that submitted the track
	$partyID = $_POST["partyID"];
	//Party to add the track to
	$partierID = $_POST["partierID"];
	//The ID of the track (the Spotify URI)
	$trackID = "\"" . $_POST["trackID"] . "\"";
	//True if the vote is for, false if it is against
	$voteFor = $_POST["voteFor"];
	/* Format voteFor to go into a query */
	if ($voteFor === "true") {
		$voteCount = 1;
		$formattedVote = "\"Vote for\"";
	}
	else {
		$voteCount = -1;
		$formattedVote = "\"Vote against\"";
	}
	
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
	
	/* Update the vote count for the specified track */
	$vote_change_entry = "UPDATE playlist SET votes_for = votes_for + " . $voteCount . " WHERE party_id = " . $partyID . " AND track_id = " . $trackID;
	$update_success = mysql_query($vote_change_entry, $link);
	
	/* Return an error if insertion fails */
	if (!update_success) {
		die("Failed trying to vote for a song");
	}
	
	/* Insert a new event into the activities table */
	$new_activity_entry = "INSERT INTO activity VALUES (" . $partyID . ", " . $partierID . ", " . $formattedVote . ", " . 
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