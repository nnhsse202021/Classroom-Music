
var songBeingLookedAt;
var studentBeingLookedAt;
var songPlaylistBeingLookedAt;
//Is this needed ^^^ or this vvv
async function getCode(email) {
	var code;
  await fetch(`/generatecode?email=${encodeURI(email)}`)
    .then(response => response.json())
    .then(data => {
      code = data.code;
    });
  return code;
}

async function getClassList(code) {
  var classroom;
	console.log(code);
	console.log("abc");
  await fetch(`/getclass?code=${encodeURI(code)}`)
    .then(response => response.json())
    .then(data => {
      classroom = data.classroom;
    })
  return classroom;
}
//Hmm ^^^

/* The playlist variable we have as of now works a bit strangely -- every even index is the song, and every odd index is the name of the student who submitted it. */
async function getPlaylist(playlistID) {
  var playlist;
  await fetch(`/getplaylist?playlistID=${encodeURI(playlistID)}`)
    .then(response => response.json())
    .then(data => {
      console.log("Value: " + data.playlist);
      playlist = data.playlist;
    });
  return playlist;
}

// deleted specified playlist, and returns the deleted playlist
async function deletePlaylist(playlistID) {
  document.getElementById("playlist").innerHTML = '';
  var playlist = ''
  await fetch(`/deleteplaylist?playlistID=${encodeURI(playlistID)}`)
    .then(response => response.json())
    .then(data => {
      console.log("Deleted playlist: " + data.playlist);
      playlist = data.playlist;
    });
  return playlist;
}


// shuffles the currently selected playlist
var isShuffled = false;
var order = [];
async function shufflePlaylist() {
  isShuffled = !isShuffled;
	order = [];
	var playlist = await getPlaylist(await getCurrentCode());
	playlist = playlist.split(",");
  if (isShuffled) {
    for (i = 0; i < (playlist.length/2); i++) {
      var num = Math.floor(Math.random() * (playlist.length/2));
      while (order.includes(num)) {
        num = Math.floor(Math.random() * (playlist.length/2));
      }
      // console.log(num);
      order.push(num);
    }
    console.log(order);
  }
}

var classNumber = "1";
// returns the current class code for the teacher
async function getCurrentCode() {
  var email = classNumber + profile.getEmail();
  var code;
  await fetch(`/generatecode?email=${encodeURI(email)}`)
    .then(response => response.json())
    .then(data => {
      code = data.code;
    });
  return code;
}


async function updateCurrentlyPlayingText(id) {
	await fetch(`/videoidtotitle?id=${encodeURI(id)}`)
		.then(response => response.json())
		.then(data => {
			document.getElementById('currentlyPlaying').innerHTML = data.title;
		});
}

var currentSongIndex = 0;
async function loadNextSong() {
	if (player) {
		var id;
		var playlist = await getPlaylist(await getCurrentCode());
    if (isShuffled) {
      id = playlist.split(",")[(order[currentSongIndex] * 2)]; // * 2 since playlist is song and student name
      currentSongIndex += 1;
      if (currentSongIndex > (playlist.length/2)) {
        currentSongIndex = 0;
      }
    }
    else {
			id = playlist.split(",")[currentSongIndex];
      currentSongIndex += 2;
      if (currentSongIndex > playlist.length) {
        currentSongIndex = 0;
      }
    }

		player.loadVideoById(id); 

    // update the play button
    isPlaying = true;
    document.getElementById("playButtonText").innerHTML = "Pause";
		updateCurrentlyPlayingText(id);
  }
}

document.getElementById("loadButton").addEventListener("click", async () => {
  await loadNextSong();
});


var isPlaying = false;
document.getElementById("playButton").addEventListener("click", () => {
	if (isPlaying == true) { // Execute this if a video is currently playing
    player.pauseVideo();
    document.getElementById("playButtonText").innerHTML = "Play";
  } else { // Execute this if a video is currently paused
    if (currentSongIndex == 0){
      loadNextSong();
    }
    player.playVideo();
    document.getElementById("playButtonText").innerHTML = "Pause";
  }
  isPlaying = !isPlaying;
});

let cancelOptionsButton = document.getElementById("cancelOptionsButton");
cancelOptionsButton.addEventListener("click", async () => {
  document.getElementById("songOptionsModal").style.display = "none";
})

let cancelOptionsesButton = document.getElementById("cancelOptionsesButton");
cancelOptionsesButton.addEventListener("click", async () => {
  document.getElementById("studentOptionsModal").style.display = "none";
})

let removeSongButton = document.getElementById("removeSongButton");
removeSongButton.addEventListener("click", async () => {
  document.getElementById("songOptionsModal").style.display = "none";
  console.log("bruhas");
  await removeSongFromPlaylist();
	await showPlaylist();
	document.getElementById("songOptionsModal").style.display = "none";
})

