const knex = require('./knex');

module.exports = {
  getUserByID(id) {
    return knex.select("*").from('account').where('id', id).first();
  }
};
