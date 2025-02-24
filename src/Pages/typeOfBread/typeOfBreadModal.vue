<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Non turini yaratish</h2>
        <form @submit.prevent="submitForm">
          <div class="modal-form">
            <div class="form-group">
              <label for="title">Nomi</label>
              <input
                id="title"
                type="text"
                v-model="typeOfBread.title"
                placeholder="Non turini nomini kiriting"
                @blur="validateField('title')"
              />
              <p v-if="errors.title" class="error-text">
                {{ errors.title }}
              </p>
            </div>
            <div class="form-group">
              <label for="price">Narxi</label>
              <input
                id="price"
                type="number"
                v-model="typeOfBread.price"
                placeholder="Non turini narxini kiriting"
                @blur="validateField('price')"
              />
              <p v-if="errors.price" class="error-text">
                {{ errors.price }}
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
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
export default {
  components: {
    Icons,
  },
  data() {
    return {
      isSubmitting: false,
      typeOfBread: {
        title: "",
        price: 0,
      },
      errors: {},
    };
  },
  props: {
    update: {
      type: Object,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "title" && !this.typeOfBread.title.trim()) {
        this.errors.title = "Non turini nomi bo'sh bo'lmasligi kerak";
      }
      if (
        field === "price" &&
        (!this.typeOfBread.price ||
          isNaN(this.typeOfBread.price) ||
          this.typeOfBread.price <= 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }
    },
    async submitForm() {
      this.errors = {};
      this.validateField("title");
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
      if (!this.update.isUpdate) {
        try {
          await api.post(
            "/api/typeOfBread",
            { title: this.typeOfBread.title, price: this.typeOfBread.price },
            {
              headers: {
                authorization: token,
              },
            }
          );
          this.closeModal();
          this.isSubmitting = false;
        } catch (error) {
          console.error("Xatolik yuz berdi:", error);
        } finally {
          this.isSubmitting = false;
        }
      } else {
        try {
          await api.put(
            "/api/typeOfBread/" + this.update.id,
            this.typeOfBread,
            {
              headers: {
                authorization: token,
              },
            }
          );
          this.closeModal();
          this.isSubmitting = false;
        } catch (error) {
          console.error("Xatolik yuz berdi:", error);
        } finally {
          this.isSubmitting = false;
        }
      }
    },
  },
  mounted() {
    if (this?.update?.isUpdate) {
      this.typeOfBread = {
        title: this?.update?.title,
        price: this?.update?.price,
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