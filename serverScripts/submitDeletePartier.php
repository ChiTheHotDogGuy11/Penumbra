<?php
	/* NOTE: The partier never actually gets deleted from the database, because that would cause
	 * activity updates to fail. */
	 
	/* Read the input variables (partier to delete and the party to remove them from) */
	$deletePartierID = $_POST["deletePartierID"];
	$deletePartyID = $_POST["deletePartyID"];
	
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
	
	/* Insert a new event into the activities table */
	$new_activity_entry = "INSERT INTO activity VALUES (" . $deletePartyID . ", " . $deletePartierID . ", \"Leave\", -1, NULL)";
	$activity_insertion_success = mysql_query($new_activity_entry, $link);
	
	/* Return an error if insertion fails */
	if (!$activity_insertion_success) {
		die("Failed trying to insert into activity");
	}
	
	/* Close db connection */ 
	mysql_close($link);
	
	echo "true";
?>