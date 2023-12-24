const { getById } = require('../users/users-model');

function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} to ${req.url}`);
  next();
}

async function validateUserId(req, res, next) {
    try {
        const { id } = req.params;
        const user = await getById(id);

        if (user) {
            req.user = user;
            next();
        } else {
            res.status(404).json({ message: "user not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error checking user ID" });
    }
}


function validateUser(req, res, next) {
  const { name } = req.body;

  if (name) {
      next();
  } else {
      res.status(400).json({ message: "missing required name field" });
  }
}

function validatePost(req, res, next) {
  const { text } = req.body;

  if (text) {
      next();
  } else {
      res.status(400).json({ message: "missing required text field" });
  }
}


// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
