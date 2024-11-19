const express = require('express'); 
const app = express();
const router = express.Router();
const bodyParse = require('body-parser');
const User = require('../schemas/UserSchema'); 
const bycrypt = require('bcrypt');

app.set("view engine", "pug"); 
app.set("views", "views");

app.use(bodyParse.urlencoded({ extended: false}))

router.get("/", (req, res, next) =>{
    res.status(200).render("register");
}); 

router.post("/", async (req, res, next) =>{
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password;

    const payload = req.body

    if (firstName && lastName && username && email && password){
        const user = await User.findOne({
            $or: [
                {username: username },
                {email: email }
            ]
        })
        .catch((err) =>{
            console.message(err);
            payload.errorMessage = "Something is wrong with the Database"
            res.status(200).render("register", payload);
        }); 

        if (user == null) {
            let data = req.body; 

            data.password = await bycrypt.hash(password, 10)

            User.create(data)
            .then((user) =>{
                req.session.user = user;
                return res.redirect("/")
            })
        } else {
           if (email == user.email) {
            payload.errorMessage = "Email already exists"
        } else {
            payload.errorMessage = "Username already exists"
           }
           res.status(200).render("register", payload);
        }
        // res.status(201).send("success");
        console.log(payload);
    } else {
        payload.errorMessage = "Add a valid value to each field"
        res.status(200).render("register", payload);
    }
}); 
module.exports = router;
