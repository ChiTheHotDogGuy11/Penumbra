
/*
 * Summary: Submit a new ajax request to the server to update the playlist
 * Parameters: None
 * Returns: undefined
*/
function updatePlaylistRequest() {
	$.ajax({
		url: "http://www.justingreet.com/penumbra/readUpdatePlaylist.php",
		type: "get",
		data: {playlistPartyID: PARTY_ID},
		dataType: "xml", 
		success: function(response, textStatus) {
			updatePlaylistXMLResponse(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			//Don't do anything on error because it's not fatal
		}
	});
}

/*
 * Summary: parse the XML response from the ajax request to update the playlist.
 *		Namely, update the divs that are displayed for each track.
 * Parameters: xmlDoc: the xml response to parse
 * Returns: undefined
 * XML Structure:
		<Playlist>
			<Track>
				<ID>$value</ID>
				<Name>$value</Name>
				<Votes_for>$value</VotesFor>
				<Artist>$value</Artist>
				<Album>$value</Album>
				<Currently_playing>$value</CurrentlyPlaying>
			</Track>
		</Playlist>
*/
function updatePlaylistXMLResponse(xmlDoc) {
	var songCount = $(xmlDoc).find("Track").length; 
	//The height of the divs representing each track
	var divHeight = $("#playlist").height() / PLAYLIST_TRACKS_NUM;
	var numTracks = Math.min(songCount, PLAYLIST_TRACKS_NUM);
	//Keep track of the number of tracks we've displayed
	var counter = 0;
	
	$(".topTrack").remove();
	$(".nowPlaying").remove();
	
	$(xmlDoc).find("Track").each(function() {
		//Means we've surpassed the number of tracks we want to display
		if (counter >= numTracks) return;
		counter += 1;
		/* new track setup */
		var newTrack = document.createElement("div");
		$(newTrack).height(divHeight);
		$(newTrack).addClass("topTrack");
		newTrack.ID = $(this).find("ID").text();
		/* setup the number of votes the track has */
		var trackCounter = document.createElement("div");
		$(trackCounter).addClass("topTrackVoteCount");
		var trackCounterText = document.createElement("h1");
		if (counter === 1) {
			$(trackCounterText).html("");
			$(newTrack).addClass("nowPlaying");
		}
		else {
			$(trackCounterText).html($(this).find("Votes_for").text());
		}
		$(trackCounter).append(trackCounterText);
		/* setup the div that holds the track name and artist */
		var infoDiv = document.createElement("div");
		$(infoDiv).addClass("infoDiv");
		var trackInfo = document.createElement("p");
		$(trackInfo).addClass("trackInfo");
		$(trackInfo).html($(this).find("Name").text() + "</br><span class=\"artistName\">by " + $(this).find("Artist").text() + "</span>");
		$(infoDiv).append(trackInfo);
		/* bring all the elements together */
		$(newTrack).append(trackCounter);
		$(newTrack).append(infoDiv);
		$("#playlist").append(newTrack);
		//Adjust the font-size of the track name and artist
		adjustFontSize(infoDiv, trackInfo);
		if (counter === 1) CURRENTLY_PLAYING = newTrack.ID;
		else if (counter === 2) NEXT_TO_PLAY = newTrack.ID;
	});
	//Special cases where there is no next song to play
	if (counter === 0) CUURENTLY_PLAYING = "";
	else if (counter === 1) {
		NEXT_TO_PLAY = "";
	}
	//If there are songs waiting to be played with nothing playing, get started
	if (counter >= 1) {
		var models = sp.require("sp://import/scripts/api/models");
		if (models.player.playing === false) {
			if (models.player.track == null) {
				sp.trackPlayer.playTrackFromUri(CURRENTLY_PLAYING, {
					onSuccess: function() {} ,
					onFailure: function () {},
					onComplete: function () {}
				});
				//Update the database to reflect the changes.
				updateCurrentlyPlaying(CURRENTLY_PLAYING);
			}
		}
	}
}

/*
 * Summary: adjust the size of the track name and artist name to ensure they both fit in the allocated div
 * Parameters: infoDiv: The div that contains the track information
			   trackInfo: The actual text that details the track name and track artist
 * Returns: undefined
*/
function adjustFontSize(infoDiv, trackInfo) {
	//A quick hack to probably force the artist name to fit on a single line
	var artistNameText = $(trackInfo).children(".artistName").text();
	if (artistNameText.length > 27) $(trackInfo).children(".artistName").css("font-size", 15);
	
	/* Now we worry about the size of the track name, in a more robust fashion */
	//Font size in pixels 
	var fontSize = 27;
	//Height of the artist name
	var artistHeight = $(trackInfo).children(".artistName").height();
	//Make the max height of the track name the size of the div minus the height of the artist name
	var maxHeight = $(infoDiv).height() * (.9)- artistHeight;
	var maxWidth = $(infoDiv).width();
	var textHeight;
	var textWidth;
	/* Reduce the size of the font as long as it doesn't fit the maxHeight and maxWidth constraints */
	do {
		$(trackInfo).css("font-size", fontSize);
		textHeight = $(trackInfo).height() - artistHeight;
		textWidth = $(trackInfo).width();
		fontSize = fontSize - 1;
	} while ((textHeight > maxHeight) || (textWidth > maxWidth));
}

/*
 * Summary: Submit a new ajax request to the server to update the activities
 * Parameters: None
 * Returns: undefined
*/
function updateActivityRequest() {
	$.ajax({
		url: "http://www.justingreet.com/penumbra/readUpdateActivities.php",
		type: "get",
		data: {activityPartyID: PARTY_ID, numberOfActivities: NUM_ACTIVITIES_TO_DISPLAY},
		dataType: "xml", 
		success: function(response, textStatus) {
			updateActivityXMLResponse(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			//Don't do anything on error because it's not fatal
		}
	});
}

/* Summary: Display the most recent activities at the party
 * Parameters: None
 * Returns: Undefined
 * XML Structure:
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
function updateActivityXMLResponse(xmlDoc) {
	var curActivity;

	$(".activity").remove();
	
	$(xmlDoc).find("Activity").each(function() {
		/* First get all the necessary information */
		curActivity = $(this);
		var partierName = curActivity.find("PartierName").text();
		var activityType = curActivity.find("ActivityType").text();
		var trackName = curActivity.find("TrackName").text();
		var trackArtist = curActivity.find("TrackArtist").text();
		var trackAlbum = curActivity.find("TrackAlbum").text();
		
		/* First deal with the party people section */
		if (!isPartyPerson(partierName)) {
			var newPerson = document.createElement("li");
			var newPersonName = document.createElement("p");
			$(newPerson).addClass("person");
			$(newPersonName).text(partierName);
			$(newPerson).append(newPersonName);
			if (PARTY_PEOPLE.length % 2 === 0) {
				$(leftPeople).append(newPerson);
			}
			else {
				$(rightPeople).append(newPerson);
			}
			PARTY_PEOPLE.push(partierName);
		}
		/* Now make the list element and initialize it */
		var newActivity = document.createElement("li");
		$(newActivity).addClass("activity");
		
		/* Do some work to get the proper height (working in the padding) */
		var totalH = $("#partyActivity").height() / NUM_ACTIVITIES_TO_DISPLAY;
		//var distrTopPadding = (parseInt($(".partyActivity ul").css("padding-top"))) / NUM_ACTIVITIES_TO_DISPLAY;
		//var activityHeight = totalH - distrTopPadding - parseInt($(".activity").css("padding-bottom"));
		$(newActivity).height(totalH);
		
		/* Do some special work to get the correct width (working in the padding) */
		var totalW = $("#partyActivity").width();
		var totalPadding = parseInt($(".activity").css("padding-left")) + parseInt($(".activity").css("padding-right"));
		$(newActivity).css("width", ((totalW - totalPadding)/totalW)*100 + "%");
		
		/* This will store the actual text */
		var newActivityDescr = document.createElement("p");
		$(newActivityDescr).addClass("activityDescr");
		
		/* Now get the actual text we want to display */
		var activityText = makeActivityText(partierName, activityType, trackName, trackArtist, trackAlbum);
		$(newActivityDescr).text(activityText);
		
		/* Now add all the elements together */
		$(newActivity).append(newActivityDescr);
		$("#partyActivity ul").append(newActivity);
	});
}

