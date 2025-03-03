<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Yetkazuvchilar</h3>
      <button class="create-button" @click="openModal = true">
        Yetkazuvchi yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">username</div>
            <div class="cell">phone</div>
            <div class="cell">password</div>
            <div class="cell">price</div>
            <div class="cell">totalPrice</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div v-for="(data, index) in allDelivery" :key="index">
            <!-- Asosiy qator -->
            <div class="row">
              <div class="cell">{{ index + 1 }}</div>
              <div class="cell">{{ data?.username || "" }}</div>
              <div class="cell">{{ data?.phone || "" }}</div>
              <div class="cell">---------</div>
              <div class="cell">{{ formatPrice(data?.price) || 0 }} so`m </div>
              <div class="cell">{{ formatPrice(data?.totalPrice) || 0 }} so`m </div>
              <div class="cell d-flex a-center j-end gap12">
                <Icons
                  class="info icon"
                  name="payed"
                  @click="openAddDeliveryPayedModal(data?._id)"
                />
                <Icons
                  name="setting"
                  title="sozlama"
                  class="icon info setting"
                  @click="
                    openUpdateModal({
                      username: data?.username,
                      phone: data?.phone,
                      price: data?.price,
                      id: data?._id,
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

            <!-- History qismi -->
            <div v-if="expandedUserId === data._id" class="history">
              <div class="history-header">
                <div class="row">
                  <div class="cell">Sana</div>
                  <div class="cell">Summa</div>
                  <div class="cell">Holat</div>
                  <div class="cell">Turi</div>
                  <div class="cell">Summasi</div>
                  <div class="cell"></div>
                </div>
              </div>
              <div class="history-body">
                <div
                  v-for="(item, i) in data?.deliveryPayed"
                  :key="i"
                  class="row"
                >
                  <div class="cell">
                    {{ formatDate(new Date(item?.createdAt)) }}
                  </div>
                  <div class="cell">{{ formatPrice(item?.price) }}</div>
                  <div class="cell">{{ item?.status }}</div>
                  <div class="cell">{{ item.type }}</div>
                  <div class="cell">
                    <Icons
                      name="deleted"
                      title="o'chirish"
                      class="icon danger"
                      @click="openDeliveryPayedModal(item?._id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <RequiredModalVue
    :isVisible="deleteVisible"
    @response="closeDeleteModal($event)"
  />
  <RequiredModalVue
    :isVisible="deleteDeliveryPayedVisible"
    @response="closeDeliveryPayedModal($event)"
  />
  <DeliveryModelVue
    v-if="openModal"
    @close="handleClose"
    @status="handleStatus($event)"
  />
  <DeliveryModelVue
    :update="update"
    v-if="updateVisible"
    @close="handleUpdateClose"
    @status="handleStatus($event)"
  />
  <DeliveryPayedModalVue
    v-if="deliveryPayedVisible"
    :id="selectedItem"
    @status="handleStatus($event)"
    @close="closeAddDeliveryPayedModal"
  />
  <ToastiffVue :toastOptions="toastOptions" />
</template>

<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import DeliveryModelVue from "./deliveryModel.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import DeliveryPayedModalVue from "./deliveryPayedModal.vue";
export default {
  components: {
    Icons,
    DeliveryModelVue,
    ToastiffVue,
    RequiredModalVue,
    DeliveryPayedModalVue,
  },
  data() {
    return {
      allDelivery: [],
      openModal: false,
      deleteVisible: false,
      updateVisible: false,
      deleteDeliveryPayedVisible: false,
      deliveryPayedVisible: false,
      update: {
        isUpdate: false,
      },
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
      expandedUserId: null,
      selectedItem: null,
    };
  },
  methods: {
    handleStatus(data) {
      this.toastOptions = {
        open: true,
        text: data?.message,
        type: data?.status,
      };
    },
    openAddDeliveryPayedModal(id) {
      this.selectedItem = id;
      this.deliveryPayedVisible = true;
    },
    closeAddDeliveryPayedModal() {
      this.selectedItem = null;
      this.deliveryPayedVisible = false;
      this.allDelivery()
    },
    openDeliveryPayedModal(id) {
      this.selectedItem = id;
      this.deleteDeliveryPayedVisible = true;
    },
    closeDeliveryPayedModal(emit) {
      if (emit) {
        this.deleteDeliveryPayed(this.selectedItem);
      }
      this.deleteDeliveryPayedVisible = false;
      this.selectedItem = null;
    },
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteDelivery(this.selectedItem);
      }
      this.deleteVisible = false;
      this.selectedItem = null;
    },
    toggleHistory(id) {
      if (this.expandedUserId === id) {
        this.expandedUserId = null;
        return;
      }
      this.expandedUserId = id;
    },
    openDeleteModal(item) {
      this.selectedItem = item;
      this.deleteVisible = true;
    },
    openUpdateModal(item) {
      this.update = Object.assign(item, { isUpdate: true });
      this.updateVisible = true;
    },
    handleClose() {
      this.openModal = false;
      this.getDeliveries();
    },
    handleUpdateClose() {
      this.updateVisible = false;
      this.update = { isUpdate: false };
      this.getDeliveries();
    },
    getDeliveries() {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";

      api
        .get("/api/deliveries", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.allDelivery = data?.deliveries;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteDelivery(id) {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      api
        .delete("/api/delivery/" + id, {
          headers: {
            authorization: token,
          },
        })
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              text: "Yetkazuvchi o`chirildi",
              type: "success",
            };
            this.getDeliveries();
          } else {
            this.toastOptions = {
              open: true,
              text: "Yetkazuvchi o`chirishda hatolik yuzberdi",
              type: "error",
            };
          }
        })
        .catch((error) => {
          console.error(error);
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
    deleteDeliveryPayed(id) {
      api
        .delete("/api/deliveryPayed/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              text: "Yetkazuvchi to`lovi o`chirildi",
              type: "success",
            };
            this.getDeliveries();
          } else {
            this.toastOptions = {
              open: true,
              text: "Yetkazuvchi to`lovini o`chirishda hatolik yuzberdi",
              type: "error",
            };
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getDeliveries();
  },
};
</script>

<style>
</style>
