document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const purpose = document.getElementById("purpose").value;
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !purpose || !message) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        alert("Thank you, " + name + "! Your concern has been submitted successfully.");
        form.reset();
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function sendEmail() {
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let purpose = document.getElementById("purpose").value;
        let message = document.getElementById("message").value;

        let subject = encodeURIComponent("Contact Form: " + purpose);
        let body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPurpose: ${purpose}\n\nMessage:\n${message}`);

        let mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=gis.center@g.batstate-u.edu.ph&su=${subject}&body=${body}`;

        window.open(mailtoLink, "_blank");
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const purpose = document.getElementById("purpose").value;
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !purpose || !message) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        sendEmail();
        alert("Thank you, " + name + "! Your concern has been submitted successfully.");
        form.reset();
    });

});
