const express = require('express'); 
const User = require('../../schemas/UserSchema'); 
const Post = require('../../schemas/PostSchema'); 
const app = express();
const router = express.Router();


router.get("/", async (req, res, next) => {
    const results = await getPosts({});
    res.status(200).send(results)
}); 
router.get("/:id", async (req, res, next) => {
    const postId = req.params.id; 

    let postData = await getPosts({_id: postId});
    postData = postData[0];

    res.status(200).send(results)
   
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

    if (req.body.replyTo){
        postData.replyTo = req.body.replyTo;
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
// like button
router.put("/:id/like", async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.session.user._id; 

    const isLiked = req.session.user.likes && req.session.user.likes.includes(postId); 

    const option = isLiked === true ? "$pull" : "$addToSet"
   
    //add user like to the db
    req.session.user = await User.findByIdAndUpdate(
      userId,
      { [option]: { likes: postId } },
      { new: true }
    ).catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
    //add post like to the db
    const post = await Post.findByIdAndUpdate(
      postId,
      { [option]: { likes: userId } },
      { new: true }
    ).catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });

    res.status(200).send(post)
}); 


async function getPosts(filter) {
  let results = await Post.find(filter)
    .populate("postedBy")
    .populate("replyTo")
    .sort({ createdAt: -1 })
    .catch((err) => {
      console.log(err);
    });
    results = await User.populate(results, {path: "replyTo.postedBy"})
    return results
}
module.exports = router;
