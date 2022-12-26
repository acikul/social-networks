import { createRouter as createVueRouter, createWebHashHistory, Router } from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import WatchedMovies from "../views/WatchedMovies.vue"
import SearchMovies from "../views/SearchMovies.vue"
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
    ],
    history: createWebHashHistory()
  })
}
