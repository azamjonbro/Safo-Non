<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Sotuv</h3>
      <button class="create-button" @click="openModal = true">
        Sotuv yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Sana</div>
            <div class="cell">Sotilgan nonlar soni</div>
            <div class="cell">Olingan pul</div>
            <div class="cell">Tavsif</div>
            <div class="cell">Qaysi narxda</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div v-for="(data, index) in sales" :key="index">
            <div class="row">
              <div class="cell">{{ index + 1 }}</div>
              <div class="cell">{{ formatDate(new Date(data.createdAt)) }}</div>
              <div class="cell">{{ formatPrice(data?.quantity) || 0 }}</div>
              <div class="cell">{{ formatPrice(data?.money) || 0 }} so`m</div>
              <div class="cell">
                {{ data?.description || "" }}
              </div>
              <div class="cell">
                {{ data?.pricetype || "tan" }}
              </div>
              <div class="cell d-flex a-center j-end gap12">
                <Icons
                  name="setting"
                  title="sozlama"
                  class="icon info setting"
                  @click="
                    openUpdateModel({
                      id: data?._id,
                      breadId: data.breadId._id,
                      money: data.money,
                      quantity: data.quantity,
                      description: data.description,
                      pricetype: data.pricetype,
                      isUpdate: true,
                    })
                  "
                />
                <Icons
                  name="deleted"
                  title="o'chirish"
                  class="icon danger"
                  @click="openDeleteModal(data?._id)"
                />
                <Icons
                  name="bottomArrow"
                  :class="{ rotated: expandedUserId === data._id }"
                  @click="toggleHistory(data._id)"
                />
              </div>
            </div>
            <div v-if="expandedUserId === data._id" class="history">
              <div class="history-header">
                <div class="row">
                  <div class="cell">№</div>
                  <div class="cell">Sonni</div>
                  <div class="cell">Nomi</div>
                  <div class="cell">Narxi</div>
                </div>
              </div>
              <div class="history-body">
                <div class="row">
                  <div class="cell">1</div>
                  <div class="cell">
                    {{ data.breadId.title }}
                  </div>
                  <div class="cell">{{ data.price || 0 }}</div>
                  <div class="cell">{{ data.quantity|| 0 }}</div>
                </div>
              </div>
              <p class="text16 d-flex j-center p-24" v-if="!data?.breadId">Non turi mavjud emas</p>
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!sales.length">
          Hozircha Sotuvlar mavjud emas
        </p>
      </div>
    </div>
  </div>
  <SaleModalVue
    v-if="openModal"
    @close="(openModal = false), getSales()"
    @status="handleStatus($event)"
  />
  <SaleModalVue
    v-if="update.isUpdate"
    @close="(update.isUpdate = false), getSales()"
    @status="handleStatus($event)"
    :update="update"
  />
  <ToastiffVue :toastOptions="toastOptions" />
  <RequiredModalVue
    :isVisible="deleteModalVisible"
    @response="closeDeleteModal($event)"
  />
</template>


<script>
import api from "@/Utils/axios";
import ToastiffVue from "@/Utils/Toastiff.vue";
import SaleModalVue from "./saleModal.vue";
import Icons from "@/components/Template/Icons.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
export default {
  components: { ToastiffVue, SaleModalVue, Icons, RequiredModalVue },
  data() {
    return {
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
      openModal: false,
      sales: [],
      expandedUserId: "",
      deleteModalVisible: false,
      selectedItem: "",
      update: {
        isUpdate: false,
      },
    };
  },
  methods: {
    openUpdateModel(item) {
      this.update = item;
    },
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteSale(this.selectedItem);
      }
      this.deleteModalVisible = false;
      this.selectedItem = null;
    },
    openDeleteModal(id) {
      this.selectedItem = id;
      this.deleteModalVisible = true;
    },
    toggleHistory(id) {
      if (this.expandedUserId === id) {
        this.expandedUserId = null;
        return;
      }
      this.expandedUserId = id;
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
    handleStatus(data) {
      this.toastOptions = {
        open: true,
        text: data?.message,
        type: data?.status,
      };
    },
    getSales() {
      api
        .get("/api/sales")
        .then(({ status, data }) => {
          if (status === 200) {
            this.sales = data?.sales;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteSale(id) {
      api
        .delete("/api/sale/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              type: "success",
              text: "Sotuv o`chirildi",
            };
            this.getSales();
          }
        })
        .catch((error) => {
          this.toastOptions = {
            open: true,
            type: "error",
            text: error.response.data.message || "Xatolik yuzberdi",
          };
          console.log(error);
        });
    },
  },
  mounted() {
    this.getSales();
  },
};
</script>

<style>
</style>