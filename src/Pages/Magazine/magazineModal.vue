<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Dokon yaratish</h2>
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="title">Nomi</label>
              <input
                id="title"
                type="text"
                v-model="magazine.title"
                placeholder="Do`kon nomini kiriting"
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
                placeholder="Do`kon telefon raqamini kiriting"
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
                @blur="validateField('address')"
              />
              <p v-if="errors.address" class="error-text">
                {{ errors.address }}
              </p>
            </div>

            <div class="form-group">
              <label for="pending">Pending</label>
              <input
                id="pending"
                type="number"
                v-model="magazine.pending"
                placeholder="Do`kon pendingini kiriting"
                @blur="validateField('pending')"
              />
              <p v-if="errors.pending" class="error-text">
                {{ errors.pending }}
              </p>
            </div>

            <div class="form-group">
              <label for="remainprice">RemainPrice</label>
              <input
                id="remainprice"
                type="number"
                v-model="magazine.remainprice"
                placeholder="Do`kon remainpriceini kiriting"
                @blur="validateField('remainprice')"
              />
              <p v-if="errors.remainprice" class="error-text">
                {{ errors.remainprice }}
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
                ? "Yangilanyapti"
                : "Yangilamoq"
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
      magazine: {
        title: "",
        phone: "",
        address: "",
        pending: 0,
        remainprice: 0,
      },
      errors: {},

      isUpdate: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "title" && !this.magazine.title.trim()) {
        this.errors.title = "Magazine nomi bo'sh bo'lmasligi kerak";
      }
      if (field === "address" && !this.magazine.address.trim()) {
        this.errors.address = "Magazine addressi bo'sh bo'lmasligi kerak";
      }
      if (field === "phone") {
        const regex = /^\+998\d{9}$/;
        if (!this.magazine.phone.trim()) {
          this.errors.phone = "Telefon raqamini kiriting";
        } else if (!regex.test(this.magazine.phone)) {
          this.errors.phone =
            "Telefon raqami noto‘g‘ri formatda (+998XXXXXXXXX)";
        }
      }
      if (
        field === "pending" &&
        (!this.magazine.pending ||
          isNaN(this.magazine.pending) ||
          this.magazine.pending <= 0)
      ) {
        this.errors.pending = "Narx musbat son bo‘lishi kerak";
      }
      if (
        field === "remainprice" &&
        (!this.magazine.remainprice ||
          isNaN(this.magazine.remainprice) ||
          this.magazine.remainprice <= 0)
      ) {
        this.errors.remainprice = "Narx musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.validateField("title");
      this.validateField("address");
      this.validateField("phone");
      this.validateField("pending");
      this.validateField("remainprice");
      for (const error in this.errors) {
        console.log(this.errors[error]);
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : "";
      if (!this.isUpdate) {
        api
          .post("/api/magazine/", this.magazine, {
            headers: {
              authorization: token,
            },
          })
          .then(({ status }) => {
            if (status === 201) {
              this.$emit("status", {
                status: "success",
                message: "Do`kon yaratildi",
              });
              this.closeModal();
              this.isSubmitting = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "Do`kon yaratilishida hatolik yuz berdi",
              });
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
      } else {
        api
          .put("/api/magazine/" + this.update.id, this.magazine, {
            headers: {
              authorization: token,
            },
          })
          .then(({ status }) => {
            if (status === 200) {
              this.$emit("status", {
                status: "success",
                message: "Do`kon yangilandi",
              });
              this.closeModal();
              this.isSubmitting = false;
              this.isUpdate = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "Do`kon yangilanishida hatolik yuz berdi",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            this.$emit("status", {
              status: "error",
              message: "Xatolik yuzberdi",
            });
          });
      }
    },
  },
  mounted() {
    if (this?.update?.isUpdate) {
      this.magazine = {
        title: this?.update?.title,
        phone: this?.update?.phone,
        address: this?.update?.address,
        pending: this?.update?.pending,
        remainprice: this?.update?.remainprice,
      };
      this.isUpdate = true;
    }
  },
};
</script>

<style>
</style>