const app = require('express')();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const axios = require("axios"); // for requests (essentially equivalent to the fetch command)
const Database = require("@replit/database");
const db = new Database();



// For storing the API key in the .env file and retrieving it
const dotenv = require("dotenv");
dotenv.config();

app.use(bodyParser.json());

// '/' endpoint handling
app.get('/', (req, res) => { // Return the html file for the home directory of the server
  res.sendFile(__dirname + '/static/index.html');
});

app.get("/ytapi", (req, res) => {
  let keyword = req.query.term;
  console.log("Search Term:  " + keyword); // temporary logging

  axios.get("https://www.googleapis.com/youtube/v3/search", { // Axios request
    params: {
      key: process.env.KEY, // Our API key
      type: "video", // type of youtube content
      part: "snippet",
      videoCategoryId: 10, // only returns videos that are categorized as songs
      maxResults: 3, // amount of results provided
      q: keyword // search term(s)
    }
  })
    .then(response => {
      // iterating through the JSON and getting the data we want from it

      for (var i = 0; i < response.data.items.length; i++) {
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
    });
});

app.get("/videoidtotitle", (req, res) => {
  let id = req.query.id;
  console.log('searching for ' + id);
  axios.get("https://youtube.googleapis.com/youtube/v3/videos", {
    params: {
      key: process.env.KEY,
      part: "snippet,contentDetails,statistics",
      id: id
    }
  })
    .then(response => {
      console.log(response.data.items[0].snippet.title)
      res.send(JSON.stringify({
        title: response.data.items[0].snippet.title
      }))
    })
    .catch(error => {
      console.log(error)
    });
});

app.get("/addsong", async (req, res) => {
  let vidID = req.query.id;
  let playlistID = req.query.playlist;
  let value = vidID;

  playlistIDList = await db.list(); // getting the list of keys
  if (playlistIDList.indexOf(playlistID) > -1) { // check for whether the key is already in the database
    value = await db.get(playlistID);
    console.log("got it");
    console.log(value);
    value = value + "," + vidID;
  }

  await db.set(playlistID, value);

  res.send(JSON.stringify({
    id: vidID,
    playlist: playlistID
  }));
});

app.get("/getplaylist", async (req, res) => {
  let playlist = req.query.playlistID;

  value = await db.get(playlist);

  console.log(value);
  console.log(await db.list());

  res.send(JSON.stringify({
    playlist: value
  }));
});

app.get("/deleteplaylist", async (req, res) => {
  let playlist = req.query.playlistID;

  value = await db.get(playlist);
  await db.delete(playlist);

  res.send(JSON.stringify({
    playlist: value
  }));
});


const parseurl = require('parseurl')
const session = require('express-session')
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: 'keyboard-cat',
	resave: false,
  saveUninitialized: true,
}));

app.use("/checksession", (req, res, next) => {
	if (!req.session.views) {
    req.session.views = {}
  }

	var pathname = parseurl(req).pathname
  
	if (req.session.views[pathname] === null) {
		req.session.views[pathname] = false;
	}

	let mode = req.query.mode;

	req.session.views["/checksession"] = (mode === 'check') ? req.session.views["/checksession"] : (mode === 'login');

	next();
})

app.get("/checksession", (req, res, next) => {
	console.log(req.session);
	res.send(JSON.stringify({
		loggedIn: req.session.views["/checksession"]
	}));
});


//serving files
app.use((req, res) => {
  res.sendFile(__dirname + req.url);
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});

// GET
// retrieving resources from servers


// POST
// sending data to servers
