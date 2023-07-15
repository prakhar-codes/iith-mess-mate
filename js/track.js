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

var auth = firebase.auth();
var displayName='', email='', uid='';

// Wait for user authentication state change
auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      displayName = user.displayName;
      email = user.email;
      uid = user.uid;
    
      document.getElementById('name').innerHTML=displayName;
      document.getElementById('email').innerHTML=email;
      
const dbRef = firebase.database().ref('users/' + uid + '/TotalCounts/' + new Date().toDateString());

dbRef.on('value', (snapshot) => {
const counters = document.querySelectorAll('.count');
const speed = {
    'Calories':50,
              'Protein':1,
              'Carbohydrates':1,
              'Fats':1
};
var targets=snapshot.val();
counters.forEach((counter) => {
  const updateCount = () => {
    const target = parseInt(targets[counter.id]);
    const count = parseInt(counter.innerText);
    const increment = Math.trunc(target / speed[counter.id]);

    if (count < target) {
      counter.innerText = count + increment;
      setTimeout(updateCount, 10);
    } else {
      counter.innerText = target;
    }
  };
  updateCount();
});
});

const trackRef = firebase.database().ref('users/' + uid + '/tracking/' + new Date().toDateString());
trackRef.once('value', (snapshot) => {
    var trackData = snapshot.val();
              meals=['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
             // Object.keys(trackData).forEach((meal) => {
              meals.forEach((meal) => {
                if(trackData[meal]!=null) {
                Object.keys(trackData[meal]).forEach((foodItem)=> {
                  const foodObject = trackData[meal][foodItem];
                  addToList(meal, foodItem, foodObject);
                });
                } else {
                    addToList(meal, 'Nothing to show', null);
                }
              });
});

}
});

// Get the button elements and the menu divs
const buttons = document.querySelectorAll('.bar-button');
const menuDivs = document.querySelectorAll('.menu-list > div');

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

var itemCount=0;
function addToList(meal, foodItem, foodObject) {

    itemCount++;
    let newItem = document.createElement('div');
    newItem.setAttribute('id', meal+foodItem);
    if(foodObject!=null) {
    newItem.innerHTML = 
    '<div class = "food-item" data-name="'+foodItem+'" data-calories="'+foodObject.Calories+'" data-protein="'+foodObject.Protein+'" data-carbohydrates="'+foodObject.Carbohydrates+'" data-fats="'+foodObject.Fats+'">'+
      '<p>' + foodItem + '</p>' +
      '<div class="nutri-info" style="display: block;">'+
      '<p>Calories: <span class="calories">' + foodObject.Calories + '</span></p>' +
      '<p>Protein: <span class="protein">' + foodObject.Protein + '</span></p>' +
      '<p>Carbohydrates: <span class="carbohydrates">' + foodObject.Carbohydrates + '</span></p>' +
      '<p>Fats: <span class="fats">' + foodObject.Fats + '</span></p>' +
        '<div class="track-button">'+
          '<button class="button-5 delete" role="button"><i class="fa fa-trash" aria-hidden="true"></i></button>'+
        '</div>'
      '</div>'+
    '</div>';
    } else {
        newItem.innerHTML = 
        '<div class = "food-item">'+
            '<p>' + foodItem + '</p>' + 
        '</div>';
    }
    let mealElement = document.getElementById(meal);
    mealElement.appendChild(newItem);
  }

document.addEventListener('click', function(event) {
  const deleteButton = event.target.closest('.delete');
  if (deleteButton) {
    // Delete button is clicked
    const meal = deleteButton.closest('.meal').id;
    const foodItemElement = deleteButton.closest('.food-item');
    const foodItem = foodItemElement.dataset.name;

    firebase.database()
      .ref('users/' + uid + '/tracking/' + new Date().toDateString() + '/' + meal + '/' + foodItem)
      .remove()
      .then(() => {
        showCustomAlert('Deleted '+foodItem);
        document.getElementById(meal+foodItem).style.display='none';
        updateTotalCounts();
      })
      .catch((error) => {
        showCustomAlert('Error Deleting '+foodItem);
      });
  }
});

function showCustomAlert(message) {
    var alertBox = document.getElementById('custom-alert');
    alertBox.innerHTML = '<p>' + message + '</p>';
    alertBox.style.display = 'block';
  
    setTimeout(function() {
      alertBox.style.display = 'none';
    }, 2000);
  }

  function updateTotalCounts () {
    const dbRef = firebase.database().ref('users/' + uid + '/TotalCounts/' + new Date().toDateString());
  
              const initialValues = {
                'Calories':0,
                'Protein':0,
                'Carbohydrates':0,
                'Fats':0
              };
          
              dbRef.set(initialValues).then(() => {
                firebase.database().ref('users/' + uid + '/tracking/' + new Date().toDateString()).once('value', (snapshot) => {
                var trackData = snapshot.val();
                var totalCalories=0, totalCarbohydrates=0, totalFats=0, totalProtein=0;
                Object.keys(trackData).forEach((meal) => {
                  Object.keys(trackData[meal]).forEach((foodItem)=> {
                    const foodObject = trackData[meal][foodItem];
                    totalCalories = totalCalories+foodObject.Calories;
                    totalProtein = totalProtein+foodObject.Protein;
                    totalFats = totalFats+foodObject.Fats;
                    totalCarbohydrates = totalCarbohydrates+foodObject.Carbohydrates;
                  });
                });
                const newValues = {
                  'Calories' : totalCalories,
                  'Protein' : totalProtein,
                  'Fats' : totalFats,
                  'Carbohydrates' : totalCarbohydrates
                }
                dbRef.set(newValues);
              });
            });
  }

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