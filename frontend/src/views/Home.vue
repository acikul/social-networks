<template>
  <div>
    <home-content />
  </div>
</template>

<script>
import { useAuth0 } from "@auth0/auth0-vue";
import axios from "axios";
import { onMounted } from "vue";
import HomeContent from "../components/HomeContent";

export default {
  name: "home-view",
  setup() {
    const auth0 = useAuth0();
    
    onMounted(() => {
      //console.log("isAuth: " + auth0.isAuthenticated._value);
      if (auth0.isAuthenticated._value) {
        const user = auth0.user
        console.log("sending save-user POST to backend");
        console.log(user.value);
        // send the user's email address to your backend endpoint
        axios.post("/api/save-user", {
          ...user._value
        }).then((response) => {
          console.log("SUCCESS");
          console.log(response);
        }).catch(error => {
          console.log("FAILURE");
          console.log(error);
        });
      }
    })

  },
  components: {
    HomeContent,
  }
};
</script>

<style lang="css" scoped>
.next-steps .fa-link {
  margin-right: 5px;
}

</style>
