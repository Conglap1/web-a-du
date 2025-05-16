async function loadProducts(containerSelector = '.product-list-flex') {
  try {
    const response = await fetch("http://localhost:3056/v1/api/product");
    const data = await response.json();
    const products = data.metadata || [];
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Lưu _id của tất cả sản phẩm vào sessionStorage
    const productIds = products.map(p => p._id);
    sessionStorage.setItem("productIds", JSON.stringify(productIds));

    // Tạo map lưu product_type theo từng product_id
    const productMap = {};
    products.forEach(p => {
      productMap[p._id] = p.product_type;
    });
    sessionStorage.setItem("productMap", JSON.stringify(productMap));

    container.innerHTML = `
      <div class="product-list-flex">
        ${products.map(p => `
          <div class="product-card" data-id="${p._id}">
            <div class="product-thumb-wrap">
              <img src="${p.product_thumb}" alt="${p.product_name}" class="product-thumb">
            </div>
            <div class="product-info">
              <div class="product-title" title="${p.product_name}">${p.product_name}</div>
              <div class="product-price-group">
                <span class="product-price">${p.product_price ? p.product_price.toLocaleString() : ''} đ</span>
              </div>
              <button class="edit-btn" data-id="${p._id}" style="margin:8px 8px 0 0;background:#3498db;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;">Sửa</button>
              <button class="delete-btn" data-id="${p._id}" data-type="${p.product_type}" style="margin-top:8px;color:#fff;background:#e74c3c;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;">Xóa</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Thêm sự kiện click để lấy _id
    container.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        sessionStorage.setItem('selectedProductId', productId);
      });
    });

    // Gắn sự kiện cho nút xóa
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const productId = this.getAttribute('data-id');
        const productMap = JSON.parse(sessionStorage.getItem('productMap') || '{}');
        const productType = productMap[productId];
        if (!productType) {
          alert('Không xác định được loại sản phẩm!');
          return;
        }
        sessionStorage.setItem('selectedProductId', productId);
        sessionStorage.setItem('selectedProductType', productType);
        deleteSelectedProduct(productId, productType).then(() => {
          loadProducts(containerSelector);
        });
      });
    });

    // Gắn sự kiện cho nút sửa
    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const productId = this.getAttribute('data-id');
        const productMap = JSON.parse(sessionStorage.getItem('productMap') || '{}');
        const productType = productMap[productId];
        const products = JSON.parse(sessionStorage.getItem('products') || '[]');
        const product = products.find(p => p._id === productId);
        if (!product) return alert('Không tìm thấy sản phẩm!');
        showEditModal(product, productType);
      });
    });

    // Lưu products vào sessionStorage khi load
    sessionStorage.setItem('products', JSON.stringify(products));
  } catch (err) {
    console.error(err);
  }
}

// Xóa sản phẩm
async function deleteSelectedProduct(productId, productType) {
  if (!productId || !productType) {
    alert('Không tìm thấy sản phẩm hoặc loại sản phẩm để xóa!');
    return;
  }
  if (!confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;

  // Lấy accessToken và customer_id từ cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  }
  const accessToken = getCookie("accessToken");
  const customerId = getCookie("customer_id");

  try {
    const response = await fetch(`http://localhost:3056/v1/api/product/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': customerId,
        'Authorization': accessToken
      },
      body: JSON.stringify({ product_type: productType })
    });
    const result = await response.json();
    if (response.ok) {
      alert('Xóa thành công!');
    } else {
      alert(result.message || 'Xóa thất bại!');
    }
  } catch (err) {
    alert('Lỗi kết nối server!');
  }
}

async function updateProduct(productId, productType, body) {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  }
  const accessToken = getCookie("accessToken");
  const customerId = getCookie("customer_id");

  const response = await fetch(`http://localhost:3056/v1/api/product/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': customerId,
      'Authorization': accessToken
    },
    body: JSON.stringify({ ...body, product_type: productType })
  });
  const result = await response.json();
  if (response.ok) {
    alert('Cập nhật thành công!');
  } else {
    alert(result.message || 'Cập nhật thất bại!');
  }
}

