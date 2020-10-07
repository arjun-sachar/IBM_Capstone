<template>
  <a-layout-header :key="currentRoute" class="header">
    <a class="logo" href="/">
      <img alt="IBM" src="../images/ibm_logo_white.png" />
    </a>
    <a-menu mode="horizontal" class="header-menu">
      <a-menu-item v-if="showAlerts" key="alerts">
        <a-badge :offset="[0, 0]" :count="$store.state.alerts.length">
          <a-button
            class="center-icon"
            @click="set_show_alerts(!$store.state.showAlerts)"
            shape="circle"
            icon="bell"
          ></a-button>
        </a-badge>
      </a-menu-item>
      <a-dropdown>
        <a class="ant-dropdown-link" href="#">
          <a-button
            shape="circle"
            class="header-dropdown-button"
            icon="user"
          ></a-button>
        </a>
        <a-menu slot="overlay">
          <a-menu-item v-if="$store.state.loggedIn">
            <a href="javascript:;">Profile</a>
          </a-menu-item>
          <a-menu-item v-if="$store.state.loggedIn && showUploads">
            <router-link to="/upload">Upload</router-link>
          </a-menu-item>
          <a-menu-item v-if="$store.state.loggedIn">
            <router-link to="/feedback">Feedback</router-link>
          </a-menu-item>
          <a-menu-item v-if="$store.state.loggedIn && $store.state.isAdmin">
            <router-link to="/admin">Admin</router-link>
          </a-menu-item>
          <a-menu-item v-if="$store.state.loggedIn">
            <a @click="logout" href="#">Logout</a>
          </a-menu-item>
          <a-menu-item v-if="!$store.state.loggedIn">
            <router-link to="/login">Login</router-link>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-menu>
  </a-layout-header>
</template>

<script>
import { mapActions } from "vuex";
import config from "@/configs/ui-config.js";

console.log("ALETS", config);
export default {
  name: "Header",
  props: {
    currentRoute: String
  },
  data() {
    return {
      showAlerts: config["showAlerts"],
      showUploads: config["showUploads"]
    };
  },
  methods: {
    ...mapActions(["logout"]),
    ...mapActions(["set_show_alerts"])
  }
};
</script>
