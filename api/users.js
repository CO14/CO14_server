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
  queries.getUserProfilePeak(req.params.id)
    .then(accounts => {
      const userProfile = [];
      const userCollection = {};
      accounts.forEach(acct => {
        if (!userCollection[acct.account_id]) {
          const userInstance = {
            account_id: acct.account_id,
            first_name: acct.first_name,
            last_name: acct.last_name,
            email: acct.email,
            profile_image: acct.image,
            facebook_url: acct.facebook_url,
            instagram_url: acct.instagram_url,
            twitter_url: acct.twitter_url,
            peak: []
          }
          userProfile.push(userInstance);
          userCollection[acct.account_id] = userInstance;
        }
        userCollection[acct.account_id].peak.push({
          peak_id: acct.peak_id,
          peak_name: acct.peak_name,
          elevation: acct.elevation,
          difficulty: acct.difficulty,
          peak_image_url: acct.image_url,
          account_rating: acct.account_rating,
          account_image_url: acct.account_image_url,
          range_id: acct.range_id,
          range_name: acct.name
        });
      });
      res.json(userProfile)
    });
});

module.exports = router;
