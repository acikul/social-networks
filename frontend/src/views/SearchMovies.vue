<template>
  <div>
    <form @submit.prevent="search">
      <div class="form-group">
        <input type="text" v-model="query" class="form-control" placeholder="Search movies...">
      </div>
      <button type="submit" class="btn btn-primary">Search</button>
    </form>

    <br />

    <div v-if="api1results.length > 0" class="row mt-3">
      <h2>MoviesDatabase results:</h2>
      <div v-for="movie in api1results" :key="movie.id" class="col-sm-4">
        <MovieSearchResultCard :movie="movie" :user="user" />
      </div>
    </div>

    <br />
    <div v-if="api2results.length > 0" class="row mt-3">
      <h2>Utelly results:</h2>
      <div v-for="movie in api2results" :key="movie.id" class="col-sm-4">
        <MovieSearchResultCard :movie="movie" :user="user" />

      </div>
    </div>
  </div>
</template>
  
<script>
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios';
import MovieSearchResultCard from '@/components/MovieSearchResultCard.vue';

export default {
  name: "SearchMovies",
  data() {
    const user = useAuth0().user.value.sub
    return {
      user,
      query: '',
      api1results: [],
      api2results: []
    };
  },
  methods: {
    search() {
      // Call first search API with query
      const options1 = {
        method: 'GET',
        url: 'https://moviesdatabase.p.rapidapi.com/titles/search/title/' + encodeURIComponent(this.query),
        params: { titleType: 'movie', exact: 'false', sort: 'year.decr', limit: '9', endYear: '2023' },
        headers: {
          'X-RapidAPI-Key': 'bc0022cfa8msh0c891b61c7fe73ep163ed5jsnfc1d04c26e0a',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
      };
      axios.request(options1).then(response => {
        this.api1results = response.data.results.map(result => ({
          id: result.id,
          title: result.titleText.text,
          releaseDate: result.releaseDate ? (result.releaseDate.day + "." + result.releaseDate.month + "." + result.releaseDate.year + ".") : "unknown",
          url: result.primaryImage ? result.primaryImage.url : "",
        }))
        console.log(this.api1results)
      }).catch(error => {
        console.error(error);
      })

      // Call second search API with query
      const options2 = {
        method: 'GET',
        url: 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup',
        params: { term: this.query},
        headers: {
          'X-RapidAPI-Key': 'bc0022cfa8msh0c891b61c7fe73ep163ed5jsnfc1d04c26e0a',
          'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
        }
      };
      axios.request(options2).then(response => {
        this.api2results = response.data.results.map(result => ({
          id: result.external_ids.imdb.id,
          title: result.name,
          releaseDate: result.releaseDate ? (result.releaseDate.day + "." + result.releaseDate.month + "." + result.releaseDate.year + ".") : null,
          url: result.picture ? result.picture : "",
        }))
        console.log(this.api2results)
      }).catch(error => {
        console.error(error);
      })
    }
  },
  components: {
    MovieSearchResultCard
  }
};
</script>
  