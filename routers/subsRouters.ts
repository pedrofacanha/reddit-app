const { ensureAuthenticated } = require("../middleware/checkAuth");
const { getSubs, getPosts, decoratePost } = require("../db");
import express from "express";
import * as db from "../db";
const router = express.Router();

router.get("/list", async (req, res) => {
  const subgroups = getSubs();
  subgroups.sort();
  
  res.render("subs", { subgroups });
});

router.get("/show/:subname", async (req, res) => {
  try {
    const user = await req.user;
    const { subname } = req.params;
    const allPosts = await db.getPosts(20, subname);
    
    const posts = [];

  if(!allPosts || allPosts.length === 0){
    const errMessage = `No posts within the "${subname}" subgroup`;
    console.error(errMessage);
    return res.redirect("/");
  }

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
