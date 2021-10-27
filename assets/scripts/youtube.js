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
        btnAuth.disabled=true;
        btnCreate.disabled=false;
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
        btnCreate.disabled=true;
        btnUpdate.disabled=false;
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
        let desc = playlist.join();
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
        for (let i = 0; i < playlist.length; i++) {
            plProgressEl.style.width = (playlist.length / (i+1)) + "%"
            await searchVideos(playlist[i]);
        }
        for (let i = 0; i < videoIds.length; i++) {
            plProgressEl.style.width = (playlist.length / (i+1)) + "%"
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
            btnAuth.disabled=true;
            loadClient();
            // maybe add an option for the user to sign out
        }
    } catch (err) {
        console.error("Error loading GAPI client for API", err);
    }
});

const random = (length = 8) => {
    // Declare all characters
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;

};

var windowObjectReference;
var windowFeatures = "width=600,height=700,left=150,top=200,toolbar=0,status=0,";

const client_id = "client_id=6a0256e60f084740acaba82df07a21e2";
const response_type = "&response_type=code";
const redirect_url = "&redirect_uri=http://tbellenger.github.io/playlist/callback/";
const scope = "&scope=playlist-modify-private";
const show_dialog = "&show_dialog=false";
const code_challenge_method = "&code_challenge_method=S256";
const verifier = random(64);

async function spotifyReqAuth() {
    try {
        console.log('verifier ',verifier);
        localStorage.setItem('spotVerifier', JSON.stringify(verifier));
        const digest = sha256(verifier);
        console.log('hash ', digest);
        const code_challenge = "&code_challenge=" + digest.toUpperCase();
        let url = "https://accounts.spotify.com/authorize?" + 
        client_id + 
        response_type + 
        redirect_url + 
        scope + 
        show_dialog +
        code_challenge_method + 
        code_challenge;
        windowObjectReference = window.open(url, "Spotify_WindowName", windowFeatures);
    } catch (err) {
        console.log(err);
    }
}

spotifyReqAuth();

