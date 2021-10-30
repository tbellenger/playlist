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
        { "eventTitleID": "event-title" ,"eventTitle" : "Event Title Updated","startDate": "10-31-21", "endDate" : "11-01-21", "Location" : "California"},
        { "eventTitleID": "Outside Lands" ,"eventTitle" : "Outside Lands","startDate": "10-31-21", "endDate" : "11-01-21", "Location" : "Golden Gate Park"},
        { "eventTitleID": "Tortuga" , "eventTitle" : "Tortuga","startDate": "11-01-21", "endDate" : "11-01-21", "Location" : "Florida"},
        { "eventTitleID": "Souther Soul Music Fest" , "eventTitle" : "Souther Soul Music Fest","startDate": "12-31-21", "endDate" : "12-31-21", "Location": "Miami"} ]
    searchResult = tempSearchResult;
    console.log('testing updateSearchContents \n \t\t',searchResult)

    for(let index = 0; index < tempSearchResult.length; index++){
        
        // use temprary data until they restructure how our data is stored.
        let aEvent = tempSearchResult[index];
        let eventTitleId = aEvent.eventTitleID
        let eventLineUpId = "event-lineup" // temporary id

        let eventTitle = aEvent.eventTitle;
        let eventStartDate = aEvent.startDate;
        let eventEndDate = aEvent.endDate;
        let eventLocation = aEvent.Location;
        let eventShortDescID = "event-short-desc"; // temporary data
       
        let tempArtistNameArray = ["Lizzo","Justin Bieber","Eric Clpaton"];
        artistNameArray = tempArtistNameArray; // temporary data
        let eventListArtistsArray = artistNameArray;
        
        //make an empty Icon element, just in case we need to add a new event to the list
        let childElementMaterialIcon = document.createElement("i")
        childElementMaterialIcon.setAttribute("class", "material-icons right")
        childElementMaterialIcon.innerHTML = "more_vert"

        let spanTitleEl = document.querySelector("#"+eventTitleId);
        
        
        if(spanTitleEl != null){ // if the event is already on the page 
            // then you can grab the element and update it
            let pEventLineUpEl = document.querySelector("#"+eventLineUpId )
            let pShortDescEl = document.querySelector("#"+eventShortDescID)

            childElementMaterialIcon = spanTitleEl.querySelector(".material-icons");
            spanTitleEl.innerHTML = eventTitle // update the title incase they changes the name of the festival
            spanTitleEl.append(childElementMaterialIcon) // add the icon element that opens the playlist menu
            pShortDescEl.innerHTML = eventLocation + ': ('+ eventStartDate + ' to ' + eventEndDate + ')';
            // update the event list with artist names
            pEventLineUpEl.innerHTML = "" // clear out the old Lineup
            let ulLineUpEl = document.createElement("ul") // make an Unordered list to hold the lineup
            for(let index2 = 0; index2 < eventListArtistsArray.length; index2++){
                let liElement = document.createElement("li")
                let artistName = eventListArtistsArray[index2];
                liElement.setAttribute("id", eventTitleId+artistName)
                liElement.innerHTML = artistName
                ulLineUpEl.append(liElement)
                
            }
            pEventLineUpEl.append(ulLineUpEl)
            

        }
        else{
            // the event is not on the page, so add the event
            spanTitleEl = document.createElement("span")
            spanTitleEl.setAttribute("class", "card-title activator")
            spanTitleEl.setAttribute("id", eventTitleId)

        }
        
        
        console.log(spanTitleEl, childElementMaterialIcon)
    }

}