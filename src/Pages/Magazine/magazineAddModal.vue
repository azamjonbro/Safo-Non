<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Non sotish</h2>

        <form>
          <div class="scroll yemagan" style="height: 90%">
            <div
              class="contentbox d-flex gap12 w-100 j-between"
              v-for="(data, index) in typeOfBreadIds"
              :key="index"
            >
              <div class="form-group">
                <label for="bread">Non turini tanlang</label>
                <CustomSelect
                  :options="typeOfBreads"
                  id="bread"
                  :selected="true"
                  @input="selectArray($event, data.id)"
                />
              </div>

              <div class="form-group">
                <label for="quantity">Narxi</label>
                <input
                  id="price"
                  type="number"
                  placeholder="Rasxod narxi"
                  v-model="data.price"
                  readonly
                />
                <!-- <p v-if="errors.price" class="error-text">
                {{ errors.price }}
              </p> -->
              </div>
              <div class="form-group">
                <label for="quantity">Soni (Dona)</label>
                <input
                  id="quantity"
                  type="number"
                  placeholder="Rasxod sonini kiriting"
                  v-model="data.quantity"
                  @blur="validateField('quantity')"
                  @input="calculateTotal"
                />
                <p v-if="data?.errors.quantity" class="error-text">
                  {{ data?.errors.quantity }}
                </p>
              </div>
              <div class="form-group">
                <label for="totalPrice">Jami narx</label>
                <input id="totalPrice" type="number" v-model="data.totalPrice" readonly placeholder="0" />
              </div>
              <div style="display: flex; align-items: end" class="gap12">
                <Icons
                  name="deleted"
                  title="o'chirish"
                  class="icon danger"
                  @click="deleteRow(data?.id)"
                />
              </div>
            </div>
            <div class="d-flex j-end">
              <button
                type="button"
                class="create-button"
                @click="
                  typeOfBreadIds.push({
                    id: typeOfBreadIds.length,
                    breadId: '',
                    quantity: 0,
                    price: 0,
                    errors: {},
                  })
                "
              >
                Qo`shish
              </button>
            </div>
          </div>
          <div class="contentbox">
            <div class="form-group">
              <label for="totalAmount">Jami narx</label>
              <input id="totalAmount" type="number" v-model="totalAmount" readonly placeholder="0" />
            </div>
            <div class="form-group">
              <label for="receivedAmount">Qabul qilingan summa</label>
              <input id="receivedAmount" type="number" v-model="magazine.money" @input="calculateRemaining" placeholder="Olingan summani kiriting" />
            </div>
            <div class="form-group">
              <label for="remainingAmount">Qoldiq</label>
              <input id="remainingAmount" type="number" v-model="remainingAmount" readonly placeholder="0" />
            </div>
          </div>
          <div class="modal-form" >
            <div class="form-group">
              <label for="paymentMethod">To`lov turi</label>
              <CustomSelect
                :options="payedMethods"
                id="paymentMethod"
                @input="selectPayedMethod($event)"
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
                @input="selectDelivery($event)"
                :selected="magazine?.deliveryId"
                :search="true"
                @blur="validateField('deliveryId')"
              />
              <p v-if="errors.deliveryId" class="error-text">
                {{ errors.deliveryId }}
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
            {{ isSubmitting ? "Sotilyapti..." : "Sotish" }}
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
      magazine: {
        deliveryId: "",
        paymentMethod: "",
        money: "",
        magazineId: "",
      },
      errors: {},
      isHideDeliveries: false,
      typeOfBreads: [],
      typeOfBreadIds: [{ id: 0, quantity: 0, breadId: "", errors: {} }],
      payedMethods: [
        { text: "Naxt", value: "Naxt" },
        { text: "Karta", value: "Karta" },
      ],
      allDelivery: [],
    };
  },
  props: {
    update: {
      type: Object,
    },
    Delivery: {
      type: Object,
    },
  },
  methods: {
    deleteRow(index) {
      if (this.typeOfBreadIds.length > 1) {
        this.typeOfBreadIds = this.typeOfBreadIds.filter(
          (item) => item.id !== index
        );
      }
    },
    calculateTotal() {
      this.totalAmount = this.typeOfBreadIds.reduce((sum, item) => {
        item.totalPrice = item.quantity * item.price;
        return sum + item.totalPrice;
      }, 0);
      this.calculateRemaining();
    },
    calculateRemaining() {
      this.remainingAmount = this.totalAmount - (this.magazine.money || 0);
    },
    selectPayedMethod(value) {
      this.magazine.paymentMethod = value;
    },
    selectDelivery(value) {
      this.magazine.deliveryId = value._id;
    },
    selectArray(value, index) {
      console.log(value);
      this.typeOfBreadIds = this.typeOfBreadIds.map((item) => {
        return item.id === index
          ? { ...item, breadId: value.id, price: value.bread.breadId.price }
          : item;
      });
    },
    getBreads() {
      api
        .get("/api/sellerBreads")
        .then(({ status, data }) => {
          if (status === 200) {
            this.typeOfBreads = data?.sellerBreads
              .map((item) => {
                return item.typeOfBreadId.map((i) => {
                  return {
                    text: i.breadId.title,
                    value: { bread: i, id: item._id },
                  };
                });
              })
              .flat(Infinity);
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
      if (field === "description" && !this.magazine.description.trim()) {
        this.errors.description =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
      if (field === "deliveryId" && !this.magazine.deliveryId.trim()) {
        this.errors.deliveryId =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
      if (field === "magazineId" && !this.magazine.magazineId.trim()) {
        this.errors.magazineId = "Foydalanuvchi do`kon bo'sh bo'lmasligi kerak";
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
      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
      api
        .post("/api/sellingBread", {
          ...this.magazine,
          typeOfBreadIds: this.typeOfBreadIds,
          deliveryId: this.magazine.deliveryId
            ? this.magazine.deliveryId
            : "delivery",
        })
        .then(({ status, data }) => {
          if (status === 201) {
            this.$emit("status", {
              message: "Sotildi",
              status: "success",
            });
            this.closeModal();
          }
        })
        .catch((error) => {
          console.error(error);
          this.toastOptions = {
            open: true,
            type: "error",
            text: "Xatolik yuzberdi",
          };
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
            this.allDelivery = data?.deliveries.map((item) => {
              return { text: item.username, value: item };
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getDeliveryBreads() {
      api
        .get("/api/orderWithDeliveries")
        .then(({ data, status }) => {
          if (status === 200) {
            this.typeOfBreads = data?.orderWithDeliveries
              .map((item) => {
                return item.typeOfBreadIds.map((i) => {
                  return {
                    text: i.breadId.title,
                    value: { bread: i, id: item._id },
                  };
                });
              })
              .flat(Infinity);
          }
        })
        .catch((error) => {
          console.error(error);
        });
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
        this.getDeliveries();
        this.getBreads();
        this.isHideDeliveries = true;
        break;
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
.contentbox{
  display: flex;
  gap: 10px;
}
.contentbox>.form-group{
  width: 33%;
}
.scroll{
  max-height: 400px;
}
form{
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.yemagan{
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
