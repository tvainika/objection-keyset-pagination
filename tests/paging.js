const expect = require('expect.js');
const Model = require('objection').Model;
const keysetPaginationRequire = require('..');

module.exports = knex => {
  describe('plugin tests', () => {
    it('should return .limit() rows per call with defaults', () => {
      const keysetPagination = keysetPaginationRequire();
      class Person extends keysetPagination(Model) {
        static get tableName() {
          return 'Person';
        }
      }

      const query = Person.query(knex)
            .orderBy('id');

      let allRows;

      return query.clone()
        .then(result => {
          allRows = result;

          return query.clone()
            .limit(5)
            .keysetPage();
        })
        .then(result => {
          expect(result.total).to.be.undefined;
          expect(result.results.length).to.equal(5);
          expect(result.results).to.eql(allRows.slice(0, 5));

          return query.clone()
            .limit(5)
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(5);
          expect(result.results).to.eql(allRows.slice(5, 10));
        });
    });

    it('use idColumn if called without order by clause', () => {
      const keysetPagination = keysetPaginationRequire();
      class Person extends keysetPagination(Model) {
        static get tableName() {
          return 'Person';
        }
      }

      const query = Person.query(knex);

      let allRows;

      return query.clone()
        .orderBy('id')
        .then(result => {
          allRows = result;

          return query.clone()
            .limit(5)
            .keysetPage();
        })
        .then(result => {
          expect(result.total).to.be.undefined;
          expect(result.results.length).to.equal(5);
          expect(result.results).to.eql(allRows.slice(0, 5));

          return query.clone()
            .limit(5)
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(5);
          expect(result.results).to.eql(allRows.slice(5, 10));
        });
    });

    it('use idColumn array if called without order by clause', () => {
      const keysetPagination = keysetPaginationRequire();
      class Person2 extends keysetPagination(Model) {
        static get tableName() {
          return 'Person2';
        }
        static get idColumn() {
          return ['id1', 'id2'];
        }
      }

      const query = Person2.query(knex);

      let allRows;

      return query.clone()
        .orderBy(Person2.idColumn)
        .then(result => {
          allRows = result;

          return query.clone()
            .limit(5)
            .keysetPage();
        })
        .then(result => {
          expect(result.total).to.be.undefined;
          expect(result.results.length).to.equal(5);
          expect(result.results).to.eql(allRows.slice(0, 5));

          return query.clone()
            .limit(5)
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(5);
          expect(result.results).to.eql(allRows.slice(5, 10));
        });
    });

    it('should limit rows per call with defaults', () => {
      const keysetPagination = keysetPaginationRequire();
      class Person extends keysetPagination(Model) {
        static get tableName() {
          return 'Person';
        }
      }

      const query = Person.query(knex)
        .orderBy('id');

      let allRows;

      return query.clone()
        .then(result => {
          allRows = result;

          return query.clone()
            .keysetPage();
        })
        .then(result => {
          expect(result.results.length).to.equal(10);
          expect(result.results).to.eql(allRows.slice(0, 10));

          return query.clone()
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(10);
          expect(result.results).to.eql(allRows.slice(10, 20));
        });
    });

    it('should limit rows per call with given settings', () => {
      const keysetPagination = keysetPaginationRequire({limit: 8, countTotal: false});
      class Person extends keysetPagination(Model) {
        static get tableName() {
          return 'Person';
        }
      }

      const query = Person.query(knex)
        .orderBy('id');

      let allRows;

      return query.clone()
        .then(result => {
          allRows = result;

          return query.clone()
            .keysetPage();
        })
        .then(result => {
          expect(result.total).to.be.undefined;
          expect(result.results.length).to.equal(8);
          expect(result.results).to.eql(allRows.slice(0, 8));

          return query.clone()
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.total).to.be.undefined;
          expect(result.results.length).to.equal(8);
          expect(result.results).to.eql(allRows.slice(8, 16));
        });
    });

    it('using other conditions in where', () => {
      const keysetPagination = keysetPaginationRequire({limit: 2});
      class Person extends keysetPagination(Model) {
        static get tableName() {
          return 'Person';
        }
      }

      const query = Person.query(knex)
        .where('firstname', 'LIKE', 'J%')
        .orderBy('id');

      let allRows;

      return query.clone()
        .then(result => {
          allRows = result;

          return query.clone()
            .keysetPage();
        })
        .then(result => {
          expect(result.results.length).to.equal(2);
          expect(result.results).to.eql(allRows.slice(0, 2));

          return query.clone()
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(2);
          expect(result.results).to.eql(allRows.slice(2, 4));
        });
    });

    it('there and back', () => {
      const keysetPagination = keysetPaginationRequire({limit: 5});
      class Person extends keysetPagination(Model) {
        static get tableName() {
          return 'Person';
        }
      }

      const query = Person.query(knex)
        .where('firstname', 'LIKE', 'J%')
        .orderBy('id');

      let allRows;

      return query.clone()
        .then(result => {
          allRows = result;

          return query.clone()
            .keysetPage();
        })
        .then(result => {
          expect(result.results.length).to.equal(5);
          expect(result.results).to.eql(allRows.slice(0, 5));

          return query.clone()
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(5);
          expect(result.results).to.eql(allRows.slice(5, 10));

          return query.clone()
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(4);
          expect(result.results).to.eql(allRows.slice(10));

          return query.clone()
            .previousKeysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(5);
          expect(result.results).to.eql(allRows.slice(5, 10).reverse());

          return query.clone()
            .previousKeysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(5);
          expect(result.results).to.eql(allRows.slice(0, 5).reverse());

          return query.clone()
            .previousKeysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(0);
        });
    });

    it('using two orderBy columns', () => {
      const keysetPagination = keysetPaginationRequire();
      class Person extends keysetPagination(Model) {
        static get tableName() {
          return 'Person';
        }
      }

      const query = Person.query(knex)
            .orderBy('firstname')
            .orderBy('id');

      let allRows;

      return query.clone()
        .then(result => {
          allRows = result;

          return query.clone()
            .keysetPage();
        })
        .then(result => {
          expect(result.total).to.be.undefined;
          expect(result.results.length).to.equal(10);
          expect(result.results).to.eql(allRows.slice(0, 10));

          return query.clone()
            .keysetPage(result.keyset);
        })
            .then(result => {
              expect(result.total).to.be.undefined;
              expect(result.results.length).to.equal(10);
              expect(result.results).to.eql(allRows.slice(10, 20));
            });
    });

    it('using two orderBy columns, one descending order', () => {
      const keysetPagination = keysetPaginationRequire();
      class Person extends keysetPagination(Model) {
        static get tableName() {
          return 'Person';
        }
      }

      const query = Person.query(knex)
        .orderBy('firstname', 'Desc')
        .orderBy('id', 'ASC');

      let allRows;

      return query.clone()
        .then(result => {
          allRows = result;

          return query.clone()
            .keysetPage();
        })
        .then(result => {
          expect(result.total).to.be.undefined;
          expect(result.results.length).to.equal(10);
          expect(result.results).to.eql(allRows.slice(0, 10));

          return query.clone()
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.total).to.be.undefined;
          expect(result.results.length).to.equal(10);
          expect(result.results).to.eql(allRows.slice(10, 20));
        });
    });

    it('using four orderBy columns, desc,asc,asc,desc order', () => {
      const keysetPagination = keysetPaginationRequire({limit: 60, countTotal: true});
      class Number extends keysetPagination(Model) {
        static get tableName() {
          return 'Number';
        }
      }

      const query = Number.query(knex)
        .orderBy('thousands', 'desc')
        .orderBy('hundreds', 'asc')
        .orderBy('tens', 'asc')
        .orderBy('ones', 'desc');

      let allRows;

      return query.clone()
        .then(result => {
          allRows = result;

          return query.clone()
            .keysetPage();
        })
        .then(result => {
          expect(result.total).to.equal(159);
          expect(result.results.length).to.equal(60);
          expect(result.results).to.eql(allRows.slice(0, 60));

          return query.clone()
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(60);
          expect(result.results).to.eql(allRows.slice(60, 120));

          return query.clone()
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(39);
          expect(result.results).to.eql(allRows.slice(120));

          return query.clone()
            .previousKeysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(60);
          expect(result.results).to.eql(allRows.slice(60, 120).reverse());

          return query.clone()
            .previousKeysetPage(result.keyset);
        })
        .then(result => {
          expect(result.results.length).to.equal(60);
          expect(result.results).to.eql(allRows.slice(0, 60).reverse());
        });
    });

    it('empty result set', () => {
      const keysetPagination = keysetPaginationRequire({countTotal: true});
      class Person extends keysetPagination(Model) {
        static get tableName() {
          return 'Person';
        }
      }
      const query = Person.query(knex)
            .orderBy('id', 'Desc')
            .where('firstname', 'Elisabeth');

      return query.clone()
        .keysetPage()
        .then(result => {
          expect(result.total).to.equal(0);
          expect(result.results.length).to.equal(0);

          return query.clone()
            .keysetPage(result.keyset);
        })
        .then(result => {
          expect(result.total).to.equal(0);
          expect(result.results.length).to.equal(0);
        });
    });
  });
};
