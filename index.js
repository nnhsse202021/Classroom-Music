const app = require('express')();
const http = require('http').createServer(app);
const bodyParser = require('body-parser')
const axios = require("axios");

const dotenv = require("dotenv")
dotenv.config()

var key = process.env.KEY

console.log(process.env.KEY)

app.use(bodyParser.json())

// '/' endpoint handling
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');

  let keyword = "Fortnite"
  let url = "https://www.googleapis.com/youtube/v3/search?key=" + process.env.KEY + "&type=video&part=snippet&maxResults=3&q=" + keyword;
  axios.get(url)
  .then(response => {
    for(var i = 0; i < response.data.items.length; i++) {
      item = response.data.items[i];
			console.log("[%s] Title: %s", item.id.videoId, item.snippet.title);
    }
  })
  .catch(error => {
    console.log(error);
  })

});




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
app.post("/api/endpoint", (req, res) => {
  console.log("got a post request");
})
