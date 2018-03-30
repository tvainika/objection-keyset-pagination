function* primeGenerator() {
  function isPrime(num) {
    for (var i = 2; i < num; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return true;
  }

  let v = 1;

  while(true) {
    do {
      ++v;
    } while (!isPrime(v));
    yield v;
  }
}

exports.seed = function(knex, Promise) {
  return knex('primes').del()
    .then(async function () {
      var gen = primeGenerator();
      do {
        var prime = gen.next().value;
        await knex('primes').insert({prime});
      } while (prime < 25000);
    });
};
