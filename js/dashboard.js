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

// Wait for user authentication state change
auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      var displayName = user.displayName;
      var email = user.email;
      var uid = user.uid;

      document.getElementById('name').innerHTML=displayName;
      document.getElementById('email').innerHTML=email; 
      document.getElementById('welcome').innerHTML='Welcome ' + displayName + ', Your email id is '+user.email;
      console.log("User details on dashboard:", displayName, email, uid);
      var userData = {
        email: email,
        displayName: displayName
      };
      database.ref('users/' + uid).set(userData)
        .then(function() {
          console.log("User data written to database");
        })
        .catch(function(error) {
          console.log("Error writing user data to database:", error);
        });

    } else {
      // No user is signed in
      console.log("No user is signed in on dashboard");
    }
  });

// Log out the user
function logout() {
    firebase.auth().signOut()
      .then(function() {
        // Sign-out successful
        console.log("User signed out");
        // Redirect to the sign-in page or another page as needed
        window.location.href = "index.html";
      })
      .catch(function(error) {
        // An error occurred
        console.log("Sign-out error:", error);
      });
  }
  
  function myFunction() {
    var x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}
