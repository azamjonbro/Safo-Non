<template>
  <div class="page d-flex column gap24">
    <div class="page-top d-flex a-center j-between">
      <h3>Nonvoylar</h3>
      <button class="create-button" @click="openModal = true" v-if="isHide">
        Nonvoy yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Ismi</div>
            <div class="cell">Raqami</div>
            <div class="cell">Maoshi</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div v-for="data in allWorkers" :key="data.ovenId">
            <div class="row-items">
              <div class="top">
                <div class="cell">{{ data?.ovenId || "-----------" }}</div>
                <div class="cell">{{ data?.username }}</div>
                <div class="cell">{{ data?.phone }}</div>
                <div class="cell">
                  {{ formatPrice(data.totalPrice || 0) }} sum
                </div>
                <div class="cell d-flex a-center j-end gap12">
                  <Icons
                    name="eyeIcon"
                    class="icon info jingra"
                    @click="
                      OpenLoginBackeryModal({
                        username: data?.username,
                        password: data?.password,
                        id: data?._id,
                      })
                    "
                  />
                  <Icons
                    name="payed"
                    title="To'lov"
                    class="icon info setting"
                    @click="openPayedModal({id:data?._id,price:data.totalPrice})"
                  />
                  <Icons
                    name="setting"
                    title="sozlama"
                    class="icon info setting"
                    @click="openUpdateModal(data)"
                  />
                  <Icons
                    name="deleted"
                    title="o'chirish"
                    class="icon danger"
                    @click="openDeleteModal(data?._id)"
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
                <button
                  class="danger danger-button"
                  style="margin-bottom: 15px"
                  @click="openDeleteHistory(data._id)"
                >
                  Hammasini o`chirish
                </button>
                <div class="history-header">
                  <div class="row-top">
                    <div class="cell">Sana</div>
                    <div class="cell">Summa</div>
                    <div class="cell">Holat</div>
                    <div class="cell">Turi</div>
                    <div class="cell">Tavsif</div>
                    <div class="cell"></div>
                  </div>
                </div>
                <div class="history-body">
                  <div
                    v-for="(item, index) in data?.history"
                    :key="index"
                    class="row"
                  >
                    <div class="cell">
                      {{ formatDate(new Date(item?.createdAt)) }}
                    </div>
                    <div class="cell">{{ formatPrice(item?.price) }}</div>
                    <div class="cell">{{ item?.status }}</div>
                    <div class="cell">{{ item?.type }}</div>
                    <div class="cell">{{ item?.comment }}</div>
                    <div class="cell d-flex j-end">
                      <Icons
                        name="deleted"
                        title="o'chirish"
                        class="icon danger"
                        @click="openBackeryPayedModal(item?._id)"
                      />
                    </div>
                  </div>
                  <p
                    class="text16 d-flex j-center p-24"
                    v-if="!data?.history.length"
                  >
                    Hozircha to'lovlar mavjud emas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="text16 d-flex j-center p-24" v-if="!allWorkers.length">
          Hozircha nonvoy mavjud emas
        </p>
      </div>
    </div>
  </div>
  <BackeryModal
    v-if="openModal"
    @close="openModal = false"
    @status="handleStatus($event)"
  />
  <BackeryModal
    v-if="backeryUpdateVisible"
    @close="closeUpdateModal"
    @status="handleStatus($event)"
    :update="update"
  />
  <PayedBackeryVue
    v-if="backeryPayedVisible"
    @close="closePayedModal"
    :selectedItemPayed="selectedItemPayed"
    @status="handleStatus($event)"
  />
  <Toastiff :toastOptions="toastOptions" />
  <RequiredModalVue
    :isVisible="backeryDeleteVisible"
    @response="closeDeleteModal($event)"
  />
  <RequiredModalVue
    :isVisible="deleteBackeryPayedVisible"
    @response="closeBackeryPayedModal($event)"
  />
  <RequiredModalVue
    :isVisible="historyModalVisible"
    @response="closeDeleteHistory($event)"
  />
  <LoginModalVue
    :loginSturckture="login"
    v-if="loginBackeryModalVisible"
    :isVisible="loginBackeryModalVisible"
    @response="closeLoginBackeryModal"
  />
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
import BackeryModal from "./BackeryModal.vue";
import Toastiff from "@/Utils/Toastiff.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import PayedBackeryVue from "./PayedBackery.vue";
import LoginModalVue from "@/components/Modals/LoginModal.vue";
export default {
  components: {
    Icons,
    BackeryModal,
    Toastiff,
    RequiredModalVue,
    PayedBackeryVue,
    LoginModalVue,
  },
  data() {
    return {
      allWorkers: [],
      openModal: false,
      toastOptions: {
        open: false,
        text: "",
      },
      backeryDeleteVisible: false,
      selectedItem: null,
      backeryUpdateVisible: false,
      update: {
        isUpdate: false,
      },
      backeryPayedVisible: false,
      deleteBackeryPayedVisible: false,
      selectedItemPayed: null,
      expanedId: null,
      historyData: [],
      loginBackeryModalVisible: false,
      login: {
        username: "",
        password: "",
      },
      isHide: true,
      historyModalVisible: false,
    };
  },
  methods: {
    closeDeleteHistory(emit) {
      if (emit) {
        this.clearHistory(this.selectedItem);
      }
      this.selectedItem = null;
      this.historyModalVisible = false;
    },
    openDeleteHistory(id) {
      this.selectedItem = id;
      this.historyModalVisible = true;
    },
    clearHistory(id) {
      api
        .delete("/api/seller/history/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              text: "Nonvoy to`lov tarixi o`chirib tashaldi",
              type: "success",
            };
            this.getAllWorker();
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            text:
              error.response.data.message || error.message || "Server xatoliki",
            type: "success",
          };
        });
    },
    OpenLoginBackeryModal(item) {
      this.login = item;
      this.loginBackeryModalVisible = true;
    },
    closeLoginBackeryModal() {
      this.login = {};
      this.loginBackeryModalVisible = false;
    },
    openBackeryPayedModal(id) {
      this.selectedItem = id;
      this.deleteBackeryPayedVisible = true;
    },
    closeBackeryPayedModal(emit) {
      if (emit) {
        this.deleteBackeryPayed(this.selectedItem);
      }
      this.selectedItem = null;
      this.deleteBackeryPayedVisible = false;
    },
    openPayedModal(item) {
      this.selectedItemPayed = item;
      this.backeryPayedVisible = true;
    },
    closePayedModal() {
      this.backeryPayedVisible = false;
      this.getAllWorker();
      this.selectedItemPayed = null;
    },
    openDeleteModal(item) {
      this.selectedItem = item;
      this.backeryDeleteVisible = true;
    },
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteBackery(this.selectedItem);
      }
      this.backeryDeleteVisible = false;
    },
    openUpdateModal(item) {
      this.backeryUpdateVisible = true;
      this.update = Object.assign(item, { isUpdate: true });
    },
    closeUpdateModal() {
      (this.backeryUpdateVisible = false), this.getAllWorker();
    },
    toggleHistory(id) {
      if (this.expanedId === id) {
        this.expanedId = null;
        return;
      }
      this.expanedId = id;
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
      await this.getAllWorker();
    },
    async getAllWorker() {
      await api.get("/api/sellers").then((response) => {
        this.allWorkers = response?.data?.sellers;
      });
    },
    deleteBackery(id) {
      api
        .delete("/api/seller/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              text: "Non voy o`chirilib keti",
              type: "success",
            };
            this.getAllWorker();
          } else {
            this.toastOptions = {
              open: true,
              type: "error",
              text: "Non voy o`chirilib ketishida hatolik yuz berdi",
            };
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteBackeryPayed(id) {
      api
        .delete("/api/sellerPayed/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.toastOptions = {
              open: true,
              text: "Non voy to`lovi o`chirilib keti",
              type: "success",
            };
            this.getAllWorker();
          } else {
            this.toastOptions = {
              open: true,
              type: "error",
              text: "Non voy to`lovi o`chirilib ketishida hatolik yuz berdi",
            };
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            type: "error",
            text: error.message || "Xatolik yuz berdi",
          };
        });
    },
  },
  mounted() {
    this.getAllWorker();
    let user = JSON.parse(localStorage.getItem("user"))?.role || "";
    if (user === "superAdmin") {
      this.isHide = false;
    }
  },
};
</script>
<style>
/* .danger-btn {
  padding: 10px;
  border-radius: 5px;
  color: white;
} */
.setting > svg > path {
  stroke: #fff;
}

.table,
.history {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.history-body {
  max-height: 400px;
  overflow: auto;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}
.row-top {
  padding: 6px 8px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
}
.row-items {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.row-items > .top {
  display: flex;
  justify-content: space-between;
}

.cell {
  flex: 1;
  padding: 8px;
  text-align: left;
}

.table-header .row {
  font-weight: bold;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.history {
  background: #fafafa;
  padding: 10px;
  border-radius: 8px;
}

.history-header .row {
  font-weight: bold;
}
.rotated {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
@media (max-width: 768px) {
  .table {
    min-width: calc(150px + 100%);
  }
}
@media (max-width: 580px) {
  .table {
    min-width: calc(300px + 100%);
  }
}
@media (max-width: 380px) {
  .table {
    min-width: calc(550px + 100%);
  }
  .table .cell {
    width: 100%;
  }
}
</style>