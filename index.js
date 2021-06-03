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
      key: process.env.KEY, // our API key
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

var classEnabledMap = {};
app.get("/sendclassenabled", (req, res) => {
	let classCode = req.query.code;
	let canJoin = req.query.canjoin;
	classEnabledMap[classCode] = canJoin;
	
	console.log(classCode + " " + canJoin);
}); // send from teacher if submitting is enabled


var canSubmitMap = {};
app.get("/sendsubmitenabled", (req, res) => {
	let classCode = req.query.code;
  let canSubmit = (req.query.canSubmit === "true");

	canSubmitMap[classCode] = canSubmit;

	console.log(classCode + " " + canSubmit + " submission");
}); // send from teacher if submitting is enabled

app.get("/getsubmitenabled", (req, res) => {
	let classCode = req.query.code;
  let canSubmit = true;

	if (classCode in canSubmitMap) {
		canSubmit = canSubmitMap[classCode];
	}

  res.send(JSON.stringify({
    submitDisabledData: canSubmit
  }));
}); // returns true/false for if submit is enabled

app.get("/removesong", async (req ,res) => {
	console.log("Request received!");

  let vidID = req.query.id;
  let playlistID = req.query.playlist;
  
  let value = await db.get(playlistID);
	value = value.split(",");

	let index = -1;
	for (let i = 0; i < value.length; i++) {
		if (value[i] === vidID) {
			index = i;
			break;
		}
	}

	value.splice(index, 2);
	value = value.toString();

	if (value === "") {
		await db.delete(playlistID);
	} else {
		await db.set(playlistID, value);
	}

  res.send(JSON.stringify({
    id: vidID,
    playlist: playlistID
  }));
})

app.get("/removestudent", async (req, res) => {
	console.log("time to remove a student");

	let email = req.query.email;
	let code = req.query.code + "class";

	let classroom = await db.get(code);
	console.log(classroom);

	let index = -1;
	for (let i = 0; i < classroom.length; i++) {
		if (classroom[i] === email) {
			index = i;
			break;
		}
	}

	classroom.splice(index, 1);
	console.log(classroom);
	console.log(index);
	await db.set(code, classroom);

	let studentsToCodes = await db.get("studentsToCodes");
	if (email in studentsToCodes) {
		delete studentsToCodes[email];
	}
	await db.set("studentsToCodes", studentsToCodes);

	console.log(studentsToCodes);

	res.send(JSON.stringify({
		successful: true
	}));
})

app.get("/addsong", async (req, res) => {
  let vidID = req.query.id;
  let playlistID = req.query.playlist;
  let value = vidID;

  var alreadyContainsSong = false;

  playlistIDList = await db.list(); // getting the list of keys
  if (playlistIDList.indexOf(playlistID) > -1) { // check for whether the key is already in the database
    value = await db.get(playlistID);
    console.log("got it");
    console.log(value);
    if (value.includes(vidID)) {
      alreadyContainsSong = true;
    }
    else {
      alreadyContainsSong = false;
      value = value + "," + vidID;
    }
  }

  await db.set(playlistID, value);

  res.send(JSON.stringify({
    id: vidID,
    playlist: playlistID,
    contains: alreadyContainsSong
  }));
});

