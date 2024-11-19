const express = require('express'); 
const bodyParse = require('body-parser');
const User = require('../schemas/UserSchema'); 
const bcrypt = require('bcrypt');
const app = express();
const router = express.Router();

app.set("view engine", "pug"); 
app.set("views", "views");

app.use(bodyParse.urlencoded({extended: false})); 

router.get("/", (req, res, next) =>{
    res.status(200).render("login")
}); 

router.post("/", async (req, res, next) =>{

    const payload = req.body; 
    if (req.body.logUsername && req.body.logPassword){
        const user = await User.findOne({
            $or: [
                {username: req.body.logUsername },
                {email: req.body.logUsername }
            ]
        })
        .catch((err) =>{
            console.message(err);
            payload.errorMessage = "Something is wrong with the Database"
            res.status(200).render("login", payload);
        }); 
        if (user != null) {
            const result = await bcrypt.compare(req.body.logPassword, user.password);
            if (result === true){
                req.session.user = user;
                return res.redirect("/");
            }
        }
        payload.errorMessage = "Login Information Incorrect"
        res.status(200).render("login", payload);
    }
    payload.errorMessage = "Each field cant be empty"
    res.status(200).render("login")
}); 

module.exports = router;
