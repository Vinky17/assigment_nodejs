const db = require('../models/db');

function slugify(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    .replace(/ì|í|ị|ỉ|ĩ/g, "i")
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    .replace(/đ/g, "d")
    .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
    .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
    .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
    .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
    .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
    .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
    .replace(/Đ/g, "D");
}


class AdminController {
  // [GET] admin/home
  index(req, res) {
    res.render('admin/home')
  }

  productsApi(req, res) {
    let sql = 'SELECT * from book';
    db.query(sql, function (err, books) {
      if (err) { throw err; }
      res.json(books);
    })
  }

  typeProductsApi(req, res) {
    let sql = 'SELECT * from type_book';
    db.query(sql, function (err, types) {
      if (err) { throw err; }
      res.json(types);
    })
  }

  // [GET] admin/list-product
  listProduct(req, res) {
    res.render('admin/list-product');
  }


  // [GET] admin/update-product/:id
  updateProduct(req, res) {
    let id = req.params.id;
    let sql = 'SELECT * FROM type_book';
    let sqlBook = 'SELECT * FROM book WHERE id = ' + id;
    db.query(sql, (err, type) => {
      if (err) throw err;
      db.query(sqlBook, (err, book) => {
        if (err) throw err;
        res.render('admin/update-product', { type, book: book[0] });
      })
    })
  }

  // [POST] admin/update-product
  handleUpdateProduct(req, res) {
    let file = req.file;
    let id = req.body.id;
    let tittle = req.body.tittle;
    let author = req.body.author;
    let description = req.body.description;
    let fk_type_id = req.body.type_book;
    let image = file.filename;
    console.log(id);

    let newBook = {
      tittle,
      author,
      description,
      image,
      slug: slugify(tittle),
      fk_type_id,
    }

    db.query(`UPDATE book SET ? WHERE id = ?`,
      [newBook, id], (err, data) => {
        if (err) throw err;
        res.send('Cập nhật thành công!')
      })
  }

  // [GET] admin/delete-product:id
  deleteProduct(req, res) {
    let id = req.params.id;
    let sqlBook = 'DELETE FROM book WHERE id = ' + id;
    db.query(sqlBook, (err, data) => {
      if (err) throw err;
      res.redirect('/admin/home');
    })
    console.log(sqlBook);
  }

  // [GET] admin/add-product
  addProduct(req, res) {
    let sql = 'SELECT * FROM type_book';
    db.query(sql, (err, type) => {
      if (err) throw err;
      res.render('admin/add-product', { type });
    })
  }

  // [POST] admin/add-product
  handleAddProduct(req, res) {
    let file = req.file;
    let tittle = req.body.tittle;
    let author = req.body.author;
    let description = req.body.description;
    let fk_type_id = req.body.type_book;
    let image = file.filename;

    let newBook = {
      tittle,
      author,
      description,
      image,
      slug: slugify(tittle),
      fk_type_id
    }

    db.query('INSERT INTO book SET ?', newBook, (err, data) => {
      if (err) throw err;
      res.redirect('/products');
    })
  }

  // [GET] admin/types/list-type-product
  listTypeProducts(req, res) {
    res.render('admin/types/list-type-product')
  }

  // [GET] admin/types/add-type-product
  addTypeProduct(req, res) {
    let sql = 'SELECT * FROM type_book';
    db.query(sql, (err, type) => {
      if (err) throw err;
      res.render('admin/types/add-type-product', { type });
    })
  }

  // [POST] admin/types/add-type-product
  handleAddTypeProduct(req, res) {
    let type_name = req.body.type_name;
    let status = req.body.status;

    let sql = `
    INSERT INTO type_book (type_name,status )
    VALUES ('${type_name}', ${status}) `

    db.query(sql, (err, data) => {
      if (err) throw err;
      res.send('Thêm thành công');
    })
  }

  // [GET] admin/delete-type-product:id
  deleteTypeProduct(req, res) {
    let id = req.params.id;
    let sqlBook = 'DELETE FROM type_book WHERE pk_type_id = ' + id;
    db.query(sqlBook, (err, data) => {
      if (err) throw err;
      res.send('Xóa thành công')
    })
  }

  // [GET] admin/types/update-type-product/:id
  updateTypeProduct(req, res) {
    let sql = 'SELECT * FROM type_book';
    db.query(sql, (err, type) => {
      if (err) throw err;
      res.render('admin/types/update-type-product', { type });
      console.log(type);
    })
  }

  // [POST] admin/update-product
  handleUpdateProduct(req, res) {
    let file = req.file;
    let id = req.body.id;
    let tittle = req.body.tittle;
    let author = req.body.author;
    let description = req.body.description;
    let fk_type_id = req.body.type_book;
    let image = file.filename;
    console.log(id);

    let newBook = {
      tittle,
      author,
      description,
      image,
      slug: slugify(tittle),
      fk_type_id,
    }

    db.query(`UPDATE book SET ? WHERE id = ?`,
      [newBook, id], (err, data) => {
        if (err) throw err;
        res.send('Cập nhật thành công!')
      })
  }
}

module.exports = new AdminController;