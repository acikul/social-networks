<template>
  <div class="upcoming-movies pb-2">
    <h1 class="pb-2">Movies</h1>
    <div class="card-group">
      <div v-for="movie in movies.slice(0, numberOfMovies)" :key="movie._id" class="col-sm-4">
        <MovieCard :movie="movie" :user="user"/>
      </div>
    </div>
  </div>
</template>

<script>
import MovieCard from './MovieCard.vue';
import {useAuth0} from "@auth0/auth0-vue";

export default {
  name: "HomeContent",
  data() {

    return {
      movies: [],
      numberOfMovies: 21,
      user: useAuth0().user
    };
  },
  mounted() {
    fetch("/api/movies")
        .then(res=>res.json())
        .then(data=>this.movies = data)
        .catch(err=>console.log("ERROR"+err));
  },
  components: {
    MovieCard
  }
};
</script>
