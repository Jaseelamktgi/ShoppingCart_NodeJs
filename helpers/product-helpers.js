var db = require('../config/connection');
var collections = require('../config/collections');
const async = require('hbs/lib/async');

module.exports = {
    //-------------Admin : Add-product---------------
    addProduct: (product, callback) => {
        //console.log('product')
        db.get().collection('product').insertOne(product).then((data) => {
            //console.log(data)
            callback(data.insertedId)
        })
    },
    //-------------Admin : Get All-product---------------
    getAllProduct: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray();
            resolve(products);
        })
    }
}