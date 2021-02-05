// https://github.com/google/google-api-javascript-client

function submitWord() {
	let searchTerm = document.getElementById("searchWord").value;
	//alert(searchTerm);
  fetch("https://express-base.evanzimmerman.repl.co/api/endpoint", {
    method: "POST",
    body: searchTerm
  }).then(result => result.json()).then(console.log)
}




/*
var key = process.env.KEY

function showResponse(response) {
    var responseString = JSON.stringify(response, '', 2);
    document.getElementById('response').innerHTML += responseString;
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See https://goo.gl/PdPA1 to get a key for your own applications.
    let key = process.env.KEY;
    gapi.client.setApiKey(key);

    search();
}

function search() {
    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        q: "funny cats"
        
    });
    
    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}

*/