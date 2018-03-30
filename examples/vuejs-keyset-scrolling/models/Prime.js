const Model = require('objection').Model;
const keysetPagination = require('objection-keyset-pagination')({countTotal: false});

class Prime extends keysetPagination(Model) {
  static get tableName() {
    return 'primes';
  }
};

module.exports = Prime;
