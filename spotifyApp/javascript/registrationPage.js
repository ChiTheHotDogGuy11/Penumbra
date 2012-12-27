/* This file handles the scripting necessary for the "registration" page, which asks for
 * the name of the party to start and the first track to add to the party playlist. */

/*
 * Summary: Checks to see if the party has a name and a starting song is selected.
 *		If both of these requirements are met, it sends an ajax request to add a new party.
 *		Otherwise, it highlights both input texts with red to indicate an error.
 * Parameters: None
 * Returns: undefined
*/
function validateThenSubmit() {
	if (SELECTED_TRACK.uri === "") {
		$("#firstSongInput").css("border", "3px solid red");
	}
	else $("#firstSongInput").css("border", "none");
	
	var curPartyName = $("#partyNameInput").val();
	if (curPartyName === "") {
		$("#partyNameInput").css("border", "3px solid red");
	}
	else $("#partyNameInput").css("border", "none");
	
	//If everything's filled out, submit the ajax requests
	if (SELECTED_TRACK.uri !== "" && curPartyName !== "") {
		//Change the page the user sees
		$("#registrationPage").removeClass("current");
		$("#partyPage").addClass("current");
		submitNewPartyRequest(curPartyName);
		//Call the function in partyPage.js to initiate the playlist display
		updatePlaylistRequest();
		//Actually start the song the user requested
		var sp = getSpotifyApi(1);
		var models = sp.require("sp://import/scripts/api/models");
		sp.trackPlayer.playTrackFromUri(SELECTED_TRACK.uri, {
			onSuccess: function() {} ,
			onFailure: function () {},
			onComplete: function () {}
		});
		/* Play the next song when the current song is done playing */
		models.player.observe(models.EVENT.CHANGE, function (o) {
			if (models.player.playing === false) {
				if (models.player.track == null) {
					sp.trackPlayer.playTrackFromUri(NEXT_TO_PLAY, {
						onSuccess: function() {} ,
						onFailure: function () {},
						onComplete: function () {}
					});
					//Update the database to reflect the changes.
					updateCurrentlyPlaying(NEXT_TO_PLAY);
					CURRENTLY_PLAYING = NEXT_TO_PLAY;
					NEXT_TO_PLAY = "";
				}
			}
		});
	/*	sp.trackPlayer.addEventListener("playerStateChanged", function(event) {
			//If this is false, the current song finished playing!
			console.log(event.data.curtrack);
			console.log(event);
		});*/
		//Start calling updatePlaylist periodically
		PLAYLIST_INTERVAL_INST = setInterval(function(){updatePlaylistRequest()}, PLAYLIST_UPDATE_INTERVAL);
		//Star calling updateActivities periodically
		//updateActivityRequest();
		ACTIVITY_INTERVAL_INST = setInterval(function(){updateActivityRequest()}, ACTIVITY_UPDATE_INTERVAL);
	}
}

/*
 * Summary: Submit a new ajax request to the server to start a new party in the 
 *		database, along with the first track on the playlist.
 * Parameters: newName: What to name the party
 * Returns: undefined
*/
function submitNewPartyRequest(newName) {
	$.ajax({
		url: "http://www.justingreet.com/penumbra/submitNewParty.php",
		type: "post",
		/*Note that I need to make this call synchronously, because updatePlaylist
		 * requires a working party_id */
		async: false,
		data: {newPartyName: newName, trackID: SELECTED_TRACK.uri, 
			trackName: SELECTED_TRACK.name, trackAlbum: SELECTED_TRACK.album,
			trackArtist: SELECTED_TRACK.artist},
		dataType: "xml", 
		success: function(response, textStatus) {
			newPartyXMLResponse(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("Error: " + textStatus);
		}
	});
}

/*
 * Summary: parse the XML response from the ajax request to start a new party. Namely,
		get the party's unique ID to allow further db access
 * Parameters: xmlDoc: the xml response to parse
 * Returns: undefined
 * XML structure: 
 	<Party>
		<ID>$value</ID>
 		<Name>$value</Name>
 	</Party>
*/
function newPartyXMLResponse(xmlDoc) {
	$(xmlDoc).find("Party").each(function() {
		PARTY_ID = $(this).find("ID").text();
	});
}

/*
 * Summary: When a key is pressed, an search request is sent to the spotify api. The song choices
 * 		that the API thinks correspond to the title provided by the user are updated and displayed 
 * 		beneath the text input field.
 * Parameters: event: This stores info about the event, namely which key was pressed
 * Returns: undefined
*/
function updateSongChoices(event) {
	//Get the character that was pressed
	var charAdded = String.fromCharCode(event.which);
	//Add it to whatever was there before to get the string in the input
	var curSongTitle = $("#firstSongInput").val() + charAdded;
	
	sp = getSpotifyApi(1);
	//Make the search request to the built-in search function
	sp.core.search(curSongTitle, {
			//I'll get a nice fat JSON object on success
			onSuccess: function(result) {
				parseTracksJSON(result);
			}
		}
	);
}

/*
 * Summary: Parse through the JSON object we retrieved after searching for a track,
		and update/create the relevant HTML to display it.
 * Parameters: json: The JSON object retrieved on the search call
 * Returns: Undefined
*/
function parseTracksJSON(json) {
	//Reset the selected track
	SELECTED_TRACK.uri = "";
	//Clear the track display to make way for the new one.
	$(".track").remove();
	var numTracks = json.tracks.length;
	//Get the height that the div for each track should be
	var divHeight = $("#songSuggestions").height() / NUM_TRACKS_TO_DISPLAY;
	//Make a new div for each track to display, and append it to the track container.
	for (var i = 0; i < NUM_TRACKS_TO_DISPLAY; i++) {
		var curTrack = json.tracks[i];
		//Only keep iterating if there are tracks to process
		if (i < numTracks) {
			var newTrackDiv = document.createElement("div");
			$(newTrackDiv).height(divHeight);
			$(newTrackDiv).addClass("track");
			//Alternate the color of the divs
			if (i % 2 !== 0) $(newTrackDiv).addClass("oddTrack");
			/* make all of the components of the div */
			var trackName = curTrack.name;
			newTrackDiv.trackName = trackName;
			var artistName = curTrack.artists[0].name;
			newTrackDiv.artistName = artistName;
			//The string to display in each div (exclude the album)
			var paraString = trackName + " by " + artistName;
			var albumName = curTrack.album.name;
			newTrackDiv.albumName = albumName;
			var trackPara = document.createElement("p");
			$(trackPara).html(paraString);
			$(newTrackDiv).append(trackPara)
			newTrackDiv.uri = curTrack.uri;
			$("#songSuggestions").append(newTrackDiv);
		}
	}
}
		