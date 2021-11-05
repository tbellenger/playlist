// Playlist information
let plTitle;
let plId;
let videoIds = [];
let lineup=[];

// Links to page elements
let btnSearch = document.querySelector("#search-btn");
let btnConnectSpotify = document.querySelector("#connect-spotify");
let txtSearch = document.querySelector("#search-query");
let searchResultsEl = document.querySelector("#search-results");
let plProgressEl = document.querySelector("#playlist-progress");

// Add event listeners
btnConnectSpotify.addEventListener("click", connectAndCreate);
btnSearch.addEventListener("click", searchEvents);
txtSearch.addEventListener("keypress", searchEventsKey);

// Catch enter key press in search box and perform search
function searchEventsKey(event) {
    if (event.which == 13) {
        searchEvents(event);
    }
}

// Catch search click and call ticketmaster function 
function searchEvents(event) {
    event.preventDefault();
    let query = txtSearch.value;
    // fill array with artists
    getArtistNameList(query);
}

// Perform OAuth if required and then create the playlist 
// using the artist name list from ticketmaster
function connectAndCreate() {
    let conn = JSON.parse(localStorage.getItem('spotConnected'));
    if (conn) {
        // check if access token is expired
        // if expired do popup again
        console.log('already connected to spotify');
        let expiry = JSON.parse(localStorage.getItem('expires_at'));
        let now = new Date().getTime();
        console.log('expire', expiry);
        console.log('now   ', now);
        if (expiry == null || now > expiry) {
            redirectToSpotifyAuthorizeEndpoint();
        } else {
            spotifyCreatePlaylistFromArtists();
        }
    } else {
        redirectToSpotifyAuthorizeEndpoint();
    }
}