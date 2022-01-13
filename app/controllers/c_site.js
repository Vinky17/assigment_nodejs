const db = require('../models/db');
class SitesController {
  // [GET] /views/index
  getList(req, res) {
    let sql = 'SELECT pk_type_id, type_name from type_book';
    let sqlBook = 'SELECT * from book LIMIT 8';

    db.query(sql, (err, typeList) => {
      if (err) throw err;

      db.query(sqlBook, (err, books) => {
        if (err) throw err;
        res.render('views/index', { books, typeList });
      })
    })
  }
}

module.exports = new SitesController;