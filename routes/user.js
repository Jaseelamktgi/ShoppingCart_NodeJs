var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProduct().then((products)=>{
    res.render('index',{products});
  });
});
router.get('/login',(req,res)=>{
  res.render('user/login');
});
router.get('/signup',(req,res)=>{
  res.render('user/signup');
});
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
  });
});

module.exports = router;
