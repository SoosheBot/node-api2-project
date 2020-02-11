const express = require("express");

const Hubs = require("./db");

const router = express.Router();

router.get('/', (req,res) => {
    Hubs.find(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log('find error', err);
        res.status(500).json({ errorMessage: "could not find posts"});
    });
});

module.exports = router;
