<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Non sotish</h2>
        <form>
          <div class="modal-form">
            <!-- <div class="form-group">
              <label for="quantity">Soni (Dona)</label>
              <input
                id="quantity"
                type="number"
                placeholder="Yetkazuvchini ismini kiriting"
                v-model="magazine.quantity"
                @blur="validateField('quantity')"
              />
              <p v-if="errors.quantity" class="error-text">
                {{ errors.quantity }}
              </p>
            </div>
      -->
            <div class="form-group" v-if="isHideDeliveries">
              <label for="delivery">To`lov turi</label>
              <CustomSelect
                :options="payedMethods"
                id="delivery"
                @input="selectPayedMethod($event)"
                :selected="magazine.payedMethod"
                :search="true"
                @blur="validateField('payedMethods')"
              />
              <p v-if="errors.deliveryId" class="error-text">
                {{ errors.deliveryId }}
              </p>
            </div>
            <div class="form-group" v-if="isHideDeliveries">
              <label for="delivery">Yetkazuvchi</label>
              <CustomSelect
                :options="deliveries"
                id="delivery"
                @input="selectDelivery($event)"
                :selected="magazine.deliveryId"
                :search="true"
                @blur="validateField('deliveryId')"
              />
              <p v-if="errors.deliveryId" class="error-text">
                {{ errors.deliveryId }}
              </p>
            </div>
          </div>
        </form>
        <form class="scroll" style="height: 50%">
          <div
            class="modal-form-2"
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
            <div style="display: flex; align-items: end" class="gap12">
              <div class="form-group" style="width: 95%">
                <label for="quantity">Soni (Dona)</label>
                <input
                  id="quantity"
                  type="number"
                  placeholder="Rasxod sonini kiriting"
                  v-model="data.quantity"
                  @blur="validateField('quantity')"
                />
                <p v-if="data?.errors.quantity" class="error-text">
                  {{ data?.errors.quantity }}
                </p>
              </div>
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
        payedMethod: "",
      },
      errors: {},
      isUpdate: false,
      isHideDeliveries: false,
      typeOfBreads: [],
      typeOfBreadIds: [{ id: 0, quantity: 0, breadId: "", errors: {} }],
      payedMethods: [
        { text: "Naxt", value: "Naxt" },
        { text: "Karta", value: "Karta" },
      ],
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
    selectPayedMethod(value) {
      this.magazine.payedMethod = value;
    },
    selectArray(value, index) {
      this.typeOfBreadIds = this.typeOfBreadIds.map((item) => {
        return item.id === index
          ? { ...item, breadId: value._id, price: value.price }
          : item;
      });
    },
    getBreads() {
      api
        .get("/api/typeOfBreads")
        .then(({ status, data }) => {
          if (status === 200) {
            this.typeOfBreads = data?.typeOfBreads.map((item) => {
              return { text: item.title, value: item };
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    closeModal() {
      this.$emit("close");
      this.isUpdate = false;
    },
    validateField(field) {
      this.errors[field] = "";
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
    },
    submitForm() {
      this.errors = {};
      this.validateField("quantity");
      this.validateField("description");
      this.validateField("deliveryId");
      this.validateField("magazineId");
      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
    },
  },
  mounted() {
    this.getBreads();
    const role = JSON.parse(localStorage.getItem("user"))?.role;
    if (role !== "delivery") {
      this.getDeliveries();
      this.isHideDeliveries = false;
    } else {
      this.isHideDeliveries = true;
    }
    if (this.Delivery?.isActive) {
      this.magazine.deliveryId = this.Delivery?.id;
    }
  },
};
</script>

<style scoped>
.modal-form-2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 10px;
}
</style>