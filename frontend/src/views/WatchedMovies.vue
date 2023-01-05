<template>
    <div class="watched-movies pb-2">
      <div class="header pb-2">
        <h1 class="pb-2">Watched movies</h1>
        <form @submit.prevent="search">
            <input type="text" @keyup="filterMovies" class="form-control" placeholder="Search movies..." ref="filter">
        </form>
      </div>


        <div class="card-group">
            <div v-for="movie in moviesFiltered" :key="movie._id" class="col-sm-4">
                <MovieCard :movie="movie" :unwatch="true" @r="refresh" :user="this.user"/>
            </div>
        </div>
        <div id="myBtn" @click="scrollToTop" class="btn-big">
          ⬆
        </div>
    </div>
</template>
  
<script>
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios';
import MovieCard from '../components/MovieCard.vue';

export default {
    name: "HomeContent",
    data() {
        return {
          movies: [],
          moviesFiltered:[],
          user: useAuth0().user,
        };
    },
    mounted() {
      this.refresh();
    },
  methods:{
      scrollToTop(){
        window.scrollTo(0, 0)
      },
    filterMovies(){
      const filterText = this.$refs.filter.value;
      this.moviesFiltered = this.movies.filter(mov=>mov.title.toLowerCase().includes(filterText.toLowerCase()));
    },
      refresh(){
        // console.log("HAVE TO REFRESH")
        // console.log(this.user)
        axios.get("/api/movies/" + this.user.email).then(response => {
          this.movies = response.data;
          this.moviesFiltered = this.movies;
          this.$refs.filter.value=null;
        }).catch(error => {
          console.error(error);
        })
      }
  },
    components: {
        MovieCard
    }
};
</script>

<style scoped>
.btn-big{
  font-size: 2em;
  cursor: pointer;
  position: sticky;
float: right;
}

#myBtn {
  display: block;
  position: fixed;
  bottom: 20px;
  right: 40px;
  z-index: 99;
  border: none;
  outline: none;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 10px;
}

#myBtn:hover {
  background-color: #555;
}

.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
  