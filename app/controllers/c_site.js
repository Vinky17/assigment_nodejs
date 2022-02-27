const db = require('../models/db');
const mailer = require('../models/mailer');
const bcrypt = require("bcrypt");
class SitesController {

  async sendMail(req, res) {
    try {
      // Lấy data truyền lên từ form phía client
      const to = req.body.to
      // Thực hiện gửi email
      await mailer.sendMail(to)
      // Quá trình gửi email thành công thì gửi về thông báo success cho người dùng
      res.send('<h1>Gửi email thành công!.</h1>')
    } catch (error) {
      // Nếu có lỗi thì log ra để kiểm tra và cũng gửi về client
      console.log(error)
      res.send(error)
    }
  }

  // [GET] /views/index
  getList(req, res) {
    let sql = 'SELECT * from type_book';
    let sqlBook = 'SELECT * from book LIMIT 8';

    db.query(sql, (err, typeList) => {
      if (err) throw err;
      db.query(sqlBook, (err, books) => {
        if (err) throw err;
        if (req.session.logged) {
          res.render('views/index', { books, typeList, user: req.session.username });
        } else {
          res.render('views/index', { books, typeList });
        }
      })
    })
  }

  // [GET] /views/signup
  signUp(req, res) {
    let sql = 'SELECT * from type_book';
    db.query(sql, function (err, typeList) {
      res.render('views/signup', { typeList });
    })
  }

  // [POST] /views/signup
  handleSignUp(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let fullname = req.body.fullname;
    let address = req.body.address;
    let email = req.body.email;
    let role = req.body.role;
    let salt = bcrypt.genSaltSync(10);
    let encode_password = bcrypt.hashSync(password, salt);

    const user = { fullname, username, password: encode_password, role, address, email };

    let sql = 'INSERT INTO users SET ?';
    db.query(sql, user, function (err) {
      if (err) throw err;
      res.send('Đăng ký thành công !');
    });
  }

  // [GET] /views/login
  logIn(req, res) {
    let sql = 'SELECT * from type_book';
    db.query(sql, function (err, typeList) {
      res.render('views/login', { typeList });
    })
  }

  // [POST] /views/login
  async handleLogIn(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let sql = `SELECT * FROM users WHERE username = ? `;
    db.query(sql, username, (err, rows) => {
      if (err) throw err;
      if (rows.length <= 0) {
        res.send('Không tìm thấy tài khoản !')
        return;
      }
      const user = rows[0];
      const pass_fromdb = user.password;
      const role = user.role;
      const result = bcrypt.compareSync(password, pass_fromdb);

      if (result) {
        if (role !== 1) {
          req.session.logged = true;
          req.session.username = user.username;
          res.redirect('/');
        } else {
          res.redirect('/admin/home')
        }
      } else {
        res.redirect('/login')
      }
    });
  }

  // [GET] /views/logout
  logOut(req, res) {
    req.session.destroy();
    res.redirect('/');
  }

  // [GET] /views/search
  search(req, res) {
    const tittle = req.query.tittle;
    const sql = 'SELECT * FROM book';
    const sqlBook = 'SELECT * FROM type_book';
    db.query(sql, function (err, books) {
      db.query(sqlBook, function (err, typeList) {
        const data = books.filter(function (item) {
          return item.tittle.toLowerCase().indexOf(tittle.toLowerCase()) !== -1
        });
        if (data.length > 0) {
          res.render('views/product/list', {
            books: data,
            typeList
          });
        } else { res.send('Không tìm thấy sản phẩm !'); }
      })
    })
  }
}


module.exports = new SitesController;