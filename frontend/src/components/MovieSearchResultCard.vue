<template>
    <div class="card">
        <img v-if="movie.url" class="card-img-top" :src="movie.url" alt="Movie poster">
        <img v-else class="card-img-top" src="noimage.jpg" alt="Movie poster">
        <div class="card-body">
            <h5 class="card-title">{{    movie.title    }}</h5>
            <p v-if="movie.releaseDate" class="card-text">Release date: {{    movie.releaseDate    }}</p>
        </div>
        <button @click="addToWatched(movie, user)" class="btn btn-primary">Add to watched</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['movie', 'user'],
    methods: {
        async addToWatched(movie, user) {
            // Call endpoint to add movie to watched list
            await axios.post('/api/save-movie/', {movie: movie, user: user});

            // Redirect to watched movies page
            this.$router.push('/watched');
        },
    }
};
</script>