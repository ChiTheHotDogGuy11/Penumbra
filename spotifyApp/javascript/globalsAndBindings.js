/***************
** GLOBALS *****
* The following are the globals used throughout the remaining files.
* They are collected in one place to make it easier to follow what's going on.
****************/

/* Summary: The number of tracks to display when the user starts typing in the "song" field
 * Locations Used: registrationPage.js */
var NUM_TRACKS_TO_DISPLAY = 5;
/* Summary: The number of tracks to be displayed on the party playlist scoreboard
 * Locations used: partyPage.js */
var PLAYLIST_TRACKS_NUM = 11; 
/* Summary: The unique party ID established on first DB connection to allow further DB access
 * Locations used: registrationPage.js, partyPage.js */
var PARTY_ID = -1;
/* Summary: Information about the currently-highlighted track on first track selection
 * Locations used: registrationPage.js */
var SELECTED_TRACK = {
	uri: "",
	name: "",
	artist: "",
	album: ""
}
/* Summary: The frequency (in milliseconds) with which we update the playlist
 * Locations used: registrationPage.js */
var PLAYLIST_UPDATE_INTERVAL = 4000;
/* Summary: The setInterval instantiation of updating the playlist
 * Locations used: registrationPage.js */
var PLAYLIST_INTERVAL_INST;
/* Summary: The frequency (in milliseconds) with which we update the activities
 * Locations used: registrationPage.js */
var ACTIVITY_UPDATE_INTERVAL = 7000;
/* Summary: The setInterval instantiation of updating the activities
 * Locations used: registrationPage.js */
var ACTIVITY_INTERVAL_INST;
/* Summary: The number of activities to display when we update activities
 * Locations used: partyPage.js */
var NUM_ACTIVITIES_TO_DISPLAY = 6;
/* Summary: The ID of the track that's currently playing
 * Locations used: registrationPage.js */
var CURRENTLY_PLAYING = "";
/* Summary: The ID of the track next in line to be played
 * Locations used: registrationPage.js */
var NEXT_TO_PLAY = "";
/* Summary: An array of the names of all the people that have taken part in
 *		an activity at the party.
 * Locations used: partyPage.js */
var PARTY_PEOPLE = [];

/***************
** BINDINGS ****
***************/

/* 
 * Summary: Function that gets called when everything is loaded. It essentially
		just binds all the proper functions to input events.
 * Parameters: None
 * Returns: Undefined
*/
$(document).ready(function() {
	//file location: registrationPage.js
	$("#newPartyRequest").click(function() {
		validateThenSubmit();
	});
	//file location: registrationPage.js
	$("#firstSongInput").keypress(function(event) {
		updateSongChoices(event);
	});
	//file location: registrationPage.js
	/* When a track in the list is selected, make it active 
	 * Need to use live because they're added asynchronously */
	$(".track").live("click", function() {
		$(".track").removeClass("selectedTrack");
		$(this).addClass("selectedTrack");
		SELECTED_TRACK.uri = this.uri;
		SELECTED_TRACK.name = this.trackName;
		SELECTED_TRACK.album = this.albumName;
		SELECTED_TRACK.artist = this.artistName;
	});
});