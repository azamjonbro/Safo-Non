<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Nonxona</h3>
      <button class="create-button" @click="createModalVisible = true">
        Non yaratish
      </button>
    </div>
    <div class="scroll pt-24 page-bottom">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Narxi</div>
            <div class="cell">Nomi</div>
            <div class="cell">TandirId</div>
            <div class="cell">quantity</div>
            <div class="cell">time</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div class="row" v-for="(data, index) in sellerBreads" :key="index">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">{{ formatPrice(data?.price) }}</div>
            <div class="cell">{{ data?.name }}</div>
            <div class="cell">{{ data?.ovenId }}</div>
            <div class="cell">{{ data?.quantity }}</div>
            <div class="cell">{{ formatDate(new Date(data?.createdAt)) }}</div>
            <div class="cell d-flex a-center j-end gap12">
              <Icons
                name="setting"
                title="sozlama"
                class="icon info setting"
                @click="
                  (updateModalVisible = true),
                    (update = { ...data, isUpdate: true })
                "
              />
              <Icons
                name="deleted"
                title="o'chirish"
                class="icon danger"
                @click="(selectedItem = data?._id), (deleteModalVisible = true)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ToastiffVue :toastOptions="toastOptions" />
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal"
  />
  <SellerNonModalVue
    v-if="createModalVisible"
    @close="(createModalVisible = false), getSellerNon()"
    @status="handleStatus($event)"
  />
  <SellerNonModalVue
    v-if="updateModalVisible"
    @close="(updateModalVisible = false), getSellerNon()"
    @status="handleStatus($event)"
    :update="update"
  />
</template>

<script>
import api from "@/Utils/axios";
import ToastiffVue from "@/Utils/Toastiff.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import Icons from "@/components/Template/Icons.vue";
import SellerNonModalVue from "./sellerNonModal.vue";
export default {
  components: { ToastiffVue, RequiredModalVue, Icons, SellerNonModalVue },
  data() {
    return {
      toastOptions: {
        open: false,
        type: "success",
        text: "",
      },
      sellerBreads: [],
      deleteModalVisible: false,
      selectedItem: null,
      createModalVisible: false,
      updateModalVisible: false,
      update: {},
    };
  },
  methods: {
    async handleStatus(data) {
      this.toastOptions = {
        open: true,
        text: data?.message,
        type: data?.status,
      };
      this.openModal = false;
      await this.getSellerNon();
    },
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteSellerNon(this.selectedItem);
      }
      this.deleteModalVisible = false;
      this.selectedItem = null;
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
    getSellerNon() {
      api
        .get("/api/sellerBreads")
        .then(({ status, data }) => {
          if (status === 200) {
            this.sellerBreads = data?.sellerBreads;
            // this.toastOptions = {
            //   open: true,
            //   type: "success",
            //   text: "Nonvoy nonlari keldi",
            // };
          }
          // else {
          //   this.toastOptions = {
          //     open: true,
          //     type: "error",
          //     text: "Nonvoy nonlari kelayotganda xatolik yuz berdi",
          //   };
          // }
        })
        .catch((error) => {
          console.error(error);
          // this.toastOptions = {
          //   open: true,
          //   type: "error",
          //   text: "Xatolik yuzberdi",
          // };
        });
    },
    deleteSellerNon(id) {
      api
        .delete("/api/sellerBread/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              type: "success",
              text: "Nonxona o`chirildi",
            };
            this.getSellerNon();
          } else {
            this.toastOptions = {
              open: true,
              type: "error",
              text: "Nonxona o`chirilishida Xatolik yuz berdi",
            };
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            type: "error",
            text: error.message || "Xatolik yuzberdi",
          };
        });
    },
  },
  mounted() {
    this.getSellerNon();
  },
};
</script>

<style>
</style>