const { ensureAuthenticated } = require("../middleware/checkAuth");
const { getSubs, getPosts, decoratePost } = require("../fake-db");
import express from "express";
// import * as database from "../controller/postController";
const router = express.Router();

router.get("/list", async (req, res) => {
  const subTypes = getSubs(); // retrieve array of subnames
  subTypes.sort();
  res.render("subs", { subTypes });
});

router.get("/show/:subname", async (req, res) => {
  try{
    // post's subgroup
  const { subname } = req.params;

  // get "n" number of posts by their subgroup
  const posts = getPosts(20, subname);

  // initialize empty array to store decorated posts
  const decoratedPosts = [];

  // check if any post exist
  if(!posts || posts.length === 0){
    const errMessage = "Post not found"
    console.log(errMessage);
    res.status(400).send(errMessage).redirect("/");
  }

  // populate array with posts that matches sub
  for (let post of posts){
    decoratedPosts.push(decoratePost(post));
  }

  res.render("sub", { posts : decoratedPosts });
  } catch (err) {
    res.status(500).send(err).redirect("/");
  }
});

export default router;
