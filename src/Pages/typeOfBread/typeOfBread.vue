<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Non turlari</h3>
      <button class="create-button" @click="openModal = true">
        Non turini yaratish
      </button>
    </div>
  </div>
  <TypeOfBreadModalVue v-if="openModal" @close='openModal = false' />
</template>

<script>
import TypeOfBreadModalVue from "./typeOfBreadModal.vue";
export default {
  components: {
    TypeOfBreadModalVue,
  },
  data() {
    return {
      openModal: false,
    };
  },
};
</script>

<style></style>