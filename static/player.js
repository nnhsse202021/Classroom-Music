
// This file stores code needed to make the youtube player work (to play our videos)


document.getElementById("loadButton").addEventListener("click", async () => {
	if (player) {
		var id;
		await fetch(`/loadnextsong`)
			.then(response => response.json())
			.then(data => {
				id = data.id
    })
		player.loadVideoById(id);
	}
})
document.getElementById("playButton").addEventListener("click", () => {
	player.playVideo();
})
document.getElementById("pauseButton").addEventListener("click", () => {
	player.pauseVideo();
})

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
// player.loadVideoById("ma67yOdMQfs", 0);
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '0',
		width: '0',
		videoId: '',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
		// setTimeout(stopVideo, 6000);
		done = true;
	}
}