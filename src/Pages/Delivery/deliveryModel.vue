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
                maxlength="15"
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
                maxlength="13"
                @input="applyPhoneMask"
                @blur="validateField('phone')"
              />
              <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>
            </div>
            <div class="form-group">
              <label for="price">Narxi</label>
              <input
                id="price"
                type="text"
                placeholder="Yetkazish narxini kiriting (dona)"
                v-model="delivery.price"
                maxlength="10"
                @input="applyPriceMask"
                @blur="validateField('price')"
              />
              <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
            </div>
            <div class="form-group" v-if="isUpdate">
              <label for="password">Parol</label>
              <input
                id="password"
                type="password"
                placeholder="Yetkazuvchini parolini kiriting"
                v-model="delivery.password"
                @blur="validateField('password')"
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
        price: "",
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
    applyPhoneMask(event) {
      let value = event.target.value.replace(/\D/g, ""); // faqat raqamlarni qoldiramiz
      if (value.startsWith("998")) {
        value = "+" + value;
      } else if (value.startsWith("9")) {
        value = "+998" + value.substring(1);
      } else {
        value = "+998";
      }
      this.delivery.phone = value.slice(0, 13); // maksimal 13 ta belgi
    },
    applyPriceMask(event) {
      this.delivery.price = event.target.value.replace(/\D/g, ""); // faqat raqamlar kiritiladi
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "username" && !this.delivery.username.trim()) {
        this.errors.username = "Foydalanuvchi nomi bo'sh bo'lmasligi kerak";
      }
      if (this.isUpdate && field === "password" && !this.delivery.password.trim()) {
        this.errors.password = "Parol bo'sh bo'lmasligi kerak";
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
        (!this.delivery.price || isNaN(this.delivery.price) || this.delivery.price <= 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.errors = {};
      this.validateField("username");
      this.validateField("phone");
      this.validateField("price");

      if (this.isUpdate) {
        this.validateField("password");
      }

      if (Object.keys(!this.errors).length) {
        return;
      }

      this.isSubmitting = true;
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      const requestData = {
        username: this.delivery.username,
        phone: this.delivery.phone,
        price: this.delivery.price,
      };

      if (this.isUpdate) {
        requestData.password = this.delivery.password;
      }

      console.log(requestData);
      

      const request = this.isUpdate
        ? api.put(`/api/delivery/${this.update.id}`, requestData, {
            headers: { authorization: token },
          })
        : api.post("/api/delivery", requestData, {
            headers: { authorization: token },
          });

      request
        .then(({ status }) => {
          if (status === 200 || status === 201) {
            this.$emit("status", {
              status: "success",
              message: this.isUpdate
                ? "Yetkazuvchi yangilandi"
                : "Yetkazuvchi yaratildi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: this.isUpdate
                ? "Yetkazuvchi yangilanishida xatolik yuz berdi"
                : "Yetkazuvchi yaratilishida xatolik yuz berdi",
            });
          }
        })
        .catch(() => {
          this.$emit("status", {
            status: "error",
            message: "Server xatosi, qaytadan urinib ko'ring",
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
  mounted() {
    if (this?.update?.isUpdate) {
      this.delivery = {
        username: this.update.username,
        phone: this.update.phone,
        price: this.update.price,
        password: "",
      };
      this.isUpdate = true;
    }
  },
};
</script>

<style>
.error-text {
  color: red;
  font-size: 12px;
}
</style>
