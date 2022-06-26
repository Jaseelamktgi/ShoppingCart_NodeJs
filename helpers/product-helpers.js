var db = require('../config/connection');
var collections = require('../config/collections');
const async = require('hbs/lib/async');
const { reject } = require('bcrypt/promises');
const { response } = require('express');
var objectId = require('mongodb').ObjectId

module.exports = {
    /* ------------ Admin : Add-product -------------- */
    addProduct: (product, callback) => {
        //console.log('product')
        product.price = parseInt(product.price)
        db.get().collection('product').insertOne(product).then((data) => {
            //console.log(data)
            callback(data.insertedId)
        });
    },

    /* ------------ Admin : Get All-product ------------- */
    getAllProduct: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray();
            resolve(products);
        });
    },

    /* ------------- Admin : Update-product ------------- */
    getProductDetails: (productId) => {
        return new Promise((reslove, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION).findOne({ _id: objectId(productId) }).then((product) => {
                reslove(product)
            });
        });
    },
    updateProduct: (productId, proDetails) => {
        return new Promise((reslove, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION)
            .updateOne({ _id: objectId(productId) },{
                $set:{
                    name:proDetails.name,
                    category:proDetails.category,
                    description:proDetails.description,
                    price:proDetails.price
                }
            }).then((response)=>{
                reslove()
            });
        });
    },

    /* ------------- Admin : Delete-product ------------- */
    deleteProduct: (productId) => {
        return new Promise((resolve, reject) => {
            console.log(objectId(productId));
            db.get().collection(collections.PRODUCT_COLLECTION).remove({ _id: objectId(productId) }).then((response) => {
                console.log(response);
                resolve(response);
            });
        });
    }

}