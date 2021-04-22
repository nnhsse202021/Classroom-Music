
// function setLogin() {
//   fetch(`/checksession?mode=${encodeURI("login")}`)
//     .then(console.log('Session marked as logged in.'));
// }

function setLogin(url) {
  fetch(`/checksession?mode=${encodeURI("login")}&url=${encodeURI(url)}`)
    .then(console.log('Session marked as logged in at' + url));
}

function setLogout() {
  fetch(`/checksession?mode=${encodeURI("logout")}`)
    .then(console.log('Session marked as logged out.'));
}

function checkLoginStatus() {
  fetch(`/checksession?mode=${encodeURI("check")}`)
    .then(response => response.json())
    .then(data => {
      console.log(data.loggedIn);
      if (data.loggedIn === undefined) {
				console.log("thonk");
        window.location.href = window.location.origin + "/static/index.html";
			} else if (data.loggedIn != window.location.href) {
				console.log(window.location.href);
				window.location.href = data.loggedIn;
			}
    });
}