<?php

	/* Get the variable passed to the php call (party_id to get playlist for) */
	$playlistPartyID = $_GET["playlistPartyID"];
	
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
	$root = $xmlDoc -> appendChild($xmlDoc -> createElement("Playlist"));
	/* XML Structure
		<Playlist>
			<Track>
				<ID>$value</ID>
				<Name>$value</Name>
				<Votes_For>$value</VotesFor>
				<Artist>$value</Artist>
				<Album>$value</Album>
				<CurrentlyPlaying>$value</CurrentlyPlaying>
			</Track>
		</Playlist>
	*/
	
	/* Get all the info about the playlist associated with the given party */
	$getPlaylistEntry = "SELECT * FROM playlist WHERE party_id = " . $playlistPartyID . " ORDER BY 
		currently_playing DESC, votes_for DESC";
	$readSuccess = mysql_query($getPlaylistEntry, $link);
	
	/* Format the result */
	/* NOTE: This must immediately follow the query */
	while ($row = mysql_fetch_array($readSuccess)) {	
		$curTrack = $root->appendChild($xmlDoc->createElement("Track"));
		
		//Add the track ID
		$curTrack->appendChild($xmlDoc->createElement("ID", $row['track_id']));
		
		//Add the track name
		$curTrack->appendChild($xmlDoc->createElement("Name", $row['track_name']));
		
		//Add the number of votes the track has
		$curTrack->appendChild($xmlDoc->createElement("Votes_for", $row['votes_for']));
		
		//Add the artist that made the track
		$curTrack->appendChild($xmlDoc->createElement("Artist", $row['track_artist']));
		
		//Add the album the track comes from
		$curTrack->appendChild($xmlDoc->createElement("Album", $row['track_album']));
		
		//Add whether or not the track is currently playing
		$curTrack->appendChild($xmlDoc->createElement("Currently_playing", $row['currently_playing']));
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