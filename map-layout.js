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