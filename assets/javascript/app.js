$(document).ready(function() {
	displayQueryTermForGif(getGifQueryTermArrayForGif());
	gifQueryTermButtonClick();
	requestGif("random");
	gifClickStateChange();
});

function requestGif(queryParameter) {
	var api_key = "yv1H2Vx4ZNdzbPdXJtBIPyDxsBy4K2eM";
	var queryTerm = queryParameter;
	var limit = 10;
	var offset = 0;
	var rating = "g";
	var fmt = "json";
	var base_url = "https://api.giphy.com/v1/gifs/search";
	var giphyUrl = base_url + "?api_key=" + api_key + "&q=" + queryTerm + "&limit=" +limit + "&offset=" + offset + "&rating=" + rating + "&fmt=" + fmt;
	// console.log(triviaQuestionUrl);
	// search the Open Trivia Database (https://opentdb.com/) for a list of trivia questions that match the selected parameter criteria
	var gifArray = [];
	$.ajax({
		url: giphyUrl,
		success: function(result) {
			var gifDataArray = result["data"];

			gifDataArray.forEach(function(gifData){
			var gif = {};
			gif["fixed_height_still_url"] = gifData["images"]["fixed_height_still"]["url"].replace("\\", "");
			gif["fixed_height_url"] = gifData["images"]["fixed_height"]["url"].replace("\\", "");
			gifArray.push(gif);
			});

			displayGif(gifArray);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Sorry, invalid request.");
			console.log("textStatus: " + textStatus + " errorThrown: " + errorThrown);
		}
	});
}

function displayGif(gifArray) {
	var gifContainer = $("#gif-container");
	gifContainer.empty();
	for (var i=0; i < gifArray.length - 1; i+=2) {
		var firstGif = gifArray[i];
		var secondGif = gifArray[i+1];
		
		var row = $("<div>");
		row.addClass("row mt-1");
		
		row = addGifToRow(row, firstGif);
		row = addGifToRow(row, secondGif);

		gifContainer.append(row);
	}
}

function addGifToRow(row, gif) {
	var column = $("<div>");
	column.addClass("col-md-5 offset-md-1 offset-md-right-1");
	
	var image = $("<img>");
	image.addClass("gif");
	image.attr("src", gif["fixed_height_still_url"]);
	image.attr("data-still", gif["fixed_height_still_url"]);
	image.attr("data-animate", gif["fixed_height_url"]);
	image.attr("data-state", "still");
	
	column.append(image);
	row.append(column);
	
	return row;
}

function gifClickStateChange() {
    $("#gif-container").on("click", ".gif", function() {
      var state = $(this).attr("data-state");

      if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
      } else if (state === "animate") {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
      }
     
    });
}

function getGifQueryTermArrayForGif() {
	var gifQueryTermArray;
	if (localStorage.getItem("gifQueryTermArray")) {
		gifQueryTermArray = localStorage.getItem("gifQueryTermArray");
	} else {
		gifQueryTermArray = ["Black Panther", "Batman", "Captain Marvel", "Superman"];
	}

	return gifQueryTermArray;
}

function displayQueryTermForGif(gifQueryTermArray) {
	var gifQueryTermContainer = $("#gif-query-term-container");
	gifQueryTermArray.forEach(function(gifQueryTerm){
		gifQueryTermContainer.append(generateGifQueryTermButton(gifQueryTerm));
	});
}

function generateGifQueryTermButton(gifQueryTerm) {
	var gifQueryTermButton = $("<button>");
	gifQueryTermButton.text(gifQueryTerm);
	gifQueryTermButton.addClass("gif-query-term-button btn btn-info");
	return gifQueryTermButton;
}

function gifQueryTermButtonClick() {
    $("#gif-query-term-container").on("click", ".gif-query-term-button", function() {
    	var queryTerm = $(this).text();
    	requestGif(queryTerm);
		gifClickStateChange();
    });	
}
