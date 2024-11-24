const express = require('express'); 
const bodyParse = require('body-parser');
const User = require('../schemas/UserSchema'); 
const bcrypt = require('bcrypt');
const app = express();
const router = express.Router();

router.get("/:id", (req, res, next) =>{
    const payload = {
        pageTitle: "View Discussions",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }
    res.status(200).render("postPage", payload)
}); 


module.exports = router;
