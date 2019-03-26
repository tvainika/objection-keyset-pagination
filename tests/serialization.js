const expect = require('expect.js');
const Model = require('objection').Model;
const keysetPaginationRequire = require('..');

module.exports = knex => {
  it('keyset aka cursor serialization', () => {
    const keysetPagination = keysetPaginationRequire({limit: 60, countTotal: true});
    class Number extends keysetPagination(Model) {
      static get tableName() {
        return 'Number';
      }
    }

    const query = Number.query(knex)
          .orderBy('id');

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

        // Serialization as JSON works nicely
        return query.clone()
          .keysetPage(JSON.parse(JSON.stringify(result.keyset)));
      })
      .then(result => {
        expect(result.results.length).to.equal(60);
        expect(result.results).to.eql(allRows.slice(60, 120));

        // objection-keyset-pagination automatically parses JSON out of string
        return query.clone()
          .keysetPage(JSON.stringify(result.keyset));
      })
      .then(result => {
        expect(result.results.length).to.equal(39);
        expect(result.results).to.eql(allRows.slice(120));

        return query.clone()
          .keysetPage(JSON.stringify(result.keyset));
      })
      .then(result => {
        expect(result.results.length).to.equal(0);

        return query.clone()
          .keysetPage(JSON.stringify(result.keyset));
      })
      .then(result => {
        expect(result.results.length).to.equal(0);

        return query.clone()
          .previousKeysetPage(JSON.stringify(result.keyset));
      })
      .then(result => {
        expect(result.results.length).to.equal(60);
        expect(result.results).to.eql(allRows.slice(60, 120).reverse());

        return query.clone()
          .previousKeysetPage(JSON.stringify(result.keyset));
      })
      .then(result => {
        expect(result.results.length).to.equal(60);
        expect(result.results).to.eql(allRows.slice(0, 60).reverse());

        return query.clone()
          .previousKeysetPage(JSON.stringify(result.keyset));
      })
      .then(result => {
        expect(result.results.length).to.equal(0);

        return query.clone()
          .previousKeysetPage(JSON.stringify(result.keyset));
      })
      .then(result => {
        expect(result.results.length).to.equal(0);
      });
  });
};
