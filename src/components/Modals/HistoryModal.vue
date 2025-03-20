<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div
        class="modal-content relative"
        ref="modalContent"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
      >
        <h1>{{ history?.manager?.username }}</h1>

        <div class="table" v-if="history?.type == 'debt'">
          <div class="table-header">
            <div class="row">
              <div class="cell">№</div>
              <div class="cell">Sana</div>
              <div class="cell">Nomi</div>
              <div class="cell">Soni</div>
              <div class="cell">Narxi</div>
              <div class="cell">Sababi</div>
              <div class="cell" v-if="history?.role !== 'seller'">Nonvoy</div>
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
                {{
                  data?.title
                    ? data.title
                    : data?.omborxonaProId?.name
                    ? data?.omborxonaProId?.name
                    : " ----"
                }}
              </div>
              <div class="cell">
                {{ data?.quantity || "----" }}
              </div>
              <div class="cell">
                {{
                  data?.price
                    ? data?.price
                    : data?.omborxonaProId?.price
                    ? data?.omborxonaProId?.price
                    : 0
                }}
              </div>
              <div class="cell">
                {{ data?.reason || data.description || "" }}
              </div>
              <div class="cell" v-if="history?.role !== 'seller'">
                {{
                  data?.sellerId?.username || data?.delivertId?.username || "id"
                }}
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
              <div class="cell" v-if="history?.role !== 'seller'">Umumiy summa</div>
              <div class="cell" v-if="history?.role !== 'seller'">
                Do`kon nomi
              </div>
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
                {{
                  data?.quantity
                    ? data?.quantity
                    : data?.typeOfBreadId
                    ? data?.typeOfBreadId.reduce((a, b) => a + b.quantity, 0)
                    : 0
                }}
              </div>
              <div class="cell">
                {{
                  data?.price
                    ? data?.price
                    : data?.typeOfBreadId
                    ? data?.typeOfBreadId.reduce(
                        (a, b) => a + b?.breadId?.price,
                        0
                      )
                    : 0
                }}
              </div>
              <div class="cell" v-if="history?.role !== 'seller'">
                {{ data?.money || "" }}
              </div>
              <div class="cell" v-if="history?.role !== 'seller'">
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
              <div class="cell">Umumiy summa</div>
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

        <div class="table" v-if="history?.type == 'soldBread'">
          <div class="table-header">
            <div class="row">
              <div class="cell">№</div>
              <div class="cell">Sana</div>
              <div class="cell">Jami Soni</div>
              <div class="cell">Jami Narxi</div>
              <div class="cell">Olgan puli</div>
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
                {{
                  data?.typeOfBreadIds?.reduce(
                    (a, b) =>
                      a +
                      b?.bread?.typeOfBreadId?.reduce(
                        (a, b) => a + b?.breadId?.price,
                        0
                      ),
                    0
                  ) || 0
                }}
              </div>
              <div class="cell">
                {{
                  data?.typeOfBreadIds?.reduce((a, b) => a + b.quantity, 0) || 0
                }}
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
        <div class="table" v-if="history?.type == 'sellerbreads'">
          <div class="table-header">
            <div class="row">
              <div class="cell">№</div>
              <div class="cell">Narxi (do'kon)</div>
              <div class="cell">Soni</div>
              <div class="cell">Qop soni</div>
              <div class="cell">Umumiy narxi</div>
              <div class="cell">Kimdan</div>
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
                {{ formatPrice(data?.price ? data?.price : 0) }}
              </div>
              <div class="cell">
                {{ formatPrice(data?.totalQuantity ? data?.totalQuantity : 0) }}
              </div>
              <div class="cell">
                {{
                  formatPrice(
                    data?.totalQopQuantity ? data?.totalQopQuantity : 0
                  )
                }}
              </div>
              <div class="cell">
                {{
                  data.typeOfBreadId.reduce((a, b) => a + b.breadId.price, 0)
                }}
              </div>
              <div class="cell">{{data.sellerId.username}}</div>
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
.static-history {
  padding-left: 10%;
  padding-right: 10%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  height: 100%;
  min-height: 40vh;
}

.static-history > div {
  height: 100%;
}
.relative > .table {
  height: 100vh;
}
.static-history .table {
  height: 100vh;
  margin-top: 15px;
  background: red;
}
.static-history .modal-buttons {
  height: 15% !important;
}
</style>
