// https://github.com/google/google-api-javascript-client

let submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", async () => {
	let searchTerm = document.getElementById("searchWord").value;
  document.getElementById("termDisplay").innerHTML = "Search Term: " + searchTerm;
	//alert(searchTerm);

  await fetch(`/ytapi?term=${encodeURI(searchTerm)}`)
    .then(res => res.json())
    .then( json => {
      for (var i = 0; i < response.data.items.length; i++) {
      item = response.data.items[i];
			console.log("[%s] Title: %s", item.id.videoId, item.snippet.title);
      }
    });

})

let cancelButton = document.getElementById("cancelButton");

cancelButton.addEventListener("click", async () => {
	document.getElementById("searchWord").value = "";
})