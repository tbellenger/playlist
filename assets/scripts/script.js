let plTitle;
let plId;
let videoIds = [];

let btnSearch = document.querySelector("#search-btn");
let btnAuth = document.querySelector("#auth-btn");
let btnCreate = document.querySelector("#create-btn");
let btnUpdate = document.querySelector("#update-btn");
let txtSearch = document.querySelector("#search-query");
let searchResultsEl = document.querySelector("#search-results");

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
    let json = await getEventByQuery(query);
    console.log(json);
    let performers = json.events[0].performers;
    let arrIds = '';
    for (let i = 0; i < performers.length; i++) {
        arrIds += performers[i].id + ' |';
    }
    json = await getPerformersById(arrIds);
    console.log(json);
}

async function searchVideos(event) {
    event.preventDefault();
    let query = txtSearch.value;
    try {
        let response = await gapi.client.youtube.search.list({
            "part": [
                "snippet"
            ],
            "maxResults": 5,
            "q": query,
            "type": "video",
            "order": "viewCount",
            "safeSearch": "none"
        });
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        let videos = response.result.items;
        videoIds = [];
        searchResultsEl.replaceChildren();
        for (let i = 0; i < videos.length; i++) {
            videoIds.push(videos[i].id.videoId);
            let cardEl = document.createElement("div");
            cardEl.classList.add("card");
            cardEl.classList.add("col");
            cardEl.classList.add("s12");
            cardEl.classList.add("m6"); 
            cardEl.classList.add("small");
            let cardContentEl = document.createElement("div");
            cardContentEl.classList.add("card-content");
            cardContentEl.innerText = videos[i].snippet.description;
            let spanTitleEl = document.createElement("span");
            spanTitleEl.classList.add("card-title");
            spanTitleEl.innerText = videos[i].snippet.title;
            let imageEl = document.createElement("img");
            imageEl.src = videos[i].snippet.thumbnails.default.url;
            let imgDivEl = document.createElement("div");
            imgDivEl.classList.add("card-image");
            imgDivEl.appendChild(imageEl);
            imgDivEl.appendChild(spanTitleEl); 
            cardEl.appendChild(imgDivEl);
            cardEl.appendChild(cardContentEl);
            searchResultsEl.appendChild(cardEl);
        }
    } catch (error) {
        console.log(error);
    }
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
