<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Do`kondan pul olish</h2>

        <form>
          <div class="contentbox">
            <div class="form-group">
              <label for="receivedAmount">Qabul qilingan summa</label>
              <input
                id="receivedAmount"
                type="number"
                v-model="magazine.pending"
                placeholder="0"
                @blur="validateField('pending')"
              />
              <p v-if="errors.pending" class="error-text">
                {{ errors.pending }}
              </p>
            </div>
            <div class="form-group">
              <label for="comment">Tavsif</label>
              <input
                id="comment"
                type="text"
                v-model="magazine.comment"
                placeholder="Tavsif kiriting"
                @blur="validateField('comment')"
              />
              <p v-if="errors.comment" class="error-text">
                {{ errors.comment }}
              </p>
            </div>

            <div class="form-group">
              <label for="receivedAmount">Pul turi</label>
              <CustomSelect
                :options="types"
                @blur="validateField('type')"
                @input="selectType($event)"
              />
              <p v-if="errors.type" class="error-text">
                {{ errors.type }}
              </p>
            </div>
            <div class="form-group">
              <label for="price">Qoldiq qarz</label>
              <input
                id="price"
                type="number"
                v-model="totalPrice"
                placeholder="0"
                @blur="validateField('price')"
                readonly
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
            {{
              isSubmitting ? "Do`kodan pul olinyapti..." : "Do`kondan pul olish"
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
      errors: {},
      magazine: {
        pending: 0,
        price: 0,
        comment: "",
        magazineId: "",
      },
      types: [
        { text: "Naxt", value: "Naxt" },
        { text: "Karta", value: "Karta" },
      ],
    };
  },
  computed: {
    totalPrice() {
      return this.magazine.price + this.magazine.pending;
    },
  },
  props: {
    pending: {
      type: Object,
    },
  },
  methods: {
    selectType(type) {
      this.magazine.type = type;
    },
    closeModal() {
      this.$emit("close");
    },
    validateField(field) {
      this.errors[field] = "";
      if (
        field === "pending" &&
        (!this.magazine.pending ||
          isNaN(this.magazine.pending) ||
          this.magazine.pending <= 0)
      ) {
        this.errors.pending = "Olingan pul son bo‘lishi kerak";
      }

       if (field === "comment" && !this.magazine.comment?.trim()) {
        this.errors.comment =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
         if (field === "type" && !this.magazine.type?.trim()) {
        this.errors.type =
          "Foydalanuvchi descripyion bo'sh bo'lmasligi kerak";
      }
      
    },
    submitForm() {
      this.errors = {};
      this.validateField("pending");
      this.validateField("comment");
      this.validateField("type");
      for (const error in this.errors) {
        if (this.errors[error] !== "") {
          return;
        }
      }
      this.isSubmitting = true;
      api
        .post("/api/magazine/pending", {
          pending: this.magazine.pending,
          comment: this.magazine.comment,
          magazineId: this.magazine.magazineId,
          type: this.magazine.type,
        })
        .then(({ status }) => {
          if (status === 200) {
            this.$emit("status", {
              status: "success",
              message: "Qarz dorlik yangilandi",
            });
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
  },
  mounted() {
    this.magazine.magazineId = this?.pending?.id;
    this.magazine.price = this?.pending?.pending;
  },
};
</script>

<style scoped>
.contentbox {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
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
