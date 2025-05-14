const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('Pages/quatang', { layout: 'layouts/quatang-layout', title: 'Quà Tặng - WebStorage' });
});

module.exports = router;