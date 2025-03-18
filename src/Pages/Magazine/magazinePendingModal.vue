<template>
  <transition name="slide-modal">
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-content relative">
        <Icons name="xIcon" class="xIcon" @click="closeModal" />
        <h2>Pending</h2>

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
            {{ isSubmitting ? "Yangilanyapti..." : "Yangilash" }}
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
      },
    };
  },
  props: {
    pending: {
      type: Object,
    },
  },
  methods: {
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
        .put("/api/magazinePending/" + this.pending.id, {
          pending: this.magazine.pending,
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
    this.magazine.id = this?.pending?.id;
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
