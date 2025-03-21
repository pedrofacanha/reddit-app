import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { getPost, getPosts, decoratePost, addComment, getUser } from "../fake-db";
import { TUsers } from "../types";

router.get("/", async (req, res) => {
  const posts = await getPosts(20);
  const user = await req.user; // created by passport
  const decoratedPosts = [];
  for (let post of posts){
    let currentPost = decoratePost(post);
    decoratedPosts.push(currentPost);
  }
  res.render("posts", { user, posts: decoratedPosts });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.get("/show/:postid", async (req, res) => {
  // TODO: show post title, post link, timestamp and creator
  // get id parameter
  const { postid } = req.params;
  // get post by id
  const currentPost = getPost(Number(postid));
  res.render("individualPost", { post: currentPost });
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // TODO: create a new comment and display description, username and date
    const description = req.body.description;
    const user = await req.user;
    const userId = Number(user.id);
    const postId = Number(req.params.postid);
    const comment = addComment(postId, user.id, description);
    const currentPost = getPost(postId);
    res.render("individualPost", { post: currentPost });
  }
);
router.post(
  "/comment-delete/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // TODO: after hitting the button, comment is deleted
  }
);

export default router;
