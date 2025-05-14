// Cuộn lên đầu
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();
        const subjectError = document.getElementById("subject-error");
        const messageError = document.getElementById("message-error");

        let valid = true;
        subjectError.textContent = "";
        messageError.textContent = "";

        if (subject.length < 6) {
            subjectError.textContent = "Chủ đề phải dài hơn 5 ký tự.";
            valid = false;
        }

        if (message.length < 11) {
            messageError.textContent = "Nội dung phải dài hơn 10 ký tự.";
            valid = false;
        }

        if (!valid) {
            e.preventDefault();
        }
    });
});




// Get modal elements
const registerModal = document.getElementById('register-modal');
const loginModal = document.getElementById('login-modal');
const registerButton = document.getElementById('register-button');
const loginButton = document.getElementById('login-button');
const switchToLogin = document.getElementById('switch-to-login');
const switchToRegister = document.getElementById('switch-to-register');
const registerCloseBtn = document.getElementById('register-close');
const loginCloseBtn = document.getElementById('login-close');

// Open register modal
registerButton.addEventListener('click', function (e) {
    e.preventDefault();
    registerModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
});

// Open login modal
loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    loginModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

// Close register modal
registerCloseBtn.addEventListener('click', function () {
    registerModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling when modal is closed
});

// Close login modal
loginCloseBtn.addEventListener('click', function () {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modals when clicking outside
window.addEventListener('click', function (event) {
    if (event.target === registerModal) {
        registerModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Switch to login form
switchToLogin.addEventListener('click', function (e) {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

// Switch to register form
switchToRegister.addEventListener('click', function (e) {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'flex';
});



// Trong file js/index.js




function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}
// Hiện nút khi cuộn xuống 200px
window.onscroll = function () {
    document.getElementById("scrollTopBtn").style.display =
        document.body.scrollTop > 200 || document.documentElement.scrollTop > 200
            ? "block"
            : "none";
};

