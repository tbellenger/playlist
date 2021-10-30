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

    // Get all events that match the name
    var url = tmBaseUrl + "/events.json?keyword=" + name + "&apikey=" + tmApiKey;
    url = url.replace(" ", "%20");

    fetch(url,
        /*{
               mode: "no-cors"
           }*/
    )
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
            console.log(dateBase);
            searchResult.startDate = dateBase.dates.start.localDate;
            if (dateBase.dates.end) {
                searchResult.endDate = dateBase.dates.end.localDate;
            }
            searchResult.venue = data._embedded.events[0]._embedded.venues[0].name;

            let attractArray = data._embedded.events[0]._embedded.attractions;
            for (let i = 0; i < attractArray.length; i++) {
                artistNameArray.push(attractArray[i].name);
                artistPictureArray.push(attractArray[i].images[0].url);
                let nextObj = {
                    name: attractArray[i].name,
                    picture: attractArray[i].images[0].url
                }
                searchResult.artistInfo.push(nextObj);
            }
        });
}

function getEventDescription(id) {
    var url = tmBaseUrl + "/events.json?id=" + id + "&apikey=" + tmApiKey;
    console.log(url);
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return null;
        })
        .then(function (data) {
            if (data) {
                console.log(data)
            }
        });
}