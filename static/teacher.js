
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


var currentSongIndex = 0;
document.getElementById("loadButton").addEventListener("click", async () => {
	if (player) {
		var playlist = await getPlaylist("tea");
		player.loadVideoById(playlist.split(",")[currentSongIndex]);
		currentSongIndex+=2;
	}
});


document.getElementById("playButton").addEventListener("click", () => {
	player.playVideo();
});


document.getElementById("pauseButton").addEventListener("click", () => {
	player.pauseVideo();
});


document.getElementById("showPlaylist").addEventListener("click", async () => {
	document.getElementById("playlist").innerHTML = '';
	var playlist = await getPlaylist("tea");
	if(playlist === null) {
		return;
	}
	var songs = playlist.split(',');
	console.log(songs);
  // song id
	for(i = 0; i < songs.length; i+=2) {
    var stuName = songs[i+1];
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
