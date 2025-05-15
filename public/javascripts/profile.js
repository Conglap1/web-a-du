// ======= Modal Logic =======
import { handleLogin, handleRegister } from '/javascripts/access.js';

document.addEventListener("DOMContentLoaded", function () {
  // Modal elements
  const loginModal = document.getElementById("login-modal");
  const registerModal = document.getElementById("register-modal");
  const loginBtn = document.getElementById("login-btn");
  const createAccountBtn = document.getElementById("create-account-btn");
  const loginClose = document.getElementById("login-close");
  const registerClose = document.getElementById("register-close");
  const switchToRegister = document.getElementById("switch-to-register");
  const switchToLogin = document.getElementById("switch-to-login");

  // Open login modal
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      loginModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  }
  // Open register modal
  if (createAccountBtn) {
    createAccountBtn.addEventListener("click", function () {
      registerModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  }
  // Close login modal
  if (loginClose) {
    loginClose.addEventListener("click", function () {
      loginModal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }
  // Close register modal
  if (registerClose) {
    registerClose.addEventListener("click", function () {
      registerModal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }
  // Switch to register
  if (switchToRegister) {
    switchToRegister.addEventListener("click", function (e) {
      e.preventDefault();
      loginModal.style.display = "none";
      registerModal.style.display = "flex";
    });
  }
  // Switch to login
  if (switchToLogin) {
    switchToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      registerModal.style.display = "none";
      loginModal.style.display = "flex";
    });
  }
  // Close modal when click outside
  window.addEventListener("click", function (event) {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
    if (event.target === registerModal) {
      registerModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // ======= Form Submit Logic =======
  document.getElementById("login-form")?.addEventListener("submit", handleLogin);
  document.getElementById("register-form")?.addEventListener("submit", handleRegister);
});