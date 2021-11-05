/****************************************************
 * Spotify Auth from 
 * https://github.com/tobika/spotify-auth-PKCE-example
 */

// Your client id from your app in the spotify dashboard:
// https://developer.spotify.com/dashboard/applications

let spotifyTestPlaylist = ['Tame Impala', 'Lizzo', 'The Strokes', 'Tyler, The Creator', 'Vampire Weekend', 'J Balvin', 'RÜFÜS DU SOL', 'Kehlani', 'Glass Animals', 'ZHU', 'Young Thug', 'Kaytranada', 'Khruangbin', 'Lord Huron', 'Nelly', 'Brittany Howard', 'Burna Boy', 'Melanie Martinez', '24kgoldn', 'TroyBoi', 'Angel Olsen', 'Sofi Tukker'];

// Restore tokens from localStorage
let access_token = JSON.parse(localStorage.getItem('access_token')) || null;
let refresh_token = JSON.parse(localStorage.getItem('refresh_token')) || null;
let expires_at = JSON.parse(localStorage.getItem('expires_at')) || null;

// Auth functions

// Generates data required for OAuth PKCE
function generateRandomString(length) {
    let text = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const digest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(codeVerifier),
    );

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function generateUrlWithSearchParams(url, params) {
    const urlObject = new URL(url);
    urlObject.search = new URLSearchParams(params).toString();

    return urlObject.toString();
}

// Auth popup
var windowObjectReference;
var windowFeatures = "width=600,height=700,left=300,top=200,toolbar=0,status=0,";
function redirectToSpotifyAuthorizeEndpoint() {
    const codeVerifier = generateRandomString(64);

    generateCodeChallenge(codeVerifier).then((code_challenge) => {
        localStorage.setItem('code_verifier', JSON.stringify(codeVerifier));

        // Redirect to example:
        // GET https://accounts.spotify.com/authorize?response_type=code&client_id=77e602fc63fa4b96acff255ed33428d3&redirect_uri=http%3A%2F%2Flocalhost&scope=user-follow-modify&state=e21392da45dbf4&code_challenge=KADwyz1X~HIdcAG20lnXitK6k51xBP4pEMEZHmCneHD1JhrcHjE1P3yU_NjhBz4TdhV6acGo16PCd10xLwMJJ4uCutQZHw&code_challenge_method=S256

        let popupUrl = generateUrlWithSearchParams(
            'https://accounts.spotify.com/authorize',
            {
                response_type: 'code',
                client_id,
                scope: 'playlist-modify-private',
                code_challenge_method: 'S256',
                code_challenge,
                redirect_uri,
            },
        );
        windowObjectReference = window.open(popupUrl, "Spotify_WindowName", windowFeatures);
        try {
            windowObjectReference.focus();
        } catch (e) {
            console.log('Popup may have been blocked');
            swal('Please allow popups in order to authorize Spotify playlist creation');
        }
        // If the user accepts spotify will come back to your application with the code in the response query string
        // Example: http://127.0.0.1:8080/?code=NApCCg..BkWtQ&state=profile%2Factivity
    });
}


/*
* SPOTIFY API CALLS - ONLY USE ONCE AUTH COMPLETE
*/

// list of artist/track objects
let list = [];
// URL to playlist
let listUrl = '';
// External URL to playlist
let listExternalUrl = '';
// User ID
let userId = '';