/* 
 * Summary: Check if the given person is already on the person list
 * Parameters: partierName: The name of the person to check
 * Returns: true if the person is in the list, false otherwise
*/
function isPartyPerson(name) {
	for (var i = 0; i < PARTY_PEOPLE.length; i++) {
		if (PARTY_PEOPLE[i] == name) return true;
	}
	return false;
}

/* 
 * Summary: Make an interesting description of an activity
 * Parameters: partierName, activityType, trackName, trackArtist, trackAlbum
 * Returns: A string containing a description of the activity.
*/
function makeActivityText(partierName, activityType, trackName, trackArtist, trackAlbum) {
	switch(activityType) {
		case "Vote for":
			return partierName + " voted for " + trackName + " by " + trackArtist + ".";
			break;
		case "Vote against":
			return partierName + " voted against " + trackName + " by " + trackArtist + ".";
			break;
		case "Join":
			return partierName + " joined the party!";
			break;
		case "Submit":
			return partierName + " added the song " + trackName + " by " + trackArtist + " to the party."; 
			break;
	}
	return "No activity match!";
}

/*
 * Summary: Update the database to remove the song that just finished playing, and make the 
 *		new song the currently playing one
 * Parameters: nextTrack: The ID of the track to play next
 * Returns: undefined
*/
function updateCurrentlyPlaying(nextTrack) {
	$.ajax({
		url: "http://www.justingreet.com/penumbra/submitUpdateCurrentlyPlaying.php",
		type: "post",
		data: {partyToChange: PARTY_ID, trackToMakeCurrent: nextTrack},
		dataType: "text", 
		success: function(response, textStatus) {
			//console.log("response : " + response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			//Don't do anything on error because it's not fatal
		}
	});
}