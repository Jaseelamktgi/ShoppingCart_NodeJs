const { response } = require('express');
var express = require('express');
const session = require('express-session');
const res = require('express/lib/response');
const async = require('hbs/lib/async');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
var userHelpers = require('../helpers/user-helpers');

/*-------- Creating verifyLogin as Middleware -------- */
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  }
  else {
    res.redirect('/login');
  }
};

/*--------------- GET home page ------------------ */
router.get('/', async function (req, res, next) {
  let user = req.session.user;
  console.log(user);
  /*---- Dispaly Cart-count ----*/
  let cartCount = null
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
    console.log(cartCount)
    
}
  
  /* ---- Dispaly products ----*/
  productHelpers.getAllProduct().then((products) => {
    res.render('index', { products, user, cartCount });
  });
});

/*--------------- GET login page ----------------- */
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  /*----invalid user checking -----*/
  else {
    res.render('user/login', { 'loginErr': req.session.loginErr });
    req.session.loginErr = "Invalid username or password"; 
  }
});

/*--------------- GET signup page ----------------- */
router.get('/signup', (req, res) => {
  res.render('user/signup');
});

/*------------- Submit signup page ---------------- */
router.post('/signup', (req, res) => {
  //console.log(req.body)
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn = true;
    req.session.user = response.user;
    res.redirect('/');
  });
});

/*--------------- Submit login page ----------------- */
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    console

    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect('/');
    }
    else {
      res.redirect('/login');

    }
  });
});

/*-------------- Destroys the session -------------- */
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

/*-----------------  View cart -------------------- */
router.get('/cart', verifyLogin, async (req, res) => {
  let products = await userHelpers.getCartProducts(req.session.user._id)
  console.log(products)
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/cart', { products, user: req.session.user ,total});
});

/*------------------ Add to Cart ------------------ */
router.get('/add-to-cart/:id', (req, res) => {
  console.log("API call")
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    //res.redirect('/');
    res.json({status:true})
  });
});

/* ------------ change product quantity ----------- */
router.post('/change-product-quantity',(req,res)=>{
  console.log(req.body)
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total=await userHelpers.getTotalAmount(req.body.user)
    res.json(response)
  });
});

/* ------------ Remove product from cart----------- */
router.post('/remove-product',(req,res)=>{
  userHelpers.removeProduct(req.body).then((response)=>{

    res.json(response)
  });
})

/* ----------------- Place Order ------------------ */
router.get('/place-order',verifyLogin,async(req,res)=>{
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  console.log(total)
  res.render('user/place-order',{total,user:req.session.user})
})

router.post('/place-order',async(req,res)=>{
  let products=await userHelpers.getCartProductList(req.body.userId)
  let totalPrice=await userHelpers.getTotalAmount(req.body.userId )
  userHelpers.placeOrder(req.body,products,totalPrice).then((response)=>{
    res.json({status:true})

  })
  console.log(req.body)
})
module.exports = router;
