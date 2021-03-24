

var studentCode = ""

document.getElementById("submitCode").addEventListener("click", () => {
  studentCode = document.getElementById("codeEntry").value;
  getCurrentCode();
})


function getCurrentCode() {
  if (window.location.pathname.includes("teacher")) {
    var email = profile.getEmail();
    fetch(`/generatecode?email=${encodeURI(email)}`)
      .then(response => response.json())
      .then(data => {
        return data.code;
      });
  } else {
    console.log(studentCode);
    document.getElementById("displayCode").innerHTML = "Your code is: " + studentCode;
    return studentCode;
  }
}



let submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", async () => {
	let searchTerm = document.getElementById("searchWord").value;
  document.getElementById("termDisplay").innerHTML = "Search Term: " + searchTerm;

  await fetch(`/ytapi?term=${encodeURI(searchTerm)}`)
		.then(console.log(response))
    .then(response => response.json())
    .then(data => {
      console.log(data.videoId1 + "   " + data.videoTitle1);
      showSongChoices(data.videoId1, data.videoId2, data.videoId3,data.videoTitle1, data.videoTitle2, data.videoTitle3);
    });
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
      console.log("Sent song to server for database logging\nID: " + data.id);
  });
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

  document.getElementById("verify").checked = false;

  document.getElementById("searchModalButton").style.display = "block";

});

/* button for displaying the search box */
let searchModalButton = document.getElementById("searchModalButton");

searchModalButton.addEventListener("click", async () => {
	document.getElementById("searchModal").style.display = "block";
  document.getElementById("searchModalButton").style.display = "none";
});

/* modal design for the verification box */
let verifyModal = document.getElementById("verifyModal");
let optionButton1 = document.getElementById("optionButton1");
let optionButton2 = document.getElementById("optionButton2");
let optionButton3 = document.getElementById("optionButton3");

var id = null;

optionButton1.addEventListener("click", async () => {
	verifyModal.style.display = "block";
	id = document.getElementById("songChoice1").getAttribute("videoid");
	// await fetch(`/addtempsong?id=${encodeURI(id)}`)
});
optionButton2.addEventListener("click", async () => {
	verifyModal.style.display = "block";
  id = document.getElementById("songChoice2").getAttribute("videoid");
});
optionButton3.addEventListener("click", async () => {
	verifyModal.style.display = "block";
  id = document.getElementById("songChoice3").getAttribute("videoid");
});

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
  document.getElementById("searchModal").style.display = "none";
  document.getElementById("termDisplay").innerHTML = "";
  document.getElementById("searchWord").value = "";
  document.getElementById("verify").checked = false;
  addSongToPlaylist(id, "tea");
  document.getElementById("searchModalButton").style.display = "block";
});

verifyCancelButton.addEventListener("click", async () => {
	document.getElementById("verifyModal").style.display = "none";
  document.getElementById("termDisplay").innerHTML = "";
  document.getElementById("verify").checked = false;
});