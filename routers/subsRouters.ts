const { ensureAuthenticated } = require("../middleware/checkAuth");
const { getSubs, getPosts, decoratePost } = require("../fake-db");
import express from "express";
// import * as database from "../controller/postController";
const router = express.Router();

router.get("/list", async (req, res) => {
  const subgroups = getSubs(); // retrieve array of subnames
  subgroups.sort();
  
  res.render("subs", { subgroups });
});

router.get("/show/:subname", async (req, res) => {
  try {
  // fetch user
  const user = await req.user;

  // post's subgroup
  const { subname } = req.params;

  // "n" number of posts by their subgroup
  const allPosts = getPosts(20, subname);

  // initialize empty array to store decorated posts
  const posts = [];

  // check if any post exist
  if(!allPosts || allPosts.length === 0){
    const errMessage = `No posts within the "${subname}" subgroup`;
    console.error(errMessage);
    return res.redirect("/");
  }

  // populate array with posts that matches sub
  for (let post of allPosts){
    posts.push(decoratePost(post));
  }

  res.render("sub", { posts, user });
  } catch (error) {
      console.error("Error in /show/:subname:", error);
      res.status(500).send("An unexpected error occurred.");
  }
});

export default router;
