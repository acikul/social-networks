<template>
  <div class="container movie-details">
    <div class="row">
      <div class="col-md-4">
        <img
          class="poster"
          :src="'https://image.tmdb.org/t/p/original' + movie.poster_path"
        />
      </div>
      <div class="col-md-8">
        <h1 class="title">{{ movie.title }}</h1>
        <p class="description">{{ movie.overview }}</p>
        <table class="table details">
          <tr>
            <td>Release Date:</td>
            <td>{{ movie.release_date }}</td>
          </tr>
          <tr>
            <td>Genres:</td>
            <td>
              <ul>
                <li v-for="mc in movieCategories" :key="mc">{{ mc }}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>TMDB Average Vote:</td>
            <td>{{ movie.vote_average }}</td>
          </tr>
          <tr>
            <td>TMDB Vote Count:</td>
            <td>{{ movie.vote_count }}</td>
          </tr>
          <tr>
            <td>Original language:</td>
            <td>{{ movie.original_language }}</td>
          </tr>
          <tr>
            <button v-if="user" type="button" class="btn btn-primary" @click="addToWatched(movie)">
              Add to watched
            </button>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuth0 } from '@auth0/auth0-vue';
import axios from "axios";

export default {
  data() {
    return {
      categories: {},
      movie: {},
      movieCategories: [],
      user: useAuth0().user,
    };
  },
  methods: {
    async getCategories() {
      await fetch(`/api/movies/categories`)
        .then((res) => res.json())
        .then((data) => {
          data.forEach((d) => {
            this.categories[d.id] = d.name;
          });
        })
        .catch((err) => console.log("ERROR" + err));
    },
    addToWatched(movie) {
      // Call endpoint to add movie to watched list
      // Redirect to watched movies page
      axios.post('/api/save-movie/', {movie: movie._id, user: this.user})
          .then(res=>this.$router.push('/watched'));


    },
  },
  async mounted() {
    await this.getCategories();
    const movieId = this.$route.params.id;
    await fetch(`/api/movie/details/${movieId}`)
      .then((res) => res.json())
      .then((data) => {
        this.movie = data;
        console.log(data);
        this.movieCategories = this.movie.genre_ids.map(
          (genre_id) => this.categories[genre_id]
        );
      })
      .catch((err) => console.log("ERROR" + err));
  },
};
</script>

<style scoped>
.btn {
    margin-left: 230px;
}
.movie-details {
  margin-top: 45px;
  margin-bottom: 85px;
}
.poster {
  width: 100%;
}
.title {
  margin-top: 20px;
  font-size: 32px;
}
.description {
  margin-top: 20px;
  font-size: 18px;
  line-height: 1.5;
  width: 80%;
  text-align: center;
}
.details {
  margin-top: 20px;
  width: 80%;
  font-size: 16px;
}
</style>
