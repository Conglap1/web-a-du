// Cuộn lên đầu
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", function () {
  // Khởi tạo trạng thái đăng nhập
  checkLoginStatus();

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
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
  }

  // Get modal elements
  const registerModal = document.getElementById("register-modal");
  const loginModal = document.getElementById("login-modal");
  const registerButton = document.getElementById("register-button");
  const loginButton = document.getElementById("login-button");
  const switchToLogin = document.getElementById("switch-to-login");
  const switchToRegister = document.getElementById("switch-to-register");
  const registerCloseBtn = document.getElementById("register-close");
  const loginCloseBtn = document.getElementById("login-close");

  // Open register modal
  if (registerButton) {
    registerButton.addEventListener("click", function (e) {
      e.preventDefault();
      registerModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    });
  }

  // Open login modal
  if (loginButton) {
    loginButton.addEventListener("click", function (e) {
      e.preventDefault();
      loginModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  }

  // Close register modal
  if (registerCloseBtn) {
    registerCloseBtn.addEventListener("click", function () {
      registerModal.style.display = "none";
      document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
    });
  }

  // Close login modal
  if (loginCloseBtn) {
    loginCloseBtn.addEventListener("click", function () {
      loginModal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }

  // Close modals when clicking outside
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

  // Switch to login form
  if (switchToLogin) {
    switchToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      registerModal.style.display = "none";
      loginModal.style.display = "flex";
    });
  }

  // Switch to register form
  if (switchToRegister) {
    switchToRegister.addEventListener("click", function (e) {
      e.preventDefault();
      loginModal.style.display = "none";
      registerModal.style.display = "flex";
    });
  }

  // Form submissions
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const username = email.split("@")[0]; // Lấy username từ email

      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);

      // Đóng modal đăng nhập
      loginModal.style.display = "none";
      document.body.style.overflow = "auto";

      // Cập nhật giao diện
      checkLoginStatus();

      // Thông báo đăng nhập thành công
      showNotification("Đăng nhập thành công!");
    });
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const fullname = document.getElementById("fullname").value;
      const email = document.getElementById("register-email").value;

      // Lưu thông tin đăng ký vào localStorage (trong thực tế sẽ gửi lên server)
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", fullname);
      localStorage.setItem("email", email);

      // Đóng modal đăng ký
      registerModal.style.display = "none";
      document.body.style.overflow = "auto";

      // Cập nhật giao diện
      checkLoginStatus();

      // Thông báo đăng ký thành công
      showNotification("Đăng ký thành công!");
    });
  }

  // Xử lý đăng xuất
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", function (e) {
      e.preventDefault();

      // Xóa thông tin đăng nhập khỏi localStorage
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("email");

      // Cập nhật giao diện
      checkLoginStatus();

      // Thông báo đăng xuất thành công
      showNotification("Đăng xuất thành công!");
    });
  }
});

// Kiểm tra trạng thái đăng nhập và cập nhật giao diện
function checkLoginStatus() {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const username = localStorage.getItem("username");
  const loginContainer = document.querySelector(".login"); // Target the parent <ul class="login">

  if (!loginContainer) return; // Exit if loginContainer isn't found

  // Remove existing login-related <li> elements to avoid duplication
  const loginItems = loginContainer.querySelectorAll(".right");
  loginItems.forEach((item) => item.remove());

  if (loggedIn && username) {
    // Người dùng đã đăng nhập
    const userProfileLi = document.createElement("li");
    userProfileLi.className = "right";
    userProfileLi.innerHTML = `
      <li class="user-profile">
        <div class="user-avatar" id="user-menu-toggle">
          <span>${getInitials(username)}</span>
        </div>
        <div class="user-dropdown" id="user-dropdown">
          <div class="user-info">
            <div class="user-avatar-large">
              <span>${getInitials(username)}</span>
            </div>
            <h4>${username}</h4>
          </div>
          <ul class="user-menu">
            <li><a href="#"><i class="fa-solid fa-user"></i> Trang cá nhân</a></li>
            <li><a href="#"><i class="fa-solid fa-gear"></i> Cài đặt</a></li>
            <li><a href="#" id="logout-button"><i class="fa-solid fa-sign-out-alt"></i> Đăng xuất</a></li>
          </ul>
        </div>
      </li>
    `;
    loginContainer.appendChild(userProfileLi);

    // Thêm sự kiện cho user-menu-toggle
    const userMenuToggle = document.getElementById("user-menu-toggle");
    const userDropdown = document.getElementById("user-dropdown");

    if (userMenuToggle && userDropdown) {
      userMenuToggle.addEventListener("click", function () {
        userDropdown.classList.toggle("active");
      });

      // Đóng dropdown khi click bên ngoài
      document.addEventListener("click", function (event) {
        if (
          !userMenuToggle.contains(event.target) &&
          !userDropdown.contains(event.target)
        ) {
          userDropdown.classList.remove("active");
        }
      });
    }

    // Thêm sự kiện cho nút đăng xuất
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        checkLoginStatus();
        showNotification("Đăng xuất thành công!");
      });
    }
  } else {
    // Người dùng chưa đăng nhập
    const registerLi = document.createElement("li");
    registerLi.className = "right";
    registerLi.innerHTML = '<a href="#" id="register-button">Đăng Ký</a>';

    const loginLi = document.createElement("li");
    loginLi.className = "right";
    loginLi.innerHTML = '<a href="#" id="login-button">Đăng Nhập</a>';

    loginContainer.appendChild(registerLi);
    loginContainer.appendChild(loginLi);

    // Thêm lại sự kiện cho nút đăng ký/đăng nhập
    const registerButton = document.getElementById("register-button");
    const loginButton = document.getElementById("login-button");

    if (registerButton) {
      registerButton.addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("register-modal").style.display = "flex";
        document.body.style.overflow = "hidden";
      });
    }

    if (loginButton) {
      loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("login-modal").style.display = "flex";
        document.body.style.overflow = "hidden";
      });
    }
  }
}

// Lấy chữ cái đầu của tên
function getInitials(name) {
  return name.charAt(0).toUpperCase();
}

// Hiển thị thông báo
function showNotification(message) {
  // Kiểm tra xem đã có notification-container chưa
  let container = document.querySelector(".notification-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  // Tạo thông báo mới
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <span class="notification-close">&times;</span>
    `;

  // Thêm vào container
  container.appendChild(notification);

  // Hiệu ứng fade-in
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Xóa thông báo sau 3 giây
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);

  // Xử lý sự kiện đóng thông báo
  const closeButton = notification.querySelector(".notification-close");
  closeButton.addEventListener("click", () => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
}

function toggleMenu() {
  const nav = document.querySelector(".nav");
  nav.classList.toggle("active");
}

// Hiện nút khi cuộn xuống 200px
window.onscroll = function () {
  document.getElementById("scrollTopBtn").style.display =
    document.body.scrollTop > 200 || document.documentElement.scrollTop > 200
      ? "block"
      : "none";
};
