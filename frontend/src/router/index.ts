import { createRouter as createVueRouter, createWebHashHistory, Router } from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import WatchedMovies from "../views/WatchedMovies.vue"
import SearchMovies from "../views/SearchMovies.vue"
import PopularMovies from "../views/PopularMovies.vue"
import RecommendedMovies from "../views/RecommendedMovies.vue"
import MovieDetails from "../views/MovieDetails.vue"
import { createAuthGuard } from "@auth0/auth0-vue";
import { App } from 'vue';

export function createRouter(app: App): Router {
  return createVueRouter({
    routes: [
      {
        path: "/",
        name: "home",
        component: Home
      },
      {
        path: "/profile",
        name: "profile",
        component: Profile,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/watched",
        name: "watched",
        component: WatchedMovies,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/search",
        name: "search",
        component: SearchMovies,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/popular",
        name: "popular",
        component: PopularMovies,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/recommended",
        name: "recommended",
        component: RecommendedMovies,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/details/:id",
        name: "details",
        component: MovieDetails,
        props: true
      },
    ],
    history: createWebHashHistory()
  })
}
