const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('Pages/index', { layout: 'layouts/default-layout', title: 'Trang Chủ - WebStorage' });
});

module.exports = router;