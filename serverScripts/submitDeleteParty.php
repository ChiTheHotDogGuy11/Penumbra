<?php
	/* Get the variable passed to the php call */
	$deletePartyID = $_POST["deletePartyID"];
	
	/* Connect to the db */
	$hostname = "db441544297.db.1and1.com";
	$database = "db441544297";
	$username = "dbo441544297";
	$password = "penumbra1";

	/* Connect to database and return error if it doesn't work*/
	$link = mysql_connect($hostname, $username, $password);
	if (!$link) {
		die("Connection failed: " . mysql_error());
	}
	
	$db_selected = mysql_select_db($database, $link);
	if (!db_selected) {
		die ("Can\'t select database: " . mysql_error());
	}
	
	/* Delete the given party from the database */
	$new_party_entry = "DELETE FROM party WHERE party_id = " . $deletePartyID;
	$insertion_success = mysql_query($new_party_entry, $link);
	
	/* Return an error if the delete fails */
	if (!$insertion_success) {
		die("Can\'t do insertion");
	}
	
	/* Close db connection */ 
	mysql_close($link);
	
	/* return true, just cuz */
	echo "true";
?>