var gifArray = [];
var gifQueryTermArray = getGifQueryTermArray();
var favoriteGifArray = getFavoriteGifArray();

$(document).ready(function() {
	displayQueryTermForGif(gifQueryTermArray);
	gifQueryTermButtonClickListener();
	requestGif("Trending");
	gifClickStateChange();
	addGifQueryTermButtonClickListener();
	searchGifQueryTermButtonClickListener();
	deleteQueryTermTrashIconClickListener();
	addMoreGifButtonClickListener();
	addFavoriteGifButtonClickListener();
	displayFavoriteGifs(getFavoriteGifArray());
	removeFavoriteGifButtonClickListener();
});

function displayFavoriteGifs(favoriteGifArray) {
	var favoriteGifContainer = $("#favorite-gif-container");
	favoriteGifContainer.empty();

	// display a message when the user doesn't have any GIFs saved in the Favorites list
	if (favoriteGifArray.length === 0) {
		favoriteGifContainer.html("<h3>You don't have any GIFs in your Favorites list at the moment</h3>");
	}

	favoriteGifArray.forEach(function(favoriteGif){
		var row = $("<div>");
		row.addClass("row mt-1");
		row = addGifToFavoriteGifContainer(row, favoriteGif);
		favoriteGifContainer.append(row);
	});
}

function addGifToFavoriteGifContainer(row, favoriteGif) {
	var column = $("<div>");
	column.addClass("col-md-6 offset-md-3 offset-md-right-3");
	
	var image = $("<img>");
	image.addClass("gif");
	image.attr("src", favoriteGif["fixed_height_still_url"]);
	image.attr("data-still", favoriteGif["fixed_height_still_url"]);
	image.attr("data-animate", favoriteGif["fixed_height_url"]);
	image.attr("data-state", "still");
	
	// image metadata
	var imageMetadata = $("<div>");
	imageMetadata.addClass("d-inline");
	imageMetadata.text("Title: " + favoriteGif["title"]);
	imageMetadata.append("<br>");
	imageMetadata.append("Rating: " + favoriteGif["rating"].toUpperCase());
	
	if (getGifFromFavoriteGifArray(favoriteGif["id"]) === null) {
		// the gif is not in the favoriteGifArray
		imageMetadata.append(" <button class=\"btn favorite-gif-button\"><i data-id=\"" + favoriteGif["id"] + "\" class=\"fa fa-star-o\" aria-hidden=\"true\"></i></button>");
	} else {
		imageMetadata.append(" <button class=\"btn favorite-gif-button\"><i data-id=\"" + favoriteGif["id"] + "\" class=\"fa fa-star\" aria-hidden=\"true\"></i></button>");
	}

	column.append(image);
	column.append("<br>");
	column.append(imageMetadata);
	row.append(column);
	
	return row;
}

function addFavoriteGifButtonClickListener() {
    $(document).on("click", "i.fa-star-o", function(event) {
    	var gifId = $(this).attr("data-id");
    	$(this).removeClass("fa-star-o");
    	$(this).addClass("fa-star");
    	addToFavoriteGifArray(gifId);
    });
}

function removeFavoriteGifButtonClickListener() {
    $(document).on("click", "i.fa-star", function(event) {
    	var gifId = $(this).attr("data-id");
    	$(this).removeClass("fa-star");
    	$(this).addClass("fa-star-o");
    	removeFromFavoriteGifArray(gifId);
    });
}

function getGifFromGifArray(id) {
	var matchingGif = null;
	// gifArray is the global array variable that gets populated when the AJAX
	// call is made
	$.each(gifArray, function (index, gif) {
		if (id === gif["id"]) {
			matchingGif = gif;
		}
	});
	return matchingGif;
}

function getGifFromFavoriteGifArray(id) {
	var matchingGif = null;
	$.each(getFavoriteGifArray(), function (index, gif) {
		if (id === gif["id"]) {
			matchingGif = gif;
		}
	});
	return matchingGif;
}

function getFavoriteGifArray() {
	if (localStorage.getItem("favoriteGifArray")) {
		favoriteGifArray = JSON.parse(localStorage.getItem("favoriteGifArray"));
	} else {
		favoriteGifArray = [];
	}
	return favoriteGifArray;
}

function addToFavoriteGifArray(gifId) {
	// add the gif with id gifId to the favoriteGifArray if it's not there already
	if (getGifFromFavoriteGifArray(gifId) === null) {
		var gif = getGifFromGifArray(gifId);
		favoriteGifArray.push(gif);
		localStorage.setItem("favoriteGifArray", JSON.stringify(favoriteGifArray));
		console.log("Added gif with id: " + gif["id"] + " and title: " + gif["title"] + " into the favorite GIFs array");
		
		return getFavoriteGifArray();
	} else {
		console.log("The gif with id: " + gifId + " is already in the favorite Gif array");
	}
}

