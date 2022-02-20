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
    let salt = bcrypt.genSaltSync(10);
    let encode_password = bcrypt.hashSync(password, salt);

    const user = { fullname, username, password: encode_password, address, email };

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
      const result = bcrypt.compareSync(password, pass_fromdb);

      if (result) {
        req.session.logged = true;
        req.session.username = user.username;
        res.redirect('/home');
      } else {
        res.redirect('/login')
      }
    });
  }

  // [GET] /views/logout
  logOut(req, res) {
    req.session.destroy();
    res.redirect('/home');
  }

}

module.exports = new SitesController;