<?php

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
	
	/* Make an XML document to return */
	$xmlDoc = new DOMDocument();
	$root = $xmlDoc -> appendChild($xmlDoc -> createElement("Parties"));
	/* XML Structure
		<Parties>
			<Party>
				<ID>$value</ID>
				<Name>$value</Name>
			</Party>
		</Parties>
	*/
	
	/* Get the id and name of each party in the db */
	$getPartiesEntry = "SELECT party_id, party_name FROM party";
	$readSuccess = mysql_query($getPartiesEntry, $link);
	
	/* Format the result */
	/* NOTE: This must immediately follow the query */
	while ($row = mysql_fetch_array($readSuccess)) {
		$curParty = $root->appendChild($xmlDoc->createElement("Party"));
		
		//Get the ID of the party
		$curParty->appendChild($xmlDoc->createElement("ID", $row['party_id']));
		
		//Get the name of the party
		$curParty->appendChild($xmlDoc->createElement("Name", $row['party_name']));
	}
	
	/* Return an error if the select fails */
	if (!$readSuccess) {
		die("Can\'t do insertion");
	}
	
	/* Close db connection */ 
	mysql_close($link);
	
	/* return the XML doc we created */
	echo $xmlDoc->saveXML();
?>