<template>
  <div class="page">
    <div class="d-flex a-center j-between">
      <h3>Magazinlar</h3>
      <button class="create-button" @click="openModal = true">
        Do`kon yaratish
      </button>
    </div>
    <div class="scroll pt-24 page-bottom">
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Nomi</th>
            <th>telefon raqami</th>
            <th>address</th>
            <th>pending</th>
            <th>remainprice</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in allMagazine" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data?.title ? data?.title : "" }}</td>
            <td>{{ data?.phone ? data?.phone : "" }}</td>
            <td>{{ data?.address ? data?.address : "" }}</td>
            <td>{{ data?.pending ? data?.pending : "" }}</td>
            <td>{{ data?.remainprice ? data?.remainprice : "" }}</td>
            <td class="d-flex a-center j-end gap12">
              <Icons name="setting" title="sozlama" class="icon info setting" />
              <Icons
                name="deleted"
                title="o'chirish"
                class="icon danger"
                @click="deleteMagzine(data?._id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <MagazineModalVue v-if="openModal" @click="handleClose" />
</template>

<script>
import Icons from "@/components/Template/Icons.vue";
import api from "@/Utils/axios";
import MagazineModalVue from "./magazineModal.vue";
export default {
  components: {
    Icons,
    MagazineModalVue,
  },
  data() {
    return {
      openModal: false,
      allMagazine: [],
    };
  },
  methods: {
    handleClose() {
      this.openModal = false;
      this.getMagazine();
    },
    getMagazine() {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";

      api
        .get("/api/magazines", {
          headers: {
            authorization: token,
          },
        })
        .then(({ data, status }) => {
          if (status === 200) {
            this.allMagazine = data?.magazines;
            console.log(data.magazines);
          }
        });
    },
    deleteMagzine(id) {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))?.accessToken
        : "";
      api
        .delete("/api/magazine/" + id, {
          headers: {
            authorization: token,
          },
        })
        .then(({ status }) => {
          if (status === 200) {
            this.getMagazine();
          }
        });
    },
  },
  mounted() {
    this.getMagazine();
  },
};
</script>

<style>
</style>