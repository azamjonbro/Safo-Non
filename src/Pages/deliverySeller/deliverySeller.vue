<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Yetkazuvchilar</h3>
      <button class="create-button" @click="openModal = true">
        Yetkazuvchiga non berish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Yetkazuvchi</div>
            <!-- <div class="cell">Soni (Dona)</div> -->
            <div class="cell">Umumiy hisob</div>
            <div class="cell">Tavsifi</div>
            <div class="cell">Soni</div>
            <div class="cell">Sana</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div v-for="(data, index) in allDelivery" :key="index">
            <!-- Asosiy qator -->
            <div class="row">
              <div class="cell">{{ index + 1 }}</div>
              <div class="cell">{{ data?.deliveryId?.username || "" }}</div>
              <!-- <div class="cell">{{ data?.quantity || "" }}</div> -->
              <div class="cell">
                {{ formatPrice(data?.totalPrice) || 0 }} so`m
              </div>
              <div class="cell">{{ data?.description || "" }}</div>
              <div class="cell">
                {{
                  data?.totalQuantity ||
                  ""
                }}
              </div>
              <div class="cell">{{ formatDate(new Date(data.createdAt)) }}</div>
              <div class="cell d-flex a-center j-end gap12">
                <Icons />
                <Icons
                  name="setting"
                  title="sozlama"
                  class="icon info setting"
                  @click="
                    openUpdateModal({
                      typeOfBreadIds: data?.typeOfBreadIds,
                      quantity: data?.quantity,
                      description: data?.description,
                      delivery: data?.delivery,
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
                  @click="toggleHistory(data?._id)"
                />
              </div>
            </div>
            <div v-if="expandedUserId === data._id" class="history">
              <div class="history-header">
                <div class="row">
                  <div class="cell">№</div>
                  <div class="cell">Nomi</div>
                  <div class="cell">Tan narxi</div>
                  <div class="cell">Narxi (do'kon)</div>
                  <div class="cell">To'yxona</div>
                  <div class="cell">Qop narxi</div>
                </div>
              </div>
              <div class="history-body">
                <div
                  v-for="(item, i) in data?.typeOfBreadIds"
                  :key="i"
                  class="row"
                >
                  <div class="cell">{{ index + 1 }}</div>
                  <div class="cell">
                    {{ item.breadId?.title ? item.breadId?.title : "" }}
                  </div>
                  <div class="cell">
                    {{
                      formatPrice(item.breadId?.price ? item.breadId?.price : 0)
                    }}
                  </div>
                  <div class="cell">
                    {{
                      formatPrice(
                        item.breadId?.price2 ? item.breadId?.price2 : 0
                      )
                    }}
                  </div>
                  <div class="cell">
                    {{
                      formatPrice(
                        item.breadId?.price3 ? item.breadId?.price : 0
                      )
                    }}
                  </div>
                  <div class="cell">
                    {{
                      formatPrice(
                        item.breadId?.price4 ? item.breadId?.price4 : 0
                      )
                    }}
                  </div>
                </div>
                <p
                  class="text16 d-flex j-center p-24"
                  v-if="!data?.typeOfBreadIds?.length"
                >
                  Hozircha to'lovlar mavjud emas
                </p>
              </div>
            </div>
            <!-- History qismi -->
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!allDelivery.length">
          Yetkazuvchiga berilgan nonlar hozir mavjud emas
        </p>
      </div>
    </div>
  </div>
  <RequiredModalVue
    :isVisible="deleteVisible"
    @response="closeDeleteModal($event)"
  />
  <DeliverySellerModalVue
    v-if="openModal"
    @close="handleClose"
    @status="handleStatus($event)"
  />
  <DeliverySellerModalVue
    :update="update"
    v-if="updateVisible"
    @close="handleUpdateClose"
    @status="handleStatus($event)"
  />
  <ToastiffVue :toastOptions="toastOptions" />
  <LoginModalVue
    v-if="loginDeliveryModalVisible"
    :isVisible="loginDeliveryModalVisible"
    :loginSturckture="login"
    @response="closeLoginBackeryModal"
  />
</template>

<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import LoginModalVue from "@/components/Modals/LoginModal.vue";
import DeliverySellerModalVue from "./deliverySellerModal.vue";
export default {
  components: {
    Icons,
    ToastiffVue,
    RequiredModalVue,
    LoginModalVue,
    DeliverySellerModalVue,
  },
  data() {
    return {
      allDelivery: [],
      openModal: false,
      deleteVisible: false,
      updateVisible: false,
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
      loginDeliveryModalVisible: false,
      login: {
        username: "",
        password: "",
        id: "",
      },
    };
  },
  methods: {
    toggleHistory(id) {
      if (this.expandedUserId === id) {
        this.expandedUserId = null;
        return;
      }
      this.expandedUserId = id;
    },
    handleStatus(data) {
      this.toastOptions = {
        open: true,
        text: data?.message,
        type: data?.status,
      };
    },
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteDelivery(this.selectedItem);
      }
      this.deleteVisible = false;
      this.selectedItem = null;
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
      api
        .get("/api/orderWithDeliveries")
        .then(({ data, status }) => {
          if (status === 200) {
            this.allDelivery = data?.orderWithDeliveries;
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
        .delete("/api/orderWithDelivery/" + id, {
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
  },
  mounted() {
    this.getDeliveries();
  },
};
</script>

<style></style>
