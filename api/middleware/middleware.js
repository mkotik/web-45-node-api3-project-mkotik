const Users = require("../users/users-model");

function logger(req, res, next) {
  // DO YOUR MAGIC
  // console.log(req);
  console.log(req.method, req.url, new Date().toISOString());
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const { id } = req.params;
  console.log(id);
  const user = await Users.getById(id);
  if (user) {
    req.user = user;
    next();
  } else {
    next({ message: `user with id ${id} not found`, status: 404 });
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  if (name) {
    next();
  } else {
    next({ message: "missing required name field", status: 400 });
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body;
  if (text) {
    next();
  } else {
    next({ message: "missing required text field", status: 400 });
  }
}

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId, validateUser, validatePost };
