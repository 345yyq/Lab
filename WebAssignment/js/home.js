// Hamburger menu interaction (mobile devices)
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const payButtons = document.querySelectorAll(".pay-btn");

payButtons.forEach(button => {
    button.addEventListener("click", function() {
        // Logic after clicking, e.g., page redirection
        window.location.href = "pay.html";
    });
});

// Click hamburger button click to toggle menu display/hide
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    // Toggle icon (show "×" when menu is displayed, "≡" when hidden)
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// When window size changes, automatically expand menu for desktop devices
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        navMenu.classList.add('show');
        hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
    } else {
        navMenu.classList.remove('show');
    }
});

// Set menu state based on window size on initial load
window.addEventListener('load', () => {
    if (window.innerWidth >= 768) {
        navMenu.classList.add('show');
    }
});