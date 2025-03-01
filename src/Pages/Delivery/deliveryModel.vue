<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Yetkazuvchi yaratish</h2>

        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="username">Nomi</label>
              <input
                id="username"
                type="text"
                placeholder="Yetkazuvchini ismini kiriting"
                v-model="delivery.username"
                @blur="validateField('username')"
              />
              <p v-if="errors.username" class="error-text">
                {{ errors.username }}
              </p>
            </div>
            <div class="form-group">
              <label for="phone">Telefon raqam</label>
              <input
                id="phone"
                type="text"
                placeholder="Yetkazuvchini telefon raqamini kiriting"
                v-model="delivery.phone"
                @blur="validateField('phone')"
              />
              <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>
            </div>
            <div class="form-group">
              <label for="price">Narxi</label>
              <input
                id="price"
                type="number"
                placeholder="Yetkazuvchini narxini kiriting"
                v-model="delivery.price"
                @blur="validateField('price')"
              />
              <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
            </div>
            <div class="form-group" v-if="isUpdate">
              <label for="price">Parolli</label>
              <input
                id="password"
                type="text"
                placeholder="Yetkazuvchini parollini kiriting"
                v-model="delivery.password"
              />
              <p v-if="errors.password" class="error-text">
                {{ errors.password }}
              </p>
            </div>
          </div>
        </form>

        <div class="modal-buttons d-flex j-end a-center gap24">
          <button type="button" class="action-button" @click="closeModal">
            Chiqish
          </button>
          <button
            type="submit"
            @click="submitForm"
            class="action-button"
            :disabled="isSubmitting"
          >
            {{
              !isUpdate
                ? isSubmitting
                  ? "Yaratilmoqda..."
                  : "Yaratish"
                : isSubmitting
                ? "Yangilanmoqda..."
                : "Yangilash"
            }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";

export default {
  components: {
    Icons,
  },
  data() {
    return {
      isSubmitting: false,
      delivery: {
        username: "",
        phone: "",
        price: 0,
        password: "",
      },
      errors: {},
      isUpdate: false,
    };
  },
  props: {
    update: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "username" && !this.delivery.username.trim()) {
        this.errors.username = "Foydalanuvchi nomi bo'sh bo'lmasligi kerak";
      }
      if (field === "password" && !this.delivery.password.trim()) {
        this.errors.password = "Foydalanuvchi parol bo'sh bo'lmasligi kerak";
      }
      if (field === "phone") {
        const regex = /^\+998\d{9}$/;
        if (!this.delivery.phone.trim()) {
          this.errors.phone = "Telefon raqamini kiriting";
        } else if (!regex.test(this.delivery.phone)) {
          this.errors.phone =
            "Telefon raqami noto‘g‘ri formatda (+998XXXXXXXXX)";
        }
      }
      if (
        field === "price" &&
        (!this.delivery.price ||
          isNaN(this.delivery.price) ||
          this.delivery.price <= 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.errors = {};
      this.validateField("username");
      this.validateField("phone");
      this.validateField("price");
      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      if (!this.isUpdate) {
        api
          .post(
            "/api/delivery",
            {
              username: this.delivery.username,
              phone: this.delivery.phone,
              price: this.delivery.price,
            },
            {
              headers: {
                authorization: token,
              },
            }
          )
          .then(({ status }) => {
            if (status === 201) {
              this.$emit("status", {
                status: "success",
                message: "Yetkazuvchi yaratildi",
              });
              this.closeModal();
              this.isSubmitting = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "Yetkazuvchi yaratilishida hatolik yuz berdi",
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        api
          .put("/api/delivery/" + this.update.id, this.delivery, {
            headers: {
              authorization: token,
            },
          })
          .then(({ status }) => {
            if (status === 200) {
              this.$emit("status", {
                status: "success",
                message: "yetkazuvchi yangilandi",
              });
              this.closeModal();
              this.isSubmitting = false;
              this.isUpdate = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "yetkazuvchi yangilanishida hatolik yuz berdi",
              });
            }
          })
          .catch((error) => {
            this.isSubmitting = false;
            console.error(error);
          });
      }
    },
  },
  mounted() {
    
    if (this?.update?.isUpdate) {
      this.delivery = {
        username: this?.update?.username,
        phone: this?.update?.phone,
        price: this?.update?.price,
      };
      this.isUpdate = true;
    }
  },
};
</script>

<style>
</style>