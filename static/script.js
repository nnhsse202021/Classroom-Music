// https://github.com/google/google-api-javascript-client

let submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", async () => {
	let searchTerm = document.getElementById("searchWord").value;
  document.getElementById("termDisplay").innerHTML = "Search Term: " + searchTerm;
	//alert(searchTerm);

  await fetch(`/ytapi?term=${encodeURI(searchTerm)}`)
    .then(response => response.json())
    .then(data => {
      console.log(data.videoId1 + "   " + data.videoTitle1);
      showSongChoices(data.videoId1, data.videoId2, data.videoId3, data.videoTitle1, data.videoTitle2, data.videoTitle3);
    })
});

function showSongChoices(videoId1, videoId2, videoId3, videoTitle1, videoTitle2, videoTitle3) {
  document.getElementById("songChoice1").innerHTML = "Title: " + videoTitle1;
  document.getElementById("songChoice2").innerHTML = "Title: " + videoTitle2;
  document.getElementById("songChoice3").innerHTML = "Title: " + videoTitle3;


  document.getElementById("songChoiceBox1").style.display = "block";
  document.getElementById("songChoiceBox2").style.display = "block";
  document.getElementById("songChoiceBox3").style.display = "block";
}

async function sendSongToDatabase(id, playlistID){

  await fetch(`/addsong?id=${encodeURI(id)}&playlist=${encodeURI(playlistID)}`)
    .then(response => response.json())
    .then(data => {
      console.log("Sent song to server for database logging\nID: " + data.id);
    })
}

async function getPlaylistFromDatabase(playlistID){

  await fetch(`/getplaylist?}&playlistid=${encodeURI(playlistID)}`)
    .then(response => response.json())
    .then(data => {
      console.log(data.playlist);
    })
}

let cancelButton = document.getElementById("cancelButton");

cancelButton.addEventListener("click", async () => {
	document.getElementById("searchWord").value = "";

  document.getElementById("songChoiceBox1").style.display = "none";
  document.getElementById("songChoiceBox2").style.display = "none";
  document.getElementById("songChoiceBox3").style.display = "none";

  document.getElementById("termDisplay").innerHTML = "";

  document.getElementById("songChoice1").innerHTML = "";
  document.getElementById("songChoice2").innerHTML = "";
  document.getElementById("songChoice3").innerHTML = "";


  document.getElementById("songChoiceBox1").style.display = "none";
  document.getElementById("songChoiceBox2").style.display = "none";
  document.getElementById("songChoiceBox3").style.display = "none";

  document.getElementById("verifyModal").style.display = "none";
  document.getElementById("searchModal").style.display = "none";

});

/* modal design for the search box */
let searchModalButton = document.getElementById("searchModalButton");

searchModalButton.addEventListener("click", async () => {
	document.getElementById("searchModal").style.display = "block";
})

/* modal design for the verification box */
let optionButton1 = document.getElementById("optionButton1");
let optionButton2 = document.getElementById("optionButton2");
let optionButton3 = document.getElementById("optionButton3");

optionButton1.addEventListener("click", async () => {
	document.getElementById("verifyModal").style.display = "block";
})
optionButton2.addEventListener("click", async () => {
	document.getElementById("verifyModal").style.display = "block";
})
optionButton3.addEventListener("click", async () => {
	document.getElementById("verifyModal").style.display = "block";
})

let verify = document.getElementById("verify");
let confirmSong = document.getElementById("confirmSong");
let verifyCancelButton = document.getElementById("verifyCancelButton");
verify.addEventListener("click", async () => {
  if (verify.checked) {
    confirmSong.disabled = false;
  }
  else {
    confirmSong.disabled = true;
  }
})
confirmSong.addEventListener("click", async () => {
	document.getElementById("verifyModal").style.display = "none";
  document.getElementById("songChoiceBox1").style.display = "none";
  document.getElementById("songChoiceBox2").style.display = "none";
  document.getElementById("songChoiceBox3").style.display = "none";
  document.getElementById("searchModal").style.display = "none";
})
verifyCancelButton.addEventListener("click", async () => {
	document.getElementById("verifyModal").style.display = "none";
})