app.get("/getplaylist", async (req, res) => {
  let playlistID = req.query.playlistID;
  value = await db.get(playlistID);
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


app.get("/renamecode", async (req, res) => {
	let code = req.query.code;
	let newName = req.query.name;

	let database = await db.list();
	var codeToName = {};
	if (database.indexOf("codeToName") > -1) {
		codeToName = await db.get("codeToName");
	}

	codeToName[code] = newName;
	await db.set("codeToName", codeToName);
})


app.get("/getcodename", async (req, res) => {
	let code = req.query.code;
	let name = await db.get("codeToName");
	name = name[code];

	res.send(JSON.stringify({
		name: name
	}))
})

// Generate an unique code for each teacher.
// req should take in an email.
app.get("/generatecode", async (req, res) => {
  let email = req.query.email;

  // find the hash function of the email
  // (same as java implementation for string hash function)
  let hash = 0;
  for (i = 0; i < email.length; i++) {
    char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  if (hash < 0) hash = -hash; // convert negative hashs to positive values

  // convert the hash function to a 6 or 7 letter code
  let code = "";
  while (hash > 1) {
    code += String.fromCharCode(65 + hash % 26);
    hash = hash / 26;
  }

	let codeToName = await db.get("codeToName");

	if (codeToName == null) {
		codeToName = {};
	}

	if (!(code in codeToName)) {
		codeToName[code] = email;
	}

	await db.set("codeToName", codeToName);

  res.send(JSON.stringify({
    code: code
  }));
});



app.get("/joinclass", async (req, res) => {
	console.log("success!");
  let code = req.query.code + "class";
  let email = req.query.email;

	let classEnabled = true;
	if (req.query.code in classEnabledMap) {
		classEnabled = (classEnabledMap[req.query.code] === 'true');
	}

  let codeList = await db.list();
  var classroom = [];

  if (codeList.indexOf(code) > -1) {
    classroom = await db.get(code);
  }

  var studentAlreadyHere;

  if (classroom.includes(email)) {
    studentAlreadyHere = true;
  }
  else if (classEnabled) {
    classroom.push(email);
    db.set(code, classroom);
    
    var studentsToCodes = {};

    if (codeList.indexOf("studentsToCodes") > -1) {
      studentsToCodes = await db.get("studentsToCodes");
    }

    studentsToCodes[email] = req.query.code;
    db.set("studentsToCodes", studentsToCodes);

    /* email to name */
    
    let dictionary = await db.get("emailToName");
    if (dictionary === null) {
      dictionary = {};
    }

    console.log(req.query.name);
    console.log(dictionary);
    dictionary[req.query.email] = req.query.name;

    await db.set("emailToName", dictionary);

    studentAlreadyHere = false;
  }
  res.send(JSON.stringify({
    contains: studentAlreadyHere,
		classEnabled: classEnabled
  }));
})


app.get("/getcurrentclass", async (req, res) => {
  let email = req.query.email;
  let studentsToCodes = await db.get("studentsToCodes");
  let currentCode = "";
  if (email in studentsToCodes) {
    currentCode = studentsToCodes[email];
  }

  res.send(JSON.stringify({
    code: currentCode
  }));
})


app.get("/getclass", async (req, res) => {
  let code = req.query.code + "class";
  let classroom = await db.get(code);

  res.send(JSON.stringify({
    classroom: classroom
  }))
});

app.get("/setemailtoname", async (req, res) => {
	let dictionary = await db.get("emailToName");
	if (dictionary === null) {
		dictionary = {};
	}

	console.log(req.query.name);
	console.log(dictionary);
	dictionary[req.query.email] = req.query.name;

	await db.set("emailToName", dictionary);
})

app.get("/getemailtoname", async (req, res) => {
	let dictionary = await db.get("emailToName");
	let email = req.query.email;

	res.send(JSON.stringify({
		name: dictionary[email]
	}))
})

/* SESSIONS: */
const parseurl = require('parseurl')
const session = require('express-session')
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard-cat',
  resave: false,
  saveUninitialized: true,
}));

/* GOOGLE SECURITY */

const CLIENT_ID = "430954870897-nqat6i8u9fbhsl4kdctnni162isherhh.apps.googleusercontent.com";
let {OAuth2Client} = require('google-auth-library');
let oAuth2Client = new OAuth2Client(CLIENT_ID);
app.post("/authenticate", async (req, res) => {
  let { token } = req.body;
  let ticket = await oAuth2Client.verifyIdToken({ // magic google stuff
    idToken: token,
    audience: CLIENT_ID
  });

	req.session.token = token;

	let email = ticket.getPayload().email;
  res.json({email: email});
})

//serving files
app.use(async (req, res) => {
	if (req.url === "/static/student.html" || req.url === "/static/teacher.html") {
		token = req.session.token;
		let ticket = await oAuth2Client.verifyIdToken({ // magic google stuff
        idToken: token,
        audience: CLIENT_ID
    })
			.then(response => {
				let email = response.payload.email;
				let isStudent = ((email.includes("@naperville203.org")) || (["kittendub@gmail.com", "evman142@gmail.com", "geoffrey.feifei@gmail.com", "bizzlebozzlebuzzle@gmail.com",
        "bzlbzlbzl2000iscool@gmail.com",
        "bzli@stu.naperville203.org"].includes(email)));
				if (isStudent) {
					if (req.url === "/static/teacher.html") {
						res.sendFile(__dirname + "/static/teacher.html");
					} else {
						return res.redirect("/static/teacher.html");
					}
				} else {
					if (req.url === "/static/student.html") {
						res.sendFile(__dirname + "/static/student.html");
					} else {
						return res.redirect("/static/student.html");
					}
				}
			})
			.catch(error => {
				// console.log(error);
				return res.redirect('/static/index.html');
			});
	} else {
		res.sendFile(__dirname + req.url);
	}
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});

// GET
// retrieving resources from servers


// POST
// sending data to servers