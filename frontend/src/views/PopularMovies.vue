<template>
  <div>
    <div id="main" class="pb-4">
      <h1>Get popular movies:</h1>
      <div
        class="btn-group"
        role="group"
        aria-label="Button group with nested dropdown"
      >
        <div class="dropdown btn-group" role="group">
          <button
            class="btn btn-primary dropdown-toggle fixed"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {{ selectedRange }}
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a
              v-for="range in ranges"
              :key="range"
              class="dropdown-item"
              href="#"
              @click.prevent="selectedRange = range"
            >
              {{ range }}
            </a>
          </div>
        </div>

        <div class="dropdown btn-group" role="group">
          <button
            class="btn btn-primary dropdown-toggle fixed"
            type="button"
            id="dropdownMenuButton1"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {{ selectedCategory.name }}
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <a
              v-for="category in categories"
              :key="category"
              class="dropdown-item"
              href="#"
              @click.prevent="selectedCategory = category"
            >
              {{ category.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="upcoming-movies pb-2">
      <div class="card-group">
        <div v-for="movie in filteredMovies" :key="movie._id" class="col-sm-4">
          <MovieCard :movie="movie" :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MovieCard from "../components/MovieCard.vue";

export default {
  components: {
    MovieCard,
  },
  data() {
    return {
      movies: [],
      ranges: ["Weekly", "Monthly", "Yearly"],
      categories: [{_id:-1, id:-1, name:"All"}],
      selectedRange: "Weekly",
      selectedCategory: {_id:-1, id:-1, name:"All"},
      filteredMovies: [],
    };
  },
  methods: {
    getPopularMovies() {
      fetch(`/api/movies/popular/${this.selectedRange.toLowerCase()}`)
        .then((res) => res.json())
        .then((data) => {
          this.movies = data;
          console.log(data);
          this.filterMovies();
        })
        .catch((err) => console.log("ERROR" + err));
    },
    getCategories() {
      fetch(`/api/movies/categories`)
        .then((res) => res.json())
        .then((data) => {
          this.categories.push(...data)
          console.log(data);
        })
        .catch((err) => console.log("ERROR" + err));
    },
    filterMovies() {
      const filtered = []
      if(this.selectedCategory.id != -1) {
        this.movies.forEach(movie => {
          if(movie.genre_ids.includes(this.selectedCategory.id)) {
            filtered.push(movie)
          }
        });
        this.filteredMovies = filtered
      } else {
        this.filteredMovies = []
        this.filteredMovies.push(...this.movies)
      }
      console.log(filtered);
    },
  },
  mounted() {
    this.getPopularMovies();
    this.getCategories();
    
  },
  watch: {
    selectedRange: "getPopularMovies",
    selectedCategory: "filterMovies"
  },
};
</script>

<style>
.fixed {
  min-width: 140px;
}
#main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
