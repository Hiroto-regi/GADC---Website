// Burger menu

document.addEventListener('DOMContentLoaded', function () {
    const burgerIcon = document.querySelector('.burger_icon');
    const navbarMenu = document.querySelector('.navbar_menu');

    burgerIcon.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
        burgerIcon.classList.toggle('active');
    });
});

// GADC Title

window.addEventListener('resize', function () {
    var textContainer = document.querySelector('.text_container');
    var windowWidth = window.innerWidth;

    if (windowWidth <= 768) {
        textContainer.innerText = "GADC"; /* Changed text for smaller screens */
    } else {
        textContainer.innerText = "GIS Applications Development Center"; /* Default text for larger screens */
    }
});

// Initial call to set text content based on the current screen size
window.dispatchEvent(new Event('resize'));


// Web app's firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyDYBrby9Sz4mpmnZAAh2cX8wdPfVVyfDg0",
    authDomain: "gadc-d6234.firebaseapp.com",
    projectId: "gadc-d6234",
    storageBucket: "gadc-d6234.appspot.com",
    messagingSenderId: "805913832486",
    appId: "1:805913832486:web:94c5922298a96a70b3cae7",
    measurementId: "G-ZPD022RXWB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialized variables
const auth = firebase.auth()
const database = firebase.database()
var user = firebase.auth().currentUser;

function formatDate(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    // Add leading zeroes if necessary
    month = (month < 10) ? '0' + month : month;
    day = (day < 10) ? '0' + day : day;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;

    return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes;
}

function login() {
    console.log("Attempting login...");
    // Show the loading icon
    document.getElementById('loading-icon').style.display = 'block';

    console.log("Loading icon displayed.");

    // Check if the reCAPTCHA token is empty
    var recaptchaToken = grecaptcha.getResponse();
    if (recaptchaToken.length == 0) {

        // reCAPTCHA not verified, notify the user and exit the function
        alert("Please complete the reCAPTCHA verification.");

        // Hide the loading icon
        document.getElementById('loading-icon').style.display = 'none';
        return;
    }

    email = document.getElementById("email").value;
    password = document.getElementById("password").value;

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert("Email or password is invalid");

        // Hide the loading icon
        document.getElementById('loading-icon').style.display = 'none';
        return;
    }

    // Sign in with email and password
    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            // Check if user's email is verified
            var user = auth.currentUser;
            if (user.emailVerified) {
                // If email is verified, update last login time
                var database_ref = database.ref();
                var currentDate = new Date();
                var formattedDate = formatDate(currentDate);
                var user_data = {
                    last_login: formattedDate
                };
                // Update user's last login time in the database
                database_ref.child('users/' + user.uid).update(user_data)
                    .then(function () {
                        alert("You are being redirected")
                        window.location.href = "user-details.html"
                    })
                    .catch(function (error) {
                        alert("Error occurred while saving user data: " + error.message);
                    });
            } else {
                // If email is not verified, prompt user to verify email
                alert("Please verify your email to login.");
            }
            // Hide the loading icon
            document.getElementById('loading-icon').style.display = 'none';
        })
        .catch(function (error) {
            // Handle login errors
            var error_code = error.error_code;
            var error_message = error.message;
            alert(error_message);
            
            // Hide the loading icon
            document.getElementById('loading-icon').style.display = 'none';

            console.log("Loading icon hidden.");
        });
}

// Fetch and display user details
function displayUserDetails() {
    var user = firebase.auth().currentUser;
    if (user) {
        var userId = user.uid;
        var userRef = firebase.database().ref('users/' + userId);
        
        userRef.once('value', function(snapshot) {
            var userData = snapshot.val();
            if (userData) {
                // Display user details
                document.getElementById('firstname').textContent = userData.firstname;
                document.getElementById('lastname').textContent = userData.lastname;
                document.getElementById('age').textContent = userData.age;
                document.getElementById('username').textContent = userData.username;
                document.getElementById('email').textContent = userData.email;
                document.getElementById('last_login').textContent = userData.last_login; // Display last login time
            } else {
                console.log('User data not found');
            }
        });
    } else {
        console.log('User not logged in');
    }
}

// Call the function to display user details when the page loads
document.addEventListener('DOMContentLoaded', function () {
    displayUserDetails();
});

// Function to handle logout
function logout() {
    auth.signOut()
        .then(function () {
            // Redirect to the login page after logout
            window.location.href = "gadc.html";
        })
        .catch(function (error) {
            // Handle logout errors
            alert("Error occurred during logout: " + error.message);
        });
}

    
// Validate Functions
function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email)) {
        // Email is good
        return true
    } else {
        // Email is not good
        return false
    }
}

function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password.length < 6) {
        return false
    } else {
        return true
    }
}

function validate_field(field) {
    if (field == null) {
        return false
    }

    if (field.length <= 0) {
        return false
    } else {
        return true
    }
}