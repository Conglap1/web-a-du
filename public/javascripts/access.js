// Hàm tiện ích để set/get cookie
function setCookie(name, value, days = 1) {
  const expires = new Date(Date.now() + days*24*60*60*1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}
function eraseCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

// Hàm xử lý đăng ký
export async function handleRegister(e) {
  e.preventDefault();
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const response = await fetch("http://localhost:3056/v1/api/BookStore/SignUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        UserName: fullname,
        Email: email,
        Password: password
      })
    });

    const data = await response.json();
    if (response.ok) {
      alert("Đăng ký thành công!");
    } else {
      alert(data.message || "Đăng ký thất bại!");
    }
  } catch (err) {
    alert("Lỗi kết nối server!");
  }
}

// Hàm xử lý đăng nhập
export async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch("http://localhost:3056/v1/api/BookStore/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Email: email,
        Password: password
      })
    });

    const data = await response.json();
    if (response.ok && data.metadata) {
      setCookie("customer_id", data.metadata.User._id);
      setCookie("accessToken", data.metadata.tokens.accessToken);
      setCookie("email", email);
      setCookie("userName", data.metadata.User.UserName);

      // Kiểm tra roles
      const roles = data.metadata.User.roles || [];
      if (roles.includes("admin")) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }
    } else {
      alert(data.message || "Đăng nhập thất bại!");
    }
  } catch (err) {
    alert("Lỗi kết nối server!");
  }
}

// Hàm hiển thị thông báo nổi
function showNotification(message) {
  let container = document.querySelector(".notification-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "notification-container";
    document.body.appendChild(container);
  }
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <span class="notification-close">&times;</span>
  `;
  container.appendChild(notification);
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
  notification.querySelector(".notification-close").onclick = () => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // Gắn lại sự kiện logout cho admin nếu có nút này trên trang
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      handleLogout();
    });
  }
  updateHeaderProfile(); // vẫn giữ cho trang home/profile
});

function updateHeaderProfile() {
  const customerId = getCookie("customer_id");
  const accessToken = getCookie("accessToken");
  const headerRight = document.getElementById("header-right");
  if (!headerRight) return;

  if (customerId && accessToken) {
    headerRight.innerHTML = "";

    let userName = getCookie("userName");
    if (!userName) {
      const email = getCookie("email");
      userName = email ? email.split("@")[0] : "User";
    }
    const userInitial = userName.charAt(0).toUpperCase();

    headerRight.innerHTML = `
      <li class="user-profile">
        <div class="user-avatar" id="user-menu-toggle">
          <span>${userInitial}</span>
        </div>
        <div class="user-dropdown" id="user-dropdown">
          <div class="user-info">
            <div class="user-avatar-large">
              <span>${userInitial}</span>
            </div>
            <h4>${userName}</h4>
          </div>
          <ul class="user-menu">
            <li><a href="#"><i class="fa-solid fa-user"></i> Trang cá nhân</a></li>
            <li><a href="#"><i class="fa-solid fa-gear"></i> Cài đặt</a></li>
            <li><a href="#" id="logout-button"><i class="fa-solid fa-sign-out-alt"></i> Đăng xuất</a></li>
          </ul>
        </div>
      </li>
    `;

    attachProfileEvents();
  }
}

function attachProfileEvents() {
  const userMenuToggle = document.getElementById("user-menu-toggle");
  const userDropdown = document.getElementById("user-dropdown");
  if (userMenuToggle && userDropdown) {
    userMenuToggle.addEventListener("click", function () {
      userDropdown.classList.toggle("active");
    });
    document.addEventListener("click", function (event) {
      if (
        !userMenuToggle.contains(event.target) &&
        !userDropdown.contains(event.target)
      ) {
        userDropdown.classList.remove("active");
      }
    });
  }
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      handleLogout();
    });
  }
}

async function handleLogout() {
  const customerId = getCookie("customer_id");
  const accessToken = getCookie("accessToken");
  if (!customerId || !accessToken) {
    window.location.href = "/";
    return;
  }
  try {
    await fetch("http://localhost:3056/v1/api/BookStore/Logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": customerId,
        "Authorization": accessToken
      }
    });
  } catch (err) {
    // Có thể show thông báo lỗi nếu cần
  }
  // Xóa cookie
  eraseCookie("customer_id");
  eraseCookie("accessToken");
  eraseCookie("email");
  eraseCookie("userName");
  // Chuyển hướng về trang profile
  window.location.href = "/";
}