const db = require('../models/db');

class ProductsController {
  // [GET] /products/
  list(req, res, next) {
    let sql = 'SELECT pk_type_id, type_name from type_book';
    let sqlBook = 'SELECT * from book';

    db.query(sql, (err, typeList) => {
      if (err) throw err;

      db.query(sqlBook, (err, books) => {
        if (err) throw err;
        res.render('views/product/list', { books, typeList });
      })
    })
  }

  // [GET] /products/:slug&:id -> detail
  detail(req, res, next) {
    let slug = req.params.slug;
    let id = req.params.id;
    let sql = 'SELECT * from type_book';
    let sqlBook = `SELECT * from book WHERE slug = '${slug}' AND fk_type_id = ${id}`;

    db.query(sql, (err, typeList) => {
      if (err) throw err;
      db.query(sqlBook, (err, bookDetail) => {
        if (err) throw err;
        res.render('views/product/detail', { bookDetail, typeList });
      })
    })
  }

  // [GET] /products/:id -> hiện sản phẩm theo loại
  viewList(req, res, next) {
    let id = req.params.id;
    let sql = 'SELECT * from type_book';
    let sqlBook = `SELECT * from book WHERE fk_type_id = '${id}'`;

    db.query(sql, (err, typeList) => {
      if (err) throw err;

      db.query(sqlBook, (err, books) => {
        if (err) throw err;
        res.render('views/product/list', { books, typeList });
      })
    })
  }
}
module.exports = new ProductsController;