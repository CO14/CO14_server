const express = require('express');
const router = express.Router()
const queries = require('../db/queries');
const authMiddleware = require('../auth/middleware');

router.get('/', (req, res) => {
  queries.getRangeByName()
    .then(ranges => {
      res.json(ranges);
    });
});

module.exports = router;
