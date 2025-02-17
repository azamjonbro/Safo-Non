<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div 
        class="modal-content" 
        ref="modalContent" 
        @touchstart="handleTouchStart" 
        @touchmove="handleTouchMove"
      >

      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      touchStartX: 0, 
      touchEndX: 0,   
    };
  },
  methods: {
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX; // Barmoq bosilgan joy
    },
    handleTouchMove(event) {
      this.touchEndX = event.touches[0].clientX; // Barmoq harakatlanayotgan joy
      
      if (this.touchStartX - this.touchEndX >= -100) {
        this.$emit("close"); // 100px chapga surilsa modal yopiladi
      }
    },
  },
};
</script>

<style>


.scroll-content {
  width: 100%;
  text-align: center;
}
</style>
