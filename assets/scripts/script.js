let plTitle;
let plId;

let btnSearch = document.querySelector("#search-btn");
let btnAuth = document.querySelector("#auth-btn");
let btnCreate = document.querySelector("#create-btn");
let btnUpdate = document.querySelector("#update-btn");

btnAuth.addEventListener("click", authenticate);
btnCreate.addEventListener("click", createPlaylist);
btnUpdate.addEventListener("click", updatePlaylist);

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

async function createPlaylist() {
    try {
        let response = await gapi.client.youtube.playlists.insert({
            "part": [
                "snippet,status"
            ],
            "resource": {
                "snippet": {
                    "title": "Sample playlist created via API" + new Date().getTime(),
                    "description": "This is a sample playlist description.",
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

async function updatePlaylist() {
    try {
        plTitle = "Updated playlist " + new Date().getTime();
        let response = await gapi.client.youtube.playlists.update({
            "part": [
                "snippet,status,contentDetails"
            ],
            "resource": {
                "id": plId,
                "snippet": {
                    "title": plTitle,
                    "description": "This is the updated playlist description.",
                    "tags": [
                        "updated playlist",
                        "API FTW"
                    ]
                },
                "status": {
                    "privacyStatus": "private"
                }
            }
        });
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        await insertVideo("M7FIvfx5J10");
        await insertVideo("_5aKcpAhTOk");
    } catch (err) {
        console.error("Execute error", err);
    }
}

async function insertVideo(videoId) {
    try {
        let response = await gapi.client.youtube.playlistItems.insert({
            "part": [
                "snippet"
            ],
            "resource": {
                "snippet": {
                    "playlistId": plId,
                    "position": 0,
                    "resourceId": {
                        "kind": "youtube#video",
                        "videoId": videoId
                    }
                }
            }
        })
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        showPlayListLink();
    } catch (err) {
        console.error("Execute error", err);
    }
}

function showPlayListLink() {
    var linkEl = document.querySelector("#pl-link");
    var plLinkEl = document.createElement("a");
    plLinkEl.href = "https://www.youtube.com/playlist?list=" + plId;
    plLinkEl.innerText = plTitle;
    linkEl.appendChild(plLinkEl);
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
        }
    } catch (err) {
        console.error("Error loading GAPI client for API", err);
    }
});