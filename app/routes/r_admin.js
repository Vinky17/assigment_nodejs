const express = require('express');
const router = express.Router();
const adminController = require('../controllers/c_admin');

const multer = require('multer');
// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //files khi upload xong sẽ nằm trong thư mục "uploads" này - các bạn có thể tự định nghĩa thư mục này
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    // tạo tên file = thời gian hiện tại nối với số ngẫu nhiên => tên file chắc chắn không bị trùng
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, filename + '-' + file.originalname);
  }
})
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const upload = multer({ storage: storage });

router.get('/add-product', adminController.addProduct);
router.post('/add-product', upload.single('image'), adminController.handleAddProduct);
router.get('/', adminController.index);

module.exports = router;