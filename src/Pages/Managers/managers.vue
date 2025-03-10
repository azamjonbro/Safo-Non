<template >
  <div class="page d-flex column gap24">
    <div class="page-top d-flex j-between a-center">
      <h3>Boshqaruvchilar</h3>
      <button class="create-button" @click="managerModalVisible = true">
        Manager yaratish
      </button>
    </div>
    <div class="page-bottom scroll p-24">
      <div class="table">
        <div class="table-header">
          <div class="row">
            <div class="cell">№</div>
            <div class="cell">Ismi</div>
            <div class="cell">Sana</div>
            <div class="cell"></div>
          </div>
        </div>
        <div class="table-body">
          <div class="row" v-for="(data, index) in managers" :key="index">
            <div class="cell">{{ index + 1 }}</div>
            <div class="cell">{{ data?.username }}</div>
            <div class="cell">{{ formatDate(new Date(data?.createdAt)) }}</div>
            <div class="cell d-flex j-end gap12">
              <Icons
                name="eyeIcon"
                class="icon info jingra"
                @click="
                  (login = {
                    username: data?.username,
                    password: data?.password,
                    id: data?._id,
                  }),
                    (loginModalVisible = true)
                "
              />
              <Icons
                name="setting"
                title="sozlama"
                class="icon info setting"
                @click="
                  (update = {
                    username: data?.username,
                    id: data?._id,
                    isUpdate: true,
                  }),
                    (updateModalVisible = true)
                "
              />
              <Icons
                name="deleted"
                title="o'chirish"
                class="icon danger"
                @click="openDeleteModal(data?._id)"
              />
            </div>
          </div>
          <p class="text16 d-flex j-center p-24" v-if="!managers.length">
            Hozircha boshqaruvchilar mavjud emas
          </p>
        </div>
      </div>
    </div>
  </div>
  <ManagerModalVue
    v-if="managerModalVisible"
    @close="(managerModalVisible = false), getMenegars()"
  />
  <ManagerModalVue
    v-if="updateModalVisible"
    :update="update"
    @close="(updateModalVisible = false), getMenegars()"
  />
  <RequiredModalVue
    :isVisible="deleteVisible"
    @response="closeDeleteModal($event)"
  />
  <ToastiffVue :toastOptions="toastOptions" />
  <LoginModalVue
    v-if="loginModalVisible"
    :isVisible="loginModalVisible"
    :loginSturckture="login"
    @response="(loginModalVisible = false), getMenegars()"
  />
</template>
<script>
import api from "@/Utils/axios";
import Icons from "@/components/Template/Icons.vue";
import ManagerModalVue from "./managerModal.vue";
import RequiredModalVue from "@/components/Modals/requiredModal.vue";
import ToastiffVue from "@/Utils/Toastiff.vue";
import LoginModalVue from "@/components/Modals/LoginModal.vue";
export default {
  components: {
    Icons,
    ManagerModalVue,
    RequiredModalVue,
    ToastiffVue,
    LoginModalVue,
  },
  data() {
    return {
      managers: [],
      managerModalVisible: false,
      deleteVisible: false,
      selectedItem: null,
      toastOptions: {
        open: false,
        type: "",
        text: "",
      },
      loginModalVisible: false,
      update: {
        username: "",
        password: "",
        id: "",
      },
      login: {},
      updateModalVisible: false,
    };
  },
  methods: {
    openDeleteModal(id) {
      this.deleteVisible = true;
      this.selectedItem = id;
    },
    closeDeleteModal(emit) {
      if (emit) {
        this.deleteManager(this.selectedItem);
      }
      this.deleteVisible = false;
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
    getMenegars() {
      api
        .get("/api/managers")
        .then(({ data, status }) => {
          if (status === 200) {            
            this.managers = data?.managers;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteManager(id) {
      api
        .delete("/api/manager/" + id)
        .then(({ status }) => {
          if (status === 200) {
            this.getMenegars();
            this.toastOptions = {
              open: true,
              type: "success",
              text: "Manager o`chirildi",
            };
          } else {
            this.toastOptions = {
              open: true,
              type: "success",
              text: "Manager o`chirilish davomida xatolik yuz berdi",
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
    this.getMenegars();
  },
};
</script>
<style >
</style>