const knex = require('./knex');

module.exports = {
  // USER QUERIES
  getUserByID: id => {
    return knex('account').where('id', id).first();
  },
  getUserProfilePeak: id => {
    return knex.select('*', 'account_peak.id as account_peak_id').from('account').where('account.id', id)
      .join('account_peak', 'account.id', 'account_id')
      .join('peak', 'peak_id', 'peak.id')
      .join('range', 'range_id', 'range.id')
  },
  updateUserProfile: account => {
    return knex('account').where('id', account.id)
      .update({
        first_name: account.first_name,
        last_name: account.last_name,
        password: account.password,
        image: account.image,
        facebook_url: account.facebook_url,
        instagram_url: account.instagram_url,
        twitter_url: account.twitter_url
      })
  },
  deleteUserProfile: account => {
    return knex('account').where('id', account.id).del();
  },
  // PEAK QUERIES
  getPeakByName: () => {
    return knex.select('*').from('peak')
      .join('range', 'range.id', 'range_id')
      .select('peak.id as peak_id', 'range.name as range_name')
  },
  addNewUserGoal: user_peak => {
    return knex('account_peak').insert(user_peak);
  },
  updateUserGoal: account_peak => {
    return knex('account_peak').where('id', account_peak.id).update({
      account_rating: account_peak.account_rating,
      account_image_url: account_peak.account_image_url,
      account_notes: account_peak.account_notes,
      is_complete: account_peak.is_complete,
      date_complete: account_peak.date_complete,
      account_id: account_peak.account_id,
      peak_id: account_peak.peak_id
    });
  },
  deleteUserGoal: user_peak => {
    return knex('account_peak').where('id', user_peak.id).del();
  }
};
