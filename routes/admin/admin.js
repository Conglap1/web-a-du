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

// Thêm các route khác cho admin ở đây

module.exports = router;