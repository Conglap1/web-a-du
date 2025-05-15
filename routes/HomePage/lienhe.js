var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Pages/LienHe', { title : 'Trang-Liên-Hệ-Cửa-Hàng-Online' });
});

module.exports = router;
