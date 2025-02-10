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

// Set up our register function
function register() {
    // Get all input field values
    var firstnameValue = document.getElementById("firstname").value;
    var lastnameValue = document.getElementById("lastname").value;
    var ageValue = document.getElementById("age").value;
    var usernameValue = document.getElementById("username").value;
    var emailValue = document.getElementById("email").value;
    var passwordValue = document.getElementById("password").value;

    // Validate input fields
    if (validate_field(firstnameValue) == false || validate_field(lastnameValue) == false || validate_field(ageValue) == false || validate_field(usernameValue) == false) {
        alert("Please fill out all the fields")
        return
    }

    // Email is not valid
    if (validate_email(emailValue) == false) {
        alert("Email is invalid")
        return
    }

    // Password is not valid
    if (validate_password(passwordValue) == false) {
        alert ("Password must be 6 characters longer")
        return
    }

    // Check if the reCAPTCHA token is empty
    var recaptchaToken = grecaptcha.getResponse();
    if (recaptchaToken.length == 0) {
         // reCAPTCHA not verified, notify the user and exit the function
        alert("Please complete the reCAPTCHA verification.");
        return;
    }

    // Move on with Auth
    auth.createUserWithEmailAndPassword(emailValue, passwordValue)
    .then(function (credential) {
        // Send email verification
        return credential.user.sendEmailVerification();
    })
    .then(function () {
        // Declare user variable
        var user = auth.currentUser;

        // Add this user to the database
        var database_ref = database.ref()

        // Create user data

        var currentDate = new Date(); // Get current date and time
        var formattedDate = formatDate(currentDate); // Format date

        var user_data = {
            firstname: firstnameValue,
            lastname: lastnameValue,
            age: ageValue,
            username: usernameValue,
            email: emailValue,
            last_login: formattedDate
        }

        // Push to Firebase Database
        database_ref.child('users/' + user.uid).set(user_data)
        .then(function () {

            // Done
            alert("User created")

            // Clear input fields
            firstname.value = "";
            lastname.value = "";
            age.value = "";
            username.value = "";
            email.value = "";
            password.value = "";
            
            // Check if email is verified
            if (!user.emailVerified) {
                alert("Please verify your email to login the next time.");
                window.location.href = "user-details.html";
                return;
            } else {
                window.location.href = "http://atlas.batstate-u.edu.ph/commandcenter/gis/?fbclid=IwAR0EUo5Mnsfstywla6cw1x97k9aplnMQuKv6uezR5xldDAbfjpwowsqyPdA";
            }

        })
        .catch(function (error) {
            // Handle database error
            alert("Error occurred while saving user data: " + error.message);
        });
    })
        .catch(function (error) {
            // Firebase will use this alert of its errors
            var error_code = error.error_code
            var error_message = error.message

            alert(error_message)
        })
}

// Listen for changes in user authentication state
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // Check if email is verified
        if (user.emailVerified) {
            // Redirect to target site
            window.location.href = "http://atlas.batstate-u.edu.ph/commandcenter/gis/?fbclid=IwAR0EUo5Mnsfstywla6cw1x97k9aplnMQuKv6uezR5xldDAbfjpwowsqyPdA";
        } else {
        }
    }
});

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
