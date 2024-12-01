let slideIndex = 0;

function showSlides() {
    const slides = document.querySelectorAll('.slide');
    const loadingLines = document.querySelectorAll('.loading-line');

    slides.forEach((slide, index) => {
        slide.style.display = 'none';
        if (index === slideIndex) {
            slide.style.display = 'block';
        }
    });

    // Update active line
    loadingLines.forEach((line, index) => {
        line.classList.toggle('active', index === slideIndex);
    });
}

function changeSlide(n) {
    const slides = document.querySelectorAll('.slide');
    slideIndex = (slideIndex + n + slides.length) % slides.length;
    showSlides();
}

function goToSlide(n) {
    const loadingLines = document.querySelectorAll('.loading-line');

    // Clear previous loading effects
    loadingLines.forEach(line => {
        line.classList.remove('loading'); // Remove loading class if it exists
    });

    // Start loading effect on the clicked line
    loadingLines[n].classList.add('loading');

    // After the loading effect, change the slide
    setTimeout(() => {
        slideIndex = n; // Set slideIndex to the clicked line index
        showSlides(); // Show the corresponding slide

        // Remove loading effect after transitioning
        loadingLines.forEach(line => {
            line.classList.remove('loading');
        });
    }, 1000); // Match this duration with your CSS animation duration (1s in this case)
}

// Initialize the slider
showSlides();

// Automatically change slide every 3 seconds (3000 milliseconds)
setInterval(() => {
    changeSlide(1); // Move to the next slide
}, 3000);
