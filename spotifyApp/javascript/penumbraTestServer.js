var textOutput = "";
var NUM_ACTIVITIES_TO_DISPLAY = 5;

$(document).ready(function() {
	$("#newPartyRequest").click(function() {
		//submitDeletePartyRequest($("#partyName").val());
		//submitDeletePartyRequest();
		//readUpdatePlaylistRequest();
		readUpdateActivitiesRequest();
	});
});

/* Test creating a new party */
function submitNewPartyRequest(newName) {
	$.ajax({
		url: "http://www.justingreet.com/penumbra/submitNewParty.php",
		type: "post",
		data: {newPartyName: newName},
		dataType: "xml", 
		success: function(response, textStatus) {
			submitNewPartyXMLParse(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("Error: " + textStatus);
		}
	});
}

function submitNewPartyXMLParse(xmlDoc) {
	$(xmlDoc).find("Party").each(function(){
		textOutput = "ID: " + $(this).find("ID").text();
		textOutput += ", Name: " + $(this).find("Name").text();
	});
	updateHTML();
}

/* Test ending a party */
function submitDeletePartyRequest() {
	$.ajax({
		url: "http://www.justingreet.com/penumbra/submitDeleteParty.php",
		type: "post",
		data: {deletePartyID: 5},
		dataType: "text", 
		success: function(response, textStatus) {
			submitDeletePartyTextParse(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("Error: " + textStatus);
		}
	});
}

function submitDeletePartyTextParse(textDoc) {
	textOutput = textDoc;
	updateHTML();
}

/* Test updating the playlist */
function readUpdatePlaylistRequest() {
	$.ajax({
		url: "http://www.justingreet.com/penumbra/readUpdatePlaylist.php",
		type: "get",
		data: {playlistPartyID: 2},
		dataType: "text", 
		success: function(response, textStatus) {
			readUpdatePlaylistXMLParse(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("Error: " + textStatus);
		}
	});
}

function readUpdatePlaylistXMLParse(xmlDoc) {
	textOutput = xmlDoc;
	updateHTML();
}


/* Test updating the recent activities */
function readUpdateActivitiesRequest() {
	$.ajax({
		url: "http://www.justingreet.com/penumbra/readUpdateActivities.php",
		type: "get",
		data: {activityPartyID: 2, numberOfActivities: NUM_ACTIVITIES_TO_DISPLAY},
		dataType: "text", 
		success: function(response, textStatus) {
			readUpdatePlaylistXMLParse(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("Error: " + textStatus);
		}
	});
}

function readUpdateActivitiesXMLParse(xmlDoc) {
	textOutput = xmlDoc;
	updateHTML();
}

function updateHTML() {
	$("#testPrint").html(textOutput);
}

