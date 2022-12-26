<template>
  <div class="col text-center pt-2 pb-2" @dblclick="addToWatched(movie, user)">

    <img v-if="this.movie.poster_path" :src="'https://image.tmdb.org/t/p/original' + this.movie.poster_path"
         :alt="'Poster image for '+ this.movie.original_title"
         :width="width"
         :height="height"
    >
    <img v-else-if="this.movie.Poster===`N/A`" src="https://cdn.2020prosoftware.com/installations/common/img/image-not-found.png"
         alt="Image not found"
         :width="width"
         :height="height"
    >
    <img v-else-if="this.movie.Poster" :src="this.movie.Poster"
         :alt="'Poster image for '+ this.movie.original_title"
         :width="width"
         :height="height"
    >
    <img v-else src="noimage.jpg"
         :width="width"
         :height="height"
         alt="Image not found"
    />

    <h4 class="mt-2">{{movie.original_title}}</h4>
  </div>
</template>
<script>
import axios from "axios";

export default {
    props: ['movie', 'user'],
  data: () => ({
    height:400,
    // width:250
  }),
  methods: {
    async addToWatched(movie, user) {
      // Call endpoint to add movie to watched list

      await axios.post('/api/save-movie/', {movie: movie._id, user: user});

      // Redirect to watched movies page
      this.$router.push('/watched');
    },
  }

};
</script>

<style scoped>
.col:hover{
  transform: scale(1.1);
  z-index: 15;
  cursor: pointer;
}
</style>