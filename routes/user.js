var express = require('express');
const res = require('express/lib/response');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"Rich dad poor dad",
      category:"Personal finance",
      description:" It advocates the importance of financial literacy, financial independence and building wealth through investing in assets ",
      price: 350,
      Image:"https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL.jpg"
    },
    {
      name:"Rich dad poor dad",
      category:"Personal finance",
      description:" It advocates the importance of financial literacy, financial independence and building wealth through investing in assets ",
      price: 350,
      Image:"https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL.jpg"
    },
    {
      name:"Rich dad poor dad",
      category:"Personal finance",
      description:" It advocates the importance of financial literacy, financial independence and building wealth through investing in assets ",
      price: 350,
      Image:"https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL.jpg"
    },
    {
      name:"Rich dad poor dad",
      category:"Personal finance",
      description:" It advocates the importance of financial literacy, financial independence and building wealth through investing in assets ",
      price: 350,
      Image:"https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL.jpg"
    }
  ]
  res.render('index',{admin:false,products});

});

module.exports = router;
