
let submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", async () => {
	let searchTerm = document.getElementById("searchWord").value;
	let code = await getCurrentCode();
  let canSubmit = await fetch(`/getsubmitenabled?code=${encodeURI(code)}`)
		.then(response => response.json())
		.then(data => {
			console.log("Song Submission Enable Data Accessed");
			console.log(data);

			return data.submitDisabledData;
		});
	
	if (canSubmit) {
		await fetch(`/ytapi?term=${encodeURI(searchTerm)}`)
			.then(response => response.json())
			.then(data => {
				console.log(data.videoId1 + "   " + data.videoTitle1);
				showSongChoices(data.videoId1, data.videoId2, data.videoId3,data.videoTitle1, data.videoTitle2, data.videoTitle3);
			});
	}
	else {
		window.alert("Song could not be submitted. Make sure you've joined a classroom. If you have, ask your teacher if submitting a song is currently disabled for this playlist.");
	}
		
});
function showSongChoices(videoId1, videoId2, videoId3, videoTitle1, videoTitle2, videoTitle3) {
  document.getElementById("songChoice1").innerHTML = "Title: " + videoTitle1;
	document.getElementById("songChoice1").setAttribute("videoid", videoId1);
  document.getElementById("songChoice2").innerHTML = "Title: " + videoTitle2;
	document.getElementById("songChoice2").setAttribute("videoid", videoId2);
  document.getElementById("songChoice3").innerHTML = "Title: " + videoTitle3;
	document.getElementById("songChoice3").setAttribute("videoid", videoId3);


  document.getElementById("songChoiceBox1").style.display = "block";
  document.getElementById("songChoiceBox2").style.display = "block";
  document.getElementById("songChoiceBox3").style.display = "block";
}

async function addSongToPlaylist(id, playlistID) {
  await fetch(`/addsong?id=${encodeURI(id)}&playlist=${encodeURI(playlistID)}`)
    .then(response => response.json())
    .then(data => {
      if (data.contains === true) {
        window.alert("Song was already in the playlist and could not be submitted. Please try again with a different song.");
      }
      else {
        console.log("Sent song to server for database logging\nID: " + data.id);
      }
  });
}


let songChoiceBox1 = document.getElementById("songChoiceBox1");
songChoiceBox1.addEventListener("click", async () => {
  verifyModal.style.display = "block";
	id = document.getElementById("songChoice1").getAttribute("videoid");
	// await fetch(`/addtempsong?id=${encodeURI(id)}`)
})

let songChoiceBox2 = document.getElementById("songChoiceBox2");
songChoiceBox2.addEventListener("click", async () => {
  verifyModal.style.display = "block";
	id = document.getElementById("songChoice2").getAttribute("videoid");
	// await fetch(`/addtempsong?id=${encodeURI(id)}`)
})

let songChoiceBox3 = document.getElementById("songChoiceBox3");
songChoiceBox3.addEventListener("click", async () => {
  verifyModal.style.display = "block";
	id = document.getElementById("songChoice3").getAttribute("videoid");
	// await fetch(`/addtempsong?id=${encodeURI(id)}`)
})

let cancelButton = document.getElementById("cancelButton");

cancelButton.addEventListener("click", async () => {
	document.getElementById("searchWord").value = "";

  document.getElementById("songChoiceBox1").style.display = "none";
  document.getElementById("songChoiceBox2").style.display = "none";
  document.getElementById("songChoiceBox3").style.display = "none";


  document.getElementById("songChoice1").innerHTML = "";
  document.getElementById("songChoice2").innerHTML = "";
  document.getElementById("songChoice3").innerHTML = "";


  document.getElementById("songChoiceBox1").style.display = "none";
  document.getElementById("songChoiceBox2").style.display = "none";
  document.getElementById("songChoiceBox3").style.display = "none";

  document.getElementById("verifyModal").style.display = "none";

  document.getElementById("verify").checked = false;

});

/* modal design for the verification box */
let verifyModal = document.getElementById("verifyModal");


var id = null;


let verify = document.getElementById("verify");
let confirmSong = document.getElementById("confirmSong");
let verifyCancelButton = document.getElementById("verifyCancelButton");
verify.addEventListener("click", async () => {
  if (verify.checked) {
    confirmSong.disabled = false;
    document.getElementById("confirmSong").style.borderColor = "#49b8da"; 
  }
  else {
    confirmSong.disabled = true;
    document.getElementById("confirmSong").style.borderColor = "#b3b3b3";
  }
})
window.onclick = function(event) {
  if (event.target == verifyModal) {
    verifyModal.style.display = "none";
  }
}
confirmSong.addEventListener("click", async () => {
	document.getElementById("verifyModal").style.display = "none";
  document.getElementById("songChoiceBox1").style.display = "none";
  document.getElementById("songChoiceBox2").style.display = "none";
  document.getElementById("songChoiceBox3").style.display = "none";
  document.getElementById("searchWord").value = "";
  document.getElementById("verify").checked = false;
  confirmSong.disabled = true;
  document.getElementById("confirmSong").style.borderColor = "#b3b3b3";
  var name = document.getElementById("store_name").innerHTML;
  // console.log(name);
  var songInfo = [id, name];
  addSongToPlaylist(songInfo, await getCurrentCode());
});

verifyCancelButton.addEventListener("click", async () => {
	document.getElementById("verifyModal").style.display = "none";
  document.getElementById("verify").checked = false;
  confirmSong.disabled = true;
  document.getElementById("confirmSong").style.borderColor = "#b3b3b3";
});

/*
async function emailToName(email) {
	let name = await fetch(`/getemailtoname?email=${encodeURI(email)}`)
		.then(response => response.json())
		.then(data => {
			console.log(data.name);
			return data.name;
		});
	return name;
}*/