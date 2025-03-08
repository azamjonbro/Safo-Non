<template>
  <div class="custom-multiselect">
    <!-- Multiselect's input box -->
    <div class="select-box" @click="toggleDropdown">
      <span v-if="!selectedOptions.length" class="selected-options"
        >Выберите специалиста</span
      >
      <span v-else class="selected-options">{{
        selectedOptions.map((option) => option?.title).join(", ")
      }}</span>
      <span class="arrow-down" @click="toggleDropdown">
        <Icons
          :name="!isOpen ? 'bottomArrow' : 'topArrow'"
          @click="toggleDropdown"
        />
      </span>
    </div>
    <div class="options-box" v-if="isOpen">
      <div
        v-for="option in options"
        :key="option._id"
        :class="['option', { selected: isSelected(option) }]"
        @click="toggleOption(option)"
      >
        {{ option?.title }}
      </div>
    </div>
  </div>
</template>

<script>
import Icons from "./Icons.vue";
import api from "@/Utils/axios";

export default {
  name: "CustomMultiselect",
  components: {
    Icons,
  },
  props: {
    activeWorker: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      isOpen: false,
      selectedOptions: [],
      options: [],
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    toggleOption(option) {
      const index = this.selectedOptions.findIndex(
        (selected) => selected._id === option._id
      );
      if (index === -1) {
        this.selectedOptions.push(option);
      } else {
        this.selectedOptions.splice(index, 1);
      }
      const selectedIds = this.selectedOptions.map((option) => option._id);
      this.$emit("input", selectedIds);
    },
    isSelected(option) {
      return this.selectedOptions.some(
        (selected) => selected._id === option._id
      );
    },
    closeDropdown(e) {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    },
    async getWorkers() {
      await api.get("/api/typeOfBreads").then(({ status, data }) => {
        if (status === 200) {
          this.options = data.typeOfBreads;
          this.preselectOptions();
        }
      });
    },

    preselectOptions() {
      if (this.activeWorker?.length) {
        this.activeWorker?.forEach((workerId) => {
          let matchedOption = this.options.find(
            (option) => option._id === workerId
          );
          if (matchedOption) {
            this.selectedOptions.push(matchedOption);
          }
        });
        const selectedIds = this.selectedOptions.map((option) => option._id);

        this.$emit("input", selectedIds);
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.closeDropdown);
    this.getWorkers();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdown);
  },
};
</script>

<style scoped>
.custom-multiselect {
  position: relative;
  width: 100%;
}

.select-box {
  border: 1px solid #ccc;
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
}

.arrow-down {
  margin-left: 10px;
}

.options-box {
  position: absolute;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 5px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: 4px;
  box-shadow: 0px 0px 4px gray;
}

.option {
  font-size: 12px;
  padding: 10px;
  cursor: pointer;
}

.option.selected {
  background-color: #007bff;
  color: white;
}

.selected-options {
  font-size: 12px;
}
</style>
