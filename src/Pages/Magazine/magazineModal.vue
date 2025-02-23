<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Dokon yaratish</h2>
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
            <p v-if="errors.title" class="error-text">
              {{ errors.title }}
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
            <p v-if="errors.title" class="error-text">
              {{ errors.title }}
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
            <p v-if="errors.title" class="error-text">
              {{ errors.title }}
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
            <p v-if="errors.title" class="error-text">
              {{ errors.title }}
            </p>
          </div>
        </div>
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
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
export default {
  components: {
    Icons,
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
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "title" && !this.magazine.title.trim()) {
        this.errors.title = "Non turini nomi bo'sh bo'lmasligi kerak";
      }
      if (field === "address" && !this.magazine.title.trim()) {
        this.errors.title = "Non turini nomi bo'sh bo'lmasligi kerak";
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
      this.isSubmitting = true;
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : "";
      api.post("/api/magazine", this.magazine, {
        headers: {
          authorization: token,
        },
      }).then(({status})=>{
        if(status === 201){
          this.closeModal()
          this.isSubmitting = false
        }
      })
    },
  },
};
</script>

<style>
</style>