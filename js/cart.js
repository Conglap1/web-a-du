// Khởi tạo giỏ hàng từ localStorage hoặc tạo mới nếu chưa có
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Hiển thị số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = itemCount;

    // Hiển thị/ẩn số lượng dựa vào số sản phẩm
    if (itemCount > 0) {
      cartCount.style.display = "flex";
    } else {
      cartCount.style.display = "none";
    }
  }
}

// Lưu giỏ hàng vào localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(id, name, price, image) {
  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    // Nếu đã có, tăng số lượng
    existingItem.quantity += 1;
  } else {
    // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: 1,
    });
  }

  // Lưu giỏ hàng và hiển thị thông báo
  saveCart();
  showNotification(`Đã thêm "${name}" vào giỏ hàng!`);
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(id) {
  // Tìm vị trí của sản phẩm trong giỏ hàng
  const index = cart.findIndex((item) => item.id === id);

  if (index !== -1) {
    const removedItem = cart[index];
    // Xóa sản phẩm khỏi mảng
    cart.splice(index, 1);
    // Lưu giỏ hàng và hiển thị thông báo
    saveCart();
    showNotification(`Đã xóa "${removedItem.name}" khỏi giỏ hàng!`);
    // Cập nhật giao diện giỏ hàng
    renderCart();
  }
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateQuantity(id, newQuantity) {
  // Tìm sản phẩm trong giỏ hàng
  const item = cart.find((item) => item.id === id);

  if (item) {
    // Số lượng tối thiểu là 1
    newQuantity = Math.max(1, newQuantity);

    // Cập nhật số lượng
    item.quantity = newQuantity;

    // Lưu giỏ hàng và cập nhật giao diện
    saveCart();
    renderCart();
  }
}

// Hiển thị giỏ hàng trong modal
function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  if (!cartItemsContainer) return;

  // Xóa nội dung cũ
  cartItemsContainer.innerHTML = "";

  // Nếu giỏ hàng trống
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<div class="empty-cart">Giỏ hàng của bạn đang trống</div>';
    cartTotalElement.textContent = "0";
    return;
  }

  // Tính tổng tiền
  let total = 0;

  // Tạo danh sách sản phẩm trong giỏ hàng
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <div class="cart-item-price">${formatCurrency(item.price)}</div>
      </div>
      <div class="cart-item-quantity">
        <button class="quantity-btn minus" onclick="updateQuantity('${
          item.id
        }', ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn plus" onclick="updateQuantity('${
          item.id
        }', ${item.quantity + 1})">+</button>
      </div>
      <div class="cart-item-subtotal">
        ${formatCurrency(itemTotal)}
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.id}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    cartItemsContainer.appendChild(itemElement);
  });

  // Cập nhật tổng tiền
  cartTotalElement.textContent = formatCurrency(total);
}

// Định dạng tiền tệ (VND)
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Mở modal giỏ hàng
function openCartModal() {
  const cartModal = document.getElementById("cart-modal");
  if (cartModal) {
    cartModal.style.display = "flex";
    document.body.style.overflow = "hidden";
    renderCart();
  }
}

// Đóng modal giỏ hàng
function closeCartModal() {
  const cartModal = document.getElementById("cart-modal");
  if (cartModal) {
    cartModal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Xử lý thanh toán
function checkout() {
  if (cart.length === 0) {
    showNotification("Giỏ hàng của bạn đang trống!");
    return;
  }

  // Kiểm tra đăng nhập
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  if (!loggedIn) {
    showNotification("Vui lòng đăng nhập để thanh toán!");
    closeCartModal();
    document.getElementById("login-modal").style.display = "flex";
    return;
  }

  // Xử lý thanh toán ở đây (trong thực tế sẽ chuyển đến trang thanh toán)
  showNotification("Đang chuyển đến trang thanh toán...");
  // Sau khi thanh toán thành công, xóa giỏ hàng
  // cart = [];
  // saveCart();
  // closeCartModal();
}

// Xóa tất cả sản phẩm trong giỏ hàng
function clearCart() {
  if (cart.length === 0) return;

  if (confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?")) {
    cart = [];
    saveCart();
    renderCart();
    showNotification("Đã xóa tất cả sản phẩm trong giỏ hàng!");
  }
}

// Khởi tạo giỏ hàng khi trang web được tải
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  // Thêm sự kiện click cho nút giỏ hàng
  const cartButton = document.getElementById("cart-button");
  if (cartButton) {
    cartButton.addEventListener("click", function (e) {
      e.preventDefault();
      openCartModal();
    });
  }

  // Thêm sự kiện click cho nút đóng modal giỏ hàng
  const cartCloseBtn = document.getElementById("cart-close");
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", closeCartModal);
  }

  // Đóng modal giỏ hàng khi click bên ngoài
  window.addEventListener("click", function (event) {
    const cartModal = document.getElementById("cart-modal");
    if (event.target === cartModal) {
      closeCartModal();
    }
  });

  // Thêm sự kiện cho các nút "Thêm vào giỏ hàng"
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productElement = this.closest(".game-item");
      const id = this.getAttribute("data-id");
      const name = productElement.querySelector("h3").textContent;
      const priceText =
        productElement.querySelector(".product-price").textContent;
      const price = parseInt(priceText.replace(/[^\d]/g, ""));
      const image = productElement
        .querySelector(".game-thumbnail")
        .style.backgroundImage.slice(4, -1)
        .replace(/"/g, "");

      addToCart(id, name, price, image);
    });
  });

  // Thêm sự kiện cho nút thanh toán
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }

  // Thêm sự kiện cho nút xóa tất cả
  const clearCartBtn = document.getElementById("clear-cart-btn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }
});

// Cập nhật hàm showNotification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}
