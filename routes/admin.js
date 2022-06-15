var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
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
  res.render('admin/view_products', { admin: true ,products});

});


module.exports = router;
