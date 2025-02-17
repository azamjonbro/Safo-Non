<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener("pageshow", this.handlePageShow);
  },
  beforeUnmount() {
    window.removeEventListener("pageshow", this.handlePageShow);
  },
  methods: {
    handlePageShow(event) {
      if (event.persisted) {
        console.log("Sahifa bfcache dan yuklandi!");
        window.location.reload(); // Sahifani qayta yuklash
      }
    }
  },
  mounted(){
    // const token= localStorage.getItem('user')
    // if(!token){
    //   this.$router.push('/login')
    // }else{
    //   this.$router.push('/')

    // }
  }
};
</script>
