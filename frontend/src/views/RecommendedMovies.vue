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
import {useAuth0} from "@auth0/auth0-vue";

export default {
  components: {
    MovieCard,
  },
  data() {
    return {
      recommendedMovies: [],
      user: useAuth0().user,
    };
  },
  mounted() {
    const auth0 = useAuth0();
    fetch("/api/movies/recommend/"+ auth0.user.value.email)
      .then((res) => res.json())
      .then((data) => (this.recommendedMovies = data))
      .catch((err) => console.log("ERROR" + err));
  },
};
</script>

<style></style>
