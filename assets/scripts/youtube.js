let playlist = ['Tame Impala', 'Lizzo', 'The Strokes', 'Tyler, The Creator', 'Vampire Weekend', 'J Balvin', 'RÜFÜS DU SOL', 'Kehlani', 'Glass Animals', 'ZHU', 'Young Thug', 'Kaytranada', 'Khruangbin', 'Lord Huron', 'Nelly', 'Brittany Howard', 'Burna Boy', 'Melanie Martinez', '24kgoldn', 'TroyBoi', 'Angel Olsen', 'Sofi Tukker'];

// Called to authenticate the user to access the API 
// that allows us to modify their youtube playlist
async function authenticate() {
    try {
        await gapi.auth2.getAuthInstance()
            .signIn({ scope: "https://www.googleapis.com/auth/youtube" });
        console.log("Sign-in successful");
        loadClient();
    } catch (err) {
        console.log("Error signing in", err);
    }
}

// Loads the google client with the youtube API
async function loadClient() {
    gapi.client.setApiKey("AIzaSyCjC_Evg4pGy3IELojH3Tm24NcuGrsOKCI");
    try {
        await gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        console.log("GAPI client loaded for API");
        btnAuth.disabled = true;
        btnCreate.disabled = false;
    } catch (err) {
        console.error("Error loading GAPI client for API", err);
    }
}

// Creates a new playlist in the user's account
async function createPlaylist() {
    try {
        let response = await gapi.client.youtube.playlists.insert({
            "part": [
                "snippet,status"
            ],
            "resource": {
                "snippet": {
                    "title": "Pregame " + new Date().getTime(),
                    "description": "New playlist",
                    "tags": [
                        "sample playlist",
                        "API call"
                    ],
                    "defaultLanguage": "en"
                },
                "status": {
                    "privacyStatus": "private"
                }
            }
        });
        console.log("Response", response);

        plTitle = response.result.snippet.title;
        plId = response.result.id;
        console.log("Playlist Title: " + plTitle);
        console.log("Playlist ID: " + plId);
        btnCreate.disabled = true;
        btnUpdate.disabled = false;
    } catch (err) {
        console.error("Execute error", err);
    }
}

// Makes updates to the playlist title and tags and 
// then calls insert video to add videos to the playlist
async function updatePlaylist() {
    try {
        console.log("Updating playlist");
        videoIds = [];
        plTitle = "Pregame Update " + new Date().getTime();
        let desc = artistNameArray.join();
        let response = await gapi.client.youtube.playlists.update({
            "part": [
                "snippet,status,contentDetails"
            ],
            "resource": {
                "id": plId,
                "snippet": {
                    "title": plTitle,
                    "description": desc,
                    "tags": [
                        "TicketMaster API",
                        "Pregame"
                    ]
                },
                "status": {
                    "privacyStatus": "private"
                }
            }
        });
        // Handle the results here (response.result has the parsed body).
        //console.log("Response", response);
        for (let i = 0; i < artistNameArray.length; i++) {
            plProgressEl.style.width = ((i + 1)/artistNameArray.length)*100 + "%"
            await searchVideos(artistNameArray[i]);
        }
        for (let i = 0; i < videoIds.length; i++) {
            plProgressEl.style.width = ((i + 1)/artistNameArray.length)*100 + "%"
            await insertVideo(i, videoIds[i]);
        }
        showPlayListLink();
    } catch (err) {
        console.error("Execute error", err);
    }
}

async function searchVideos(artist) {
    try {
        console.log("Searching for " + artist + " video");
        let response = await gapi.client.youtube.search.list({
            "part": [
                "snippet"
            ],
            "maxResults": 1,
            "q": artist,
            "type": "video",
            "order": "viewCount",
            "safeSearch": "none"
        });
        // Handle the results here (response.result has the parsed body).
        let videos = await response.result.items;
        for (let i = 0; i < videos.length; i++) {
            console.log("Adding " + artist + " video ID to list");
            videoIds.push(videos[i].id.videoId);
        }
    } catch (error) {
        console.log(error);
    }
}

