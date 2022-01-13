const siteRouter = require('./r_site');
const productsRouter = require('./r_product');
const adminRouter = require('./r_admin');
function route(app) {

  app.use('/products', productsRouter);
  app.use('/admin', adminRouter);
  app.use('/', siteRouter);
}

module.exports = route;