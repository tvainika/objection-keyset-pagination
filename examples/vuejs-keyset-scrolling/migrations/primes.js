exports.up = function(knex, Promise) {
  return knex.schema.createTable('primes', function (t) {
    t.increments('id').primary();
    t.integer('prime');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('primes');
};
