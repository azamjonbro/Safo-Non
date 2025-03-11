<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Chiqim yaratish</h2>
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="title">Nomi</label>
              <input
                id="title"
                type="text"
                v-model="magazine.title"
                placeholder="Do`kon nomini kiriting"
                maxlength="50"
                @input="sanitizeInput('title')"
                @blur="validateField('title')"
              />
              <p v-if="errors.title" class="error-text">
                {{ errors.title }}
              </p>
            </div>
            <div class="form-group">
              <label for="phone">Telefon raqam</label>
              <input
                id="phone"
                type="text"
                v-model="magazine.phone"
                placeholder="+998XXXXXXXXX"
                maxlength="13"
                @input="sanitizePhone()"
                @blur="validateField('phone')"
              />
              <p v-if="errors.phone" class="error-text">
                {{ errors.phone }}
              </p>
            </div>
            <div class="form-group">
              <label for="address">Address</label>
              <input
                id="address"
                type="text"
                v-model="magazine.address"
                placeholder="Do`kon addressini kiriting"
                maxlength="100"
                @input="sanitizeInput('address')"
                @blur="validateField('address')"
              />
              <p v-if="errors.address" class="error-text">
                {{ errors.address }}
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
            {{ isSubmitting ? "Yaratilmoqda..." : "Yaratish" }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isSubmitting: false,
      magazine: {
        title: "",
        phone: "",
        address: "",
      },
      errors: {},
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    sanitizeInput(field) {
      this.magazine[field] = this.magazine[field].replace(/[^a-zA-Z0-9'`\s]/g, "");
    },
    sanitizePhone() {
      this.magazine.phone = this.magazine.phone.replace(/[^0-9+]/g, "");
      if (!this.magazine.phone.startsWith("+998")) {
        this.magazine.phone = "+998";
      }
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "title" && !this.magazine.title.trim()) {
        this.errors.title = "Magazin nomi bo'sh bo'lmasligi kerak";
      }
      if (field === "address" && !this.magazine.address.trim()) {
        this.errors.address = "Magazin addressi bo'sh bo'lmasligi kerak";
      }
      if (field === "phone") {
        const regex = /^\+998\d{9}$/;
        if (!this.magazine.phone.trim()) {
          this.errors.phone = "Telefon raqamini kiriting";
        } else if (!regex.test(this.magazine.phone)) {
          this.errors.phone = "Telefon raqami noto‘g‘ri formatda (+998XXXXXXXXX)";
        }
      }
    },
    submitForm() {
      this.errors = {};
      this.validateField("username");
      this.validateField("phone");
      this.validateField("price");
      for (const error in this.errors) {
        if (this.errors[error]) {
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
            "/api/",
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
};
</script>

<style>
.error-text {
  color: red;
  font-size: 14px;
}
</style>