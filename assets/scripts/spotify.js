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