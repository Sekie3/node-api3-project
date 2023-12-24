const express = require('express');
const Users = require('./users-model');
const { validateUserId } = require('../middleware/middleware');
const { validateUser } = require('../middleware/middleware');
const { validatePost } = require('../middleware/middleware');


// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async (req, res) => {
  try {
      const users = await Users.get();
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving users' });
  }
});


router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user);
});


router.post('/', validateUser, async (req, res) => {
  try {
      const newUser = await Users.insert(req.body);
      res.status(201).json(newUser);
  } catch (error) {
      res.status(500).json({ message: 'Error adding the user' });
  }
});


router.put('/:id', validateUserId, validateUser, async (req, res) => {
  try {
      const updatedUser = await Users.update(req.params.id, req.body);
      res.json(updatedUser);
  } catch (error) {
      res.status(500).json({ message: 'Error updating the user' });
  }
});


router.delete('/:id', validateUserId, async (req, res) => {
  try {
      const user = req.user;
      await Users.remove(req.params.id);
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Error deleting the user' });
  }
});


router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
      const posts = await Users.getUserPosts(req.params.id);
      res.json(posts);
  } catch (error) {
      res.status(500).json({ message: 'Error getting the posts' });
  }
});


const Posts = require('../posts/posts-model');

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
    try {
        const newPost = { ...req.body, user_id: req.params.id };
        const post = await Posts.insert(newPost);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating the post' });
    }
});

// do not forget to export the router
module.exports = router;
