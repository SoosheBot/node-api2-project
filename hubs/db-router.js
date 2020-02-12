const express = require("express");

const db = require("./db");

const router = express.Router();

// POST a new post
router.post("/", (req, res) => {
  const posts = { ...req.body };
  if (!posts.title || !posts.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.insert(posts)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

// POST new comment to posts
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const comments = { ...req.body, post_id: id };

  db.insertComment(comments)
    .then(comment => {
      if (!comment.id) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (!comment) {
        res
          .status(400)
          .json({ message: "Please provide text for the comment" });
      } else {
        res.status(201).json(comment);
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error saving the comment to the database"
      });
    });
});

// GET all posts
router.get("/", (req, res) => {
  db.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log("find error", err);
      res.status(500).json({ errorMessage: "could not find posts" });
    });
});

//GET all posts by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(posts => {
      res.status(201).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "The post with the specified ID does not exist." });
    });
});
// GET all comments in post (by post id)
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  db.findPostComments(id)
    .then(comments => {
      res.status(201).json(comments);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Error retrieving comments in posts" });
    });
});

//DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(posts => {
      if (posts) {
        console.log(`Post ID #${id} has been removed`);
        res.status(201).json(posts);
      } else {
        res.status(404).json({ message: "ID does not exist" });
      }
    })
    .catch(err => {
      console.log("DELETE err", err);
      res.status(500).json({ errorMessage: "The post could not be removed" });
    });
});

// PUT
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const posts = { ...req.body };

  if (!posts.title || !posts.contents) {
    res
      .status(400)
      .json({
        errorMessage: "Please provide title and contents for the post."
      });
  } else {
    db.update(id, posts)
      .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The posts information could not be modified." });
      });
  }
});

module.exports = router;
