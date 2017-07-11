const express = require('express');
const router = express.Router()
const queries = require('../db/queries');
const authMiddleware = require('../auth/middleware');

router.get('/', (req, res) => {
  queries.getPeakByName()
    .then(peaks => {
      const peaksJoined = []
      peaks.forEach(peak => {
        const onePeak = {
          rank: peak.rank,
          peak_id: peak.peak_id,
          peak_name:peak.peak_name,
          elevation: peak.elevation,
          difficulty: peak.difficulty,
          image_url: peak.image_url,
          range_id: peak.range_id,
          range_name: peak.range_name
        }
        peaksJoined.push(onePeak)
      })
      res.json(peaksJoined);
    });
});

module.exports = router;
