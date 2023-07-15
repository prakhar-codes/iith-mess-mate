// Initialize Firebase
var firebaseConfig = {
	apiKey: "AIzaSyDXsKEjlm2_ZQ5tVqO6URoM3Gu5JXEW7PQ",
	authDomain: "iithmessmate.firebaseapp.com",
	projectId: "iithmessmate",
	storageBucket: "iithmessmate.appspot.com",
	messagingSenderId: "296422995335",
	appId: "1:296422995335:web:c00a6522130cca90614f22",
	measurementId: "G-ZV5JSK10JE"
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
var analytics = firebase.analytics();
var database = firebase.database();
var storage = firebase.storage();
var auth = firebase.auth();

// Use Firebase services here
var ui = new firebaseui.auth.AuthUI(firebase.auth());


// Configure Firebase Auth UI
var uiConfig = {
	signInOptions: [
		firebase.auth.EmailAuthProvider.PROVIDER_ID,
		firebase.auth.GoogleAuthProvider.PROVIDER_ID
	],
	signInSuccessUrl: "dashboard.html", // Provide the URL to redirect after successful sign-in
	callbacks: {
		signInSuccessWithAuthResult: function(authResult, redirectUrl) {
			// Successful sign-in
			var user = authResult.user;
			console.log("User signed in:", user);
			return true; // Return true to redirect to the signInSuccessUrl
		}
	}
};

// Start Firebase Auth UI
ui.start("#firebaseui-auth-container", uiConfig);

// Get user details on success page
function getUserDetails() {
	var user = firebase.auth().currentUser;

	if (user) {
		// User is signed in
		var displayName = user.displayName;
		var email = user.email;
		var uid = user.uid;

		console.log("User details:", displayName, email, uid);
		// Redirect to dashboard.html
		window.location.href = "dashboard.html";
	} else {
		// No user is signed in
		console.log("No user is signed in");
	}
}

// Call getUserDetails on success page load
window.addEventListener("load", function() {
	getUserDetails();
});