// Search for artist and retrieve id - then use url returned to search top tracks
async function spotifySearchItem(artistName) {
    let url = 'https://api.spotify.com/v1/search?type=artist&q=';
    let auth = 'Bearer ' + JSON.parse(localStorage.getItem('access_token'));
    try {
        let response = await fetch(url + artistName, {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            let json = await response.json();

            if (json.artists.items.length != 0) {

                await spotifySearchArtistTopTracks(json.artists.items[0].href);
            }
        } else {
            handleError(await response.json());
        }
    } catch (err) {
        console.log(err);
    }
}

async function spotifySearchArtist(url) {
    let auth = 'Bearer ' + JSON.parse(localStorage.getItem('access_token'));
    try {
        let response = await fetch(url, {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            let json = await response.json();

        } else {
            handleError(await response.json());
        }
    } catch (err) {
        console.log(err);
    }
}

// GET method to search for artist top track
// url is the api url for the artist
// this creates an object with the top track from 
// the artist and pushes it to the list array
// object is called data below
// artist top tracks return tracks where the artist may not be
// the main artist so when looking through the top tracks the 
// one which actually lists them as the artist first is the one
// that is selected. 
async function spotifySearchArtistTopTracks(url) {
    let auth = 'Bearer ' + JSON.parse(localStorage.getItem('access_token'));
    try {
        let response = await fetch(url + '/top-tracks?market=US', {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            let json = await response.json();

            let data = {
                artistName: '',
                artistHref: '',
                track: '',
                trackHref: '',
                trackUri: ''
            }
            // find track with artist as first listed artist
            let i = 0;
            for (let i = 0; i < json.tracks.length; i++) {
                if (json.tracks[i].artists[0].href == url) {
                    // match first listed artist so break out
                    data.artistName = json.tracks[i].artists[0].name;
                    data.artistHref = json.tracks[i].artists[0].href;
                    data.track = json.tracks[i].name;
                    data.trackHref = json.tracks[i].href;
                    data.trackUri = json.tracks[i].uri;

                    list.push(data);
                    break;
                }
            }
        } else {
            handleError(await response.json());
        }
    } catch (err) {
        console.log(err);
    }
}

// This function is the main link to the page contents
// It uses a combination of the other functions to 
// search for each of the artists in the event, then 
// get the current user, create a playlist for that user
// and then finally add each of the top tracks to the playlist
// a page progress bar is updated and a link to the playlist 
// is displayed
async function spotifyCreatePlaylistFromArtists() {
    list = [];
    listUrl = '';
    listExternalUrl = '';
    userId = '';
    let artistArray = artistNameArray;
    let progressBarEl = document.querySelector('#progress-bar');
    let playlistLinkEl = document.querySelector("#playlist-link");
    progressBarEl.style.width = '0%'
    if (artistArray.length === 0) {
        console.log('artist array was empty - using test data');
        artistArray = spotifyTestPlaylist;
    }
    for (let i = 0; i < artistArray.length; i++) {
        await spotifySearchItem(artistArray[i]);
        progressBarEl.style.width = ((100 / artistArray.length) * i) + "%";
    }
    // list should now contain an array of artist objects

    // get current user
    await spotifyGetCurrentUser();
    await spotifyCreatePlaylist();

    // create array of uris
    let uriArray = [];
    for (let i = 0; i < list.length; i++) {
        uriArray.push(list[i].trackUri);
    }

    await spotifyAddItemsPlaylist(uriArray);
    playlistLinkEl.innerHTML = "<a href='" + listExternalUrl + "'>Spotify Playlist</a>";
    progressBarEl.style.width = '100%';

}

// GET method to get the currently logged in user
// This stores the user ID in userID
async function spotifyGetCurrentUser() {
    let auth = 'Bearer ' + JSON.parse(localStorage.getItem('access_token'));

    try {
        let response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            let json = await response.json();
            userId = json.id;


        } else {
            handleError(await response.json());
        }
    } catch (err) {
        console.log(err);
    }
}

// Use POST method to create a playlist under a user ID
// The user should be logged in and OAuth completed
// userId is the user ID of the logged in user
// Playlist name is created using the name of the festival 
// This function stores the playlist url in listUrl 
// This function stores an external link to the playlist in listExternalUrl
async function spotifyCreatePlaylist() {
    let auth = 'Bearer ' + JSON.parse(localStorage.getItem('access_token'));
    const data = {
        name: 'Pregame x ' + localStorage.getItem('festival_name'),
        description: 'Pregame Festival Playlist',
        public: false
    }
    new Date().getTime()
    try {
        let response = await fetch('https://api.spotify.com/v1/users/' + userId + '/playlists', {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (response.ok) {
            let json = await response.json();
            listUrl = json.href;
            listExternalUrl = json.external_urls.spotify;

        } else {
            handleError(await response.json());
        }
    } catch (err) {
        console.log(err);
    }
}

// Use POST method to add items to an existing playlist
// uriArray is the array of items to add
// listUrl is set to the url of the playlist to be updated
async function spotifyAddItemsPlaylist(uriArray) {
    let auth = 'Bearer ' + JSON.parse(localStorage.getItem('access_token'));
    const data = {
        uris: uriArray,
        position: 0
    }

    try {
        let response = await fetch(listUrl + '/tracks', {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (response.ok) {
            let json = await response.json();
            listUrl = json.href;

        } else {
            handleError(await response.json());
        }
    } catch (err) {
        console.log(err);
    }
}

// Handles fetch error results using template
function handleError(error) {
    console.error(error);
    searchResultsEl.innerHTML = errorTemplate({
        status: error.error.status,
        message: error.error.message,
    });
}

// Error template for fetch error results
function errorTemplate(data) {
    return `<h2>Error info</h2>
      <table>
        <tr>
            <td>Status</td>
            <td>${data.status}</td>
        </tr>
        <tr>
            <td>Message</td>
            <td>${data.message}</td>
        </tr>
      </table>`;
}