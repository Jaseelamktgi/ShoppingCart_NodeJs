var db = require('../config/connection');
var collections = require('../config/collections');
//Use converting  password into encrypted form 
const bcrypt=require('bcrypt');
const async = require('hbs/lib/async');

module.exports = {
    //-------------User : Signup---------------
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10);     //hash(password from userData,salt round),Salt round-The cost factor controls how much time is needed to calculate a single BCrypt hash.
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then(()=>{
                resolve(userData);
            });
        });
    }

}