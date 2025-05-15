var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // Lấy thông tin user từ session hoặc cookie nếu có
  const userName = req.session?.userName || null;
  const userInitial = userName ? userName.charAt(0).toUpperCase() : null;
  res.render('Pages/home', { 
    title: 'Trang Chủ',
    userName,
    userInitial
  });
});

module.exports = router;
