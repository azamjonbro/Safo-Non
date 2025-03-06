<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content relative">
      <Icons name="xIcon" class="xIcon" @click="$emit('close')" />
      <h3>Chiqimlar yaratish</h3>

      <div class="modal-buttons d-flex j-end a-center gap24">
        <button type="button" class="action-button" @click="$emit('close')">
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
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
export default {
  components: {
    Icons,
  },
  data() {
    return {
      isSubmitting: false,
      isUpdate: false,
    };
  },
};
</script>

<style>
</style>