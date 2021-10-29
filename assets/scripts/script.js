let plTitle;
let plId;
let videoIds = [];

let btnSearch = document.querySelector("#search-btn");
let btnAuth = document.querySelector("#auth-btn");
let btnConnectSpotify = document.querySelector("#connect-spotify");
let btnCreate = document.querySelector("#create-btn");
let btnUpdate = document.querySelector("#update-btn");
let txtSearch = document.querySelector("#search-query");
let searchResultsEl = document.querySelector("#search-results");
let plProgressEl = document.querySelector("#playlist-progress");

btnConnectSpotify.addEventListener("click", redirectToSpotifyAuthorizeEndpoint);
btnAuth.addEventListener("click", authenticate);
btnCreate.addEventListener("click", createPlaylist);
btnUpdate.addEventListener("click", updatePlaylist);
btnSearch.addEventListener("click", searchEvents);
btnSearch.addEventListener("keypress", searchEventsKey);

function searchEventsKey(event) {
    if (event.keycode == 13) {
        searchEvents(event);
    }
}

async function searchEvents(event) {
    event.preventDefault();
    let query = txtSearch.value;
    // fill array with artists
    getEvents(query);
}

// Shows the link to the newly updated playlist
function showPlayListLink() {
    var linkEl = document.querySelector("#pl-link");
    linkEl.replaceChildren();
    var plLinkEl = document.createElement("a");
    plLinkEl.href = "https://www.youtube.com/playlist?list=" + plId;
    plLinkEl.target = "_blank";
    plLinkEl.innerText = plTitle;
    linkEl.appendChild(plLinkEl);
    searchResultsEl.replaceChildren();
    btnUpdate.disabled=true;
    btnCreate.disabled=false;
}
