<?php
	/* Read the input variables (new partier name and the ID of the party to join) */
	$newPartierName = $_POST["newPartierName"];
	$partyToJoinID = $_POST["partyToJoinID"];
	/* Format the input to read cleanly into an SQL Query */
	$newPartierForSQL = "\"" . $newPartierName . "\"";
	
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
	
	/* Make a new partier in the database */
	$new_partier_entry = "INSERT INTO partier VALUES (" . $partyToJoinID . ", NULL, " . $newPartierForSQL. ")";
	$insertion_success = mysql_query($new_partier_entry, $link);
	/* Get the new partier's ID */
	$partierID = mysql_insert_id($link);
	
	/* Return an error if insertion fails */
	if (!$insertion_success) {
		die("Can\'t do insertion");
	}
	
	/* Insert a new event into the activities table */
	$new_activity_entry = "INSERT INTO activity VALUES (" . $partyToJoinID . ", " . $partierID . ", \"Join\", -1, NULL)";
	$activity_insertion_success = mysql_query($new_activity_entry, $link);
	
	/* Return an error if insertion fails */
	if (!$activity_insertion_success) {
		die("Failed trying to insert into activity");
	}
	
	/* Close db connection */ 
	mysql_close($link);
	
	/* Make an XML document to return */
	$xmlDoc = new DOMDocument();
	
	/* XML Structure
		<Partier>
			<ID>$value</ID>
			<Name>$value</Name>
		</Partier>
	*/ 
	
	$root = $xmlDoc -> appendChild($xmlDoc -> createElement("Partier"));
	/* append the party ID to the root of the xml doc */
	$root -> appendChild($xmlDoc -> createElement("ID", $partierID));
	$root -> appendChild($xmlDoc -> createElement("Name", $newPartierName));
	
	echo $xmlDoc->saveXML();
?>