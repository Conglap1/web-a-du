const express = require('express');
const router = express.Router();

// Trang admin dashboard
router.get('/', (req, res) => {
  res.render('admin/Pages/dashboard', { title: 'Admin Dashboard' });
});

// Trang thêm sản phẩm
router.get('/add-product', (req, res) => {
  res.render('admin/Pages/addProduct', { title: 'Thêm sản phẩm' });
});

// Trang sửa sản phẩm
router.get('/edit-product/:id', (req, res) => {
  const productId = req.params.id;
  // Tìm sản phẩm theo ID và truyền dữ liệu vào trang sửa
  res.render('admin/Pages/editProduct', { title: 'Sửa sản phẩm', productId });
});

// Thêm các route khác cho admin ở đây

module.exports = router;