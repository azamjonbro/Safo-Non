<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Magazinlar</h3>
      <button class="create-button" @click="openModal = true">
        Do`kon yaratish
      </button>
    </div>
    <div class="scroll pt-24 page-bottom">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Nomi</div>
            <div class="cell">Raqami</div>
            <div class="cell">Manzil</div>
            <div class="cell">Qarzdorlik</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div v-for="(data, index) in allMagazine" :key="index">
            <div class="row">
              <div class="cell">{{ index + 1 }}</div>
              <div class="cell">{{ data?.title ? data?.title : "" }}</div>
              <div class="cell">{{ data?.phone ? data?.phone : "" }}</div>
              <div class="cell">{{ data?.address ? data?.address : "" }}</div>
              <div class="cell">{{ data?.pending ? data?.pending : 0 }}</div>
              <div class="cell d-flex j-end gap12">
                <Icons
                  name="payed"
                  title="Qarzni to`lash"
                  class="icon info setting"
                  @click="
                    openPendingModal({ id: data?._id, pending: data.pending })
                  "
                />
                <Icons
                  name="debt"
                  title="To'lov"
                  class="icon info setting"
                  @click="openAddModal(data?._id)"
                />
                <Icons
                  name="setting"
                  title="sozlama"
                  class="icon info setting"
                  @click="
                    openUpdateModal({
                      title: data?.title,
                      phone: data?.phone,
                      address: data?.address,
                      pending: data?.pending,
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
            <div v-if="expandedUserId === data?._id" class="history">
              <div class="history-header">
                <div class="row">
                  <div class="cell">Index</div>
                  <div class="cell">Yaratilgan</div>
                  <div class="cell">Yetkazuvchi</div>
                  <div class="cell">Umumiy pul</div>
                  <div class="cell">Qarzdorlik</div>
                  <div class="cell"></div>
                </div>
              </div>
              <div class="history-body">
                <div class="row" v-for="(item, i) in data?.history" :key="i">
                  <div class="cell">{{ i + 1 }}</div>
                  <div class="cell">
                    {{ formatDate(new Date(item?.createdAt)) }}
                  </div>
                  <div class="cell">{{ item.deliveryId?.username }}</div>
                  <div class="cell">{{ formatPrice(item.totalPrice) }}</div>
                  <div class="cell">{{ formatPrice(item.pending) }}</div>
                  <div class="cell d-flex j-end">
                    <Icons
                      name="deleted"
                      title="o'chirish"
                      class="icon danger"
                      @click="openHistoryModal(item?._id)"
                    />
                  </div>
                </div>
              </div>
              <p
                class="text16 d-flex j-center p-24"
                v-if="!data.history.length"
              >
                Hozircha qarzdorlik mavjud emas mavjud emas
              </p>
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!allMagazine.length">
          Hozircha do`konlar mavjud emas
        </p>
      </div>
    </div>
  </div>
  <RequiredModalVue
    :isVisible="deleteVisible"
    @response="closeDeleteModal($event)"
  />
  <ToastiffVue :toastOptions="toastOptions" />
  <MagazineModalVue
    v-if="openModal"
    @close="handleClose"
    @status="handleStatus($event)"
  />
  <MagazineModalVue
    v-if="updateVisible"
    :update="update"
    @close="closeUpdateModal"
    @status="handleStatus($event)"
  />
  <RequiredModalVue
    :isVisible="deleteHistoryModal"
    @response="closeHistoryModal($event)"
  />
  <MagazineAddModalVue
    v-if="openAddModalVisible"
    @close="closeAddModal"
    :Delivery="Delivery"
    @status="handleStatus($event)"
  />
  <MagazinePendingModalVue
    v-if="pendingModalVisible"
    @close="(pendingModalVisible = false), getMagazine()"
    :pending="pending"
    @status="handleStatus($event)"
  />
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
import MagazineModalVue from "./magazineModal.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
import MagazineAddModalVue from "./magazineAddModal.vue";
import MagazinePendingModalVue from "./magazinePendingModal.vue";
export default {
  components: {
    Icons,
    MagazineModalVue,
    RequiredModalVue,
    ToastiffVue,
    MagazineAddModalVue,
    MagazinePendingModalVue,
  },
  data() {
    return {
      openModal: false,
      allMagazine: [],
      deleteVisible: false,
      selectedItem: null,
      updateVisible: false,
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
      update: {
        isUpdate: false,
      },
      expandedUserId: "",
      deleteHistoryModal: false,
      openAddModalVisible: false,
      Delivery: {
        isActive: false,
      },
      pendingModalVisible: false,
      pending: {},
    };
  },
  methods: {
    openPendingModal(item) {
      this.pendingModalVisible = true;
      this.pending = item;
    },
    closeAddModal() {
      this.openAddModalVisible = false;
      this.getMagazine();
    },
    openAddModal(id) {
      this.Delivery = {
        id,
        isActive: true,
      };
      this.openAddModalVisible = true;
    },
    closeHistoryModal(emit) {
      if (emit) {
        this.deleteHistoryModalAxios(this.selectedItem);
      }
      this.deleteHistoryModal = false;
      this.selectedItem = null;
    },
    openHistoryModal(id) {
      this.selectedItem = id;
      this.deleteHistoryModal = true;
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
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteMagzine(this.selectedItem);
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
    handleClose() {
      this.openModal = false;
      this.getMagazine();
    },
    closeUpdateModal() {
      this.updateVisible = false;
      this.update = { isUpdate: false };
      this.getMagazine();
    },
    handleStatus(data) {
      this.toastOptions = {
        open: true,
        type: data?.status,
        text: data?.message,
      };
    },
    openUpdateModal(item) {
      this.update = Object.assign(item, { isUpdate: true });
      this.updateVisible = true;
    },
    getMagazine() {
      api
        .get("/api/magazines")
        .then(({ data, status }) => {
          if (status === 200) {
            this.allMagazine = data?.magazines;
            console.log(data?.magazines);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteMagzine(id) {
      api
        .delete("/api/magazine/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.getMagazine();
            this.toastOptions = {
              open: true,
              text: "Do`kon o`chirib tashlandi",
              type: "success",
            };
          } else {
            this.toastOptions = {
              open: true,
              text: "Do`kon o`chirib tashlandi",
              type: "error",
            };
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            type: "error",
            text: "Xatolik yuzberdi",
          };
        });
    },
    deleteHistoryModalAxios(id) {
      api
        .delete("/api/sellingBread/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.getMagazine();
            this.toastOptions = {
              open: true,
              text: "Do`kon history o`chirib tashlandi",
              type: "success",
            };
          } else {
            this.toastOptions = {
              open: true,
              text: "Do`kon history o`chirib tashlandi",
              type: "error",
            };
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            type: "error",
            text: "Xatolik yuzberdi",
          };
        });
    },
  },
  mounted() {
    this.getMagazine();
  },
};
</script>

<style>
</style>