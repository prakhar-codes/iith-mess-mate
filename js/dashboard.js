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

const currentDate = new Date(); // You can pass any desired date to the function
const result = getDayAndWeekNumber(currentDate);
var displayName = '',
	email = '',
	uid = '';

// Wait for user authentication state change
auth.onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in
		displayName = user.displayName;
		email = user.email;
		uid = user.uid;

		document.getElementById('name').innerHTML = displayName;
		document.getElementById('email').innerHTML = email;

		database.ref('users/' + uid + '/TotalCounts/' + new Date().toDateString()).on('value', (snapshot) => {
			var totalCounts = snapshot.val();
			document.getElementById('calories').innerHTML = "Calories : " + totalCounts.Calories;
			document.getElementById('protein').innerHTML = "Protein : " + totalCounts.Protein;
			document.getElementById('fats').innerHTML = "Fats : " + totalCounts.Fats;
			document.getElementById('carbohydrates').innerHTML = "Carbohydrates : " + totalCounts.Carbohydrates;
		});

		document.getElementById('welcome').innerHTML += displayName.split(" ")[0] + ',';

		console.log(result.day); // Day number in the month
		console.log(result.week); // Week number (1 to 4) in the month
		document.getElementById('day').innerHTML = 'Today is ' + result.day + ' and here is your mess menu for today :)'

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
			const weekData = menuData[meal];
			document.getElementById(meal).innerHTML += '<p class="menu-subcat">Regular :</p>';
			if (result.week % 2 == 1 && weekData['Week13'] != null) {
				var dayData = weekData['Week13'];
				Object.keys(dayData).forEach((weekday) => {
					if (weekday === result.day) {
						Object.keys(dayData[weekday]).forEach((foodItem) => {
							addToList(meal, foodItem, dayData[weekday][foodItem]);
						});
					}
				});
			}

			if (result.week % 2 == 0 && weekData['Week24'] != null) {
				var dayData = weekData['Week24'];
				Object.keys(dayData).forEach((weekday) => {
					if (weekday === result.day) {
						Object.keys(dayData[weekday]).forEach((foodItem) => {
							addToList(meal, foodItem, dayData[weekday][foodItem]);
						});
					}
				});
			}
			var dayData = weekData['Daily'];
			Object.keys(dayData).forEach((foodItem) => {
				addToList(meal, foodItem, dayData[foodItem]);
			});
			if (weekData['Extras'] != null) {
				var dayData = weekData['Extras'];
				if (!(result.day == 'Sunday' && meal == 'Dinner'))
					document.getElementById(meal).innerHTML += '<p class="menu-subcat">Extras :</p>';
				Object.keys(dayData).forEach((weekday) => {
					if (weekday === result.day) {
						Object.keys(dayData[weekday]).forEach((foodItem) => {
							addToList(meal, foodItem, dayData[weekday][foodItem]);
						});
					}
				});
			}
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

let itemCount = 0;

