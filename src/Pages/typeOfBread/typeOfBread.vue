<template>
  <div class="page">
    <div class="page-top d-flex a-center j-between">
      <h3>Non turlari</h3>
      <button class="create-button" @click="openModal = true">
        Non turini yaratish
      </button>
    </div>
    <div class="scroll page-bottom p-24">
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Nomi</th>
            <th>Narxi</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in allTypeOfBread" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data?.title ? data?.title : "" }}</td>
            <td>{{ data?.price ? data?.price : 0 }}</td>
            <td class="d-flex a-center j-end gap12">
              <Icons name="setting" title="sozlama" class="icon info setting" />
              <Icons name="deleted" title="o'chirish" class="icon danger" @click="deleteTypeOfBread(data?._id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <TypeOfBreadModalVue v-if="openModal" @close="handleClose" />
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import TypeOfBreadModalVue from "./typeOfBreadModal.vue";
import api from "@/Utils/axios";
export default {
  components: {
    TypeOfBreadModalVue,
    Icons,
  },
  data() {
    return {
      openModal: false,
      allTypeOfBread: [],
    };
  },
  methods: {
    handleClose() {
      this.openModal = false;
      this.getallTypeOfBread();
    },
    getallTypeOfBread() {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";

      api
        .get("/api/typeOfBreads", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.allTypeOfBread = data?.typeOfBreads;
          }
        });
    },
    deleteTypeOfBread(id) {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      api.delete("/api/typeOfBread/" + id, {
        headers: {
          authorization: token,
        },
      }).then(({status})=>{
        if(status === 200){
           this.getallTypeOfBread()
        }
      })
    },
  },
  mounted() {
    this.getallTypeOfBread();
  },
};
</script>

<style></style>