function removeFromFavoriteGifArray(gifId) {
	var gif = removeGifFromFavoriteGifArray(gifId);
	if (gif) {
		localStorage.setItem("favoriteGifArray", JSON.stringify(favoriteGifArray));
		console.log("Removed gif with id: " + gif["id"] + "and title: " + gif["title"] + " from the favorite GIFs array");
	}
	return getFavoriteGifArray();
}

function removeGifFromFavoriteGifArray(id) {
	var removedGif = null;
	// $.each(getFavoriteGifArray(), function (index, gif) {
	// 	console.log(gif);
	// 	if (id === gif["id"]) {
	// 		removedGif = getFavoriteGifArray().splice(index, 1)[0];
	// 		console.log(removedGif);
	// 		return removedGif;
	// 	}
	// });
	for (var i=0; i < getFavoriteGifArray().length; i++) {
		if (id === getFavoriteGifArray()[i]["id"]) {
			removedGif = getFavoriteGifArray().splice(i, 1)[0];
			return removedGif;			
		}
	}
}

function addGifQueryTermButtonClickListener() {
    $("#add-gif-query-term-button").on("click", function(event) {
    	event.preventDefault();	
    	var newQueryTerm = $("#gif-query-term").val().trim();
    	if (newQueryTerm) {
    		var newQueryTermCapitalized = newQueryTerm.substr(0,1).toUpperCase()+newQueryTerm.substr(1);
    		$("#gif-query-term").val("");
    		displayQueryTermForGif(addToGifQueryTermArray(newQueryTermCapitalized));
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
	gifArray = [];
	$.ajax({
		url: giphyUrl,
		success: function(result) {
			var gifDataArray = result["data"];

			gifDataArray.forEach(function(gifData){
				// console.log(gifData);
				var gif = {};
				gif["id"] = gifData["id"];
				gif["title"] = gifData["title"];
				gif["rating"] = gifData["rating"];
				gif["fixed_height_still_url"] = gifData["images"]["fixed_height_still"]["url"].replace("\\", "");
				gif["fixed_height_url"] = gifData["images"]["fixed_height"]["url"].replace("\\", "");
				gifArray.push(gif);
			});
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
	for (var i=0; i < gifArray.length-1; i+=2) {
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
	
	if (getGifFromFavoriteGifArray(gif["id"]) === null) {
		// the gif is not in the favoriteGifArray
		imageMetadata.append(" <button class=\"btn favorite-gif-button\"><i data-id=\"" + gif["id"] + "\" class=\"fa fa-star-o\" aria-hidden=\"true\"></i></button>");
	} else {
	imageMetadata.append(" <button class=\"btn favorite-gif-button\"><i data-id=\"" + gif["id"] + "\" class=\"fa fa-star\" aria-hidden=\"true\"></i></button>");
	}

	column.append(image);
	column.append("<br>");
	column.append(imageMetadata);
	row.append(column);
	
	return row;
}

function gifClickStateChange() {
	$(document).on("click", ".gif", function() {
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

function getGifQueryTermArray() {
	if (localStorage.getItem("gifQueryTermArray")) {
		gifQueryTermArray = JSON.parse(localStorage.getItem("gifQueryTermArray"));
	} else {
		gifQueryTermArray = ["Ironman", "Batman", "Captain Marvel", "Superman"];
	}
	return gifQueryTermArray;
}

function addToGifQueryTermArray(newQueryTerm) {
	gifQueryTermArray.push(newQueryTerm);
	localStorage.setItem("gifQueryTermArray", JSON.stringify(gifQueryTermArray));
	console.log("Added '" + newQueryTerm + "' into the GIF query terms array");
	
	return getGifQueryTermArray();
}

function removeFromGifQueryTermArray(index) {
	var removedQueryTerm = gifQueryTermArray.splice(index, 1);
	console.log("Removed '" + removedQueryTerm + "' from the GIF query terms array");
	localStorage.setItem("gifQueryTermArray", JSON.stringify(gifQueryTermArray));
	
	return getGifQueryTermArray();
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
    $(document).on("click", "i.fa-trash", function() {
    	var index = parseInt($(this).attr("data-index"));
	    displayQueryTermForGif(removeFromGifQueryTermArray(index));
    });
}

function gifQueryTermButtonClickListener() {
    $("#gif-query-term-container").on("click", ".gif-query-term-button", function() {
    	var queryTerm = $(this).text();
    	requestGif(queryTerm);
    });	
}
