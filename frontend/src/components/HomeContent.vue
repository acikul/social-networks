<template>
  <div class="upcoming-movies pb-2">
    <div class="header">
      <h1 class="pb-2">Movies</h1>
      <Pag @page-changed="getMovies" :total-items="allItems" :items-per-page="numberOfMoviesPerPage"/>
    </div>
    <div class="card-group row">
      <div v-for="movie in movies" :key="movie._id" class="col-sm-4">
        <MovieCard :movie="movie" :user="user"/>
      </div>
    </div>
  </div>
</template>

<script>
import MovieCard from './MovieCard.vue';
import {useAuth0} from "@auth0/auth0-vue";
import Pagination from "@/components/Pag.vue";
import Pag from "@/components/Pag.vue";


export default {
  name: "HomeContent",
  data() {

    return {
      movies: [],
      numberOfMoviesPerPage: 12,
      user: useAuth0().user,
      allItems: 0
    };
  },
  mounted() {
    fetch("/api/movies?page=1")
        .then(res=>res.json())
        .then(data=>this.movies = data)
        .catch(err=>console.log("ERROR"+err));

    fetch("/api/movies/count/get").then(res=>res.json()).then(res=>this.allItems=res.number);
  },
  methods:{
    getMovies(page){
      fetch(`/api/movies?page=${page}`)
          .then(res=>res.json())
          .then(data=>this.movies = data)
          .catch(err=>console.log("ERROR"+err));
    }
  },
  components: {
    Pag,
    MovieCard
  }
};
</script>
<style>
.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>