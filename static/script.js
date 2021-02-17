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


})

function showSongChoices(videoId1, videoId2, videoId3, videoTitle1, videoTitle2, videoTitle3) {
  document.getElementById("songChoice1").innerHTML = "Title: " + videoTitle1;
  document.getElementById("songChoice2").innerHTML = "Title: " + videoTitle2;
  document.getElementById("songChoice3").innerHTML = "Title: " + videoTitle3;


  document.getElementById("songChoiceBox1").style.display = "block";
  document.getElementById("songChoiceBox2").style.display = "block";
  document.getElementById("songChoiceBox3").style.display = "block";
}

let cancelButton = document.getElementById("cancelButton");

cancelButton.addEventListener("click", async () => {
	document.getElementById("searchWord").value = "";
})

let modalButton = document.getElementById("modalButton");

modalButton.addEventListener("click", async () => {
	document.getElementById("testModal").style.display = "block";
})




/* GOOGLE AUTHENTICATION */



//load up that authy boi
gapi.load("auth2", () => {
    gapi.auth2.init();
})
function googleLogin() {
    var googleUser = await gapi.auth2.getAuthInstance().signIn(); // <- this one gonna open the google window
    let res = await fetch("whatever route to ur auth stuff", {
        method: "POST",
        body: JSON.stringify({
            token: googleUser.getAuthResponse().id_token
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}