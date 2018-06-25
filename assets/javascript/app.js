var gifQueryTermArray = getGifQueryTermArrayForGif();

$(document).ready(function() {
	// displayQueryTermForGif(getGifQueryTermArrayForGif());
	displayQueryTermForGif(gifQueryTermArray);
	gifQueryTermButtonClick();
	requestGif("trending");
	gifClickStateChange();
	addGifQueryTermButtonClick();
	searchGifQueryTermButtonClick();
});

function addGifQueryTermButtonClick() {
    $("#add-gif-query-term-button").on("click", function(event) {
    	// console.log("inside addGifQueryTermButtonClick()");
    	event.preventDefault();	
    	var newQueryTerm = $("#gif-query-term").val().trim();
    	if (newQueryTerm) {
    		var newQueryTermCapitalized = newQueryTerm.substr(0,1).toUpperCase()+newQueryTerm.substr(1);
    		$("#gif-query-term").val("");
    		displayQueryTermForGif(addToGifQueryTermArrayForGif(newQueryTermCapitalized));
    	}
    });
}

function searchGifQueryTermButtonClick() {
    $("#search-gif-query-term-button").on("click", function(event) {
    	// console.log("inside searchGifQueryTermButtonClick()");
    	event.preventDefault();	
    	var newQueryTerm = $("#gif-query-term").val().trim();
    	if (newQueryTerm) {
    		var newQueryTermCapitalized = newQueryTerm.substr(0,1).toUpperCase()+newQueryTerm.substr(1);
    		$("#gif-query-term").val("");
    		requestGif(newQueryTermCapitalized);
    	}
    });
}

function requestGif(queryParameter, offsetNumber) {
	var api_key = "yv1H2Vx4ZNdzbPdXJtBIPyDxsBy4K2eM";
	var queryTerm = queryParameter;
	var limit = 10;
	var offset = offsetNumber ? offsetNumber : 0;
	var rating = "g";
	var fmt = "json";
	var base_url = (queryParameter === "trending") ? "https://api.giphy.com/v1/gifs/trending" : "https://api.giphy.com/v1/gifs/search";
	var giphyUrl = base_url + "?api_key=" + api_key + "&q=" + queryTerm + "&limit=" +limit + "&offset=" + offset + "&rating=" + rating + "&fmt=" + fmt;
	console.log(giphyUrl);
	// search the Giphy API (https://github.com/Giphy) for a list of gifs that match the selected query parameter criteria
	var gifArray = [];
	$.ajax({
		url: giphyUrl,
		success: function(result) {
			var gifDataArray = result["data"];

			gifDataArray.forEach(function(gifData){
			var gif = {};
			gif["id"] = gifData["id"];
			// console.log(gif["id"]);
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
	// var gifQueryTermArray;
	if (localStorage.getItem("gifQueryTermArray")) {
		gifQueryTermArray = JSON.parse(localStorage.getItem("gifQueryTermArray"));
	} else {
		gifQueryTermArray = ["Ironman", "Batman", "Captain Marvel", "Superman"];
	}
	// console.log(gifQueryTermArray);
	return gifQueryTermArray;
}

function addToGifQueryTermArrayForGif(newQueryTerm) {
	gifQueryTermArray.push(newQueryTerm);
	localStorage.setItem("gifQueryTermArray", JSON.stringify(gifQueryTermArray));
	return getGifQueryTermArrayForGif();
}

function displayQueryTermForGif(gifQueryTermArray) {
	var gifQueryTermContainer = $("#gif-query-term-container");
	gifQueryTermContainer.empty();
	gifQueryTermArray.forEach(function(gifQueryTerm){
		gifQueryTermContainer.append(generateGifQueryTermButton(gifQueryTerm));
	});
}

function generateGifQueryTermButton(gifQueryTerm) {
	var gifQueryTermButton = $("<button>");
	gifQueryTermButton.text(gifQueryTerm);
	var bootstrapButtonClassArray = ["btn-primary", "btn-success", "btn-info", "btn-warning", "btn-danger"];
	var selectedBootstrapButtonClass = bootstrapButtonClassArray[Math.floor(Math.random()*bootstrapButtonClassArray.length)];
	gifQueryTermButton.addClass("gif-query-term-button btn "  + selectedBootstrapButtonClass);
	return gifQueryTermButton;
}

function gifQueryTermButtonClick() {
    $("#gif-query-term-container").on("click", ".gif-query-term-button", function() {
    	var queryTerm = $(this).text();
    	requestGif(queryTerm);
		gifClickStateChange();
    });	
}
