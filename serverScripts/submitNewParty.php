<?php
	/* Get the variable passed to the php call */
	$newPartyName = $_POST["newPartyName"];
	/* Format the input to read cleanly into an SQL query */
	$newPartyForSQL = "\"" . $newPartyName . "\"";
	
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

	/* Connect to database and return error if it doesn't work*/
	$link = mysql_connect($hostname, $username, $password);
	if (!$link) {
		die("Connection failed: " . mysql_error());
	}
	
	$db_selected = mysql_select_db($database, $link);
	if (!db_selected) {
		die ("Can\'t select database: " . mysql_error());
	}
	
	/* Make a new party entry in the database */
	$new_party_entry = "INSERT INTO party VALUES (NULL, " . $newPartyForSQL . ")";
	$insertion_success = mysql_query($new_party_entry, $link);
	/* Get the new party's ID */
	$partyID = mysql_insert_id($link);
	
	/* Return an error if the insertion fails */
	if (!$insertion_success) {
		die("Can\'t do insertion");
	}
	
	/* Insert the new track into the party playlist */
	$new_track_entry = "INSERT INTO playlist VALUES(" . $partyID . ", " . $trackID . ", 1, " . 
		$trackName . ", " . $trackArtist . ", " . $trackAlbum . ", 0)";
	$insertion_success_two = mysql_query($new_track_entry, $link);
	
	/* Return an error if insertion fails */
	if (!insertion_success_two) {
		die("Failed trying to add a new song to the playlist.");
	}
	
	/* Close db connection */ 
	mysql_close($link);
	
	/* Make an XML document to return */
	$xmlDoc = new DOMDocument();
	
	/* XML structure
		<Party>
			<ID>$value</ID>
			<Name>$value</Name>
		</Party>
	*/
	
	$root = $xmlDoc -> appendChild($xmlDoc -> createElement("Party"));
	/* append the party ID to the root of the xml doc */
	$idAttr = $root -> appendChild($xmlDoc -> createElement("ID", $partyID));
	$nameAttr = $root -> appendChild($xmlDoc -> createElement("Name", $newPartyName));
	
	echo $xmlDoc->saveXML();
?>