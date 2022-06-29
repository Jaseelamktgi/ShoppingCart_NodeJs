var db = require('../config/connection');
var collections = require('../config/collections');
const bcrypt = require('bcrypt');
const async = require('hbs/lib/async');
const { status } = require('express/lib/response');
const { reject } = require('bcrypt/promises');
const { response } = require('express');
var objectId = require('mongodb').ObjectId
// Razorpay instance creation
const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: 'rzp_test_YvyMMUHgr4kUjQ',
    key_secret: 'ONN4K3ckPFc0DljxagVQL4i2',
});

module.exports = {
    /*------------ User : Signup Action -------------- */
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            //console.log(userData)
            userData.Password = await bcrypt.hash(userData.Password, 10);     //hash(password from userData,salt round),Salt round-The cost factor controls how much time is needed to calculate a single BCrypt hash.
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then(() => {
                resolve(userData);
            });
        });
    },

    /*------------- User : Login Action -------------- */
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ Email: userData.Email });
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("Login success");
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        console.log("Login failed");
                        resolve({ status: false });
                    }
                })
            } else {
                console.log("User not found");
                resolve({ status: false });
            }
        });
    },

    /*------------- User : Add to Cart -------------- */
    addToCart: (productId, userId) => {
        let proObj = {
            item: objectId(productId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (userCart) {
                /*----checks product exist or not ---*/
                let proExist = userCart.products.findIndex(product => product.item == productId)
                console.log(proExist)
                if (proExist != -1) {
                    db.get().collection(collections.CART_COLLECTION)
                        .updateOne({ user: objectId(userId), 'products.item': objectId(productId) },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }
                        ).then(() => {
                            resolve()
                        })
                }
                else {
                    db.get().collection(collections.CART_COLLECTION)
                        .updateOne({ user: objectId(userId) },
                            {
                                $push: { products: proObj }

                            }).then((response) => {
                                resolve();
                            })
                }

            } else {
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve();
                })
            }
        })
    },

    /*---- User : Get Cart-Products(allProductDetails) ---- */
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                }
                /*
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        let: { proList: '$products' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', "$$proList"]
                                    }
                                }
                            }
                        ],
                        as: 'cartItems'
                    }
                }  
                 */
            ]).toArray()
            //console.log(cartItems[0].product)
            resolve(cartItems)
        })
    },

    /*------------ User : Get Cart-count  ------------ */
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },

    /*-------- User : Product-quantity(Inc&Dec) ------- */
    changeProductQuantity: (details) => {
        console.log("printed ", details)
        count = parseInt(details.count)
        quantity = parseInt(details.quantity)

        console.log(details.cart, details.productId)
        return new Promise((resolve, reject) => {
            if (count == -1 && quantity == 1) {
                db.get().collection(collections.CART_COLLECTION)

                    .updateOne({ _id: objectId(details.cart) },
                        {
                            $pull: { products: { item: objectId(details.product) } }
                        }
                    ).then((response) => {
                        resolve({ removeProduct: true })
                    })
            }
            else {
                db.get().collection(collections.CART_COLLECTION)
                    .updateOne({ _id: objectId(details.cart), 'products.item': objectId(details.product) },
                        {
                            $inc: { 'products.$.quantity': count }
                        }
                    ).then((response) => {
                        resolve(true)
                    })
            }
        })
    },

    /*-------- User : Remove product from cart ------- */
    removeProduct: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART_COLLECTION)

                .removeOne({ _id: objectId(details.cart) },
                    {
                        $pull: { products: { item: objectId(details.product) } }
                    }
                ).then((response) => {
                    resolve({ removeProduct: true })
                })
        })

    },

    /*------------ User : Get Cart-count  ------------ */
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },

    /*---------- User : Total-Amount payable --------- */
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$product.price'] } }
                    }
                }

            ]).toArray()
            //console.log("TOTAL", total[0].total)
            resolve(total[0].total)
        })
    },
    /*------------ User : Cart Product List ----------- */
    getCartProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            console.log(userId)
            let cart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: objectId(userId) })
            console.log("CART RESPONSE|||||||", cart)
            resolve(cart.products)
        })
    },

    /*------------ User : Place-Order ----------- */
    placeOrder: (order, products, total) => {
        console.log(products)
        return new Promise((resolve, reject) => {
            console.log(order, products, total)
            let status = order['paymentMethod'] === 'COD' ? 'Order Placed' : 'Pending'
            let orderObj = {
                deliveryDetails: {
                    name: order.name,
                    mobile: order.phone,
                    address: order.address,
                    pincode: order.pincode
                },
                userId: objectId(order.userId),
                paymentMethod: order['paymentMethod'],
                products: products,
                totalAmount: total,
                date: new Date(),
                status: status
            }
            db.get().collection(collections.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                db.get().collection(collections.CART_COLLECTION).deleteOne({ user: objectId(order.userId) })
                console.log("Order Id : ", response.insertedId)
                resolve(response.insertedId)
            })
        })
    },

    /*---------- User : Get All-Orders ---------- */
    getAllOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            console.log("USER", userId)
            let orders = await db.get().collection(collections.ORDER_COLLECTION)
                .find({ userId: objectId(userId) }).toArray()
            //console.log(orders)
            resolve(orders)
        })
    },

    /*---------- User : Get Order Products ---------- */
    getOrderedProducts: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let orderedItems = await db.get().collection(collections.ORDER_COLLECTION).aggregate([
                {
                    $match: { _id: objectId(orderId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$product.price'] } }
                    }
                }
            ]).toArray()
            console.log(orderedItems)
            resolve(orderedItems)
        })

    },

    /*---------- User : Razorpay Integration ---------- */
    generateRazorpay: (orderId, total) => {
        console.log("OrderId&Total", orderId, total)
        return new Promise((resolve, reject) => {
            var options = {
                amount: total,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "" + orderId
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log("ERROR", err)
                } else {
                    console.log("New Order :", order);
                    resolve(order)
                }
            });
        })
    },

     /*---------- User : verify Payment ---------- */
     verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto')
            const hmac = crypto.createHmac('sha256', 'ONN4K3ckPFc0DljxagVQL4i2')

            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
            hmac = hmac.digest('hex')

            if (hmac === details['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject(err)
            }

        })
    }
}