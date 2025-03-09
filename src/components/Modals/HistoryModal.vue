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
  props:{
    histor:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      touchStartX: 0, 
      touchEndX: 0,   
    };
  },
  methods: {
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
    },
    handleTouchMove(event) {
      this.touchEndX = event.touches[0].clientX; 
      
      if (this.touchEndX-this.touchStartX   >= 120 ||this.touchStartX  -this.touchEndX >= 120 ) {
        this.$emit("close"); 
      }
    },
  },
  mounted(){

  }
};
</script>

<style>


.scroll-content {
  width: 100%;
  text-align: center;
}
</style>
