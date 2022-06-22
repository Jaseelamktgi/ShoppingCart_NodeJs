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
router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id);
  console.log(product);
  res.render('admin/edit-product', { product });
});
router.post('/edit-product/:id', (req, res) => {
  console.log(req.params.id);
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    if (image = req.files.image) {
      let id=req.params.id;
      let image = req.files.image;
      image.mv('./public/product-images/' + id + '.jpg')
    }
    res.redirect('/admin');
  })

})

/* ----------- Delete prodcuts -----------*/
router.get('/delete-product/:id', (req, res) => {
  let productId = req.params.id;
  console.log(productId);
  productHelpers.deleteProduct(productId).then((response) => {
    console.log("DELETED")
    res.redirect('/admin');
   
  });
});


module.exports = router;
