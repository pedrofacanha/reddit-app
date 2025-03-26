import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import * as db from "../fake-db";

router.get("/", async (req, res) => {
  // fetch data 
  const posts = await db.getPosts(20);
  const user = await req.user;

  // initialize empty array to store modified posts
  const decoratedPosts = [];
  for (let post of posts){
    let currentPost = db.decoratePost(post);
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

      // display error message in the console if anything goes wrong
      console.error(errMessage);

      // send an HTML response with an alert and redirect
      return res.status(400).send(`
        <script>
          alert("${errMessage}");
          setTimeout(() => window.location = "/posts/create", 100);
        </script>
      `);
    }

    // add to database
    const newPost = db.addPost(title, link, id, description, subgroup);
    const updatedPost = db.decoratePost(newPost);

    res.render("individualPost", { post: updatedPost });
  } catch (error) {
    console.error("Something went wrong in /router/post/create:", error);
    
    // redirect to main page and log the error
    res.status(500).redirect("/"); 
    }
});

router.get("/show/:postid", async (req, res) => {
  // TODO: show post title, post link, timestamp and creator
  // fetch user
  const user = await req.user;

  // fetch post id
  const { postid } = req.params;

  // fetch post by id
  const currentPost = db.getPost(Number(postid));

  res.render("individualPost", { post : currentPost, user });
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
    // fetch all inputs
    const { title, link, description, subgroup } = req.body;
    const postid = Number(req.params.postid);

    // update timestamp
    const timestamp = Date.now();

    // use editPost()
    db.editPost(postid, { title,link,description,subgroup,timestamp });

    // render ejs file if valid. if not, redirect to homepage
    const post = db.getPost(postid);
    if(!post){
      res.status(404).send("Post not found").redirect("/");
    }

    res.render("individualPost", { post });
  } catch (err) {
    console.error("Something went wrong");
    res.status(500).redirect("/");
  }
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  // TODO: display page that asks user if confirms deletion
  try {
    // fetch data
    const { postid } = req.params;
    const post = db.getPost(Number(postid));

    res.render("deletePost", { post });
  } catch (err) {
    console.error("Something unexpected happened.");
    res.status(500).redirect("/");
  }
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  try {
    const { postid } = req.params;

    // fetch post
    const post = db.getPost(Number(postid));

    // validate post
    if (post) {
      
      db.deletePost(Number(postid));
      
      // redirect to the subgroup page
      res.render("sub", { posts : undefined});
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    res.status(500).redirect("/");
  }
});


router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // TODO: create a new comment and display description, username and date
    // retrieve info from user
    const description = req.body.description;
    const user = await req.user;
    const userId = Number(user?.id);
    const postId = Number(req.params.postid);

    db.addComment(postId, userId, description);

    // validate post
    const currentPost = db.getPost(postId);
    if(!currentPost){
      res.status(404).send("Post not found");
    }

    res.render("individualPost", { post : currentPost, user });
  }
);
router.post(
  "/comment-delete/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // fetch data
    const data = req.body;
    const user = await req.user;
    const postId = Number(req.params.postid);

    // fetch comment id
    const commentId = Number(data.id);

    db.deleteComment(commentId);
    
    // render updated post
    const updatedPost = db.getPost(postId);

    res.render("individualPost", { post: updatedPost, user });
  }
);

export default router;
