var tmApiKey = "YfcjW3gno5AAWiEVx4skuvK2AMDhLXmT"; // Ticketmaster API key
// var tmApiKey = "GAQ2WS39g7oCAOY3Ssi9qTYrB73gxKaR"
var tmBaseUrl = "https://app.ticketmaster.com/discovery/v2"; // Base URL

function getEventList() {
    // pick all events that are music
    var url = tmBaseUrl + "/events.json?classificationName=music&apikey=" + tmApiKey;
    // url = url.replace(" ", "%20");

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return null;
        })
        .then(function (data) {
            eventListArray = [];

            if (!data) {
                swal("Error", "Could not find music events in Sacramento", "error");
                return;
            }

            let attractions = data._embedded.events;

            for (let i = 0; i < attractions.length; i++) {
                eventListArray.push(attractions[i].name);
            }

            // Sort the array and insert only unique items
            let tempArray = eventListArray.sort();
            eventListArray = [];

            // The first item put in the array can't create a conflict.
            eventListArray.push(tempArray[0]);

            // Loop over the remainder of the array, adding only unique items
            for (let i = 1; i < tempArray.length; i++) {
                if (tempArray[i] !== eventListArray[eventListArray.length - 1]) {
                    eventListArray.push(tempArray[i]);
                }
            }
        });
}

function getArtistNameList(name) {

    // Get a music event that matches the name
    var url = tmBaseUrl + "/events.json?keyword=" + name + "&classificationName=music&apikey=" + tmApiKey;
    url = url.replace(" ", "%20");

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return null;
        })
        .then(function (data) {
            // Clear out the old global data
            artistNameArray = [];
            artistPictureArray = [];
            searchResult.startDate = "";
            searchResult.endDate = "";
            searchResult.venue = "";
            searchResult.artistInfo = [];

            if (!data._embedded) {
                swal("Error", "Could not find \"" + name + "\".", "error");
                return;
            }

            let dateBase = data._embedded.events[0];
            searchResult.startDate = dateBase.dates.start.localDate;
            if (dateBase.dates.end) {
                searchResult.endDate = dateBase.dates.end.localDate;
            }
            searchResult.venue = data._embedded.events[0]._embedded.venues[0].name;

            let attractArray = data._embedded.events[0]._embedded.attractions;
            for (let i = 0; i < attractArray.length; i++) {
                artistNameArray.push(attractArray[i].name);

                let lastImageIndex = attractArray[i].images.length - 1;
                if (lastImageIndex < 0)
                    lastImageIndex = 0;

                let images = attractArray[i].images;
                let currImage = getRequiredImage(images);
                if (currImage !== "") {
                    artistPictureArray.push(currImage);
                } else {
                    artistPictureArray.push(attractArray[i].images[lastImageIndex].url);
                    currImage = attractArray[i].images[lastImageIndex].url;
                }
                let nextObj = {
                    name: attractArray[i].name,
                    picture: currImage
                };
                searchResult.artistInfo.push(nextObj);
            }

            updateSearchContents();
        });
}

function getRequiredImage(images) {
    let selectedImage = "";
    for (let i = 0; i < images.length; i++) {
        if (images[i].ratio === "16_9") {
            if (images[i].width === 640) {
                selectedImage = images[i].url;
                break;
            } else {
                if (selectedImage === "") {
                    selectedImage = images[i].url;
                }
            }
        }
    }

    return selectedImage;
}