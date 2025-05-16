document.getElementById('show-draft-products').addEventListener('click', async function(e) {
  e.preventDefault();
  const container = document.getElementById('admin-product-list');
  container.innerHTML = '<p>Đang tải sản phẩm chưa công bố...</p>';
  try {
    const res = await fetch('http://localhost:3056/v1/api/product/drafts/all');
    const data = await res.json();
    const products = data.metadata || [];
    container.innerHTML = `
      <div class="product-list">
        ${products.map(p => `
          <div class="product-card">
            <img src="${p.product_thumb}" alt="${p.product_name}">
            <div class="product-info">
              <h3>${p.product_name}</h3>
              <div class="product-price">${p.product_price ? p.product_price.toLocaleString() : ''} đ</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    container.innerHTML = '<p>Lỗi tải sản phẩm chưa công bố!</p>';
  }
});