// Adds videos to the playlist at position 0
// This will push existing videos to the end of the playlist
// Updates the playlist link to YouTube
async function insertVideo(pos, videoId) {
    try {
        console.log("Inserting videoID " + videoId + " to position " + pos + "in playlist")
        await gapi.client.youtube.playlistItems.insert({
            "part": [
                "snippet"
            ],
            "resource": {
                "snippet": {
                    "playlistId": plId,
                    "position": pos,
                    "resourceId": {
                        "kind": "youtube#video",
                        "videoId": videoId
                    }
                }
            }
        })
        // Handle the results here (response.result has the parsed body).
        //console.log("Response", response);
    } catch (err) {
        console.error("Execute error", err);
    }
}

gapi.load("client:auth2", async function () {
    try {
        //var localhost = "762278068311-tf0f00kql9cm5hdhu2scjgdfg1mqm822.apps.googleusercontent.com";
        var github = "762278068311-stoa3fflppk9o9qfdr2cf57mro3s7b4m.apps.googleusercontent.com"
        let gauth = gapi.auth2.init({ client_id: github });
        await gauth;
        if (gauth.isSignedIn.get()) {
            console.log("already signed in");
            btnAuth.disabled = true;
            loadClient();
            // maybe add an option for the user to sign out
        }
    } catch (err) {
        console.error("Error loading GAPI client for API", err);
    }
});

/****************************************************
 * Spotify Auth
 * https://github.com/tobika/spotify-auth-PKCE-example
 */

// Your client id from your app in the spotify dashboard:
// https://developer.spotify.com/dashboard/applications


// Restore tokens from localStorage
let access_token = localStorage.getItem('access_token') || null;
let refresh_token = localStorage.getItem('refresh_token') || null;
let expires_at = localStorage.getItem('expires_at') || null;

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

var windowObjectReference;
var windowFeatures = "width=600,height=700,left=300,top=200,toolbar=0,status=0,";
function redirectToSpotifyAuthorizeEndpoint() {
    const codeVerifier = generateRandomString(64);

    generateCodeChallenge(codeVerifier).then((code_challenge) => {
        localStorage.setItem('code_verifier', codeVerifier);

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

        // If the user accepts spotify will come back to your application with the code in the response query string
        // Example: http://127.0.0.1:8080/?code=NApCCg..BkWtQ&state=profile%2Factivity
    });
}

redirectToSpotifyAuthorizeEndpoint();

async function spotifySearchItem(artistName) {
    let url = 'https://api.spotify.com/v1/search?type=artist&q=';
    let auth = 'Bearer ' + localStorage.getItem('access_token');
    try {
        let response = await fetch(url + artistName,{
            headers:{
                'Authorization' : auth,
                'Content-Type' : 'application/json'
            }
        });
        if (response.ok) {
            let json = await response.json();
            console.log(json);
            console.log(json.artists.items[0].href);
            spotifySearchArtistTopTracks(json.artists.items[0].href);
        } else {
            handleError(response);
        }
    } catch (err) {
        console.log(err);
    }
}

async function spotifySearchArtist(url) {
    let auth = 'Bearer ' + localStorage.getItem('access_token');
    try {
        let response = await fetch(url,{
            headers:{
                'Authorization' : auth,
                'Content-Type' : 'application/json'
            }
        });
        if (response.ok) {
            let json = await response.json();
            console.log(json);
        } else {
            handleError(response);
        }
    } catch (err) {
        console.log(err);
    }
}

async function spotifySearchArtistTopTracks(url) {
    let auth = 'Bearer ' + localStorage.getItem('access_token');
    try {
        let response = await fetch(url + '/top-tracks?market=US',{
            headers:{
                'Authorization' : auth,
                'Content-Type' : 'application/json'
            }
        });
        if (response.ok) {
            let json = await response.json();
            console.log(json);
        } else {
            handleError(response);
        }
    } catch (err) {
        console.log(err);
    }
}

function handleError(error) {
    console.error(error);
    searchResultsEl.innerHTML = errorTemplate({
        status: error.response.status,
        message: error.error.error_description,
    });
}

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