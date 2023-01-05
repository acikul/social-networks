<template>
  <div class="col text-center pt-2 pb-2"
       @contextmenu.prevent="addToWatched(movie, user)"
       @click="goToDetails">

    <img v-if="this.movie.poster_path" :src="'https://image.tmdb.org/t/p/original' + this.movie.poster_path"
         :alt="'Poster image for '+ this.movie.title"
         :width="width"
         :height="height"
    >
    <img v-else-if="this.movie.Poster===`N/A`" src="https://cdn.2020prosoftware.com/installations/common/img/image-not-found.png"
         alt="Image not found"
         :width="width"
         :height="height"
    >
    <img v-else-if="this.movie.Poster" :src="this.movie.Poster"
         :alt="'Poster image for '+ this.movie.title"
         :width="width"
         :height="height"
    >
    <img v-else src="noimage.jpg"
         :width="width"
         :height="height"
         alt="Image not found"
    />

    <h4 class="mt-2">{{movie.title}}</h4>
  </div>
</template>
<script>
import axios from "axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    // props: ['movie', 'user',''],
  props:{
      movie:{
        type:Object,
        required:true
      },
    user:{
      type:Object,
      required:true
    },
    unwatch:{
        type:Boolean,
        required:false,
        default:false
    }
  },
  data: () => ({
    height:400,
    // width:250
  }),
  methods: {
    goToDetails(){

      this.$router.push(`/details/${this.movie._id}`);
    },
    async addToWatched(movie, user) {
      if(!this.user){
        return
      }
      // Call endpoint to add movie to watched list
      if(!this.$props.unwatch){
        console.log("SAVING")
        if(!movie._id){
          movie._id=movie.id;
        }
        await axios.post('/api/save-movie/', {movie: movie._id, user: user});
        toast(`${movie.title} has been added to watched movies.`, {
          autoClose: 1000,
          position: toast.POSITION.BOTTOM_CENTER,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          theme: "light",
          type: "info",
        });
      }else{
        console.log("REMOVING")
        await axios.post('/api/remove-movie/', {movie: movie._id, user: user})
        this.$emit("r", true);
        toast(`${movie.title} has been removed from watched movies.`, {
          autoClose: 1000,
          position: toast.POSITION.BOTTOM_CENTER,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          theme: "light",
          type: "info",
        });
      }


      // Redirect to watched movies page
      // this.$router.push('/watched');
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
.progress-bar{
  color: aqua;
}

</style>