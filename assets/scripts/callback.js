window.addEventListener('load', function(event) {
    console.log(this.location.search);
    this.localStorage.setItem('spotify', JSON.stringify(this.location.search));
    spotifyReqAccessToken();
});

async function spotifyReqAccessToken() {
    let verifier = JSON.parse(localStorage.getItem('spotVerifier'));
    let params = new URLSearchParams(JSON.parse(localStorage.getItem("spotify")));
    params.set('grant_type', 'authorization_code');
    params.set('redirect_uri','http://tbellenger.github.io/playlist/callback/');
    params.set('client_id','6a0256e60f084740acaba82df07a21e2');
    params.set('code_verifier', verifier);
    console.log(params.toString());
    try {
        let response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic NmEwMjU2ZTYwZjA4NDc0MGFjYWJhODJkZjA3YTIxZTI6NzYyNzE3ZDYyMmRmNGJkZDliNjAxNWNjNmNiZDAzY2U=',
                'Content-Type': 'application/x-www-form-urlencoded'                    
            },
            body: params.toString()
        });
        if (response.ok) {
            json = await response.json();
            console.log(json);
        }
    } catch(err) {
        console.log(err);
    }
}
