<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Do`konlar</h3>
      <button class="create-button" @click="createModalVisible = true">
        Do`kon yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Nomi</div>
            <div class="cell">Description</div>
            <div class="cell">Sonni</div>
            <div class="cell">Narxi</div>
            <div class="cell">Umumiy summa</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div
            v-for="(data, index) in magazines"
            :key="index"
            class="row-items"
          >
            <div class="top">
              <div class="cell">{{ index + 1 }}</div>
              <div class="cell">{{ data?.title || "" }}</div>
              <div class="cell">{{ data?.description || '' }}</div>
              <div class="cell">{{ data?.quantity || 0 }}</div>
              <div class="cell">{{ formatPrice(data?.price || 0) }} sum</div>
              <div class="cell">
                {{ formatPrice(data.totalPrice || 0) }} sum
              </div>
              <div class="cell d-flex a-center j-end gap12">
                <Icons
                  name="setting"
                  title="sozlama"
                  class="icon info setting"
                  @click="
                    (update = {
                      id: data?._id,
                      sellerBreadId: data?.sellerBreadId,
                      quantity: data?.quantity,
                      price: data?.price,
                      isUpdate: true,
                    }),
                      (updateModalVisible = true)
                  "
                />
                <Icons
                  name="deleted"
                  title="o'chirish"
                  class="icon danger"
                  @click="
                    (selectedItem = data?._id), (deleteModalVisible = true)
                  "
                />
              </div>
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!magazines.length">
          Hozircha do`kon mavjud emas
        </p>
      </div>
    </div>
  </div>
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
  <SellerShopModalVue
    v-if="createModalVisible"
    @close="(createModalVisible = false), getSellerShop()"
    @status="handleStatus($event)"
  />
  <SellerShopModalVue
    v-if="updateModalVisible"
    @close="(updateModalVisible = false), getSellerShop()"
    :update="update"
    @status="handleStatus($event)"
  />
  <ToastiffVue :toastOptions="toastOptions" />
</template>

<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import SellerShopModalVue from "./sellerShopModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
export default {
  components: {
    Icons,
    RequiredModalVue,
    SellerShopModalVue,
    ToastiffVue,
  },
  data() {
    return {
      openModal: false,
      magazines: [],
      selectedItem: null,
      deleteModalVisible: false,
      createModalVisible: false,
      updateModalVisible: false,
      update: {
        isUpdate: false,
      },
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
        this.deleteSellerShop(this.selectedItem);
      }
      this.selectedItem = null;
      this.deleteModalVisible = false;
      this.getSellerShop();
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
    async handleStatus(data) {
      this.toastOptions = {
        open: true,
        text: data?.message,
        type: data?.status,
      };
      this.openModal = false;
      await this.getSellerShop();
    },
    async getSellerShop() {
      api
        .get("/api/sellerMagazines")
        .then(({ status, data }) => {
          if (status === 200) {
            this.magazines = data;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteSellerShop(id) {
      api
        .delete("/api/sellerMagazine/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              text: "Do`kon o`chirilib keti",
              type: "success",
            };
            this.getSellerShop();
          } else {
            this.toastOptions = {
              open: true,
              type: "error",
              text: "Do`kon o`chirilib ketishida hatolik yuz berdi",
            };
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getSellerShop();
  },
};
</script>

<style>
</style>