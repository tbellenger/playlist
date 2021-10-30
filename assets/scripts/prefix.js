var artistNameArray = []; // Array of artists from TicketMaster
var artistPictureArray = []; //Array of pictures from TicketMaster
var eventListArray = []; // Array of events from TicketMaster
let searchResult;

// Spotify Auth Details
const client_id = '6a0256e60f084740acaba82df07a21e2';
//const redirect_uri = 'https://tbellenger.github.io/playlist/callback/'; // Your redirect uri
// testing url
const redirect_uri = 'http://127.0.0.1:5500/callback/'; // Your redirect uri

function updateSearchContents(){
    // an array of event objects
    let tempSearchResult = [
        { "eventTitle" : "Outside Lands","startDate": "10-31-21", "endDate" : "11-01-21"},
        { "eventTitle" : "Tortuga","startDate": "11-01-21", "endDate" : "11-01-21"},
        { "eventTitle" : "Souther Soul Music Fest","startDate": "12-31-21", "endDate" : "12-31-21"} ]
    searchResult = tempSearchResult
    console.log('testing updateSearchContents \n \t\t',searchResult)

    for(let index = 0; index < tempSearchResult.length; index++){
        let aEvent = tempSearchResult[index];
        let eventTitle = aEvent.eventTitle;
        let eventStartDate = aEvent.startDate;
        let eventEndDate = aEvent.endDate;
        
        let childElementMaterialIcon = document.createElement("i")
        childElementMaterialIcon.setAttribute("class", "material-icons right")
        childElementMaterialIcon.innerHTML = "more_vert"
        let spanTitleEl = document.querySelector("#"+eventTitle);
        if(spanTitleEl != null){ // if the event is already on the page 
            // then you can grab the element and update it
            childElementMaterialIcon = spanTitleEl.querySelector(".material-icons");

        }
        else{
            // the event is not on the page, so add the event
            spanTitleEl = document.createElement("span")
            spanTitleEl.setAttribute("class", "card-title activator")
            spanTitleEl.setAttribute("id", eventTitle)

        }
        
        
        console.log(spanTitleEl, childElementMaterialIcon)
    }

}