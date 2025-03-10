<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div
        class="modal-content relative"
        ref="modalContent"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
      >
        <h1>{{ history?.manager.username }}</h1>

        <div class="table" v-if="history?.type == 'debt'">
          <div class="table-header">
            <div class="row">
              <div class="cell">№</div>
              <div class="cell">Sana</div>
              <div class="cell">Nomi</div>
              <div class="cell">Soni</div>
              <div class="cell">Narxi</div>
              <div class="cell">Sababi</div>
              <div class="cell">Nonvoy</div>
            </div>
          </div>
          <div class="table-body">
            <div
              v-for="(data, index) in history?.history"
              :key="index"
              class="row"
            >
              <div class="cell">{{ index + 1 }}</div>
              <div class="cell">
                {{ formatDate(new Date(data.createdAt)) }}
              </div>
              <div class="cell">
                {{ data?.title || "" }}
              </div>
              <div class="cell">
                {{ data?.quantity || 0 }}
              </div>
              <div class="cell">
                {{ data?.price || 0 }}
              </div>
              <div class="cell">
                {{ data?.reason || "" }}
              </div>
              <div class="cell">
                {{ data?.sellerId?.username || "id" }}
              </div>
            </div>
          </div>
        </div>

        <div class="table" v-if="history?.type == 'prixod'">
          <div class="table-header">
            <div class="row">
              <div class="cell">№</div>
              <div class="cell">Sana</div>
              <div class="cell">Soni</div>
              <div class="cell">Narxi</div>
              <div class="cell">Money</div>
              <div class="cell">Do`kon nomi</div>
            </div>
          </div>
          <div class="table-body">
            <div
              v-for="(data, index) in history?.history"
              :key="index"
              class="row"
            >
              <div class="cell">{{ index + 1 }}</div>
              <div class="cell">
                {{ formatDate(new Date(data.createdAt)) }}
              </div>
              <div class="cell">
                {{ data?.quantity || 0 }}
              </div>
              <div class="cell">
                {{ data?.price || 0 }}
              </div>
              <div class="cell">
                {{ data?.money || "" }}
              </div>
              <div class="cell">
                {{ data?.magazineId?.title || "id" }}
              </div>
            </div>
          </div>
        </div>

          <div class="table" v-if="history?.type == 'pending'">
          <div class="table-header">
            <div class="row">
              <div class="cell">№</div>
              <div class="cell">Sana</div>
              <div class="cell">Soni</div>
              <div class="cell">Narxi</div>
              <div class="cell">Money</div>
              <div class="cell">Do`kon nomi</div>
            </div>
          </div>
          <div class="table-body">
            <div
              v-for="(data, index) in history?.history"
              :key="index"
              class="row"
            >
              <div class="cell">{{ index + 1 }}</div>
              <div class="cell">
                {{ formatDate(new Date(data.createdAt)) }}
              </div>
              <div class="cell">
                {{ data?.quantity || 0 }}
              </div>
              <div class="cell">
                {{ data?.price || 0 }}
              </div>
              <div class="cell">
                {{ data?.money || "" }}
              </div>
              <div class="cell">
                {{ data?.magazineId?.title || "id" }}
              </div>
            </div>
          </div>
        </div>

  
        <div class="modal-buttons d-flex j-end a-center gap24">
          <button type="button" class="action-button" @click="$emit('close')">
            Chiqish
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    history: {
      type: Object,
    },
  },
  data() {
    return {
      touchStartX: 0,
      touchEndX: 0,
    };
  },
  methods: {
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU").format(price);
    },
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
    },
    handleTouchMove(event) {
      this.touchEndX = event.touches[0].clientX;

      if (
        this.touchEndX - this.touchStartX >= 120 ||
        this.touchStartX - this.touchEndX >= 120
      ) {
        this.$emit("close");
      }
    },
  },
  // mounted() {
  //   console.log(this.history);
  // },
};
</script>

<style>
.scroll-content {
  width: 100%;
  text-align: center;
}
</style>
