<template>
  <div>
    <div class="dropdown" id="main">
      <h1>Get popular movies:</h1>
      <button
        class="btn btn-primary dropdown-toggle fixed"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {{ selected }}
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#" @click.prevent="selected = 'weekly'"
          >Weekly</a
        >
        <a class="dropdown-item" href="#" @click.prevent="selected = 'monthly'"
          >Monthly</a
        >
        <a class="dropdown-item" href="#" @click.prevent="selected = 'yearly'"
          >Yearly</a
        >
      </div>
    </div>

    <div class="upcoming-movies pb-2">
      <div class="card-group">
        <div v-for="movie in movies" :key="movie._id" class="col-sm-4">
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
      selected: "weekly",
      movies: [],
    };
  },
  methods: {
    getPopularMovies() {
      fetch(`/api/movies/${this.selected}`)
        .then((res) => res.json())
        .then((data) => (this.movies = data))
        .catch((err) => console.log("ERROR" + err));
    },
  },
  mounted() {
    this.getPopularMovies();
  },
  watch: {
    selected: "getPopularMovies",
  },
};
</script>

<style>
.fixed {
  min-width: 100px;
}
#main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
