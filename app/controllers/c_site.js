const db = require('../models/db');
const bcrypt = require("bcrypt");
class SitesController {
  // [GET] /views/index
  getList(req, res) {
    let sql = 'SELECT * from type_book';
    let sqlBook = 'SELECT * from book LIMIT 8';

    db.query(sql, (err, typeList) => {
      if (err) throw err;
      db.query(sqlBook, (err, books) => {
        if (err) throw err;
        res.render('views/index', { books, typeList });
      })
    })
  }

  logIn(req, res) {
    let sql = 'SELECT * from type_book';
    db.query(sql, function (err, typeList) {
      res.render('views/login', { typeList });
    })
  }

  handleLogIn(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let sql = `SELECT * FROM users WHERE username = "${username}" `;
    db.query(sql, (err, rows) => {
      if (err) throw err;
      if (rows.length <= 0) {
        res.send('Không tìm thấy tài khoản !')
        return;
      }
      let user = rows[0];
      let result = bcrypt.compare(password, user.password);
      console.log(password);
      console.log(result);
      console.log(sql);
      console.log(user);
      result ? res.send('SUCCESSFULLY!!') : res.send('Đăng nhập thất bại')
    });
  }

  signUp(req, res) {
    let sql = 'SELECT * from type_book';
    db.query(sql, function (err, typeList) {
      res.render('views/signup', { typeList });
    })
  }

  handleSignUp(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let fullname = req.body.fullname;
    let address = req.body.address;
    let email = req.body.email;
    let salt = bcrypt.genSaltSync(10);
    let encode_password = bcrypt.hashSync(password, salt);

    const user = { fullname, username, password: encode_password, adress: address, email };

    let sql = 'INSERT INTO users SET ?';
    db.query(sql, user, function (err) {
      if (err) throw err;
      res.send('Đăng ký thành công !');
    });
  }


}

module.exports = new SitesController;