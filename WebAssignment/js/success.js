// 1. Initialize navigation menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        navMenu.classList.add('show');
        hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
    } else {
        navMenu.classList.remove('show');
    }
});

window.addEventListener('load', () => {
    if (window.innerWidth >= 768) {
        navMenu.classList.add('show');
    }
    showPaymentInfo();
});

// 2. Display book title and selected local card info
function showPaymentInfo() {
    const bookMessage = document.getElementById('bookMessage');
    const selectedCardLogo = document.getElementById('selectedCardLogo');
    const maskedCard = document.getElementById('maskedCard');

    if (!bookMessage || !selectedCardLogo || !maskedCard) return;

    // Read locally stored local image path and information
    const bookName = localStorage.getItem('bookName') || 'your book';
    const lastFourDigits = localStorage.getItem('lastFourDigits') || '0000';
    const cardLogoUrl = localStorage.getItem('selectedCardLogo') || './images/a.jpg'; // Default to a.jpg

    // Render the selected local card logo
    selectedCardLogo.src = cardLogoUrl;
    // Render masked card number
    maskedCard.textContent = `**** **** **** ${lastFourDigits}`;

    // Clear local storage
    localStorage.removeItem('bookName');
    localStorage.removeItem('lastFourDigits');
    localStorage.removeItem('selectedCardLogo');
}