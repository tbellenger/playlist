const STUBHUB_API = "https://api.stubhub.com/";
const STUBHUB_SEARCH_EVENTS = "sellers/search/events/v3?";
const STUBHUB_SEARCH_PERFORMERS = "partners/search/performers/v3?";
const STUBHUB_ACCESS_TOKEN = "cada2ilygjcINAmIim4OeFsvXQNx";

// Search a performer ID or an array of performer IDs
// to get their names returned. Array cannot be greater
// than 200 IDs.
const getPerformersById = async function(ids) {
    let data;
    if (typeof ids === "Array") {
        if (ids.length > 200) {
            throw new Error("Array cannot be greater than 200 IDs.");
        }
        let idsString = ids.join(" |");
        data = 'id='+idsString;
    } else {
        data = 'id='+ids;
    }
    let url = STUBHUB_API + STUBHUB_SEARCH_PERFORMERS + data;
    //let url = "https://api.stubhub.com/partners/search/performers/v3?id=728983";
    console.log(url);
    try {
        const response = await fetch(url, { 
            headers: { 
                Authorization:`Bearer ${STUBHUB_ACCESS_TOKEN}`, 
                Accept:"application/json" 
            }
        });
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
}

// Search for events by fuzzy logic query. Filter on 
// Music Festivals and exclude parking tickets. 
const getEventByQuery = async function(query) {
    let data = 'q=' + query + '&categoryName="Music Festival"&parking="false"';
    let url = STUBHUB_API + STUBHUB_SEARCH_EVENTS + data;
    try {
        let response = await fetch(url, { 
            headers: { 
                Authorization:`Bearer ${STUBHUB_ACCESS_TOKEN}`, 
                Accept:"application/json" 
            }
        });
        let json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
}