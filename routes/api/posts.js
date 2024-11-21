const express = require('express'); 
const User = require('../../schemas/UserSchema'); 
const Post = require('../../schemas/PostSchema'); 
const app = express();
const router = express.Router();


router.get("/", (req, res, next) => {
    Post
        .find()
        .populate("postedBy")
        .then((results) => {
            res.status(200).send(results);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400)
        })
}); 

router.post("/", async (req, res, next) => {
    if (!req.body.content) {
        console.log("content param not sent with request");
        return res.sendStatus(400);
    }
    const postData = {
        content: req.body.content,
        postedBy: req.session.user
    }
    Post.create(postData)
    .then(async (newPost) => {
        newPost = await User.populate(newPost, {path: "postedBy"})
        res.status(201).send(newPost)
    })
    .catch((err) =>{
        console.log(err);
        res.sendStatus(400)
    })
}); 

module.exports = router;
