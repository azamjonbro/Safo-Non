<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Do`konlar</h3>
      <!-- <button class="create-button" @click="createModalVisible = true">
        Do`kon yaratish
      </button> -->
    </div>
    <div class="scroll pt-24 page-bottom">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Vaqt</div>
            <div class="cell">Tavsif</div>
            <div class="cell">Soni</div>
            <div class="cell">Qop soni</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div v-for="(data, index) in sellerBreads" :key="index">
            <div class="row-items">
              <div class="top">
                <div class="cell">{{ index + 1 }}</div>
                <div class="cell">
                  {{ formatDate(new Date(data?.createdAt)) }}
                </div>
                <div class="cell">{{ data?.description }}</div>
                <div class="cell">{{ data?.totalQuantity }}</div>
                <div class="cell">{{ data?.totalQopQuantity }}</div>
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
                    @click="
                      (selectedItem = data?._id), (deleteModalVisible = true)
                    "
                  />

                  <Icons
                    name="bottomArrow"
                    class="icon"
                    :class="{ rotated: expanedId === data._id }"
                    @click="toggleHistory(data?._id)"
                  />
                </div>
              </div>
              <div v-if="expanedId === data?._id" class="history">
                <div class="history-header">
                  <div class="row-top">
                    <div class="cell">№</div>
                    <div class="cell">Sana</div>
                    <div class="cell">Soni</div>
                    <div class="cell">Qop Soni</div>
                    <div class="cell">Kimdan</div>
                  </div>
                  <div class="history-body">
                    <div
                      class="row"
                      v-for="(item, index) in data?.history"
                      :key="index"
                    >
                      <div class="cell">{{ index + 1 }}</div>
                      <div class="cell">{{ formatDate(new Date(item.createdAt))}}</div>
                      <div class="cell">{{ item?.totalQuantity }}</div>
                      <div class="cell">
                        {{ item?.totalqopQuantity }}
                      </div>
                      <div class="cell">
                        {{ item?.sellerId?.username }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!sellerBreads.length">
          Hozircha nonvoy mavjud emas
        </p>
      </div>
    </div>
  </div>
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
  <!-- <SellerShopModalVue
    v-if="createModalVisible"
    @close="(createModalVisible = false), getSellerShop()"
    @status="handleStatus($event)"
  />
  <SellerShopModalVue
    v-if="updateModalVisible"
    @close="(updateModalVisible = false), getSellerShop()"
    :update="update"
    @status="handleStatus($event)"
  /> -->
  <ToastiffVue :toastOptions="toastOptions" />
</template>

<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
// import SellerShopModalVue from "./sellerShopModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
export default {
  components: {
    Icons,
    RequiredModalVue,
    // SellerShopModalVue,
    ToastiffVue,
  },
  data() {
    return {
      // openModal: false,
      sellerBreads: [],
      selectedItem: null,
      deleteModalVisible: false,
      // createModalVisible: false,
      // updateModalVisible: false,
      // update: {
      //   isUpdate: false,
      // },
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
      expanedId: "",
    };
  },
  methods: {
        toggleHistory(id) {
      if (this.expanedId === id) {
        this.expanedId = null;
        return;
      }
      this.expanedId = id;
    },
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
    getSellerNon() {
      api
        .get("/api/sellerBreads")
        .then(({ status, data }) => {
          if (status === 200) {
            this.sellerBreads = data?.sellerBreads;
          }
        })
        .catch((error) => {
          console.error(error);
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

<style></style>
