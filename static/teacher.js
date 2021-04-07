
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
    var playlist = await getPlaylist(await getCurrentCode());
    player.loadVideoById(playlist.split(",")[currentSongIndex]);
    currentSongIndex += 2;
    
    // update the play button
    isPlaying = true;
    document.getElementById("playButtonText").innerHTML = "Pause";
  }
});


document.getElementById("playButton").addEventListener("click", () => {
  player.playVideo();
});




document.getElementById("showPlaylist").addEventListener("click", async () => {
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
  deletePlaylist("tea");
  window.alert("Playlist has been cleared!");
})
document.getElementById("generateCode").addEventListener("click", async () => {
  var email = profile.getEmail();
  document.getElementById("displayCode").innerHTML = "Your code is: " + await getCurrentCode();
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