// function showEditModal(product, productType) {
//   const modal = document.getElementById('editModal');
//   const fields = document.getElementById('editFields');
//   let html = `
//     <label>Tên sản phẩm</label>
//     <input name="product_name" value="${product.product_name || ''}" required>
//     <label>Giá</label>
//     <input name="product_price" type="number" value="${product.product_price || ''}" required>
//     <label>Số lượng</label>
//     <input name="product_quantity" type="number" value="${product.product_quantity || ''}" required>
//     <label>Mô tả</label>
//     <textarea name="product_description">${product.product_description || ''}</textarea>
//   `;
//   // Thêm các trường đặc thù
//   if (productType === 'Book') {
//     const attr = product.product_attributes || {};
//     html += `
//       <label>Tiêu đề</label><input name="title" value="${attr.title || ''}" required>
//       <label>Tác giả</label><input name="author" value="${attr.author || ''}" required>
//       <label>NXB</label><input name="publisher" value="${attr.publisher || ''}" required>
//       <label>Năm XB</label><input name="publication_year" type="number" value="${attr.publication_year || ''}" required>
//       <label>ISBN</label><input name="isbn" value="${attr.isbn || ''}" required>
//       <label>Thể loại</label><input name="genre" value="${attr.genre || ''}" required>
//       <label>Ngôn ngữ</label><input name="language" value="${attr.language || ''}" required>
//       <label>Định dạng</label><input name="format" value="${attr.format || ''}" required>
//     `;
//   }
//   // Thêm tương tự cho Stationery và Gift...
//   fields.innerHTML = html;
//   modal.classList.remove('hidden');

//   // Đóng modal
//   document.getElementById('closeEditModal').onclick = () => modal.classList.add('hidden');

//   // Submit form sửa
//   document.getElementById('editForm').onsubmit = async function(e) {
//     e.preventDefault();
//     const formData = new FormData(this);
//     const body = {};
//     formData.forEach((v, k) => body[k] = v);
//     // Tách product_attributes
//     let product_attributes = {};
//     if (productType === 'Book') {
//       product_attributes = {
//         title: body.title, author: body.author, publisher: body.publisher,
//         publication_year: body.publication_year, isbn: body.isbn,
//         genre: body.genre, language: body.language, format: body.format
//       };
//     }
//     // Tương tự cho Stationery, Gift...
//     // Xóa các trường attributes khỏi body
//     ['title','author','publisher','publication_year','isbn','genre','language','format'].forEach(k => delete body[k]);
//     body.product_attributes = product_attributes;
//     body.product_type = productType;

//     // Gửi PATCH lên server
//     await updateProduct(product._id, productType, body);
//     modal.classList.add('hidden');
//     loadProducts('.product-list-flex'); // reload lại danh sách
//   };
// }

// // Inject modal sửa sản phẩm vào cuối body nếu chưa có
// if (!document.getElementById('editModal')) {
//   const modalHtml = `
//     <div id="editModal" class="hidden" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:1000;">
//       <form id="editForm" style="background:#fff;padding:24px;border-radius:8px;min-width:320px;max-width:90vw;">
//         <h3>Sửa sản phẩm</h3>
//         <div id="editFields"></div>
//         <div style="margin-top:16px;text-align:right;">
//           <button type="button" id="closeEditModal" style="margin-right:8px;">Hủy</button>
//           <button type="submit">Lưu</button>
//         </div>
//       </form>
//     </div>
//   `;
//   document.body.insertAdjacentHTML('beforeend', modalHtml);

//   // Gắn sự kiện đóng modal NGAY SAU khi inject
//   document.getElementById('closeEditModal').onclick = function() {
//     document.getElementById('editModal').classList.add('hidden');
//   };
// }