<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Chiqim {{ isUpdate ? "yangilash" : "yaratish" }}</h2>

        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="title">Nomi</label>
              <input
                id="title"
                type="text"
                placeholder="Chqim nomini kiriting"
                maxlength="15"
                v-model="deliveryDebt.title"
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
                placeholder="chqim narxi kiriting"
                v-model="deliveryDebt.price"
                @blur="validateField('price')"
              />
              <p v-if="errors.price" class="error-text">
                {{ errors.price }}
              </p>
            </div>
            <div class="form-group">
              <label for="description">Tavsif</label>
              <input
                id="description"
                type="text"
                placeholder="Chqim description kiriting"
                maxlength="15"
                v-model="deliveryDebt.description"
                @blur="validateField('description')"
              />
              <p v-if="errors.description" class="error-text">
                {{ errors.description }}
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
      errors: {},
      deliveryDebt: {
        title: "",
        description: "",
        price: 0,
      },
      isUpdate: false,
    };
  },
  props: {
    update: {
      type: Object,
    },
  },
  methods: {
    validateField(field) {
      this.errors[field] = "";
      if (field === "description" && !this.deliveryDebt.description.trim()) {
        this.errors.description = "Foydalanuvchi nomi bo'sh bo'lmasligi kerak";
      }

      if (field === "title" && !this.deliveryDebt.title.trim()) {
        this.errors.title = "Foydalanuvchi nomi bo'sh bo'lmasligi kerak";
      }

      if (
        field === "price" &&
        (!this.deliveryDebt.price ||
          isNaN(this.deliveryDebt.price) ||
          this.deliveryDebt.price <= 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }
    },
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    submitForm() {
      this.validateField("title");
      this.validateField("description");
      this.validateField("price");

      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;

      this.isUpdate
        ? api.put("/api/deliveryDebt/" + this.update.id, this.deliveryDebt)
        : api
            .post("/api/deliveryDebt", this.deliveryDebt)
            .then(({ status }) => {
              if (status === 200 || status === 201) {
                this.$emit("status", {
                  status: "success",
                  message: this.isUpdate
                    ? "Chqim yangilandi"
                    : "Chqim yaratildi",
                });
                this.closeModal();
              } else {
                this.$emit("status", {
                  status: "error",
                  message: this.isUpdate
                    ? "Chiqim yangilanishida xatolik yuz berdi"
                    : "Chiqim yaratilishida xatolik yuz berdi",
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
      this.deliveryDebt = {
        description: this?.update?.description,
        price: this?.update?.price,
      };
    }
  },
};
</script>

<style>
</style>
