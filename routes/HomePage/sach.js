const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('Pages/sach', { layout: 'layouts/default-layout', title: 'Sách - WebStorage' });
});

module.exports = router;