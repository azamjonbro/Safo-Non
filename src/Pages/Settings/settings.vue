<template>
  <div class="page">
    <div class="page-top d-flex j-between a-center">
      <h3>Sozlamalar</h3>
    </div>
    <form @submit="changePassowrd">
      <div class="settings-form">
        <div class="form-group">
          <label for="password">Parolni kiriting</label>
          <input
            type="text"
            placeholder="Password"
            id="password"
            v-model="passwords.password1"
            @blur="validateField('password1')"
          />
          <p v-if="errors.password1" class="error-text">
            {{ errors.password1 }}
          </p>
        </div>

        <div class="form-group">
          <label for="password2">Parolni Qayta kirting</label>
          <input
            type="text"
            placeholder="Password2"
            id="password2"
            v-model="passwords.password2"
            @blur="validateField('password2')"
          />
          <p v-if="errors.password2" class="error-text">
            {{ errors.password2 }}
          </p>
        </div>
        <button class="change-button" type="submit">
          {{ isSubmitting ? "Yangiliniyapti..." : "Yangilash" }}
        </button>
      </div>
    </form>
  </div>
  <ToastiffVue :toastOptions="toastOptions" />
</template>

<script>
import ToastiffVue from "@/Utils/Toastiff.vue";
import api from "@/Utils/axios";

export default {
  components: {
    ToastiffVue,
  },
  data() {
    return {
      isSubmitting: false,
      passwords: {
        password1: "",
        password2: "",
      },
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" },
      },
      errors: {},
    };
  },
  methods: {
    validateField(field) {
      this.errors[field] = "";
      if (field === "password1" && !this.passwords.password1.trim()) {
        this.errors.password1 = "Parolni bo'sh bo'lmasligi kerak";
      }
      if (field === "password2" && !this.passwords.password2.trim()) {
        this.errors.password2 = "Parolni qaytadan kiriting";
      }
    },
    changePassowrd(e) {
      e.preventDefault();
      this.errors = {};
      this.validateField("password1");
      this.validateField("password2");
      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      if (this.passwords.password1 !== this.passwords.password2) {
        this.toastOptions = {
          open: true,
          type: "error",
          text: "Parolni to`gri yozing",
        };
      } else {
        this.isSubmitting = true;

        api
          .put("/api/auth/password", { password: this.passwords.password2 })
          .then(({ status }) => {
            if (status === 200) {
              this.passwords = {
                password1: "",
                password2: "",
              };
              this.toastOptions = {
                open: true,
                text: "Password yangilandi",
                type: "success",
              };
            } else {
              this.toastOptions = {
                open: false,
                text: "Xatolik yuz berdi",
                type: "error",
              };
            }
          })
          .catch((error) => {
            this.toastOptions = {
              open: true,
              text: "Xatolik yuz berdi" || error.message,
              type: "error",
            };
          });
      }
    },
  },
};
</script>
<style>
.settings-form {
  width: 34%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.change-button {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  color: white;
  background-color: #6a8ffd;
  cursor: pointer;
  transition: 0.5s ease-in-out;
  margin-top: 5px;
}
.change-button:hover {
  background-color: #4d79ff;
}
@media screen and (max-width: 900px) {
  .settings-form {
    width: 100%;
  }
}
</style>