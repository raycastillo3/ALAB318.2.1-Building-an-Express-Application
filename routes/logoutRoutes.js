const express = require('express'); 
const bodyParse = require('body-parser');
const User = require('../schemas/UserSchema'); 
const bcrypt = require('bcrypt');
const app = express();
const router = express.Router();

app.use(bodyParse.urlencoded({extended: false})); 

router.get("/", (req, res, next) =>{
   if (req.session){
    req.session.destroy(()=>{
        res.redirect("/login")
    })
   }
}); 

module.exports = router;
