const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('Pages/lienhe', { layout: 'layouts/lienhe-layout', title: 'Liên Hệ - WebStorage' });
});

module.exports = router;