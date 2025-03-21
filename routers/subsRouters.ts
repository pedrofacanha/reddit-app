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
  const { subname } = req.params; // post's subgroup
  const posts = getPosts(20, subname); // get "n" number of posts by their subgroup
  const decoratedPosts = []; // initialize empty array to store decorated posts
  for (let post of posts){
    decoratedPosts.push(decoratePost(post));
  }
  res.render("sub", { decoratedPosts });
});

export default router;
