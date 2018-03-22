'use strict';

const Knex = require('knex');

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
       return require('./paging')(knex);
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
