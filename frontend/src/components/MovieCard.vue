<template>
    <div class="card">
        <img v-if="movie.url" class="card-img-top" :src="movie.url" alt="Movie poster">
        <img v-else class="card-img-top" src="noimage.jpg" alt="Movie poster">
        <div class="card-body">
            <h5 class="card-title">{{movie.title}}</h5>
            <p class="card-text">Release date: {{movie.releaseDate ? movie.releaseDate : "unknown"}}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: ['movie'],
};
</script>
