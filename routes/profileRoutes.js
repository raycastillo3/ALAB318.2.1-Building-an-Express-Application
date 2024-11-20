const express = require('express'); 
const app = express();
const router = express.Router();
const bodyParse = require('body-parser');


router.get("/", (req, res, next) =>{
    const payload = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }

    res.status(200).render("profilePage", payload)
})

module.exports = router;