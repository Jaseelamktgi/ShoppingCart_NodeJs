var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
var userHelpers = require('../helpers/user-helpers');

/*-------- Creating verifyLogin as Middleware -------- */
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next();
  }
  else{
    res.redirect('/login');
  }
} ;

/*--------------- GET home page ------------------ */
router.get('/', function (req, res, next) {
  let user = req.session.user;
  // console.log(user);
  productHelpers.getAllProduct().then((products) => {
    res.render('index', { products, user });
  });
});

/*--------------- GET login page ----------------- */
router.get('/login', (req, res) => {
  if(req.session.loggedIn){
    res.redirect('/')
  }
  /*----invalid user checking -----*/
  else{
  res.render('user/login',{'loginErr':req.session.loginErr});
  req.session.loginErr="Invalid username or password";
  }
});

/*--------------- GET signup page ----------------- */
router.get('/signup', (req, res) => {
  res.render('user/signup');
});

/*--------------- POST signup page ---------------- */
router.post('/signup', (req, res) => {
  //console.log(req.body)
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
  });
});

/*--------------- POST login page ----------------- */
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

/*-------------- Destroys the session --------------- */
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

/*-------------                     ----------------- */
router.get('/cart',verifyLogin,(req,res)=>{
  res.render('user/cart');
});

module.exports = router;
