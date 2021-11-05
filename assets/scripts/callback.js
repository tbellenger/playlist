let contentEl = document.querySelector("#content");


// This is called when the Spotify popup calls the callback page
// in callback/index.html
// Once loaded we check the result returned from Spotify in 
// the callback. If error then the user cancelled the OAuth
// Otherwise it contains a code and we move on to exchange the
// code for the token
window.addEventListener('load', function (event) {
    searchParams = new URLSearchParams(this.location.search);
    if (searchParams.get('error') !== null) {
        contentEl.innerHTML = "User cancelled auth";
    } else {
        this.localStorage.setItem('spotCode', JSON.stringify(searchParams.get('code')));
        exchangeToken(searchParams.get('code'));
    }
});

// exchange the code for a token using POST
// If successful then access token, refresh token and expiry 
// get stored in localstorage
// Once complete this code will call spotConnectionCallback in 
// prefix.js and then close the popup window
function exchangeToken(code) {
    const code_verifier = JSON.parse(localStorage.getItem('code_verifier'));

    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: new URLSearchParams({
            client_id,
            grant_type: 'authorization_code',
            code,
            redirect_uri,
            code_verifier,
        }),
    })
        .then(addThrowErrorToFetch)
        .then((data) => {
            processTokenResponse(data);

            // clear search query params in the url
            window.history.replaceState({}, document.title, '/');
            localStorage.setItem('spotConnected', JSON.stringify(true));
            opener.spotConnectionCallback();
            window.close();
        })
        .catch(handleError);
}

function handleError(error) {
    console.error(error);
    contentEl.innerHTML = errorTemplate({
        status: error.response.status,
        message: error.error.error_description,
    });
    localStorage.setItem('spotConnected', false);
    opener.spotConnectionCallback();
}

function errorTemplate(data) {
    return `<h2>Error info</h2>
      <table>
        <tr>
            <td>Status</td>
            <td>${data.status}</td>
        </tr>
        <tr>
            <td>Message</td>
            <td>${data.message}</td>
        </tr>
      </table>`;
}

async function addThrowErrorToFetch(response) {
    if (response.ok) {
        return response.json();
    } else {
        throw { response, error: await response.json() };
    }
}

function processTokenResponse(data) {
    console.log(data);

    access_token = data.access_token;
    refresh_token = data.refresh_token;

    const t = new Date();
    expires_at = t.setSeconds(t.getSeconds() + data.expires_in);

    localStorage.setItem('access_token', JSON.stringify(access_token));
    localStorage.setItem('refresh_token', JSON.stringify(refresh_token));
    localStorage.setItem('expires_at', JSON.stringify(expires_at));
}