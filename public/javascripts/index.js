document.addEventListener("DOMContentLoaded", function () {
  // Lấy các phần tử modal và nút
  const registerModal = document.getElementById("register-modal");
  const loginModal = document.getElementById("login-modal");
  const registerButton = document.getElementById("register-button");
  const loginButton = document.getElementById("login-button");
  const registerCloseBtn = document.getElementById("register-close");
  const loginCloseBtn = document.getElementById("login-close");

  // Mở modal đăng ký
  if (registerButton) {
    registerButton.addEventListener("click", function (e) {
      e.preventDefault();
      registerModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Ngăn cuộn khi modal mở
    });
  }

  // Mở modal đăng nhập
  if (loginButton) {
    loginButton.addEventListener("click", function (e) {
      e.preventDefault();
      loginModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Ngăn cuộn khi modal mở
    });
  }

  // Đóng modal đăng ký
  if (registerCloseBtn) {
    registerCloseBtn.addEventListener("click", function () {
      registerModal.style.display = "none";
      document.body.style.overflow = "auto"; // Cho phép cuộn khi modal đóng
    });
  }

  // Đóng modal đăng nhập
  if (loginCloseBtn) {
    loginCloseBtn.addEventListener("click", function () {
      loginModal.style.display = "none";
      document.body.style.overflow = "auto"; // Cho phép cuộn khi modal đóng
    });
  }

  // Đóng modal khi nhấn bên ngoài
  window.addEventListener("click", function (event) {
    if (event.target === registerModal) {
      registerModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
    if (event.target === loginModal) {
      loginModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});