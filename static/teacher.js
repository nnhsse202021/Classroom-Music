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
	console.log(playlist);
	console.log(playlist.length);
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

// returns the current class code for the teacher
async function getCurrentCode() {
  var email = profile.getEmail();
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
  await fetch(`/getclass?code=${encodeURI(code)}`)
    .then(response => response.json())
    .then(data => {
      classroom = data.classroom;
    })
  return classroom;
}

var currentSongIndex = 0;
document.getElementById("loadButton").addEventListener("click", async () => {
  if (player) {
    if (isShuffled) {
      var playlist = await getPlaylist(await getCurrentCode());
      player.loadVideoById(playlist.split(",")[(order[currentSongIndex] * 2)]); // * 2 since playlist is song and student name
      currentSongIndex += 1;
      if (currentSongIndex > (playlist.length/2)) {
        currentSongIndex = 0;
      }
    }
    else {
      var playlist = await getPlaylist(await getCurrentCode());
      player.loadVideoById(playlist.split(",")[currentSongIndex]);
      currentSongIndex += 2;
      if (currentSongIndex > playlist.length) {
        currentSongIndex = 0;
      }
    }
    // update the play button
    isPlaying = true;
    document.getElementById("playButtonText").innerHTML = "Pause";
  }
});


var isPlaying = false;
document.getElementById("playButton").addEventListener("click", () => {
  if (isPlaying == true) { // Execute this if a video is currently playing
    player.pauseVideo();
    document.getElementById("playButtonText").innerHTML = "Play";
  } else { // Execute this if a video is currently paused
    player.playVideo();
    document.getElementById("playButtonText").innerHTML = "Pause";
  }

  isPlaying = !isPlaying;
});


document.getElementById("showPlaylist").addEventListener("click", async () => {
  document.getElementById("playlistCard").style.display = "block";
  document.getElementById("playlist").innerHTML = '';
  var playlist = await getPlaylist(await getCurrentCode());
  if (playlist === null) {
    return;
  }
  var songs = playlist.split(',');
  console.log(songs);
  // song id
  for (i = 0; i < songs.length; i += 2) {
    var stuName = songs[i + 1];
    await fetch(`/videoidtotitle?id=${encodeURI(songs[i])}`)
      .then(response => response.json())
      .then(data => {
        var newItem = document.createElement('li');
        newItem.innerHTML = data.title;
        document.getElementById('playlist').appendChild(newItem).append(" ----------- Submitted by: " + stuName);
      });
  }
});


document.getElementById("clearPlaylist").addEventListener("click", async () => {
  deletePlaylist(await getCurrentCode());
  window.alert("Playlist has been cleared!");
})

document.getElementById("shuffleButton").addEventListener("click", async () => {
  currentSongPlaylist = 0; // doesn't save between
  shufflePlaylist();
  if (isShuffled){
    window.alert("Playlist is shuffling!");
  }
  else {
    window.alert("Playlist is no longer shuffling!")
  }
})


// document.getElementById("generateCode").addEventListener("click", async () => {
//   var email = profile.getEmail();
//   document.getElementById("displayCode").innerHTML = "Your code is: " + await getCurrentCode();
// })

var isClassEnabled = true;
var classDisabledData = [];
var isSubmitEnabled = true;
var submitDisabledData;

// support method for enabling/disabling, activated upon sign-in
async function xyz () {
  // enabling/disabling classes
  classDisabledData = [await getCurrentCode(), isClassEnabled];
  await fetch(`/sendclassenabled?classArray=${encodeURI(classDisabledData)}`); // so it's not linked to pressing the button
  document.getElementById("disableClassButtonText").innerHTML = "Disable Classroom Code";
  document.getElementById("disableClassDescription").innerHTML = "Your class is currently ENABLED";

  // enabling/disabling song submission
  submitDisabledData = isSubmitEnabled;
  await fetch(`/sendsubmitenabled?canSubmit=${encodeURI(submitDisabledData)}`); // so it's not linked to pressing the button
  document.getElementById("disableSubmitButtonText").innerHTML = "Disable Song Submissions";
  document.getElementById("disableSongDescription").innerHTML = "Your playlist is currently ENABLED";
}

// method for allowing disabling/enabling classes
document.getElementById("disableClassButton").addEventListener("click", async () => {
  if (classDisabledData[1] != true && classDisabledData[1] != false) { // if undefined
    classDisabledData[1] = true;
  }
  if (classDisabledData[1] === true) { // if enabled
    classDisabledData[1] = false; // disable
    document.getElementById("disableClassButtonText").innerHTML = "Enable Classroom Code"; // change button to ask for enable
    document.getElementById("disableClassDescription").innerHTML = "Your class is currently DISABLED"; // change description to disabled
    await fetch(`/sendclassenabled?classArray=${encodeURI(classDisabledData)}`);
  }
  else { // else(if disabled)
    classDisabledData[1] = true; // enable
    document.getElementById("disableClassButtonText").innerHTML = "Disable Classroom Code"; // change button to ask for disable
    document.getElementById("disableClassDescription").innerHTML = "Your class is currently ENABLED"; // change description to enabled
    await fetch(`/sendclassenabled?classArray=${encodeURI(classDisabledData)}`);
  }
})

// method for allowing disabling/enabling song submissions
document.getElementById("disableSubmitButton").addEventListener("click", async () => {
  if (submitDisabledData != true && submitDisabledData != false) { // if undefined
    submitDisabledData = true;
  }
  if (submitDisabledData === true) { // if enabled
    submitDisabledData = false; // disable
    document.getElementById("disableSubmitButtonText").innerHTML = "Enable Song Submissions"; // change button to ask for enable
    document.getElementById("disableSongDescription").innerHTML = "Your playlist is currently DISABLED"; // change description to disabled
    await fetch(`/sendsubmitenabled?canSubmit=${encodeURI(submitDisabledData)}`);
  }
  else { // else(if disabled)
    submitDisabledData = true; // enable
    document.getElementById("disableSubmitButtonText").innerHTML = "Disable Song Submissions"; // change button to ask for disable
    document.getElementById("disableSongDescription").innerHTML = "Your playlist is currently ENABLED"; // change description to enabled
    await fetch(`/sendsubmitenabled?canSubmit=${encodeURI(submitDisabledData)}`);
  }
})

document.getElementById("refreshClass").addEventListener("click", async () => {
  let classroom = await getClassList(await getCurrentCode());
  document.getElementById('class-list').innerHTML = "";

  for (let i = 0; i < classroom.length; i++) {
    let newItem = document.createElement('li');
    newItem.innerHTML = classroom[i];
    document.getElementById('class-list').appendChild(newItem);
  }
})