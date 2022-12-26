<template>
    <div class="watched-movies">
        <h1>Watched movies</h1>
        <div class="card-group">
            <div v-for="movie in movies" :key="movie.id" class="col-sm-4">
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

        axios.get("/api/movies/" + auth0.user.value.sub).then(response => {
            this.movies = response.data.map(result => ({
                id: result._id,
                title: result.title,
                releaseDate: result.releaseDate,
                url: result.url,
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
  