let removeStudentButton = document.getElementById("removeStudentButton");
removeStudentButton.addEventListener("click", async () => {
  document.getElementById("studentOptionsModal").style.display = "none";
	console.log(studentBeingLookedAt);
	await removeStudentFromClass();
	await refreshClass();
	document.getElementById("studentOptionsModal").style.display = "none";
})

document.getElementById("showPlaylist").addEventListener("click", showPlaylist)

async function showPlaylist() {
  document.getElementById("playlistCard").style.display = "inline-block";
  document.getElementById("playlist").innerHTML = '';
  var playlist = await getPlaylist(await getCurrentCode());
  if (playlist === null) return;
  var songs = playlist.split(',');
	console.log(songs);
  // song id
  for (let i = 0; i < songs.length; i += 2) {
    var stuName = songs[i + 1];
    await fetch(`/videoidtotitle?id=${encodeURI(songs[i])}`)
      .then(response => response.json())
      .then(data => {
        /*
        var rmvbtn = document.createElement("BUTTON");
        rmvbtn.innerHTML = "CLICK ME";
        document.getElementById("playlist").appendChild(rmvbtn);
        */
        var newItem = document.createElement("BUTTON");
        newItem.setAttribute('id', songs[i]);
        newItem.classList.add("playlistSongs1");

        newItem.addEventListener("click", async () => {
          displaySongInfo(data.title, stuName);
          console.log("Sent ID and Student Name to MODAL");

          songBeingLookedAt = songs[i];
          
          document.getElementById("songInfoName").innerHTML = "Song Name: " + data.title;
          document.getElementById("submittedBy").innerHTML = "Submitted By: " + stuName;
          document.getElementById("songOptionsModal").style.display = "block";
        })

        newItem.innerHTML = data.title;
        document.getElementById('playlist').appendChild(newItem);
      });
  }

}

async function removeSongFromPlaylist() {
  var id = songBeingLookedAt;
  var playlistID = await getCurrentCode();
  
  await fetch(`/removesong?id=${encodeURI(id)}&playlist=${encodeURI(playlistID)}`)
    .then(response => response.json())
    .then(data => {
      console.log("(REQUEST RECEIVED BACK) after sending song to server to be removed from the playlist\nID: " + data.id);
  });
	await showPlaylist();
}

async function removeStudentFromClass() {
	var email = studentBeingLookedAt;
	var playlistID = await getCurrentCode();
	await fetch(`/removestudent?email=${encodeURI(email)}&code=${encodeURI(playlistID)}`)
    .then(response => response.json())
		.then(data => {
			
		});
  await refreshClass();
  console.log("remove success!");
}

async function displaySongInfo(id, stuName){
  console.log("id: " + id + "\nname: " + stuName);
}

document.getElementById("shuffleButton").addEventListener("click", async () => {
  shufflePlaylist();
  if (isShuffled) {
    window.alert("Playlist is shuffling!");
  }
  else {
    window.alert("Playlist is no longer shuffling!");
  }
})


async function loadClassSelection() {
	let newItem = document.createElement('select');
	newItem.name = 'selectClass';
	newItem.id = 'selectClass';
	let email = profile.getEmail();
	for (let i = 1; i <= 8; i++) {
		let code = await getCode(i + email);
		await fetch(`/getcodename?code=${encodeURI(code)}`).
			then(response => response.json())
			.then(data => {
				let newOption = document.createElement('option');
				newOption.innerHTML = data.name;
				newOption.id = 'option' + i;
				newOption.value = i;

				newItem.appendChild(newOption);
			});
	}

	document.getElementById('selectClassLabel').innerHTML = "Select your class: ";
	document.getElementById('selector').appendChild(newItem);

	var classSelector = document.getElementById("selectClass");
	classSelector.addEventListener("change", async () => {
		classNumber = classSelector.value;
		document.getElementById("class-list").innerHTML = "";
		document.getElementById("displayCode").innerHTML = "Your code is: " + await getCurrentCode();
	})
}


document.getElementById("changeClassNameButton").addEventListener("click", async () => {
	let code = await getCurrentCode();
	let newName = document.getElementById("changeClassName").value;

	document.getElementById("option" + classNumber).innerHTML = newName;

	await fetch(`/renamecode?code=${encodeURI(code)}&name=${encodeURI(newName)}`);
})

var isClassEnabled = true;
var classDisabledData = [];
var isSubmitEnabled = true;
var submitDisabledData;

