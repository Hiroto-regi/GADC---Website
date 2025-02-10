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

// News and Announcement

document.addEventListener("DOMContentLoaded", function() {
    var slideIndex = 0;
    showSlides();

    function showSlides() {
        var slides = document.getElementsByClassName("slide-fade");
        for (var i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex].style.display = "block";

        // Trigger animation for the current slide with a delay
        setTimeout(function() {
            slides[slideIndex].style.opacity = 1;
        }, 300); // Adjust the delay time as needed

        // Add a class to the container based on the current slide index
        document.querySelector(".slideshow-container").className = "slideshow-container color-" + slideIndex;
    }

    window.prevSlide = function() {
        if (slideIndex > 0) {
            slideIndex--;
        } else {
            slideIndex = document.getElementsByClassName("slide-fade").length - 1;
        }
        showSlides();
    };

    window.nextSlide = function() {
        if (slideIndex < document.getElementsByClassName("slide-fade").length - 1) {
            slideIndex++;
        } else {
            slideIndex = 0;
        }
        showSlides();
    }; 
});


// Animations -- Fade in and fade out

document.addEventListener("DOMContentLoaded", function() {
    const newsSection = document.querySelector(".news-section");
    const newsCards = document.querySelectorAll(".news-card");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && window.innerWidth > 768) { // Adjust the screen size breakpoint as needed
                // If scrolling into view and screen size is larger than 768px
                let delay = 0;
                newsCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add("animate");
                        card.classList.remove("reverse");
                    }, delay); // Adjust the delay (in milliseconds) as needed
                    delay += 600; // Increment delay for the next card
                });
            } else {
                // If scrolling out of view or screen size is smaller than or equal to 768px
                newsCards.forEach(card => {
                    card.classList.remove("animate");
                    card.classList.remove("reverse");
                });
            }
        });
    }, { threshold: 0.5 }); // Only trigger when more than 50% of the section is in view

    observer.observe(newsSection);
});



// Services

document.addEventListener('DOMContentLoaded', function () {
    const loopVideo = document.getElementById('loopVideo');
    
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;

        // Adjust the threshold as needed
        const threshold = 0.5;
        const videoTop = loopVideo.offsetTop;
        const videoHeight = loopVideo.offsetHeight;

        if (scrollPosition > videoTop - window.innerHeight * threshold &&
            scrollPosition < videoTop + videoHeight - window.innerHeight * threshold) {
            loopVideo.play();
        } else {
            loopVideo.play();
        }
    });
});

// Services - fade in and fade out
document.addEventListener("DOMContentLoaded", function () {
    const servicesSection = document.querySelector(".services-container");
    const servicesCards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && window.innerWidth > 768) { // Apply animations only for larger screens
                // If scrolling into view
                let delay = 0;
                servicesCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add("animate");
                        card.classList.remove("reverse");
                    }, delay); // Adjust the delay (in milliseconds) as needed
                    delay += 500; // Increment delay for the next card
                });
            } else {
                // If scrolling out of view or on smaller screens
                servicesCards.forEach(card => {
                    card.classList.remove("animate");
                    card.classList.remove("reverse");
                });
            }
        });
    }, { threshold: 0.5 }); // Only trigger when more than 50% of the section is in view

    observer.observe(servicesSection);
});


// Research Facilities - fade in and fade out

document.addEventListener("DOMContentLoaded", function () {
    const researchSection = document.querySelector(".research-container");
    const researchCards = document.querySelectorAll(".single-img");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && window.innerWidth > 768) { // Apply animations only for larger screens
                // If scrolling into view
                researchCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add("animate");
                        card.classList.remove("reverse");
                    }, index * 500); // Adjust the delay (in milliseconds) as needed
                });
            } else {
                // If scrolling out of view or on smaller screens
                researchCards.forEach(card => {
                    card.classList.remove("animate");
                    card.classList.remove("reverse");
                });
            }
        });
    }, { threshold: 0.5 }); // Only trigger when more than 50% of the section is in view

    observer.observe(researchSection);
});

// Events and Activities 

window.addEventListener('load', function() {
    const eventContainer = document.querySelector('.event');
    const scrollSpeed = 5; // Adjust the speed of scrolling
    let scrollDirection = 1; // 1 for forward, -1 for backward

    function autoScroll() {
        // Check if reached the end or beginning
        if (eventContainer.scrollLeft >= eventContainer.scrollWidth - eventContainer.clientWidth) {
            // Change direction to backward when reaching the end
            scrollDirection = -1;
        } else if (eventContainer.scrollLeft <= 0) {
            // Change direction to forward when reaching the beginning
            scrollDirection = 1;
        }

        // Scroll by the appropriate speed based on direction
        eventContainer.scrollLeft += scrollDirection * scrollSpeed;
    }

    // Set interval for autoscrolling
    const scrollInterval = setInterval(autoScroll, 50); // Adjust the interval time as needed for smoothness

    // Pause autoscrolling when hovering over the event container
    eventContainer.addEventListener('mouseenter', function() {
        clearInterval(scrollInterval);
    });

    // Resume autoscrolling when mouse leaves the event container
    eventContainer.addEventListener('mouseleave', function() {
        clearInterval(scrollInterval); // Clear previous interval to prevent stacking
        setInterval(autoScroll, 50); // Adjust the interval time as needed for smoothness
    });
});












