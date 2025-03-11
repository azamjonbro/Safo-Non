<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content relative">
      <Icons name="xIcon" class="xIcon" @click="closeModal" />
      <h3>{{ !isUpdate ? "Omborxona mahsulotini yaratish" : "Omborxona mahsulotini yangilash" }}</h3>

      <form>
        <div class="modal-form">
          <div class="form-group">
            <label for="typeId">Mahsulot nomi</label>
            <input id="typeId" type="text" placeholder="Omborxona turini tanglang" @blur="validateField('name')" v-model="warehouse.name" />
            <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
          </div>
          <div class="form-group">
            <label for="price">Narxi (dona)</label>
            <input
              id="price"
              type="number"
              v-model="warehouse.price"
              placeholder="Omborxona narxi kiriting"
              @blur="validateField('price')"
            />
            <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
          </div>
          <div class="form-group">
            <label for="quantity">Soni (dona/kg/metr)</label>
            <input
              id="quantity"
              type="number"
              v-model="warehouse.quantity"
              placeholder="Omborxona sonini kiriting"
              @blur="validateField('quantity')"
            />
            <p v-if="errors.quantity" class="error-text">{{ errors.quantity }}</p>
          </div>
          <div class="form-group">
            <label for="totalPrice">Umumiy narx</label>
            <input
              id="totalPrice"
              type="number"
              :value="totalPrice"
              readonly
            />
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
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
import CustomSelectVue from "@/components/Template/customSelect.vue";

export default {
  components: {
    Icons,
    CustomSelectVue,
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
        name: "",
        price: 0,
        quantity: 0,
      },
      errors: {},
      isUpdate: false,
    };
  },
  computed: {
    totalPrice() {
      return this.warehouse.price * this.warehouse.quantity;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "name" && !this.warehouse?.name?.trim()) {
        this.errors.name = "Mahsulot nomi bo'sh bo'lmasligi kerak";
      }
      if (
        field === "price" &&
        (!this.warehouse.price ||
          isNaN(this.warehouse.price) ||
          this.warehouse.price < 0)
      ) {
        this.errors.price = "Narx musbat son bo‘lishi kerak";
      }
      if (
        field === "quantity" &&
        (!this.warehouse.quantity ||
          isNaN(this.warehouse.quantity) ||
          this.warehouse.quantity < 0)
      ) {
        this.errors.quantity = "Soni musbat son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.validateField("name");
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
          .post("/api/typeOfWareHouse", this.warehouse, {
            headers: {
              authorization: token,
            },
          })
          .then(({ status }) => {
            if (status === 201) {
              this.$emit("status", {
                status: "success",
                message: "Omborxona yaratildi",
              });
              this.closeModal();
              this.isSubmitting = false;
            } else {
              this.$emit("status", {
                status: "error",
                message: "Omborxona yaratilishida hatolik yuz berdi",
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        api
          .put("/api/typeOfWareHouse/" + this?.update?.id, this.warehouse, {
            headers: {
              authorization: token,
            },
          })
          .then(({ status }) => {
            if (status === 200) {
              this.$emit("status", {
                status: "success",
                message: "Omborxona yangilandi",
              });
              this.closeModal();
              this.isSubmitting = false;
            }
          })
          .catch((error) => {
            console.error(error);
            this.$emit("status", {
              status: "error",
              message: "Omborxona yangilanishida hatolik yuz berdi",
            });
          });
      }
    },
  },
  mounted() {
    if (this?.update?.isUpdate) {
      this.warehouse = {
        name: this?.update?.name,
        price: this?.update?.price,
        quantity: this?.update?.quantity,
      };
      this.isUpdate = true;
    }
  },
};
</script>
