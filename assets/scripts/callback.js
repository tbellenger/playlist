let contentEl = document.querySelector("#content");



window.addEventListener('load', function (event) {
    console.log(this.location.search);
    searchParams = new URLSearchParams(this.location.search);
    if (searchParams.get('error') !== null) {
        contentEl.innerHTML = "User cancelled auth";
    } else {
        this.localStorage.setItem('spotCode', JSON.stringify(searchParams.get('code')));
        exchangeToken(searchParams.get('code'));
    }
});

function exchangeToken(code) {
    const code_verifier = localStorage.getItem('code_verifier');

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

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_at', expires_at);
}