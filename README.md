[![Build Status](https://travis-ci.org/tvainika/objection-keyset-pagination.svg?branch=master)](https://travis-ci.org/tvainika/objection-keyset-pagination)

# objection-keyset-pagination

Objection-keyset-pagination is a plugin to [Objection.js](https://vincit.github.io/objection.js) ORM to implement keyset based pagination, also known as cursor pagination.

Keyset pagination requires having strict ordering of records. On the user interface side, keyset pagination goes well with infinite scroll elements. Keyset pagination provides stable results. Next batch of records always continues from the last record of previous batch even if there would be insertion or deletions between queries. Using dummy numbered pages such as Objection.js' own `.page()` or `OFFSET` in SQL, then insertion or deletion causes some records omitted or duplicated.

<a href="https://use-the-index-luke.com/no-offset">
   <img src="https://use-the-index-luke.com/static/no-offset-banner-468x60.NsC5gHrT.png" width="468" height="60"
        alt="Do not use OFFSET for pagination"
   />
</a>

## Installation
Install:

```bash
npm install objection-keyset-pagination
```

Register the plugin:

```js
const Model = require('objection').Model;
const keysetPagination = require('objection-keyset-pagination')();

class Person extends keysetPagination(Model) {
  static get tableName() {
    return 'Person';
  }
}
```

## Options

**limit:** The number of rows per request if not set. The limit can be also set per query with `.limit()`. Default value is 10.

**countTotal:** Query total number of rows. Two queries must be performed to get the total count. Default value is true.

The options can be provided by optional second argument when registering the plugin:

```js
const keysetPagination = require('objection-keyset-pagination')({
  limit: 20});
```

## Usage

Query with `.keysetPage()` to fetch first batch of rows and the keyset. Then later fetch next batch of rows starting from the keyset. The keyset is a plain old JS object, which can be easily passed around in JSON serialization.

```js
const result1 = await Person
  .query()
  .where('age', '>', 20)
  .limit(5)
  .orderBy('id')
  .keysetPage();
```

The models are returned in `result.results` just like with `.page()`.

The keyset index columns are returned in `result.keyset`. Pass this back in the next query to fetch next batch of rows. This `keyset` contains 

The return value has `result.total` (unless **countTotal** was set to false) which contains **total** count of rows.

The next batch of rows are fetched by passing `result.keyset` as parameter to `.keysetPage()`.

```js
const result2 = await Person
  .query()
  .where('age', '>', 20)
  .limit(5)
  .orderBy('id')
  .keysetPage(result1.keyset);
```

Fetching backwards can be achieved using `.previousKeysetPage(result.keyset)`. The returned models here are in reverse order.

```js
const result3 = await Person
  .query()
  .where('age', '>', 20)
  .limit(5)
  .orderBy('id')
  .previousKeysetPage(result2.keyset);

expect(result3.results).to.eql(result1.reverse());
```
