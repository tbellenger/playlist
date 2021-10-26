let playlist = ['Tame Impala', 'Lizzo', 'The Strokes', 'Tyler, The Creator', 'Vampire Weekend', 'J Balvin', 'RÜFÜS DU SOL', 'Kehlani', 'Glass Animals', 'ZHU', 'Young Thug', 'Kaytranada', 'Khruangbin', 'Lord Huron', 'Nelly', 'Brittany Howard', 'Burna Boy', 'Melanie Martinez', '24kgoldn', 'TroyBoi', 'Angel Olsen', 'Sofi Tukker', 'Earthgang', 'Marc Rebillet', 'Sharon Van Etten', 'SG Lewis', 'A R I Z O N A', 'JPEGMAFIA', 'Drama', 'Dr. Dog', 'Shiba San', 'Boy Pablo', 'Rico Nasty', 'Andrew McMahon in the Wilderness', '070 Shake', 'Trevor Daniel', 'The Midnight', 'Moses Sumney', 'mxmtoon', 'Dijon', 'The Hu', 'Yung Bae', 'Bakar.', 'The Soul Rebels', 'Hinds', 'Caroline Polachek', 'Yves Tumor', 'Crooked Colours', 'Scarypoolparty', 'J. Phlip', 'Marc E. Bassy', 'Julia Jacklin', 'Goth Babe', 'Remi Wolf', 'Cam', 'Neil Frances', 'Rexx Life Raj', 'Cannons', 'Buscabulla', 'Resistance Revival Chorus', 'Odie', 'Claud', 'Madeline Kenney', 'Post Animal', 'Nap Eyes', 'Neal Francis'];

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
                    "title": "Playlister " + new Date().getTime(),
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
        plTitle = "Updated playlist " + new Date().getTime();
        let response = await gapi.client.youtube.playlists.update({
            "part": [
                "snippet,status,contentDetails"
            ],
            "resource": {
                "id": plId,
                "snippet": {
                    "title": plTitle,
                    "description": "Updated playlist",
                    "tags": [
                        "Songkick API",
                        "Playlister"
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
            await searchVideos(playlist[i]);
        }
        for (let i = 0; i < videoIds.length; i++) {
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
        let videos = response.result.items;
        videoIds = [];
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
        console.log("Inserting videoID " + videoID + " to position " + pos + "in playlist")
        let response = await gapi.client.youtube.playlistItems.insert({
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