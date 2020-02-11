const express = require("express");

const db = require("./db");

const router = express.Router();
// POST
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

// POST to id
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const comments = { ...req.body, postId: id };
  if (!comments) {
    res.status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else if (!comments.text) {
    res.status(400).json({ errorMessage: "Please provide text for the comment." });
  } else {
    db.insertComment(comments)
      .then(comment => {
        res.status(201).json(comment);
      })
      .catch(err => {
        res.status(500).json({
            error: "There was an error while saving the comment to the database"
          });
      });
  }
});

// GET
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
// GET by id
// GET comment by id
// DELETE
// PUT

module.exports = router;
