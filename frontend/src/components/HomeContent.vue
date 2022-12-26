<template>
  <div class="upcoming-movies">
    <h1>Upcoming movies</h1>
    <div class="card-group">
      <div v-for="movie in movies" :key="movie.id" class="col-sm-4">
        <MovieCard :movie="movie" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MovieCard from './MovieCard.vue';

const options = {
  method: 'GET',
  url: 'https://moviesdatabase.p.rapidapi.com/titles/x/upcoming',
  params: {startYear: '2022', endYear: '2023', limit: 9, sort: 'year.incr', titleType: 'movie'},
  headers: {
    'X-RapidAPI-Key': 'bc0022cfa8msh0c891b61c7fe73ep163ed5jsnfc1d04c26e0a',
    'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
  }
};

export default {
  name: "HomeContent",
  data() {
    return { 
      movies: [],
    };
  },
  mounted() {
    axios.request(options).then(response => {
      this.movies = response.data.results.map(result => ({
        id: result.id,
        title: result.titleText.text,
        releaseDate: result.releaseDate.day +"."+ result.releaseDate.month +"."+ result.releaseDate.year + ".",
        url: result.primaryImage ? result.primaryImage.url : "",
      }))
      console.log(this.movies);
    }).catch(error => {
      console.error(error);
    })
  },
  components: {
    MovieCard
  }
};
</script>
