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
// Usage example
const currentDate = new Date(); // You can pass any desired date to the function
const result = getDayAndWeekNumber(currentDate);


// Wait for user authentication state change
auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      var displayName = user.displayName;
      var email = user.email;
      var uid = user.uid;

      document.getElementById('name').innerHTML=displayName;
      document.getElementById('email').innerHTML=email; 
      document.getElementById('welcome').innerHTML+=displayName.split(" ")[0]+',';

      console.log(result.day);  // Day number in the month
      console.log(result.week); // Week number (1 to 4) in the month
      document.getElementById('day').innerHTML = 'Today is ' + result.day + ' and here is your mess menu for today :)'
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
    // Reference to the "menu" node in the database
  const menuRef = firebase.database().ref('menu');
    // Read all food items
  menuRef.once('value', (snapshot) => {
    const menuData = snapshot.val();
  
    // Iterate over each day
    Object.keys(menuData).forEach((meal) => {
      console.log(meal);
      const weekData = menuData[meal];
      document.getElementById(meal).innerHTML+='<p class="menu-subcat">Regular :</p>';
      if(result.week % 2 == 1 && weekData['Week13']!=null) {
        var dayData = weekData['Week13'];
        Object.keys(dayData).forEach((weekday) => {
          if(weekday===result.day) {
          Object.keys(dayData[weekday]).forEach((foodItem) => {
            console.log(foodItem);
            document.getElementById(meal).innerHTML+='<p>'+foodItem+'</p>';
          });
        }
        });
      }

      if(result.week % 2 == 0 && weekData['Week24']!=null) {
        var dayData = weekData['Week24'];
        Object.keys(dayData).forEach((weekday) => {
          if(weekday===result.day) {
          Object.keys(dayData[weekday]).forEach((foodItem) => {
            console.log(foodItem);
            document.getElementById(meal).innerHTML+='<p>'+foodItem+'</p>';
          });
        }
        });
      }
        var dayData = weekData['Daily'];
        Object.keys(dayData).forEach((foodItem) => {
          console.log(foodItem);
          document.getElementById(meal).innerHTML+='<p>'+foodItem+'</p>';
        });
      if(weekData['Extras']!=null) {
        var dayData = weekData['Extras'];
        if(!(result.day=='Sunday' && meal=='Dinner'))
          document.getElementById(meal).innerHTML+='<p class="menu-subcat">Extras :</p>';
        Object.keys(dayData).forEach((weekday) => {
          if(weekday===result.day) {
          Object.keys(dayData[weekday]).forEach((foodItem) => {
            console.log(foodItem);
            document.getElementById(meal).innerHTML+='<p>'+foodItem+'</p>';
          });
        }
        });
      }
/*
      Object.keys(weekData).forEach((week) => {
        const dayData = weekData[week];

        // Display food items for Week 13 on odd week numbers
        if (week === 'Week13' && result.week % 2 === 1) {
          Object.keys(dayData).forEach((weekday) => {
            if(weekday===result.day) {
            Object.keys(dayData[weekday]).forEach((foodItem) => {
              console.log(foodItem);
              document.getElementById(meal).innerHTML+='<p>'+foodItem+'</p>';
            });
          }
          });
        }
        // Display food items for Week 24 on even week numbers
        if (week === 'Week24' && result.week % 2 === 0) {
          console.log('Week 24 Food Items:');
          Object.keys(dayData).forEach((weekday) => {
            if(weekday===result.day) {
            Object.keys(dayData[weekday]).forEach((foodItem) => {
              console.log(foodItem);
              document.getElementById(meal).innerHTML+='<p>'+foodItem+'</p>';
            });
          }
          });
        }

        if (week === 'Daily') {
          Object.keys(dayData).forEach((foodItem) => {
            console.log(foodItem);
            document.getElementById(meal).innerHTML+='<p>'+foodItem+'</p>';
          });
        }

        if (week === 'Extras') {
          Object.keys(dayData).forEach((weekday) => {
            if(weekday===result.day) {
            Object.keys(dayData[weekday]).forEach((foodItem) => {
              console.log(foodItem);
              document.getElementById(meal).innerHTML+='<p>'+foodItem+'</p>';
            });
          }
          });
      }

      });
*/
    });
  });
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

function getDayAndWeekNumber(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const dayNumber = date.getDate();

  const weekNumber = Math.ceil((dayNumber + dayOfWeek) / 7);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[(dayOfWeek + dayNumber - 1) % 7];

  return {
    day: dayName,
    week: weekNumber
  };
}

// Get the button elements and the menu divs
const buttons = document.querySelectorAll('.bar-button');
const menuDivs = document.querySelectorAll('.menu-list > div');

// Function to show/hide the menu divs
function toggleMenuDivs(divId) {
  menuDivs.forEach((div) => {
    if (div.id === divId) {
      div.style.display = 'block'; // Show the selected div
    } else {
      div.style.display = 'none'; // Hide the other divs
    }
  });
}

window.addEventListener('load', function() {
  // Initially show the Breakfast div
  toggleMenuDivs('Breakfast');
  buttons[0].focus();
});

// Attach click event listeners to the buttons
buttons.forEach((button) => {
  button.addEventListener('click', function() {
    // Get the id of the corresponding menu div
    const divId = this.textContent;

    // Toggle the visibility of the menu divs
    toggleMenuDivs(divId);
  });
});