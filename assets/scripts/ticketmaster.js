var tmApiKey = "YfcjW3gno5AAWiEVx4skuvK2AMDhLXmT";  // Ticketmaster API key
// var tmApiKey = "GAQ2WS39g7oCAOY3Ssi9qTYrB73gxKaR"
var tmBaseUrl = "https://app.ticketmaster.com/discovery/v2"; // Base URL

function getEvents(name) {
    var url = tmBaseUrl + "/events.json?keyword=" + name + /* "&dmaId=374 */ "&apikey=" + tmApiKey;
    url = url.replace(" ", "%20");
    fetch(url, /*{
        mode: "no-cors"
    }*/)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return null;
        })
        .then(function (data) {
            console.log(data._embedded.events[0]._embedded.attractions);
        });
}