var artistNameArray = []; // Array of artists from TicketMaster
var artistPictureArray = []; //Array of pictures from TicketMaster
var eventListArray = []; // Array of events from TicketMaster
let searchResult = {
    startDate: "",
    endDate: "",
    venue: "",
    artistInfo: []
};

// Spotify Auth Details
const client_id = '6a0256e60f084740acaba82df07a21e2';
//const redirect_uri = 'https://tbellenger.github.io/playlist/callback/'; // Your redirect uri
// testing url
const redirect_uri = 'http://127.0.0.1:5500/callback/'; // Your redirect uri

function updateSearchContents() {
    console.log("searchResult \n \t\t", searchResult)
    
    if(searchResult.artistInfo.length != null ) {
        let aEvent = searchResult.artistInfo[0]; // grab the event name and event image
        let eventTitleId = "event-title"
        let eventLineUpId = "event-lineup"
        let eventShortDescID = "event-short-desc"; 
        let eventImgId = "event-img"
        let eventTitle = searchResult.artistInfo[0].name;
        let eventPictureUrl = searchResult.artistInfo[0].picture
        let eventLocation = searchResult.venue;
        let eventStartDate = searchResult.startDate;
        let eventEndDate = searchResult.endDate;
        let eventArtistArray = searchResult.artistInfo

        let eventImgElement = document.querySelector("#"+eventImgId)
        eventImgElement.setAttribute("src", eventPictureUrl)

        //make an empty Icon element, just in case we need to add a new event to the list
        // for the scope of the project it may not be used
        let childElementMaterialIcon = document.createElement("i")
        childElementMaterialIcon.setAttribute("class", "material-icons right")
        childElementMaterialIcon.innerHTML = "more_vert"

        let pShortDescEl = document.querySelector("#" + eventShortDescID)
        // set the description to Location & date
        pShortDescEl.innerHTML = eventLocation + ': ' + eventStartDate
        if(eventEndDate.length > 1) // some events do not list an end date, but if it does update the description
            pShortDescEl.innerHTML = eventLocation + ': (' + eventStartDate + ' to ' + eventEndDate + ')';
        // for the event grab all the artists info

        // grab the event Title element already on the page, so we have 
        // a container to append new data to
        let spanTitleEl = document.querySelector("#" + eventTitleId);
        if (spanTitleEl != null) { // if the event card is already on the page 
            // then you can grab the event card and update its data
            
            // grab the child element that should already be on the page
            // this is the Icon that shows more details about the event when you click on it.
            childElementMaterialIcon = spanTitleEl.querySelector(".material-icons");
            spanTitleEl.innerHTML = eventTitle // update the title incase they changes the name of the festival
            spanTitleEl.append(childElementMaterialIcon) // add the icon element that opens the playlist menu
            
            //grab the container that will hold the list of artists
            let pEventLineUpEl = document.querySelector("#" + eventLineUpId)
            pEventLineUpEl.innerHTML = "" // clear out the old Lineup
            //let ulLineUpEl = document.createElement("ul") // make an Unordered list to hold the lineup
            let inner = '';
            // update the event list with the latest artist names & artist data
            // the first index in the artist array, at index = 0, is always the venue info, so we skip that index
            for (let index = 1; index < eventArtistArray.length; index++) {
                // starting at index 1, loop over the array of artist objects
                //let liElement = document.createElement("li")
                //let artistName = eventArtistArray[index].name;
                //liElement.setAttribute("id", eventTitleId + artistName)
                //liElement.innerHTML = artistName
                inner += artistTemplate(eventArtistArray[index]);
            }
            pEventLineUpEl.innerHTML = inner;

            //console.log(spanTitleEl, childElementMaterialIcon)
        }
    }

}

function spotConnectionCallback(isConnected) {
    console.log('spot connected');
    if (isConnected) {
        spotifyCreatePlaylistFromArtists()
    }
}

function artistTemplate(eventArtist) {
    return `<div class="pg-card">
    <img class="pg-artist-img" src="${eventArtist.picture}">
    <span class="pg-card-title">${eventArtist.name}</span>
    </div>`
}
