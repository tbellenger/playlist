const TM_API = "https://app.ticketmaster.com/discovery/v2/";
const TM_SEARCH_EVENTS = "events.json?";
const TM_SEARCH_ATTRACTIONS = "attractions/";
const TM_TOKEN = "apikey=YfcjW3gno5AAWiEVx4skuvK2AMDhLXmT";

// Search for events by fuzzy logic query. Filter on 
// Music Festivals and exclude parking tickets. 
const getTmEventByQuery = async function(query) {
    let data = 'keyword=' + query;
    let url = TM_API + TM_SEARCH_EVENTS + data + "&" + TM_TOKEN;
    try {
        let response = await fetch(url);
        let json = await response.json();
        
        return json;
    } catch (error) {
        console.log(error);
    }
}