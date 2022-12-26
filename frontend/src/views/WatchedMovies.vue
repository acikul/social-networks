<template>
    <div class="watched-movies pb-2">
        <h1 class="pb-2">Watched movies</h1>
        <div class="card-group">
            <div v-for="movie in movies" :key="movie._id" class="col-sm-4">
                <MovieCard :movie="movie" />
            </div>
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
        };
    },
    mounted() {
        const auth0 = useAuth0();
        axios.get("/api/movies/" + auth0.user.value.email).then(response => {
          console.log(response);
          console.log("ODGOVORO")
            this.movies = response.data
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
  