var db = require('../config/connection');
var collections = require('../config/collections');
//Use converting  password into encrypted form 
const bcrypt=require('bcrypt');
const async = require('hbs/lib/async');
const { status } = require('express/lib/response');

module.exports = {
    /*--------------User : Signup Action--------------- */
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            //console.log(userData)
            userData.Password=await bcrypt.hash(userData.Password,10);     //hash(password from userData,salt round),Salt round-The cost factor controls how much time is needed to calculate a single BCrypt hash.
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then(()=>{
                resolve(userData);
            });
        });
    },
    /*--------------User : Login Action--------------- */
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false;
            let response={}
            let user=await db.get().collection(collections.USER_COLLECTION).findOne({Email:userData.Email});
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("Login success");
                        response.user=user;
                        response.status=true;
                        resolve(response);
                    }else{
                        console.log("Login failed");
                        resolve({status:false});
                    }
                })
            }else{
                console.log("User not found");
                resolve({status:false});
            }
        })
    }

}