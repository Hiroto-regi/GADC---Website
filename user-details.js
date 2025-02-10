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

// Click for showing drop down menu

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    const profileLink = document.querySelector('.profile-link');
    const dropdownProfile = document.querySelector('.dropdown-profile');

    profileLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        event.stopPropagation();
        console.log('Profile link clicked');
        dropdownProfile.classList.toggle('active'); // Toggle the visibility of the dropdown menu
    });

    // Close the dropdown when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!event.target.closest('dropdown_profile')) {
            console.log('Clicked outside dropdown');
            dropdownProfile.classList.remove('active');
        }
    });
});

// Account management

document.addEventListener('DOMContentLoaded', function() {
    const manageAccountLink = document.querySelector('.dropdown-profile li:nth-child(1) a');
    const accountManage = document.getElementById('account-manage');
    const uploadButton = document.getElementById('upload-button');
    const profilePictureInput = document.getElementById('profile-picture-input');
    const userDetailSection = document.getElementById('user-details-container');

    manageAccountLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        accountManage.classList.toggle('active'); // Toggle the visibility of the floating div
    
        // Hide other sections
        modal.style.display = "none"; // Hide Borrow Drone section

        // Hide user details section
        userDetailSection.classList.remove('active');
        // userDetailSection.style.display = "none"; // Hide user details section
    });

    // Close the floating div when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.account-manage') && !event.target.closest('.dropdown-profile')) {
            accountManage.classList.remove('active');
        }
    });

    // Event listener for the upload button
    uploadButton.addEventListener('click', function() {
        profilePictureInput.click(); // Trigger the file input click event
    });

    // Event listener for profile picture input change
    profilePictureInput.addEventListener('change', function() {
        // Handle the uploaded profile picture here
        const uploadedFile = profilePictureInput.files[0];
        // Example: You can display the selected file name
        console.log('Selected file:', uploadedFile.name);
    });
});

// To stop going back to the user details page
document.getElementById('account-manage').addEventListener('click', function(event) {
    event.stopPropagation();
});

document.addEventListener('DOMContentLoaded', function() {
    const updateButton = document.getElementById('update-button');
    const cancelButton = document.getElementById('cancel-button');
    const clearButton = document.getElementById('clear-button');

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userId = user.uid; // Assign value to userId variable
            var userRef = firebase.database().ref('users/' + userId);
            
            userRef.once('value', function(snapshot) {
                var userData = snapshot.val();
                console.log(userData);
                if (userData) {
                    // Display user details
                    document.getElementById('edit-firstname').value = userData['firstname'];
                    document.getElementById('edit-lastname').value = userData['lastname'];
                    document.getElementById('edit-age').value = userData['age'];
                    document.getElementById('edit-username').value = userData['username'];
                } else {
                    console.log('User data not found');
                }
            });
        } else {
            console.log('User not logged in');
        }
    });

    // Update button click event listener
    updateButton.addEventListener('click', function() {
        if (!userId) {
            console.log('User ID not available');
            return; // Exit function if userId is not available
        } else {
            // Show loading
            document.getElementById('loading-icon').style.display = 'block';

        // Get updated values from input fields
        const updatedFirstName = document.getElementById('edit-firstname').value;
        const updatedLastName = document.getElementById('edit-lastname').value;
        const updatedAge = document.getElementById('edit-age').value;
        const updatedUsername = document.getElementById('edit-username').value;

        // Update the corresponding Firebase database entries
        firebase.database().ref('users/' + userId).update({
            'firstname': updatedFirstName,
            'lastname': updatedLastName,
            'age': updatedAge,
            'username': updatedUsername,
        }).then(function() {
            console.log('Account updated successfully!');

            // Hide the loading icon
            document.getElementById('loading-icon').style.display = 'none';

            window.location.href = "user-details.html";
        }).catch(function(error) {
            console.error('Error updating account:', error);
            // Hide the loading icon
            document.getElementById('loading-icon').style.display = 'none';
        });
        }
    });

    // Cancel button click event listener
    cancelButton.addEventListener('click', function(){
        if (!userId) {
            console.log('User ID not available');
            return; // Exit function if userId is not available
        } else {
            window.location.href = "user-details.html"
        }
    })

    // Clear button click event listener 
    clearButton.addEventListener('click', function(){
        if (!userId) {
            console.log('User ID not available');
            return; // Exit function if userId is not available
        } else {
            var firstnameInput = document.getElementById("edit-firstname")
            var lastnameInput = document.getElementById("edit-lastname")
            var ageInput = document.getElementById("edit-age")
            var usernameInput = document.getElementById("edit-username")

            // Clear input fields
            firstnameInput.value = "";
            lastnameInput.value = "";
            ageInput.value = "";
            usernameInput.value = "";
        }
    })
});

// Borrow Drone
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the download button
var downloadBtn = document.getElementById("downloadBtn");

const userDetailSection = document.getElementById('user-details-container');
const accountManage = document.getElementById('account-manage');
// When the user clicks the button, open the modal
btn.onclick = function() {
    console.log("Borrow Drone button clicked");
    modal.style.display = "block";
    // Hide other sections

    // Hide user details section
    userDetailSection.classList.remove('active');
    console.log("Hiding User Detail section");

    console.log("Hiding Manage Account section");
    accountManage.classList.remove('active'); // Hide Account Management section
}

  // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
    }
}

// Function to handle the download PDF action
downloadBtn.onclick = function() {
    var pdfPath = "borrowdrone/borrowdrone.pdf";
    var a = document.createElement("a");
    a.href = pdfPath;
    a.target = "_blank"; // Open in new tab
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Hide user details section
    userDetailSection.classList.remove('active');
}

// Logout function
document.addEventListener('DOMContentLoaded', function() {
    // Get a reference to the logout link
    const logoutLink = document.getElementById('logout-link');

    // Add a click event listener to the logout link
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        logout(); // Call the logout function
    });
});

// Function to handle logout
function logout() {
    auth.signOut()
        .then(function () {
            // Redirect to the login page after logout
            window.location.href = "index.html";
        })
        .catch(function (error) {
            // Handle logout errors
            alert("Error occurred during logout: " + error.message);
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
            } else {
                console.log('User data not found');
            }
        });
    } else {
        console.log('User not logged in');
    }
}

// Listen for changes in user authentication state
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // Check if email is verified
        if (user.emailVerified) {
            // Display user details
            displayUserDetails();
            
            // Redirect to target site
            // window.location.href = "http://atlas.batstate-u.edu.ph/commandcenter/gis/?fbclid=IwAR0EUo5Mnsfstywla6cw1x97k9aplnMQuKv6uezR5xldDAbfjpwowsqyPdA";
        } else {
            displayUserDetails();
        }
    }
});