<template>
  <div class="admin-summary">
    <h2>API Explorer</h2>

    <h3>
      <a target="_blank" :href="explorerUrl">{{ explorerUrl }}</a>
    </h3>
    <h3>
      Your access token: <strong>{{ accessToken }}</strong>
    </h3>
  </div>
</template>

<script>
import api from "@/configs/api";

const data = [];
export default {
  name: "Explorer",
  data() {
    return {
      baseUrl: api.base_url,
      accessToken: localStorage.getItem("user-token")
    };
  },
  computed: {
    explorerUrl: function() {
      return this.baseUrl.replace("/api", "/explorer");
    }
  }
};
</script>

<style lang="less"></style>
