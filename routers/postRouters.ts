import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import * as db from "../fake-db";

router.get("/", async (req, res) => {
  // fetch data 
  const posts = await db.getPosts(20);
  const user = await req.user;

  // variable to store modified post
  let currentPost;

  // initialize empty array to store modified posts
  const decoratedPosts = [];
  for (let post of posts){
    currentPost = db.decoratePost(post);
    decoratedPosts.push(currentPost);
  }

  res.render("posts", { user, posts : decoratedPosts });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  // TODO: create a <form> in the individualPost.ejs to pass user's info
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  try {
    // retrieve req.body
    const { title, link, description, subgroup } = req.body;

    // retrieve user ID
    const id = Number(req.user?.id);

    // validate form data
    if (!link || !description || typeof subgroup !== "string") {
      const errMessage = "Form must have a link, description, and a valid subgroup"

      // if creation goes wrong, display error message
      console.log(errMessage);

      // redirect user if creation is unsuccessful
      return res.redirect("/");
    }

    // add created post to database
    const newPost = db.addPost(title, link, id, description, subgroup);
    const post = db.decoratePost(newPost);

    res.render("individualPost", { post });
  } catch (error) {
    console.error("Something went wrong in /posts/create:", error);
    res.status(500).send("An unexpected error occurred.");
    }
});

router.get("/show/:postid", async (req, res) => {
  // TODO: show post title, post link, timestamp and creator
  try {
    // fetch user
  const user = await req.user;
  // fetch post id
  const { postid } = req.params;
  // fetch post by id
  const currentPost = db.getPost(Number(postid));
  if(!currentPost){
    console.log(`Post ${postid} not found`);
    return res.redirect("/");
  }

  // update total votes
  currentPost.votes = db.getVotesForPost(Number(postid));
  console.log(currentPost.votes);

  res.render("individualPost", { user, post : currentPost });
  } catch (err) {

    console.error("Error in /posts/show/:postid: ", err);
    res.status(500).send("An unexpected error ocurred.");
  }
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // TODO: create a form to edit a post
  // fetch data
  const postid = req.params.postid;
  const post = db.getPost(Number(postid));

  res.render("editPost", { post });
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // TODO: send req.body with data edited to the respective form
  try {
    // fetch data
    const { title, link, description, subgroup } = req.body;
    const postid = Number(req.params.postid);

    // fetch user
    const user = await req.user;

    // update timestamp
    const timestamp = Date.now();

    // editPost()
    db.editPost(postid, { title,link,description,subgroup,timestamp });

    // render ejs if post is valid. if not, redirect to homepage
    const post = db.getPost(postid);
    if(!post){
      console.log("Post not found");
      return res.redirect("/");
    }

    res.render("individualPost", { post, user });
  } catch (error) {
      console.error("Error in /edit/:postid:", error);
      res.status(500).send("An unexpected error occurred.");
  }
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  // TODO: display page that asks if user deletion
  try {
    // fetch data
    const { postid } = req.params;
    const post = db.getPost(Number(postid));

    res.render("deletePost", { post });
  } catch (error) {
      console.error("Error in /deleteconfirm/:postid:", error);
      res.status(500).send("An unexpected error occurred.");
  }
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  try {
    const { postid } = req.params;

    // fetch post
    const post = db.getPost(Number(postid));


    // validate post and delete it
    if (post) {
      
      db.deletePost(Number(postid));
      
      // redirect to the subgroup page
      res.redirect(`/subs/show/${post.subgroup}`);
    } else {
      console.log("Post not found");
      return res.redirect("/");
    }
  } catch (error) {
      console.error("Error in /delete/:postid:", error);
      res.status(500).send("An unexpected error occurred.");
  }
});


router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // TODO: create a new comment and display description, username and date
    // fetch info from user
    const description = req.body.description;
    const user = await req.user;
    const userId = Number(user?.id);
    const postId = Number(req.params.postid);

    db.addComment(postId, userId, description);

    // validate post
    const currentPost = db.getPost(postId);
    if(!currentPost){
      console.log("Post not found")
      return res.redirect("/");
    }

    res.render("individualPost", { post : currentPost, user });
  }
);
router.post(
  "/comment-delete/:postid",
  ensureAuthenticated,
  async (req, res) => {
    try {
      // fetch data
      const data = req.body;
      const postId = Number(req.params.postid);

      // fetch comment ID
      const commentId = Number(data.id);

      // delete the comment
      db.deleteComment(commentId);

      res.redirect(`/posts/show/${postId}`);
    } catch (error) {
      console.error("Error in /comment-delete/:postid:", error);
      res.status(500).send("An unexpected error occurred.");
    }
  }
);

router.post("/vote/:postid", ensureAuthenticated, async(req, res)=>{
  // get post.id
  const postId = Number(req.params.postid);

  // fetch user
  const user = await req.user;  

  // fetch vote value
  const vote = Number(req.body.setvoteto);

  // TODO: update votes object in the database => implement function
  // * first condition
    // add up 1 to existing user vote
      // else: create user in votes object with a value of 1
  // * second condition
    // subtract 1 from existing user.value (vote)
      // if user.value === 1 => user.value = 0;
      // if user.value === 2 => user.value = 1 and so on...
    // else: create user in votes object with a value of -1
    db.updateVote(Number(user?.id), Number(postId), vote)

  res.redirect(`/posts/show/${postId}`);
});
export default router;
