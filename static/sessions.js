
function setLogin() {
	fetch(`/checksession?mode=${encodeURI("login")}`)
		.then(console.log('Session marked as logged in.'));
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

			if (data.loggedIn === false) {
				window.location.href = window.location.origin + "/static/index.html";
			}

		});
}
