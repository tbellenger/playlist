let plTitle;
let plId;
let videoIds = [];
let lineup=[];

let btnSearch = document.querySelector("#search-btn");
let btnConnectSpotify = document.querySelector("#connect-spotify");
// let btnCreate = document.querySelector("#create-btn");
let txtSearch = document.querySelector("#search-query");
let searchResultsEl = document.querySelector("#search-results");
let plProgressEl = document.querySelector("#playlist-progress");

btnConnectSpotify.addEventListener("click", connectAndCreate);
//btnAuth.addEventListener("click", authenticate);
//btnCreate.addEventListener("click", spotifyCreatePlaylistFromArtists);
//btnUpdate.addEventListener("click", updatePlaylist);
btnSearch.addEventListener("click", searchEvents);
txtSearch.addEventListener("keypress", searchEventsKey);

function searchEventsKey(event) {
    if (event.which == 13) {
        searchEvents(event);
    }
}

function searchEvents(event) {
    event.preventDefault();
    let query = txtSearch.value;
    // fill array with artists
    getArtistNameList(query);
}

function connectAndCreate() {
    let conn = JSON.parse(localStorage.getItem('spotConnected'));
    if (conn) {
        // check if access token is expired
        // if expired do popup again
        let expiry = JSON.parse(localStorage.getItem('expires_at'));
        let now = new Date().getTime();
        if (expiry == null || now > expiry) {
            redirectToSpotifyAuthorizeEndpoint();
        } else {
            spotifyCreatePlaylistFromArtists();
        }
    } else {
        redirectToSpotifyAuthorizeEndpoint();
    }
}