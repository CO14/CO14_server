const express = require('express');
const router = express.Router()
const queries = require('../db/queries');
const authMiddleware = require('../auth/middleware');

function isValidId(req, res, next) {
  if (!isNaN(req.params.id)) {
    return next();
  } else {
    next(new Error("Invalid ID"));
  }
}

router.get('/:id', isValidId, (req, res, next) => {
  queries.getUserByID(req.params.id)
    .then(user => {
      res.json(user);
    });
});

module.exports = router;
