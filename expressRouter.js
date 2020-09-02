const express = require("express");

const router = express.Router();

const db = require("./data/db");

router.get("/", (req, res) => {
  db.find(req.query)
    .then((rez) => {
      res.status(200).json(rez);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then((rez) => {
      if (rez) {
        res.status(200).json(rez);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "The post information could not be retrieved.",
      });
    });
});

router.get("/:id/comments", (req, res) => {
  db.findPostComments(req.params.id)
    .then((rez) => {
      if (rez) {
        res.status(200).json(rez);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  console.log(req.body);
  db.insert(req.body)
    .then((rez) => {
      if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      } else {
        res.status(201).json(rez);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

router.post("/:id/comments", (req, res) => {
  req.body.post_id = Number(req.params.id);

  console.log(req.body);
  db.insertComment(req.body)

    .then((rez) => {
      console.log(rez);

      // if (req.body.text) {
      //   if (rez) {
      //     res.status(201).json({ message: "Created" });
      //   } else {
      //     res.status(404).json({
      //       message: "The post with the specified ID does not exist.",
      //     });
      //   }
      // } else {
      //   res
      //     .status(400)
      //     .json({ errorMessage: "Please provide text for the comment." });
      // }

      if (req.body.text) {
        res.status(201).json({ message: "Created" });
      } else {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      }

      // if (!users.find((user) => user.id === id)) {
      //   res
      //     .status(404)
      //     .json({ message: "The post with the specified ID does not exist." });
      // } else if (!req.body.text) {
      //   res
      //     .status(400)
      //     .json({ errorMessage: "Please provide text for the comment." });
      // } else {
      //   res.status(201).json({ message: "Created" });
      // }
    })
    .catch((err) => {
      console.log(err);
      if (err.errno === 19) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(500).json({
          error: "There was an error while saving the comment to the database",
        });
      }
    });
});

router.delete("/:id", (req, res) => {
  db.remove(req.params.id)
    .then((rez) => {
      if (rez) {
        res.status(200).json({ message: "Aaaaaaaand it's gone" });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  db.update(req.params.id, changes)

    .then((rez) => {
      if (rez > 0) {
        if (!req.body.title && !req.body.contents) {
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post.",
          });
        } else {
          res
            .status(201)
            .json({ message: `Update at post ${req.params.id} successful` });
        }
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

// router.put("/:id/comments", (req, res) => {
//   const changes = req.body;
//   db.findCommentById(req.params.id, changes)
// });

module.exports = router;