function addToList(meal, foodItem, foodObject) {

	itemCount++;

	let newItem = document.createElement('div');
	newItem.innerHTML =
		'<div class = "food-item" data-name="' + foodItem + '" data-calories="' + foodObject.Calories + '" data-protein="' + foodObject.Protein + '" data-carbohydrates="' + foodObject.Carbohydrates + '" data-fats="' + foodObject.Fats + '">' +
		'<p>' + foodItem + '</p>' +
		'<i class="fa fa-caret-down add-icon" aria-hidden="true"></i>' +
		'<div class="nutri-info" style="display: none;">' +
		'<p>Calories: <span class="calories">' + foodObject.Calories + '</span></p>' +
		'<p>Protein: <span class="protein">' + foodObject.Protein + '</span></p>' +
		'<p>Carbohydrates: <span class="carbohydrates">' + foodObject.Carbohydrates + '</span></p>' +
		'<p>Fats: <span class="fats">' + foodObject.Fats + '</span></p>' +
		'<div class="number-input">' +
		'<button class="decrement" data-id="' + itemCount + '">-</button>' +
		'<input type="number" class="number" id="number-' + itemCount + '" value="1" min="0">' +
		'<button class="increment" data-id="' + itemCount + '">+</button>' +
		'</div>' +
		'<div class="track-button">' +
		'<button class="button-5 track" role="button"><i class="fa fa-plus-square" aria-hidden="true"></i></button>' +
		'<button class="button-5 delete" role="button"><i class="fa fa-trash" aria-hidden="true"></i></button>' +
		'</div>'
	'</div>' +
	'</div>';
	let mealElement = document.getElementById(meal);
	mealElement.appendChild(newItem);
}
document.addEventListener('click', function(event) {
	const trackButton = event.target.closest('.track');
	if (trackButton) {
		// Track button is clicked
		const meal = trackButton.closest('.meal').id;
		const foodItemElement = trackButton.closest('.food-item');
		const numberInput = parseInt(foodItemElement.querySelector('.number').value);
		const foodItem = foodItemElement.dataset.name;

		const trackObject = {
			Calories: numberInput * parseInt(foodItemElement.dataset.calories),
			Protein: numberInput * parseInt(foodItemElement.dataset.protein),
			Carbohydrates: numberInput * parseInt(foodItemElement.dataset.carbohydrates),
			Fats: numberInput * parseInt(foodItemElement.dataset.fats),
			Number: numberInput
		};

		database
			.ref('users/' + uid + '/tracking/' + new Date().toDateString() + '/' + meal + '/' + foodItem)
			.set(trackObject)
			.then(function() {
				showCustomAlert('Added ' + foodItem);
				updateTotalCounts();
			})
			.catch(function(error) {
				showCustomAlert('Error Tracking ' + foodItem);
			});
	}

	const deleteButton = event.target.closest('.delete');
	if (deleteButton) {
		// Delete button is clicked
		const meal = deleteButton.closest('.meal').id;
		const foodItemElement = deleteButton.closest('.food-item');
		const foodItem = foodItemElement.dataset.name;

		database
			.ref('users/' + uid + '/tracking/' + new Date().toDateString() + '/' + meal + '/' + foodItem)
			.remove()
			.then(() => {
				showCustomAlert('Deleted ' + foodItem);
				updateTotalCounts();
			})
			.catch((error) => {
				showCustomAlert('Error Deleting ' + foodItem);
			});
	}

	const addIcon = event.target.closest('.add-icon');
	if (addIcon) {
		// Add icon is clicked
		const nutriInfo = addIcon.parentElement.querySelector('.nutri-info');
		nutriInfo.style.display = nutriInfo.style.display === 'none' ? 'block' : 'none';
	}

	const incrementButton = event.target.closest('.increment');
	if (incrementButton) {
		// Increment button is clicked
		const itemId = incrementButton.dataset.id;
		const numberInput = document.getElementById('number-' + itemId);
		const currentValue = parseInt(numberInput.value);
		numberInput.value = (currentValue + 1).toString();
		updateNutritionValues(incrementButton);
	}

	const decrementButton = event.target.closest('.decrement');
	if (decrementButton) {
		// Decrement button is clicked
		const itemId = decrementButton.dataset.id;
		const numberInput = document.getElementById('number-' + itemId);
		const currentValue = parseInt(numberInput.value);
		if (currentValue > 0) {
			numberInput.value = (currentValue - 1).toString();
			updateNutritionValues(decrementButton);
		}
	}
});

function updateNutritionValues(button) {
	const foodItemElement = button.closest('.food-item');
	const caloriesElement = foodItemElement.querySelector('.calories');
	const proteinElement = foodItemElement.querySelector('.protein');
	const carbohydratesElement = foodItemElement.querySelector('.carbohydrates');
	const fatsElement = foodItemElement.querySelector('.fats');
	const numberInput = foodItemElement.querySelector('.number');

	const inputNumber = parseInt(numberInput.value);

	const foodObject = {
		Calories: parseInt(foodItemElement.dataset.calories),
		Protein: parseInt(foodItemElement.dataset.protein),
		Carbohydrates: parseInt(foodItemElement.dataset.carbohydrates),
		Fats: parseInt(foodItemElement.dataset.fats)
	};

	caloriesElement.textContent = foodObject.Calories * inputNumber;
	proteinElement.textContent = foodObject.Protein * inputNumber;
	carbohydratesElement.textContent = foodObject.Carbohydrates * inputNumber;
	fatsElement.textContent = foodObject.Fats * inputNumber;
}

function showCustomAlert(message) {
	var alertBox = document.getElementById('custom-alert');
	alertBox.innerHTML = '<p>' + message + '</p>';
	alertBox.style.display = 'block';

	setTimeout(function() {
		alertBox.style.display = 'none';
	}, 2000);
}

function updateTotalCounts() {
	const dbRef = firebase.database().ref('users/' + uid + '/TotalCounts/' + new Date().toDateString());

	const initialValues = {
		'Calories': 0,
		'Protein': 0,
		'Carbohydrates': 0,
		'Fats': 0
	};

	dbRef.set(initialValues).then(() => {
		firebase.database().ref('users/' + uid + '/tracking/' + new Date().toDateString()).once('value', (snapshot) => {
			var trackData = snapshot.val();
			var totalCalories = 0,
				totalCarbohydrates = 0,
				totalFats = 0,
				totalProtein = 0;
			Object.keys(trackData).forEach((meal) => {
				Object.keys(trackData[meal]).forEach((foodItem) => {
					const foodObject = trackData[meal][foodItem];
					totalCalories = totalCalories + foodObject.Calories;
					totalProtein = totalProtein + foodObject.Protein;
					totalFats = totalFats + foodObject.Fats;
					totalCarbohydrates = totalCarbohydrates + foodObject.Carbohydrates;
				});
			});
			const newValues = {
				'Calories': totalCalories,
				'Protein': totalProtein,
				'Fats': totalFats,
				'Carbohydrates': totalCarbohydrates
			}
			dbRef.set(newValues);
		});
	});
}