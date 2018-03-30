import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';
import axios from 'axios';

var app = new Vue({
  el: '#app',
  data: {
    primes: [],
    cursor: undefined
  },
  methods: {
    infiniteHandler($state) {
      axios.get('/primes', {
        params: {
          cursor: this.cursor
        }
      }).then(({data}) => {
        this.cursor = data.cursor;
        if (data.primes.length) {
          this.primes = this.primes.concat(data.primes.map(x => x.prime));
          $state.loaded();
        } else {
          $state.complete();
        }
      });
    }
  },
  components: {
    InfiniteLoading
  }
});
