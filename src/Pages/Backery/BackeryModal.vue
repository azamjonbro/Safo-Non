<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Nonvoy yaratish</h2>
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="username">Foydalanuvchi nomi</label>
              <input
                id="username"
                type="text"
                v-model="user.username"
                placeholder="Foydalanuvchi nomini kiriting"
                @blur="validateField('username')"
              />
              <p v-if="errors.username" class="error-text">
                {{ errors.username }}
              </p>
            </div>
            <div class="form-group">
              <label for="ovenId">Foydalanuvchiga tegishli tandir raqami</label>
              <input
                id="ovenId"
                type="text"
                v-model="user.ovenId"
                placeholder="Foydalanuvchi tandir raqamini kiriting"
                @blur="validateField('ovenId')"
              />
              <p v-if="errors.ovenId" class="error-text">{{ errors.ovenId }}</p>
            </div>
            <div class="form-group">
              <label for="phone">Telefon raqami</label>
              <input
                id="phone"
                type="text"
                v-model="user.phone"
                placeholder="Telefon raqamini kiriting"
                @blur="validateField('phone')"
              />
              <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>
            </div>
            <div class="form-group">
              <label for="price">Har bir non uchun narxi</label>
              <input
                id="price"
                type="number"
                v-model="user.price"
                placeholder="Summa kiriting"
                @blur="validateField('price')"
              />
              <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
            </div>
            <div class="form-group" v-if="isUpdate">
              <label for="password">Parol</label>
              <input
                type="text"
                id="password"
                v-model="user.password"
                placeholder="Nonvoy parolini kiriting"
              />
            </div>
          </div>
        </form>
        <div class="modal-buttons d-flex j-end a-center gap24">
          <button type="button" class="action-button" @click="closeModal">
            Chiqish
          </button>
          <button
            type="button"
            @click="submitForm()"
            class="action-button"
            :disabled="isSubmitting"
          >
            {{
              !isUpdate
                ? isSubmitting
                  ? "Yaratilmoqda..."
                  : "Yaratish"
                : isSubmitting
                ? "Yangilanyapti..."
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
  props: {
    update: {
      type: Object,
    },
  },
  data() {
    return {
      isSubmitting: false,
      user: {
        username: "",
        phone: "",
        price: "",
        ovenId: "",
        password: "",
      },
      errors: {},
      isUpdate: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "username" && !this.user.username.trim()) {
        this.errors.username = "Foydalanuvchi nomi bo'sh bo'lmasligi kerak";
      }
      if (
        field === "ovenId" &&
        (!this.user.ovenId || isNaN(this.user.ovenId))
      ) {
        this.errors.ovenId = "Tandir raqami raqam bo‘lishi kerak";
      }
      //  if (
      //   field === "password" &&
      //   (!this.user.password || isNaN(this.user.password))
      // ) {
      //   this.errors.password = "Foydalanuvchi paroli bo‘lishi bo`lmasligi kerak";
      // }
      if (field === "phone") {
        const regex = /^\+998\d{9}$/;
        if (!this.user.phone.trim()) {
          this.errors.phone = "Telefon raqamini kiriting";
        } else if (!regex.test(this.user.phone)) {
          this.errors.phone =
            "Telefon raqami noto‘g‘ri formatda (+998XXXXXXXXX)";
        }
      }
      if (
        field === "price" &&
        (!this.user.price || isNaN(this.user.price) || this.user.price < 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }
    },
    async submitForm() {
      this.errors = {};
      this.validateField("username");
      this.validateField("phone");
      this.validateField("price");
      this.validateField("ovenId");

      if (!Object.keys(this.errors).length) {
        return;
      }
        
      this.isSubmitting = true;
      if (!this.isUpdate) {
        try {
          const response = await api.post("/api/seller", {...this.user,password: this.password ? this.password : this.user.phone.slice(-4)});
          console.log(response);

          if (response?.status == 201) {
            this.$emit("status", {
              status: "success",
              message: "Nonvoy muvaffaqqiyatli qo'shildi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "Nonvoy qo'shishda hatolik",
            });
          }
          this.isSubmitting = true;
        } catch (error) {
          this.$emit("status", {
            status: "error",
            message:
              error.response?.data?.message ||
              error.message ||
              "Xatolik yuz berdi",
          });
        } finally {
          this.isSubmitting = false;
        }
      } else {
        try {
          const response = await api.put(
            "/api/seller/" + this?.update?._id,
            this.user
          );
          if (response?.status == 200) {
            this.$emit("status", {
              status: "success",
              message: "Nonvoy muvaffaqqiyatli yangilandi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "Nonvoy yangilanishida hatolik",
            });
          }
          this.isSubmitting = true;
        } catch (error) {
          this.$emit("status", {
            status: "error",
            message:
              error.response?.data?.message ||
              error.message ||
              "Xatolik yuz berdi",
          });
        } finally {
          this.isSubmitting = false;
        }
      }
    },
  },
  mounted() {    
    if (this?.update?.isUpdate) {
      this.user = {
        username: this?.update?.username,
        phone: this?.update?.phone,
        price: this?.update?.price,
        ovenId: this?.update?.ovenId,
      };
      this.isUpdate = true;
    }
  },
};
</script>

<style>
.error-text {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

.xIcon {
  position: absolute;
  top: 50px;
  right: 100px;
  z-index: 101;
}

.xIcon > svg {
  width: 60px;
  height: 60px;
}
</style>