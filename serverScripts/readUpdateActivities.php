<?php

	/* Get the variable passed to the php call (party_id to get activities for) */
	$activityPartyID = $_GET["activityPartyID"];
	$numberOfActivities = $_GET["numberOfActivities"];
	
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
	$root = $xmlDoc -> appendChild($xmlDoc -> createElement("Activities"));
	/* XML Structure
		<Activities>
			<Activity>
				<PartierName>$value</PartierName>
				<ActivityType>$value</ActivityType>
				<TimeOccured>$value</Time_occured>
				<TrackName>$value</TrackName>
				<TrackArtist>$value</TrackArtist>
				<TrackAlbum>$value</TrackAlbum>
		</Activities>
	*/
	
	/* Get all the info about the playlist associated with the given party */
	/*$getActivitiesEntry = "SELECT partier_name, activity_type, time_occured, track_name, track_artist, track_album
		FROM partier, activity, playlist WHERE partier.party_id = " . $activityPartyID . " AND activity.party_id = " . $activityPartyID 
		. " AND playlist.party_id = " . $activityPartyID . " AND playlist.track_id = activity.track_id ORDER BY time_occured DESC
		LIMIT " . $numberOfActivities;*/
	//AND partier.partier_id = activity.partier_id
	$getActivitiesEntry = "SELECT partier_name, activity_type, time_occured, track_name, track_artist, track_album FROM activity INNER JOIN partier
				USING(party_id, partier_id) INNER JOIN playlist USING(party_id, track_id) WHERE party_id = " . $activityPartyID . " ORDER BY
				time_occured DESC LIMIT " . $numberOfActivities;
	//echo $getActivitiesEntry;
	$readSuccess = mysql_query($getActivitiesEntry, $link);
	
	/* Format the result */
	/* NOTE: This must immediately follow the query */
	while ($row = mysql_fetch_array($readSuccess)) {					
		$curTrack = $root->appendChild($xmlDoc->createElement("Activity"));
		
		//Get the name of the person that performed an action
		$curTrack->appendChild($xmlDoc->createElement("PartierName", $row['partier_name']));
		
		//Get the type of activity the user performed ("Submit a song", "Vote for a song", etc.)
		$curTrack->appendChild($xmlDoc->createElement("ActivityType", $row['activity_type']));
		
		//Get the time the user performed the action
		$curTrack->appendChild($xmlDoc->createElement("TimeOccured", $row['time_occured']));
		
		//Get the name of the track the user acted upon (NOTE: empty string when the user joins/ leaves the party)
		$curTrack->appendChild($xmlDoc->createElement("TrackName", $row['track_name']));
		
		//Get the name of the artist the user acted upon (NOTE: empty string when the user joins/ leaves the party)
		$curTrack->appendChild($xmlDoc->createElement("TrackArtist", $row['track_artist']));
		
		//Get the name of the album the user acted upon (NOTE: empty string when the user joins/ leaves the party)
		$curTrack->appendChild($xmlDoc->createElement("TrackAlbum", $row['track_album']));
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