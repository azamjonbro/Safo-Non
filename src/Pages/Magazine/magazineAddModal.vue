<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="closeModal">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Non sotish</h2>

        <form @submit.prevent="submitForm">
          <!-- Bread Type and Quantity Section -->
          <div class="yemagan">
            <div class="contentbox d-flex gap12 w-100 j-between">
              <div class="form-group">
                <label for="bread">Non turini tanlang</label>
                <CustomSelect
                  :options="typeOfBreads"
                  id="bread"
                  :selected="true"
                  @input="selectArray"
                />
              </div>

              <div class="form-group">
                <label for="price">Narxi</label>
                <input
                  id="price"
                  type="number"
                  placeholder="Rasxod narxi"
                  v-model="typeOfBread.price"
                  readonly
                />
              </div>
              <div class="form-group">
                <label for="bread">Qaysi narxda</label>
                <CustomSelect
                  :options="prices"
                  :selected="magazine.pricetype"
                  @input="selectPrice($event)"
                />
              </div>
            </div>
          </div>

          <!-- Total Amount and Received Amount Section -->
          <div class="contentbox">
            <div class="form-group">
              <label for="quantity">Soni (Dona)</label>
              <input
                id="quantity"
                type="number"
                placeholder="Rasxod sonini kiriting"
                v-model="magazine.quantity"
                @blur="validateField('quantity')"
                @input="calculateTotal"
              />
              <p v-if="errors.quantity" class="error-text">
                {{ errors.quantity }}
              </p>
            </div>
            <div class="form-group">
              <label for="totalAmount">Jami narx</label>
              <input
                id="totalAmount"
                type="number"
                v-model="totalAmount"
                readonly
                placeholder="0"
              />
            </div>

            <div class="form-group">
              <label for="receivedAmount">Qabul qilingan summa</label>
              <input
                id="receivedAmount"
                type="number"
                v-model="magazine.money"
                @input="calculateRemaining"
                placeholder="Olingan summani kiriting"
              />
            </div>

            <div class="form-group">
              <label for="remainingAmount">Qoldiq</label>
              <input
                id="remainingAmount"
                type="number"
                v-model="remainingAmount"
                readonly
                placeholder="0"
              />
            </div>
          </div>

          <!-- Payment Method Section -->
          <div class="modal-form">
            <div class="form-group">
              <label for="paymentMethod">To`lov turi</label>
              <CustomSelect
                :options="payedMethods"
                id="paymentMethod"
                @input="selectPayedMethod"
                :search="true"
                @blur="validateField('paymentMethod')"
              />
              <p v-if="errors.paymentMethod" class="error-text">
                {{ errors.paymentMethod }}
              </p>
            </div>

            <div class="form-group" v-if="isHideDeliveries">
              <label for="delivery">Yetkazuvchi</label>
              <CustomSelect
                :options="allDelivery"
                id="delivery"
                @input="selectDelivery"
                :selected="magazine?.deliveryId"
                :search="true"
                @blur="validateField('deliveryId')"
              />
              <p v-if="errors.deliveryId" class="error-text">
                {{ errors.deliveryId }}
              </p>
            </div>
          </div>

          <!-- Buttons Section -->
          <div class="modal-buttons d-flex j-end a-center gap24">
            <button type="button" class="action-button" @click="closeModal">
              Chiqish
            </button>
            <button
              type="submit"
              class="action-button"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Sotilyapti..." : "Sotish" }}
            </button>
          </div>
        </form>
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
      magazine: {
        deliveryId: "",
        paymentMethod: "",
        money: 0,
        magazineId: "",
        breadId: "",
        quantity: 0,
        pricetype: "tan",
      },
      errors: {},
      isHideDeliveries: false,
      typeOfBreads: [],
      payedMethods: [
        { text: "Naxt", value: "Naxt" },
        { text: "Karta", value: "Karta" },
      ],
      allDelivery: [],
      typeOfBread: {
        price: 0,
      },
      totalAmount: 0,
      remainingAmount: 0,
      prices: [
        { text: "Tan narxi", value: "tan" },
        { text: "To`yxona", value: "toyxona" },
        { text: "Do`kon", value: "dokon" },
      ],
    };
  },
  props: {
    update: Object,
    Delivery: Object,
  },
  methods: {
    selectPrice(type) {
      this.magazine.pricetype = type;
    },
    deleteRow(index) {
      if (this.typeOfBreadIds.length > 1) {
        this.typeOfBreadIds = this.typeOfBreadIds.filter(
          (item) => item.id !== index
        );
      }
    },
    calculateTotal() {
      this.totalAmount = this.typeOfBread.price * this.magazine.quantity;
      this.calculateRemaining();
    },
    calculateRemaining() {
      // this.remainingAmount = this.totalAmount - (this.magazine.money || 0);
      // this.remainingAmount = this.totalAmount * this.magazine.quantity;
      this.remainingAmount = this.totalAmount - (this.magazine.money || 0);
    },
    selectPayedMethod(value) {
      this.magazine.paymentMethod = value;
    },
    selectDelivery(value) {
      this.magazine.deliveryId = value._id;
    },
    selectArray(value) {
      this.magazine.breadId = !value.id
        ? value.bread.typeOfBreadIds[0]._id
        : value.id;
        console.log(value)
      this.typeOfBread.price =
        this.magazine.pricetype === ""
          ? value.breadId.price
          : this.magazine.pricetype === "toyxona"
          ? value.breadId.price3
          : this.magazine.pricetype === "dokon"
          ? value.breadId.price2
          : value.breadId.price;
    },
    getBreads() {
      api
        .get("/api/sellerBreads")
        .then(({ status, data }) => {
          if (status === 200) {
            const groupedBreads = data?.sellerBreads.reduce((acc, bread) => {
              bread.typeOfBreadId.forEach((breadDetail) => {
                const { breadId, quantity, qopQuantity } = breadDetail;
                if (!acc[breadId._id]) {
                  acc[breadId._id] = {
                    text: breadId.title,
                    value: {
                      quantity: 0,
                      qopQuantity: 0,
                      breadId: breadId,
                      bread: bread,
                      id: bread._id,
                    },
                  };
                }
                acc[breadId._id].value.quantity += quantity;
                acc[breadId._id].value.qopQuantity += qopQuantity;
              });
              return acc;
            }, {});

            this.typeOfBreads = Object.values(groupedBreads);
            console.log(this.typeOfBreads);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (field === "paymentMethod" && !this.magazine.paymentMethod.trim()) {
        this.errors.paymentMethod = "To`lov turini tanlang";
      }
      if (
        field === "quantity" &&
        (!this.magazine.quantity ||
          isNaN(this.magazine.quantity) ||
          this.magazine.quantity <= 0)
      ) {
        this.errors.quantity = "Soni (Dona) musbat son bo‘lishi kerak";
      }
      if (
        field === "money" &&
        (!this.magazine.money ||
          isNaN(this.magazine.money) ||
          this.magazine.money <= 0)
      ) {
        this.errors.money = "Olingan pul son bo‘lishi kerak";
      }
    },
    submitForm() {
      this.errors = {};
      this.validateField("magazineId");
      this.validateField("money");

      if (Object.values(this.errors).some((error) => error !== "")) {
        return;
      }

      this.isSubmitting = true;
      api
        .post("/api/sellingBread", {
          ...this.magazine,
          deliveryId: this.magazine.deliveryId || "delivery",
        })
        .then(({ status }) => {
          if (status === 201) {
            this.$emit("status", { message: "Sotildi", status: "success" });
            this.closeModal();
          }
        })
        .catch((error) => {
          console.error(error);
          this.$emit("status", {
            message:
              error.response?.data?.message ||
              error?.message ||
              "Xatolik yuz berdi",
            status: "error",
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    getDeliveries() {
      api
        .get("/api/deliveries")
        .then(({ data, status }) => {
          if (status === 200) {
            this.allDelivery = data?.deliveries.map((item) => ({
              text: item.username,
              value: item,
            }));
          }
        })
        .catch(console.error);
    },
    getDeliveryBreads() {
      api
        .get("/api/orderWithDeliveries")
        .then(({ data, status }) => {
          if (status === 200) {
            console.log(data);
            const groupedBreads = data?.orderWithDeliveries.reduce(
              (acc, bread) => {
                bread.typeOfBreadIds.forEach((breadDetail) => {
                  const { breadId, quantity, qopQuantity } = breadDetail;
                  if (!acc[breadId._id]) {
                    acc[breadId._id] = {
                      text: breadId.title,
                      value: {
                        quantity: 0,
                        qopQuantity: 0,
                        breadId: breadId,
                        bread: bread,
                        id: bread._id,
                      },
                    };
                  }
                  acc[breadId._id].value.quantity += quantity;
                  acc[breadId._id].value.qopQuantity += qopQuantity;
                });
                return acc;
              },
              {}
            );

            this.typeOfBreads = Object.values(groupedBreads);
          }
        })
        .catch(console.error);
    },
  },
  mounted() {
    const user = localStorage.getItem("user");
    const role = user ? JSON.parse(user).role : null;

    switch (role) {
      case "delivery":
        this.getDeliveryBreads();
        this.isHideDeliveries = false;
        break;
      case "superAdmin":
      case "manager":
        this.getDeliveries();
        this.getBreads();
        this.isHideDeliveries = true;
        break;
      default:
        break;
    }

    if (this.Delivery?.isActive) {
      this.magazine.magazineId = this.Delivery?.id;
    }
  },
};
</script>

<style scoped>
.contentbox {
  display: flex;
  gap: 10px;
}
.contentbox > .form-group {
  width: 33%;
}
.scroll {
  max-height: 400px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.yemagan {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.modal-form-2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 10px;
}
</style>
