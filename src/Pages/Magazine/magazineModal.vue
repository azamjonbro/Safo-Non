<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Do'kon yaratish</h2>
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="title">Do'kon nomi</label>
              <input
                id="title"
                type="text"
                v-model="magazine.title"
                placeholder="Do`kon nomini kiriting"
                @input="applyRegex('title')"
                @blur="validateField('title')"
                maxlength="30"
              />
              <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
            </div>
            <div class="form-group">
              <label for="phone">Telefon raqam</label>
              <input
                id="phone"
                type="text"
                v-model="magazine.phone"
                placeholder="+998 XX XXX XX XX"
                @input="applyPhoneMask"
                @blur="validateField('phone')"
                maxlength="17"
              />
              <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>
            </div>
            <div class="form-group">
              <label for="address">Manzil</label>
              <input
                id="address"
                type="text"
                v-model="magazine.address"
                placeholder="Do`kon addressini kiriting"
                @blur="validateField('address')"
                maxlength="30"
              />
              <p v-if="errors.address" class="error-text">
                {{ errors.address }}
              </p>
            </div>
            <div class="form-group">
              <label for="pending">Qarzdorlik (boshlang'ich)</label>
              <input
                id="pending"
                type="number"
                v-model="magazine.pending"
                placeholder="Do`kon pendingini kiriting"
                @blur="validateField('pending')"
                maxlength="15"
              />
              <p v-if="errors.pending" class="error-text">
                {{ errors.pending }}
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
                ? "Yangilanyapti..."
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
        this.errors.title = "Do'kon nomi bo'sh bo'lmasligi kerak";
      }
      if (field === "address" && !this.magazine.address.trim()) {
        this.errors.address = "Do'kon manzili bo'sh bo'lmasligi kerak";
      }
      // if (field === "phone") {
      //   const regex = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;
      //   if (!this.magazine.phone.trim()) {
      //     this.errors.phone = "Telefon raqamini kiriting";
      //   } else if (!regex.test(this.magazine.phone)) {
      //     this.errors.phone = "Telefon raqami noto‘g‘ri formatda (+998 XX XXX XX XX)";
      //   }
      // }
      if (
        (field === "pending" && !this.magazine.pending) ||
        isNaN(this.magazine.pending) ||
        this.magazine.pending < 0
      ) {
        this.errors.pending = "Narx musbat son bo‘lishi kerak";
      }
    },
    applyRegex(field) {
      if (field === "title") {
        this.magazine.title = this.magazine.title.replace(/[^a-zA-Z0-9 ]/g, "");
      }
      if (field === "address") {
        this.magazine.address = this.magazine.address.replace(
          /[^a-zA-Z0-9, ]/g,
          ""
        );
      }
    },
    submitForm() {
      this.validateField("title");
      this.validateField("address");
      this.validateField("phone");
      this.validateField("pending");

      if (Object.keys(!this.errors).length) {
        return;
      }

      this.isSubmitting = true;

      const request = this.isUpdate
        ? api.put("/api/magazine/" + this.update.id, this.magazine)
        : api.post("/api/magazine/", this.magazine);

      request
        .then(({ status }) => {
          if (status === 201 || status === 200) {
            this.$emit("status", {
              status: "success",
              message: this.isUpdate ? "Do`kon yangilandi" : "Do`kon yaratildi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: this.isUpdate
                ? "Do`kon yangilanishida hatolik"
                : "Do`kon yaratilishida hatolik",
            });
          }
        })
        .catch(() => {
          this.$emit("status", {
            status: "error",
            message: "Xatolik yuzberdi",
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
  mounted() {
    if (this?.update?.isUpdate) {
      this.magazine = {
        title: this?.update?.title,
        phone: this?.update?.phone,
        address: this?.update?.address,
        pending: this?.update?.pending,
      };
      this.isUpdate = true;
    }
  },
};
</script>
