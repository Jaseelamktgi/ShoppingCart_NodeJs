//------mongodb connection creation :---------------

const MongoClient = require('mongodb').MongoClient;
const state = {
    db: null
}
module.exports.connect = function (done) {

    const url = "mongodb+srv://test_user:INhY5HHv4j5FkAFH@cluster0.omhgj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const dbname = 'ShoppingCart';

    MongoClient.connect(url, (err, data) => {
        if (err) {
            console.log("DATABASE ERROR", err);
            return done(err);
        }
        state.db = data.db(dbname);
        console.log("DATABASE CONNECTED");
        
    })
}
module.exports.get = function () {
    return state.db; 
}


