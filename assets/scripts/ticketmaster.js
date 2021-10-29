var tmApiKey = "YfcjW3gno5AAWiEVx4skuvK2AMDhLXmT"; // Ticketmaster API key
// var tmApiKey = "GAQ2WS39g7oCAOY3Ssi9qTYrB73gxKaR"
var tmBaseUrl = "https://app.ticketmaster.com/discovery/v2"; // Base URL

function getEventList() {
    // pick all events that are music in the greater Sacramento area (dma ID = 374)
    var url = tmBaseUrl + "/events.json?classificationName=music&dmaId=374&apikey=" + tmApiKey;
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
                console.log('search on ' + name + ' successful');
                return response.json();
            }
            return null;
        })
        .then(function (data) {
            artistNameArray = [];
            artistPictureArray = [];

            if (!data._embedded) {
                swal("Error", "Could not find \"" + name + "\".", "error");
                return;
            }

            let attractArray = data._embedded.events[0]._embedded.attractions;
            console.log(attractArray);
            for (let i = 0; i < attractArray.length; i++) {
                artistNameArray.push(attractArray[i].name);
                artistPictureArray.push(attractArray[i].images[0].url);
                // getArtistPicture(attractArray[i].id);
            }
        });
}

var url = "";
var urls = [];

function getArtistPicture(id) {
    url = tmBaseUrl + "/attractions/" + id + "?apikey=" + tmApiKey;
    urls.push(url);
    console.log(url)
    setTimeout(function (url) {
        console.log(url);
        sendAsyncRequests();
    }, 0.25 * 1000);
}

var index = 0;

function sendAsyncRequests() {
    for (index = 0; index < urls.length; index++) {
        setTimeout(function () {
            sendAsyncReq(urls[index]);
        }, 0.23 * 1000);
    }
}

async function sendAsyncReq(url) {
    await fetch(url,
            /* {
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
            if (data) {
                artistPictureArray.push(data.images[0].url);
            } else {
                artistPictureArray.push("");
            }
        })
        .catch(function (error) {
            artistPictureArray.push("");
        });
}