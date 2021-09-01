const express = require("express");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");

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

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Users.getById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      next({ message: "not found", status: 404 });
    }
  } catch (err) {
    next(err);
  }
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
});

router.post("/", async (req, res, next) => {
  if (!req.body.name) {
    next({ message: "missing required name", status: 400 });
  } else {
    try {
      const newUser = await Users.insert(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!req.body.name) {
    next({ message: "missing required name", status: 400 });
  } else {
    try {
      const updatedUser = await Users.update(id, req.body);
      if (updatedUser) {
        res.status(201).json(updatedUser);
      } else {
        next({ message: "ID not found", status: 404 });
      }
    } catch (err) {
      next(err);
    }
  }
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Users.getById(id);
    if (user) {
      res.status(200).json(user);
      await Users.remove(id);
    } else {
      next({ message: "id not found", status: 404 });
    }
  } catch (err) {
    next(err);
  }
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get("/:id/posts", async (req, res, next) => {
  const { id } = req.params;
  try {
    const posts = await Users.getUserPosts(id);
    const user = await Users.getById(id);
    if (user) {
      res.status(200).json(posts);
    } else {
      next({ message: "id not found", status: 404 });
    }
  } catch (err) {
    next(err);
  }
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post("/:id/posts", async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    next({ message: "missing required text", status: 400 });
  } else {
    try {
      const user = await Users.getById(id);
      if (user) {
        const newPost = await Posts.insert({ text, user_id: id });
        res.status(201).json(newPost);
      } else {
        next({ message: "id not found", status: 404 });
      }
    } catch (err) {
      next(err);
    }
  }

  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({
    message: err.message,
  });
});

// do not forget to export the router
module.exports = router;
