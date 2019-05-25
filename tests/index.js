'use strict';

const Knex = require('knex');

function* personGenerator(start, end) {
  let i = start;

  const firstnames = ['Jennifer', 'Sylvester', 'Tommy', 'John'];

  while(i <= end) {
    yield {id: i,
           firstname: firstnames[i % firstnames.length],
           lastname: `Stallone`
          };
    i++;
  }
}

function* person2Generator(start, end) {
  let i = start;

  const firstnames = ['Jennifer', 'Sylvester', 'Tommy', 'John'];

  while(i <= end) {
    yield {id1: Math.floor(i / 10),
           id2: i % 10,
           firstname: firstnames[i % firstnames.length],
           lastname: `Stallone`
          };
    i++;
  }
}

function* numberGenerator(start, end, incr = 7) {
  let i = start;

  while(i <= end) {
    yield {id: i,
           thousands: Math.floor(i / 1000) % 10,
           hundreds: Math.floor(i / 100) % 10,
           tens: Math.floor(i / 10) % 10,
           ones: i % 10
          };
    i += incr;
  }
}

describe('database tests', () => {
  const dbConfigs = [
    {
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './test.db'
      }
    },
    {
      client: 'postgres',
      connection: {
        host: '127.0.0.1',
        user: 'keyset',
        password: 'no-offset',
        database: 'keysetpaging_test'
      }
    }
  ];

  const sessions = dbConfigs.map(knexConfig => {
    let knex = Knex(knexConfig);

    describe(knexConfig.client, () => {
      before(() => {
        return knex.schema.dropTableIfExists('person');
      });

      before(() => {
        return knex.schema.createTable('person', table => {
          table.increments('id').primary();
          table.string('firstname');
          table.string('lastname');
        });
      });

      before(() => {
        return knex('person')
          .then(function () {
            // Inserts seed entries
            return knex('person').insert([...personGenerator(1, 29)]);
          });
      });

      before(() => {
        return knex.schema.dropTableIfExists('person2');
      });

      before(() => {
        return knex.schema.createTable('person2', table => {
          table.integer('id1');
          table.integer('id2');
          table.string('firstname');
          table.string('lastname');
          table.primary(['id1', 'id2']);
        });
      });

      before(() => {
        return knex('person2')
          .then(function () {
            // Inserts seed entries
            return knex('person2').insert([...person2Generator(1, 29)]);
          });
      });

      before(() => {
        return knex.schema.dropTableIfExists('number');
      });

      before(() => {
        return knex.schema.createTable('number', table => {
          table.increments('id').primary();
          table.integer('thousands');
          table.integer('hundreds');
          table.integer('tens');
          table.integer('ones');
        });
      });

      before(() => {
        return knex('number')
          .then(function () {
            return knex('number').insert([...numberGenerator(1, 1111)]);
          });
      });

      require('./paging')(knex);
      require('./serialization')(knex);
    });

    return knex;
  });

  after(() => {
    return Promise.all(
      sessions.map(knex => {
        return knex.destroy();
      })
    );
  });
});
