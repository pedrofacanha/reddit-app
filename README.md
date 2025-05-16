Reddit-Style Multi-Page Web App with Express and Passport.js
This project is a full-stack Node.js web application developed as a term assignment for COMP3012. Built with Express.js, EJS templating, and Passport.js for authentication, the app allows users to create and interact with posts in a subreddit-style structure — all without writing any front-end JavaScript.

🔑 Key Features
🔐 User login & logout via Passport.js

🧵 Users can create posts, comments, and assign posts to custom "subgroups"

🗳 Posts and comments support upvoting/downvoting with visual feedback

🗂 Dynamic creation and filtering of content by subgroup (like Reddit)

📝 Full CRUD (Create, Read, Update, Delete) operations for posts and comments

🔄 Full-page form-based interactions (no AJAX or client-side JS)

🎨 CSS-based active vote state styling

💾 Persistent storage using Prisma ORM

📁 Main Routes
- /login, /logout – User authentication

- /posts/create, /posts/show/:id, /posts/edit/:id, /posts/delete/:id – Post management

- /posts/comment-create/:id – Comment submission

- /posts/vote/:id – Vote handling

- /subs/list, /subs/show/:subname – Subgroup navigation

- / – Homepage with the 20 most recent posts

🧱 Tech Stack
1. Backend: Node.js, Express.js, Passport.js

2. Database: Prisma (with relational schema: Users, Posts, Comments, Subgroups)

3. Templating: EJS

4. Styling: CSS

5. Authentication: Session-based login/logout

📌 Notes
- No front-end JavaScript is used

- Votes and actions cause full-page reloads (as specified)

- Subgroups are created dynamically when a post specifies a new one