// support method for enabling/disabling, activated upon sign-in
async function xyz () {
	console.log("123");
  // enabling/disabling classes
  // classDisabledData = [await getCurrentCode(), isClassEnabled];
  // await fetch(`/sendclassenabled?classArray=${encodeURI(classDisabledData)}`)
	// 	.then(response => response.json())
	// 	.then(data => {
			
	// 	}); // so it's not linked to pressing the button
  document.getElementById("disableClassButton").innerHTML = "Disable Classroom Code";
  document.getElementById("disableClassDescription").innerHTML = "Your class is currently ENABLED";


	console.log(456);

  // enabling/disabling song submission
  submitDisabledData = isSubmitEnabled;
  await fetch(`/sendsubmitenabled?canSubmit=${encodeURI(submitDisabledData)}`); // so it's not linked to pressing the button
  document.getElementById("disableSubmitButton").innerHTML = "Disable Song Submissions";
  document.getElementById("disableSongDescription").innerHTML = "Your playlist is currently ENABLED";
}

// method for allowing disabling/enabling classes
document.getElementById("disableClassButton").addEventListener("click", async () => {
	let code = await getCurrentCode();

  if (classDisabledData[1] != true && classDisabledData[1] != false) { // if undefined
    classDisabledData[1] = true;
  }
  if (classDisabledData[1] === true) { // if enabled
    classDisabledData[1] = false; // disable
    document.getElementById("disableClassButton").innerHTML = "Enable Classroom Code"; // change button to ask for enable
    document.getElementById("disableClassDescription").innerHTML = "Your class is currently DISABLED"; // change description to disabled
    await fetch(`/sendclassenabled?code=${encodeURI(code)}&canjoin=${encodeURI(false)}`);
  }
  else { // else(if disabled)
    classDisabledData[1] = true; // enable
    document.getElementById("disableClassButton").innerHTML = "Disable Classroom Code"; // change button to ask for disable
    document.getElementById("disableClassDescription").innerHTML = "Your class is currently ENABLED"; // change description to enabled
    await fetch(`/sendclassenabled?code=${encodeURI(code)}&canjoin=${encodeURI(true)}`);
  }
})

// method for allowing disabling/enabling song submissions
document.getElementById("disableSubmitButton").addEventListener("click", async () => {
	let code = await getCurrentCode();
  if (submitDisabledData != true && submitDisabledData != false) { // if undefined
    submitDisabledData = true;
  }
  if (submitDisabledData === true) { // if enabled
    submitDisabledData = false; // disable
    document.getElementById("disableSubmitButton").innerHTML = "Enable Song Submissions"; // change button to ask for enable
    document.getElementById("disableSongDescription").innerHTML = "Your playlist is currently DISABLED"; // change description to disabled
    await fetch(`/sendsubmitenabled?canSubmit=${encodeURI(false)}&code=${encodeURI(code)}`);
  }
  else { // else(if disabled)
    submitDisabledData = true; // enable
    document.getElementById("disableSubmitButton").innerHTML = "Disable Song Submissions"; // change button to ask for disable
    document.getElementById("disableSongDescription").innerHTML = "Your playlist is currently ENABLED"; // change description to enabled
    await fetch(`/sendsubmitenabled?canSubmit=${encodeURI(true)}&code=${encodeURI(code)}`);
  }
})


document.getElementById("refreshClass").addEventListener("click", refreshClass)


async function refreshClass() {
  let classroom = await getClassList(await getCurrentCode());
	console.log(classroom);
  document.getElementById('class-list').innerHTML = "";
  document.getElementById("studentCard").style.display = "inline-block";
  for (let i = 0; i < classroom.length; i++) {
    var newItem1 = document.createElement("BUTTON");
    newItem1.innerHTML = classroom[i];
    console.log(classroom[i]);
    newItem1.classList.add("playlistSongs2");
    //newItem.setAttribute('id', songs[i]);
    
    newItem1.addEventListener("click", async () => {
			studentBeingLookedAt = classroom[i];
			let name = await emailToName(classroom[i]);
      document.getElementById("studentInfoName").innerHTML = "Student Name: " + name;
      document.getElementById("studentEmail").innerHTML = "Student Email: " + classroom[i];
      document.getElementById("studentOptionsModal").style.display = "block";
    })
    document.getElementById('class-list').appendChild(newItem1);
  }
}

async function emailToName(email) {
	let name = await fetch(`/getemailtoname?email=${encodeURI(email)}`)
		.then(response => response.json())
		.then(data => {
			console.log(data.name);
			return data.name;
		});
	return name;
}

let cancelClearButton = document.getElementById("cancelClearButton");
cancelClearButton.addEventListener("click", async () => {
  document.getElementById("confirmClearModal").style.display = "none";
})

document.getElementById("confirmClearButton").addEventListener("click", async () => {
  deletePlaylist(await getCurrentCode());
  document.getElementById("confirmClearModal").style.display = "none";
})

document.getElementById("clearPlaylist").addEventListener("click", async () => {
  document.getElementById("confirmClearModal").style.display = "block";
})