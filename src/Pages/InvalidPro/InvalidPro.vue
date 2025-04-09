<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Yaroqsiz Nonlar</h3>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Soni</div>
            <div class="cell">Narxi</div>
            <div class="cell">Umumiy hisob</div>
            <div class="cell">Tavsifi</div>
            <div class="cell">Sana</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div class="row" v-for="(data, index) in InvalidPro" :key="index">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">
              {{ formatPrice(data?.order.totalQuantity) || 0 }}
            </div>
            <div class="cell">{{ formatPrice(data?.price || 0) }} so`m</div>
            <div class="cell">
              {{ formatPrice(data?.totalPrice || 0) }} so`m
            </div>
            <div class="cell">{{ data?.order.description || "" }}</div>
            <div class="cell">
              {{ formatDate(new Date(data.order.createdAt)) }}
            </div>
            <div class="cell d-flex a-center j-end gap12">
              <Icons
                name="deleted"
                class="icon danger setting"
                @click="openDelete(data._id)"
              />
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!InvalidPro.length">
          Yaroqsiz nonlar hozir mavjud emas
        </p>
      </div>
    </div>
  </div>
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
  <ToastiffVue :toastOptions="toastOptions" />
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
export default {
  components: {
    Icons,
    RequiredModalVue,
    ToastiffVue,
  },
  data() {
    return {
      InvalidPro: [],
      selectedItem: null,
      deleteModalVisible: false,
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
    };
  },
  methods: {
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteInvalidPro(this.selectedItem);
      }
      this.selectedItem = null;
      this.deleteModalVisible = false;
    },
    openDelete(id) {
      this.selectedItem = id;
      this.deleteModalVisible = true;
    },
    getInvalidPros() {
      api
        .get("/api/InvalidPros")
        .then(({ status, data }) => {
          if (status === 200) {
            this.InvalidPro = data?.InvalidPro;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteInvalidPro(id) {
      api
        .delete("/api/InvalidPro/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              type: "success",
              text: "Yaroqsiz non o`chirildi",
            };
            this.getInvalidPros();
          } else {
            this.toastOptions = {
              open: true,
              type: "error",
              text: "Yaroqsiz non o`chirilishida Xatolik yuz berdi",
            };
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            type: "error",
            text: error.response.data.message || "Xatolik yuz berdi",
          };
        });
    },
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("ru-RU").format(price);
    },
  },
  mounted() {
    this.getInvalidPros();
  },
};
</script>

<style>
</style>