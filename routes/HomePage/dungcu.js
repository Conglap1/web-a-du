const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('Pages/dungcu', { layout: 'layouts/dungcu-layout', title: 'Dụng Cụ - WebStorage' });
});

module.exports = router;