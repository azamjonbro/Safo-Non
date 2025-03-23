<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Nonlarni qaytarish</h2>
        <!-- <form class="scroll" ></form> -->
        <div class="scroll" style="height: 100%; margin-top: 30px">
          <div
            class="modal-form-2"
            v-for="(data, index) in typeOfBreadIds"
            :key="index"
          >
            <div class="form-group">
              <label for="bread">Non turini</label>
              <input
                id="price"
                type="text"
                placeholder="Rasxod narxi"
                v-model="data.breadName"
                readonly
              />
            </div>
            <div class="form-group">
              <label for="bread">Qaysi narxda</label>
              <input
                id="price"
                type="text"
                placeholder="Rasxod narxi"
                v-model="data.pricetype"
                readonly
              />
            </div>
            <div class="form-group">
              <label for="quantity">Jami Narxi</label>
              <input
                id="price"
                type="number"
                placeholder="Rasxod narxi"
                v-model="data.totalPrice"
                readonly
              />
              <!-- <p v-if="errors.price" class="error-text">
                {{ errors.price }}
              </p> -->
            </div>
            <div class="form-group" style="width: 95%">
              <label for="quantity">Soni (Dona)</label>
              <input
                id="quantity"
                type="number"
                placeholder="Rasxod sonini kiriting"
                v-model="data.totalQuantity"
                readonly
                @blur="validateField('quantity')"
              />
            </div>
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
import CustomSelect from "@/components/Template/customSelect.vue";
export default {
  components: {
    Icons,
    CustomSelect,
  },
  data() {
    return {
      isSubmitting: false,
      delivery: {
        description: "",
        deliveryId: "",
        pricetype: "",
      },
      typeOfBreadIds: [
        {
          id: 0,
          quantity: 0,
          bread: "",
          typeOfBread: "",
          errors: {},
          price: 0,
          pricetype: "",
        },
      ],
      prices: [
        { text: "Tan narxi", value: "tan" },
        { text: "To`yxona", value: "toyxona" },
        { text: "Do`kon", value: "dokon" },
      ],
      orderWithDeliveries: [],
    };
  },
  props: {
    update: {
      type: Object,
    },
  },
  computed: {
    totalAmountPrice() {
      return (
        this.typeOfBreads.reduce((a, b) => a + b.totalPrice, 0) -
        this.typeOfBreadIds.reduce((a, b) => a + b.price, 0)
      );
    },
    totalAmountQuantity() {
      return (
        this.typeOfBreads.reduce((a, b) => a + b.totalQuantity, 0) -
        this.typeOfBreadIds.reduce((a, b) => a + b.quantity, 0)
      );
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "description" && !this.delivery.description?.trim()) {
        this.errors.description =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
      if (field === "deliveryId" && !this.delivery.deliveryId?.trim()) {
        this.errors.deliveryId =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
    },
    submitForm() {
      if (!this.typeOfBreadIds.length) {
        return;
      }
      this.isSubmitting = true;
      console.log({
        orderWtihDelivery: this.typeOfBreadIds,
      });
      api
        .post("/api/returnedPro", {
          orderWithDelivery: this.typeOfBreadIds.map((i) => i._id),
        })
        .then(({ status }) => {
          if (status === 201) {
            this.$emit("status", {
              status: "success",
              message: "Nonlar qaytaril",
            });
            this.closeModal();
            this.isSubmitting = false;
          } else {
            this.$emit("status", {
              status: "error",
              message: "Nonlar qaytarilishida hatolik yuz berdi",
            });
          }
        })
        .catch((error) => {
          this.isSubmitting = false;
          console.error(error);
          this.$emit("status", {
            status: "error",
            message:
              error.response.data.message ||
              error.data.message ||
              "Xatolik yuz berdi",
          });
        });
    },
    getOrderWithDelivery() {
      api
        .get("/api/orderWithDeliveries")
        .then(({ data, status }) => {
          if (status === 200) {
            this.typeOfBreadIds =  [
              {
                id: 0,
                quantity: 0,
                bread: "",
                typeOfBread: "",
                errors: {},
                price: 0,
                pricetype: "",
              },
            ] ||  data?.orderWithDeliveries.map((item) => {
              return {
                ...item,
                totalQuantity: item.typeOfBreadIds.reduce(
                  (a, b) => a + b.quantity,
                  0
                ),
                pricetype: item.pricetype
                  ? item.pricetype === "tan"
                    ? "Tan narxi"
                    : item.pricetype === "toyxona"
                    ? "To`yxona"
                    : item.pricetype === "narxi"
                    ? "Do`kon"
                    : "Tan narxi"
                  : "Tan narxi",
                breadName: item.typeOfBreadIds
                  .map((i) => i.breadId.title)
                  .join(","),
              };
            })
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getOrderWithDelivery();
  },
};
</script>

<style scoped>
.modal-form-2 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 10px;
}
</style>