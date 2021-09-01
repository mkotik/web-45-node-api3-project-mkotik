function logger(req, res, next) {
  // DO YOUR MAGIC
  // console.log(req);
  console.log(req.method, req.url, new Date().toISOString());
  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  console.log("validate user id");
  next();
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  console.log("validate user");
  next();
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  console.log("validate post");
  next();
}

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId, validateUser, validatePost };
