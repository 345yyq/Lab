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
    initExpYear();
    showBookTitle();
    initCardSelectors();
});

// 2. Dynamically generate expiration year options
function initExpYear() {
    const expYearSelect = document.getElementById('expYear');
    if (!expYearSelect) return;
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
        const year = currentYear + i;
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        expYearSelect.appendChild(option);
    }
}

// 3. Get and display book title from URL parameters
function showBookTitle() {
    const bookTitleElement = document.getElementById('bookTitle');
    if (!bookTitleElement) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const encodedBookName = urlParams.get('book') || 'Your Selected Book';
    const decodedBookName = decodeURIComponent(encodedBookName);
    bookTitleElement.textContent = decodedBookName;
}

// Initialize card type selection buttons and record selection status
function initCardSelectors() {
    const cardSelectors = document.querySelectorAll('.card-selector');
    const isCardSelected = document.getElementById('isCardSelected');
    if (!isCardSelected) return;

    cardSelectors.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mark as selected
            isCardSelected.value = 'true';
            // Add style to the selected button
            cardSelectors.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// 4. Form validation logic
const paymentForm = document.getElementById('paymentForm');
const feedback = document.getElementById('feedback');

if (paymentForm && feedback) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s|-/g, '') || '';
        const expMonth = parseInt(document.getElementById('expMonth')?.value) || 0;
        const expYear = parseInt(document.getElementById('expYear')?.value) || 0;
        const cvv = document.getElementById('cvv')?.value || '';
        const isCardSelected = document.getElementById('isCardSelected')?.value === 'true';

        let isValid = true;
        feedback.textContent = '';
        feedback.className = 'feedback';

        // Validate if a card type has been selected
        if (!isCardSelected) {
            showError('Please select a card type first');
            isValid = false;
        }

        // Validate credit card number
        const cardRegex = /^5[1-5]\d{14}$/;
        if (!cardRegex.test(cardNumber)) {
            showError('Invalid Mastercard number: must start with 51-55 and be 16 digits');
            isValid = false;
        }

        // Validate expiration date
        if (isValid) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                showError('Card has expired. Please select a future date.');
                isValid = false;
            }
        }

        // Validate security code
        if (isValid) {
            const cvvRegex = /^\d{3,4}$/;
            if (!cvvRegex.test(cvv)) {
                showError('Security code must be 3 or 4 digits');
                isValid = false;
            }
        }

        // 5. Submit to API and store info
        if (isValid) {
            const paymentData = {
                master_card: parseInt(cardNumber),
                exp_year: expYear,
                exp_month: expMonth,
                cvv_code: cvv
            };

            // Store the book name and the last four digits of the card number
            localStorage.setItem('lastFourDigits', cardNumber.slice(-4));
            localStorage.setItem('bookName', document.getElementById('bookTitle')?.textContent || 'Your Book');
            const selectedCard = document.querySelector('.card-selector.active');
            if (selectedCard) {
                localStorage.setItem('selectedCardLogo', selectedCard.dataset.logo);
            }

            fetch('https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.message || 'Payment failed: invalid card details');
                    });
                }
                return response.json();
            })
            .then(data => {
                window.location.href = 'success.html';
            })
            .catch(error => {
                showError(`Error: ${error.message}`);
            });
        }
    });
}

// Helper function: display error message
function showError(message) {
    if (feedback) {
        feedback.textContent = message;
        feedback.className = 'feedback error';
    }
}