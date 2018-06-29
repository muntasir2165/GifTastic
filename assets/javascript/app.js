var gifQueryTermArray = getGifQueryTermArrayForGif();

$(document).ready(function() {
	displayQueryTermForGif(gifQueryTermArray);
	gifQueryTermButtonClickListener();
	requestGif("Trending");
	gifClickStateChange();
	addGifQueryTermButtonClickListener();
	searchGifQueryTermButtonClickListener();
	deleteQueryTermTrashIconClickListener();
	addMoreGifButtonClickListener();
});

function addGifQueryTermButtonClickListener() {
    $("#add-gif-query-term-button").on("click", function(event) {
    	event.preventDefault();	
    	var newQueryTerm = $("#gif-query-term").val().trim();
    	if (newQueryTerm) {
    		var newQueryTermCapitalized = newQueryTerm.substr(0,1).toUpperCase()+newQueryTerm.substr(1);
    		$("#gif-query-term").val("");
    		displayQueryTermForGif(addToGifQueryTermArrayForGif(newQueryTermCapitalized));
    	}
    });
}

function searchGifQueryTermButtonClickListener() {
    $("#search-gif-query-term-button").on("click", function(event) {
    	event.preventDefault();

    	var newQueryTerm = $("#gif-query-term").val().trim();
    	if (newQueryTerm) {
    		var newQueryTermCapitalized = newQueryTerm.substr(0,1).toUpperCase()+newQueryTerm.substr(1);
    		$("#gif-query-term").val("");
    		requestGif(newQueryTermCapitalized);
    	}
    });
}

function requestGif(queryParameter, offsetNumber, appendToGifContainer) {
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
				console.log(gifData);
				var gif = {};
				gif["id"] = gifData["id"];
				gif["title"] = gifData["title"];
				gif["rating"] = gifData["rating"];
				gif["fixed_height_still_url"] = gifData["images"]["fixed_height_still"]["url"].replace("\\", "");
				gif["fixed_height_url"] = gifData["images"]["fixed_height"]["url"].replace("\\", "");
				gifArray.push(gif);
			});
			// console.log("gifArray size: " + gifArray.length);
			setAddMoreGifButton(queryTerm, offset);
			if (appendToGifContainer) {
				displayGif(gifArray, appendToGifContainer);
			} else {
				displayGif(gifArray);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Sorry, invalid request.");
			console.log("textStatus: " + textStatus + " errorThrown: " + errorThrown);
		}
	});
}

function setAddMoreGifButton(queryTerm, offset) {
	var addMoreGifButton = $("#add-more-gif-button");
	addMoreGifButton.attr("data-query", queryTerm);
	addMoreGifButton.attr("data-offset", parseInt(offset)+11);
}

function addMoreGifButtonClickListener() {
	$("#add-more-gif-button").on("click", function(){
		event.preventDefault();
		var queryTerm = $(this).attr("data-query");
		var offset = $(this).attr("data-offset");
		var appendToGifContainer = true;
		requestGif(queryTerm, offset, appendToGifContainer);
	});
}

function displayGif(gifArray, appendToGifContainer) {
	var gifContainer = $("#gif-container");
	// if appendToGifContainer is falsy (or not specified),
	// then empty the #gif-container div before displaying
	// gifs inside it
	if (!appendToGifContainer){
		gifContainer.empty();
	}
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
	column.addClass("col-md-5 offset-md-1");
	
	var image = $("<img>");
	image.addClass("gif");
	image.attr("src", gif["fixed_height_still_url"]);
	image.attr("data-still", gif["fixed_height_still_url"]);
	image.attr("data-animate", gif["fixed_height_url"]);
	image.attr("data-state", "still");
	
	// image metadata
	var imageMetadata = $("<div>");
	imageMetadata.addClass("d-inline");
	imageMetadata.text("Title: " + gif["title"]);
	imageMetadata.append("<br>");
	imageMetadata.append("Rating: " + gif["rating"].toUpperCase());

	column.append(image);
	column.append("<br>");
	column.append(imageMetadata);
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
	if (localStorage.getItem("gifQueryTermArray")) {
		gifQueryTermArray = JSON.parse(localStorage.getItem("gifQueryTermArray"));
	} else {
		gifQueryTermArray = ["Ironman", "Batman", "Captain Marvel", "Superman"];
	}
	return gifQueryTermArray;
}

function addToGifQueryTermArrayForGif(newQueryTerm) {
	gifQueryTermArray.push(newQueryTerm);
	localStorage.setItem("gifQueryTermArray", JSON.stringify(gifQueryTermArray));
	console.log("Added '" + newQueryTerm + "' into the GIF query terms array");
	
	return getGifQueryTermArrayForGif();
}

function removeFromGifQueryTermArrayForGif(index) {
	var removedQueryTerm = gifQueryTermArray.splice(index, 1);
	console.log("Removed '" + removedQueryTerm + "' from the GIF query terms array");
	localStorage.setItem("gifQueryTermArray", JSON.stringify(gifQueryTermArray));
	
	return getGifQueryTermArrayForGif();
}

function displayQueryTermForGif(gifQueryTermArray) {
	var gifQueryTermContainer = $("#gif-query-term-container");
	gifQueryTermContainer.empty();
	$.each(gifQueryTermArray, function (index, gifQueryTerm) {
		gifQueryTermContainer.append(generateGifQueryTermButton(index, gifQueryTerm));
	});
}

function generateGifQueryTermButton(index, gifQueryTerm) {
	var gifQueryTermButtonContainer = $("<div>");
	gifQueryTermButtonContainer.addClass("d-inline");
	
	var gifQueryTermButton = $("<button>");
	gifQueryTermButton.text(gifQueryTerm);
	var bootstrapButtonClassArray = ["btn-primary", "btn-success", "btn-info", "btn-warning", "btn-danger"];
	var selectedBootstrapButtonClass = bootstrapButtonClassArray[Math.floor(Math.random()*bootstrapButtonClassArray.length)];
	gifQueryTermButton.addClass("gif-query-term-button btn "  + selectedBootstrapButtonClass);
	
	gifQueryTermButtonContainer.append(gifQueryTermButton);
	gifQueryTermButtonContainer.append("<span class=\"clickableAwesomeFontTrashIcon\"><i data-index=\"" + index + "\" class=\"fa fa-trash\" aria-hidden=\"true\"></i></span>");
	
	return gifQueryTermButtonContainer;
}

function deleteQueryTermTrashIconClickListener() {
	// $(".clickableAwesomeFontTrashIcon").on("click", "i", function() {
	// the above line wasn't working and so, as per the suggestion at: 
	// https://stackoverflow.com/questions/14186505/jquery-click-action-only-fires-once-per-page-refresh
	// I am using the 'document' object as the selector
    $(document).on("click", "i", function() {
    	var index = parseInt($(this).attr("data-index"));
	    displayQueryTermForGif(removeFromGifQueryTermArrayForGif(index));
    });
}

function gifQueryTermButtonClickListener() {
    $("#gif-query-term-container").on("click", ".gif-query-term-button", function() {
    	var queryTerm = $(this).text();
    	requestGif(queryTerm);
    });	
}
