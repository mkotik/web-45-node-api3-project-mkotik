const express = require("express");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res, next) => {
  try {
    const response = await Users.get();
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "no users found" });
    }
  } catch (err) {
    next(err);
  }
  // RETURN AN ARRAY WITH ALL THE USERS
});

router.get("/:id", validateUserId, async (req, res, next) => {
  res.status(200).json(req.user);
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
});

router.post("/", validateUser, async (req, res, next) => {
  try {
    const newUser = await Users.insert(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put("/:id", validateUser, validateUserId, async (req, res, next) => {
  try {
    const updatedUser = await Users.update(req.user.id, req.body);
    res.status(201).json(updatedUser);
  } catch (err) {
    next(err);
  }
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  try {
    res.status(200).json(req.user);
    await Users.remove(req.user.id);
  } catch (err) {
    next(err);
  }
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  try {
    const posts = await Users.getUserPosts(req.user.id);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    const { text } = req.body;
    try {
      const newPost = await Posts.insert({ text, user_id: req.user.id });
      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }

    // RETURN THE NEWLY CREATED USER POST
    // this needs a middleware to verify user id
    // and another middleware to check that the request body is valid
  }
);

router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({
    message: err.message,
  });
});

// do not forget to export the router
module.exports = router;
