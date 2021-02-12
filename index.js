const app = require('express')();
const http = require('http').createServer(app);
const bodyParser = require('body-parser')
const axios = require("axios"); // for requests (essentially equivalent to the fetch command)

// For storing the API key in the .env file and retrieving it
const dotenv = require("dotenv")
dotenv.config()

//var key = process.env.KEY // don't need this at the moment, would rather not store the key value

app.use(bodyParser.json())

// '/' endpoint handling
app.get('/', (req, res) => { // Return the html file for the home directory of the server
  res.sendFile(__dirname + '/static/index.html');
});

app.get("/ytapi", (req,res) => {

  let keyword = req.query.term;
  console.log("Search Term:  " + keyword); // temporary logging

  axios.get("https://www.googleapis.com/youtube/v3/search", { // Axios request
    params: {
      key: process.env.KEY, // Our API key
      type: "video", // type of youtube content
      part: "snippet",
			videoCategoryId: 10, //only returns videos that are categorized as songs
      maxResults: 3, // amount of results provided
      q: keyword // search term(s)
    }
  })
  .then(response => {
    // iterating through the JSON and getting the data we want from it
    
    for(var i = 0; i < response.data.items.length; i++) {
      item = response.data.items[i];
			console.log("[%s] Title: %s", item.id.videoId, item.snippet.title.replace("&#39;", "'"));
    }
    res.send(JSON.stringify({
      videoId1: response.data.items[0].id.videoId,
      videoTitle1: response.data.items[0].snippet.title,
      videoId2: response.data.items[1].id.videoId,
      videoTitle2: response.data.items[1].snippet.title,
      videoId3: response.data.items[2].id.videoId,
      videoTitle3: response.data.items[2].snippet.title
    }));
  })
  .catch(error => {
    console.log(error);
  })

})

//serving files
app.use((req, res) => {
  res.sendFile(__dirname + req.url)
})

http.listen(3000, function(){
	console.log('listening on *:3000')
})



// http

// GET
// retrieving resources from servers


// POST
// sending data to servers
