<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div
        class="modal-content relative"
        ref="modalContent"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
      >
        <h1>{{ history?.manager?.username || "" }}</h1>

        <div class="scroll h-80">
          <div class="table" v-if="history?.type == 'debt'">
            <div class="table-header">
              <div class="row">
                <div class="cell">№</div>
                <div class="cell">Sana</div>
                <div class="cell">Nomi</div>
                <div class="cell">Soni</div>
                <div class="cell">Narxi</div>
                <div class="cell">Umumiy summa</div>
                <div class="cell">Sababi</div>
                <div class="cell" v-if="isHideSeller">Nonvoy</div>
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
                    formatPrice(
                      data?.price
                        ? data?.price
                        : data?.omborxonaProId?.price
                        ? data?.omborxonaProId?.price
                        : 0
                    )
                  }}
                </div>
                <div class="cell">
                  {{
                    formatPrice(
                      (data?.price
                        ? data?.price
                        : data?.omborxonaProId?.price
                        ? data?.omborxonaProId?.price
                        : 0) * data?.quantity
                    )
                  }}
                </div>
                <div class="cell">
                  {{ data?.reason || data.description || "----" }}
                </div>
                <div class="cell" v-if="isHideSeller">
                  {{
                    data?.sellerId?.username ||
                    data?.delivertId?.username ||
                    "----"
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
                <div class="cell" v-if="history?.role == 'manager'">
                  Umumiy summa
                </div>
                <div
                  class="cell"
                  v-if="
                    history?.role !== 'seller' && history?.role !== 'manager'
                  "
                >
                  Umumiy summa
                </div>
                <div
                  class="cell"
                  v-if="
                    history?.role !== 'seller' && history?.role !== 'manager'
                  "
                >
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
                      ? data.pricetype === ""
                        ? data.breadId.price
                        : data.pricetype === "toyxona"
                        ? data.breadId.price3
                        : data.pricetype === "dokon"
                        ? data.breadId.price2
                        : data.breadId.price
                      : 0
                  }}
                </div>
                <div class="cell">
                  {{
                    formatPrice(
                      data?.price
                        ? data?.price
                        : data.pricetype === ""
                        ? data.breadId.price
                        : data.pricetype === "toyxona"
                        ? data.breadId.price3
                        : data.pricetype === "dokon"
                        ? data.breadId.price2
                        : data.breadId.price || 0
                    )
                  }}
                </div>
                <div class="cell" v-if="history?.role == 'manager'">
                  {{
                    formatPrice(
                      (data?.price
                        ? data?.price
                        : data.pricetype === ""
                        ? data.breadId.price
                        : data.pricetype === "toyxona"
                        ? data.breadId.price3
                        : data.pricetype === "dokon"
                        ? data.breadId.price2
                        : data.breadId.price) * data.quantity
                    )
                  }}
                </div>
                <div
                  class="cell"
                  v-if="
                    history?.role !== 'seller' && history?.role !== 'manager'
                  "
                >
                  {{ formatPrice(data?.money) || "" }}
                </div>
                <div
                  class="cell"
                  v-if="
                    history?.role !== 'seller' && history?.role !== 'manager'
                  "
                >
                  {{ data?.magazineId?.title || "------" }}
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
                <div class="cell">Soni</div>
                <div class="cell">Narxi</div>
                <div class="cell">Olingan pul</div>
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
                  {{ data?.quantity }}
                </div>
                <div class="cell">
                  {{
                    data?.typeOfBreadIds.reduce(
                      (a, b) => a + b.breadId.price2 * b.quantity,
                      0
                    ) || 0
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
                <!-- <div class="cell">Narxi</div> -->
                <div class="cell">Turi</div>
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
                  {{ data.text }}
                </div>
                <div class="cell">
                  {{
                    formatPrice(data.value?.quantity ? data.value?.quantity : 0)
                  }}
                </div>
                <div class="cell">
                  {{
                    formatPrice(
                      data.value?.qopQuantity ? data.value?.qopQuantity : 0
                    )
                  }}
                </div>
                <div class="cell">
                  {{
                    formatPrice(
                      data.value?.totalPrice ? data.value?.totalPrice : 0
                    )
                  }}
                </div>
                <div class="cell">{{ data.value?.sellerId?.username }}</div>
              </div>
            </div>
          </div>
          <div class="table" v-if="history?.type == 'sellingbread'">
            <div class="table-header">
              <div class="row">
                <div class="cell">№</div>
                <!-- <div class="cell">Narxi</div> -->
                <div class="cell">Turi</div>
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
                  {{
                    data.breadId.typeOfBreadId[0].breadId.title || "Non turi"
                  }}
                </div>
                <div class="cell">
                  {{ formatPrice(data.quantity ? data.quantity : 0) }}
                </div>
                <div class="cell">
                  {{
                    formatPrice(
                      data.breadId?.totalQopQuantity
                        ? data.breadId?.totalQopQuantity
                        : 0
                    )
                  }}
                </div>
                <div class="cell">
                  {{ formatPrice(data.price ? data.price : 0) }}
                </div>
                <div class="cell">{{ data?.deliveryId?.username }}</div>
              </div>
            </div>
          </div>

          <div class="table" v-if="history?.type == 'bread-seller'">
            <div class="table-header">
              <div class="row">
                <div class="cell">№</div>
                <div class="cell">Sana</div>
                <div class="cell">Turi</div>
                <div class="cell">Narxi</div>
                <div class="cell">Soni</div>
                <div class="cell">Qop soni</div>
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
                  {{ formatDate(new Date(data?.createdAt)) }}
                </div>
                <div class="cell">
                  {{
                    data?.typeOfBreadId[0].breadId.title
                      ? data?.typeOfBreadId[0].breadId.title
                      : ""
                  }}
                </div>

                <div class="cell">
                  {{ formatPrice(data?.price ? data?.price : 0) }}
                </div>
                <div class="cell">
                  {{
                    formatPrice(data?.totalQuantity ? data?.totalQuantity : 0)
                  }}
                </div>
                <div class="cell">
                  {{
                    formatPrice(
                      data?.totalQopQuantity ? data?.totalQopQuantity : 0
                    )
                  }}
                </div>
              </div>
            </div>
          </div>

          <div class="table" v-if="history?.type == 'orderwithdelivery'">
            <div class="table-header">
              <div class="row">
                <div class="cell">№</div>
                <div class="cell">Sana</div>
                <div class="cell">Soni</div>
                <div class="cell">Nomi</div>
                <div class="cell">Tavsif</div>
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
                  {{ formatDate(new Date(data?.createdAt)) }}
                </div>
                <div class="cell">
                  {{ formatPrice(data?.totalQuantity) || 0 }}
                </div>
                <div class="cell">
                  {{ data?.title ? data?.title : "" }}
                </div>
                <div class="cell">
                  {{ data?.description ? data?.description : "" }}
                </div>
                <div class="cell">
                  {{ formatPrice(data?.totalPrice ? data?.totalPrice : 0) }}
                </div>
                <div class="cell">
                  {{ data.deliveryId.username || "---" }}
                </div>
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
      isHideSeller: false,
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
  mounted() {
    if (this.history.role == "seller") {
      this.isHideSeller = false;
    } else if (this.history.role == "delivery") {
      this.isHideSeller = true;
    }
  },
};
</script>

<style>
.h-80{
  height: 80vh;
}
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
  min-height: 100vh;
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
