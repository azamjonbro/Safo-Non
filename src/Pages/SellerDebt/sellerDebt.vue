<template>
  <div class="page d-flex column gap24">
    <div class="page-top d-flex a-center j-between">
      <h3>Chiqimlar</h3>
      <button class="create-button" @click="createModalVisible = true">
        Chiqimlar yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
        <div class="table">
            <div class="table-header">
                <div class="row">
                    <div class="cell">№</div>
                    <div class="cell">Ismi</div>
                    <div class="cell">R</div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      createModalVisible: false,
    };
  },
};
</script>

<style>
</style>