var partyName = "";
var partyID = -1;
var counter = -1;
//In seconds
var timeBetweenUpdates = 4;

$(document).ready(function() {
	$("#newPartyRequest").click(function() {
		submitNewPartyRequest($("#partyName").val());
	});
});

function submitNewPartyRequest(newName) {
	$.ajax({
		url: "http://www.justingreet.com/penumbra/makeNewParty.php",
		type: "post",
		data: {newPartyName: newName},
		dataType: "xml", 
		success: function(response, textStatus) {
			partyName = newName;
			//console.log(response);
			parseXML(response);
			$("#pages .current").removeClass("current");
			$("div#counterPage").addClass("current");
			//Start checking for updates periodically
			setInterval(function(){checkForUpdates()}, 1000*timeBetweenUpdates);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("Error: " + textStatus);
		}
	});
}

function parseXML(xmlDoc) {
	$(xmlDoc).find("Party").each(function(){
		partyID = $(this).find("ID").text();
		counter = $(this).find("Counter").text();
	});
	updateHTML();
}

function updateHTML() {
	$("#counterDisplay").html("Counter = " + counter);
	$("#partyHeader").html(partyName + ", ID: " + partyID);
}

function checkForUpdates() {
	$.ajax({
		url: "http://www.justingreet.com/penumbra/relayPartyUpdates.php",
		type: "get",
		data: {partyID: partyID},
		dataType: "xml", 
		success: function(response, textStatus) {
			parseXML(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("Error: " + textStatus);
		}
	});
}
	