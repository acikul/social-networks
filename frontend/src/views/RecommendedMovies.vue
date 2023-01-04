<template>
  <div>
    <div class="upcoming-movies pb-2">
      <h1 class="pb-2">Recommended movies</h1>
      <div class="card-group">
        <div
          v-for="movie in recommendedMovies"
          :key="movie._id"
          class="col-sm-4"
        >
          <MovieCard :movie="movie" :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MovieCard from "../components/MovieCard.vue";

export default {
  components: {
    MovieCard,
  },
  data() {
    return {
      recommendedMovies: [],
    };
  },
  mounted() {
    fetch("/api/movies/recommended")
      .then((res) => res.json())
      .then((data) => (this.recommendedMovies = data))
      .catch((err) => console.log("ERROR" + err));
  },
};
</script>

<style></style>
