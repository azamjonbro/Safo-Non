<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content relative">
      <Icons name="xIcon" class="xIcon" @click="closeModal" />
      <h3>Omborxona yaratish</h3>

      <div class="modal-form">
        <div class="form-group">
          <label for="typeId">TypeId</label>
          <input
            id="typeId"
            type="text"
            v-model="warehouse.typeId"
            placeholder="Omborxona turini nomini kiriting"
            @blur="validateField('typeId')"
          />
          <p v-if="errors.typeId" class="error-text">
            {{ errors.typeId }}
          </p>
        </div>
        <div class="form-group">
          <label for="price">Narxi</label>
          <input
            id="price"
            type="text"
            v-model="warehouse.price"
            placeholder="Omborxona narxi  kiriting"
            @blur="validateField('price')"
          />
          <p v-if="errors.price" class="error-text">
            {{ errors.price }}
          </p>
        </div>
        <div class="form-group">
          <label for="quantity">Sonni</label>
          <input
            id="quantity"
            type="text"
            v-model="warehouse.quantity"
            placeholder="Omborxona sonini  kiriting"
            @blur="validateField('quantity')"
          />
          <p v-if="errors.quantity" class="error-text">
            {{ errors.quantity }}
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
      warehouse: {
        typeId: "",
        price: 0,
        quantity: 0,
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
      if (field === "typeId" && !this.warehouse.typeId.trim()) {
        this.errors.typeId = "Non turini nomi bo'sh bo'lmasligi kerak";
      }
      if (
        field === "price" &&
        (!this.warehouse.price ||
          isNaN(this.warehouse.price) ||
          this.warehouse.price <= 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.validateField("typeId");
      this.validateField("quantity");
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
          .post("/api/warehouse", this.warehouse, {
            headers: {
              authorization: token,
            },
          })
          .then(({ status }) => {
            if (status === 201) {
              this.closeModal();
              this.isSubmitting = false;
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        api
          .put("/api/warehouse/" + this?.update?.id, this.warehouse, {
            headers: {
              authorization: token,
            },
          })
          .then(({ status }) => {
            if (status === 200) {
              this.closeModal();
              this.isSubmitting = false;
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
  mounted() {
    if (this?.update?.isUpdate) {
      this.warehouse = {
        typeId: this?.update?.typeId?._id,
        price: this?.update?.price,
        quantity: this?.update?.quantity,
      };
      this.isUpdate = true
    }
  },
};
</script>

<style>
</style>