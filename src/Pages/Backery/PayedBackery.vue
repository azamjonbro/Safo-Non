<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="closeModal()">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal()" />
        <h2>Tolov qilish</h2>
        <form>
          <div class="modal-form">
            <div class="form-group">
              <label for="price">To`lov</label>
              <input
                type="text"
                id="price"
                v-model="bakcery.price"
                placeholder="To`lov summasini kiriting"
                maxlength="10"
                @input="applyMask"
                @blur="validateField('price')"
              />
              <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
            </div>

            <div class="form-group">
              <label for="statusId">To`lov holati</label>
              <CustomSelectVue
                :placeholder="'To`lov holatini tanlang'"
                id="statusId"
                @input="sellectPayedState($event)"
                :options="payedStatus"
                @blur="validateField('statusId')"
                :search="true"
              />
              <p v-if="errors.statusId" class="error-text">
                {{ errors.statusId }}
              </p>
            </div>

            <div class="form-group relative">
              <label for="typeId">To`lov turi</label>
              <CustomSelectVue
                :placeholder="'To`lov turini tanlang'"
                id="typeId"
                @input="sellectPayedType($event)"
                :options="payedType"
                @blur="validateField('typeId')"
                :search="true"
              />
              <p v-if="errors.typeId" class="error-text">{{ errors.typeId }}</p>
            </div>
            <div class="form-group">
              <label for="comment">Tavsif</label>
              <input
                type="text"
                id="comment"
                v-model="bakcery.comment"
                placeholder="Tavsifini kiriting"
                maxlength="10"
                @blur="validateField('comment')"
              />
              <p v-if="errors.comment" class="error-text">
                {{ errors.comment }}
              </p>
            </div>
          </div>
        </form>
        <div class="modal-buttons d-flex j-end a-center gap24">
          <button type="button" class="action-button" @click="closeModal">
            Chiqish
          </button>

          <button
            type="button"
            @click="submitForm()"
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
import CustomSelectVue from "@/components/Template/customSelect.vue";

export default {
  components: {
    Icons,
    CustomSelectVue,
  },
  props: {
    selectedItemPayed: String,
  },
  data() {
    return {
      bakcery: {
        type: "",
        price: "",
        status: "",
        comment: "",
      },
      errors: {},
      isSubmitting: false,

      payedStatus: [
        { text: "To'landi", value: "To'landi" },
        { text: "To'lanmadi", value: "To'lanmadi" },
      ],
      payedType: [
        { text: "Bonus", value: "Bonus" },
        { text: "Shtraf", value: "Shtraf" },
        { text: "Kunlik", value: "Kunlik" },
        { text: "Avans", value: "Avans" },
      ],
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    sellectPayedState(id) {
      this.bakcery.status = id;
    },
    sellectPayedType(id) {
      this.bakcery.type = id;
    },
    applyMask(event) {
      let value = event.target?.value.replace(/\D/g, "");
      this.bakcery.price = value;
    },
    validateField(field) {
      this.errors[field] = "";

      if (field === "price") {
        if (!this.bakcery.price) {
          this.errors.price = "Iltimos, summa kiriting";
        } else if (!/^\d+$/.test(this.bakcery.price)) {
          this.errors.price = "Faqat raqamlar kiritilishi mumkin";
        }
      }
      if (field === "typeId" && !this.bakcery.type) {
        this.errors.typeId = "To`lov turi bo'sh bo'lmasligi kerak";
      }
      if (field === "statusId" && !this.bakcery.status) {
        this.errors.statusId = "To`lov holati bo'sh bo'lmasligi kerak";
      }
      if (field === "comment" && !this.bakcery.comment) {
        this.errors.comment = "Tavsif  bo'sh bo'lmasligi kerak";
      }
    },
    async submitForm() {
      this.errors = {};
      this.validateField("price");
      this.validateField("typeId");
      this.validateField("statusId");

      if (Object.keys(!this.errors).length) {
        return;
      }

      this.isSubmitting = true;

      await api
        .post("/api/sellerPayed", this.bakcery)
        .then(({ status }) => {
          if (status === 201) {
            this.$emit("status", {
              status: "success",
              message: "To'lov muvaffaqiyatli amalga oshirildi",
            });
            this.closeModal();
          } else {
            this.$emit("status", {
              status: "error",
              message: "To'lov amalga oshirishda xatolik yuz berdi",
            });
          }
        })
        .catch((error) => {
          console.error(error);
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
    this.bakcery.sellerId = this?.selectedItemPayed;
  },
};
</script>

<style>
.error-text {
  color: red;
  font-size: 12px;
}
</style>
