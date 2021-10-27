let contentEl = document.querySelector("#content");

window.addEventListener('load', function(event) {
    console.log(this.location.search);
    searchParams = new URLSearchParams(this.location.search);
    if (searchParams.get('error')!==null) {
        contentEl.innerHTML = "User cancelled auth";
    } else {
        this.localStorage.setItem('spotCode', JSON.stringify(searchParams.get('code')));
        spotifyReqAccessToken();
    }
});

async function spotifyReqAccessToken() {
    let verifier = JSON.parse(localStorage.getItem('spotVerifier'));
    let params = new URLSearchParams();
    params.set('code',JSON.parse(localStorage.getItem("spotCode")));
    params.set('grant_type', 'authorization_code');
    params.set('redirect_uri','https://tbellenger.github.io/playlist/callback/');
    params.set('client_id','6a0256e60f084740acaba82df07a21e2');
    params.set('code_verifier', verifier);
    console.log(params.toString());

    let b64 = btoa('6a0256e60f084740acaba82df07a21e2:762717d622df4bdd9b6015cc6cbd03ce');
    try {
        let response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + b64,
                'Content-Type': 'application/x-www-form-urlencoded'                    
            },
            body: params.toString()
        });
        if (response.ok) {
            json = await response.json();
            console.log(json);
        } else {
            json = await response.json();
            contentEl.innerHTML = response.status + " " + response.statusText + " " + json.error + " : " + json.error_description;
        }
    } catch(err) {
        console.log(err);
        contentEl.innerHtml = err.toString();
    }
}
