const knex = require('./knex');

module.exports = {
  getUserByID: id => {
    return knex('account').where('id', id).first();
  },
  getUserProfilePeak: id => {
    return knex.select('*').from('account').where('account.id', id)
      .join('account_peak', 'account.id', 'account_id')
      .join('peak', 'peak_id', 'peak.id')
      .join('range', 'range_id', 'range.id')
  }
};
