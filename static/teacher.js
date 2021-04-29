/* The playlist variable we have as of now works a bit strangely -- every even index is the song, and every odd index is the name of the student who submitted it. */

var songBeingLookedAt;
var songPlaylistBeingLookedAt;

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
  console.log("bruhas");
  removeSongFromPlaylist();
})

document.getElementById("showPlaylist").addEventListener("click", async () => {
  document.getElementById("playlistCard").style.display = "inline-block";
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
        /*
        var rmvbtn = document.createElement("BUTTON");
        rmvbtn.innerHTML = "CLICK ME";
        document.getElementById("playlist").appendChild(rmvbtn);
        */
        var newItem = document.createElement("BUTTON");
        newItem.setAttribute('id', songs[i]);
        newItem.classList.add("playlistSongs");

        newItem.addEventListener("click", async () => {
          displaySongInfo(data.title, stuName);
          console.log("Sent ID and Student Name to MODAL");

          songBeingLookedAt = songs[i];
          songPlaylistBeingLookedAt = playlist;
          
          document.getElementById("songInfoName").innerHTML = "Song Name: " + data.title;
          document.getElementById("submittedBy").innerHTML = "Submitted By: " + stuName;
          document.getElementById("songOptionsModal").style.display = "block";

        })


        newItem.innerHTML = data.title;
        document.getElementById('playlist').appendChild(newItem);
      });
  }

});

async function removeSongFromPlaylist(id, playlistID) {
  var id = songBeingLookedAt;
  var playlistID = songPlaylistBeingLookedAt;
  
  await fetch(`/removesong?id=${encodeURI(id)}&playlist=${encodeURI(playlistID)}`)
    .then(response => response.json())
    .then(data => {
      console.log("(REQUEST RECEIVED BACK) after sending song to server to be removed from the playlist\nID: " + data.id);
  });
}

async function displaySongInfo(id, stuName){
  console.log("id: " + id + "\nname: " + stuName);
}

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

document.getElementById("refreshClass").addEventListener("click", async () => {
  let classroom = await getClassList(await getCurrentCode());
  document.getElementById('class-list').innerHTML = "";
  document.getElementById("studentCard").style.display = "inline-block";
  for (let i = 0; i < classroom.length; i++) {
    var newItem1 = document.createElement("BUTTON");
    newItem1.innerHTML = classroom[i];
    console.log(classroom[i]);
    newItem1.classList.add("playlistSongs");
    //newItem.setAttribute('id', songs[i]);
    
    newItem1.addEventListener("click", async () => {
      document.getElementById("studentInfoName").innerHTML = "Student Name: " + classroom[i];
      document.getElementById("studentOptionsModal").style.display = "block";
    })
    document.getElementById('class-list').appendChild(newItem1);
  }
})