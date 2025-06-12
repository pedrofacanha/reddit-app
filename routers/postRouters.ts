import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import * as db from "../db";

router.get("/", async (req, res) => {
  const user = await req.user;
  const posts = await db.getPosts(20);
  const decoratedPosts = [];

  for (let post of posts) {
    const decorated = await db.decoratePost(post);
    decoratedPosts.push(decorated);
  }

  res.render("posts", { user, posts: decoratedPosts });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  try {
    const { title, link, description, subgroup } = req.body;
    const id = Number(req.user?.id);
    const user = req.user;

    if (!link || !description || typeof subgroup !== "string") {
      console.log("Form must have a link, description, and valid subgroup");
      return res.redirect("/");
    }

    const newPost = await db.addPost(title, link, id, description, subgroup);
    const post = await db.decoratePost(newPost);

    res.render("individualPost", { post, user });
  } catch (error) {
    console.error("Error in /posts/create:", error);
    res.status(500).send("Unexpected error.");
  }
});

router.get("/show/:postid", async (req, res) => {
  try {
    const user = await req.user;
    const { postid } = req.params;
    const post = await db.getPost(Number(postid));

    if (!post) {
      console.log(`Post ${postid} not found`);
      return res.redirect("/");
    }

    res.render("individualPost", { user, post });
  } catch (err) {
    console.error("Error in /posts/show/:postid:", err);
    res.status(500).send("Unexpected error.");
  }
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const postid = Number(req.params.postid);
  const post = await db.getPost(postid);
  res.render("editPost", { post });
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  try {
    const { title, link, description, subgroup } = req.body;
    const postid = Number(req.params.postid);
    const user = await req.user;
    const timestamp = Date.now();

    await db.editPost(postid, { title, link, description, subgroup, timestamp });
    const post = await db.getPost(postid);

    if (!post) {
      console.log("Post not found");
      return res.redirect("/");
    }

    res.render("individualPost", { post, user });
  } catch (error) {
    console.error("Error in /edit/:postid:", error);
    res.status(500).send("Unexpected error.");
  }
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  try {
    const { postid } = req.params;
    const post = await db.getPost(Number(postid));
    res.render("deletePost", { post });
  } catch (error) {
    console.error("Error in /deleteconfirm/:postid:", error);
    res.status(500).send("Unexpected error.");
  }
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  try {
    const { postid } = req.params;
    const post = await db.getPost(Number(postid));

    if (post) {
      await db.deletePost(Number(postid));
      res.redirect(`/subs/show/${post.subgroup}`);
    } else {
      console.log("Post not found");
      return res.redirect("/");
    }
  } catch (error) {
    console.error("Error in /delete/:postid:", error);
    res.status(500).send("Unexpected error.");
  }
});

router.post("/comment-create/:postid", ensureAuthenticated, async (req, res) => {
  try {
    const description = req.body.description;
    const user = await req.user;
    const userId = Number(user?.id);
    const postId = Number(req.params.postid);

    await db.addComment(postId, userId, description);
    const post = await db.getPost(postId);

    if (!post) {
      console.log("Post not found");
      return res.redirect("/");
    }

    res.render("individualPost", { post, user });
  } catch (error) {
    console.error("Error in /comment-create/:postid:", error);
    res.status(500).send("Unexpected error.");
  }
});

router.post("/comment-delete/:postid", ensureAuthenticated, async (req, res) => {
  try {
    const data = req.body;
    const postId = Number(req.params.postid);
    const commentId = Number(data.id);

    await db.deleteComment(commentId);
    res.redirect(`/posts/show/${postId}`);
  } catch (error) {
    console.error("Error in /comment-delete/:postid:", error);
    res.status(500).send("Unexpected error.");
  }
});

router.post("/vote/:postid", ensureAuthenticated, async (req, res) => {
  const postId = Number(req.params.postid);
  const user = await req.user;
  const vote = Number(req.body.setvoteto);

  await db.updateVote(Number(user?.id), postId, vote);
  res.redirect(`/posts/show/${postId}`);
});

export default router;
