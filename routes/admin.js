var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* --------- GET admin product listing ----------- */
router.get('/', function (req, res, next) {
  productHelpers.getAllProduct().then((products) => {
    res.render('admin/view_products', { admin: true, products });

  })
});

/*-------------- Add-product ---------------*/
router.get('/add-product', (req, res) => {
  res.render('admin/add-product');
});
router.post('/add-product', (req, res) => {
  // console.log(req.body);
  // console.log(req.files.image);    //using value of name attribute 

  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product');
      }
      else {
        console.log(err);
      }
    });
  });
});

/* ----------- Edit prodcuts ------------*/
router.get('/edit-product', (req, res) => {

});

/* ----------- Delete prodcuts -----------*/
router.get('/delete-product:id', (req, res) => {
  let proId = req.params.id;
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/');
  });
});


module.exports = router;
