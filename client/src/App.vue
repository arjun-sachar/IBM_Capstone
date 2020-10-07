<template>
  <div id="app" style="overflow:hidden !important">
    <notifications group="global" position="top left" />
    <a-layout id="main-app-layout">
      <Header v-if="$store.state.loggedIn" />
      <a-layout>
        <NavBar
          v-if="$store.state.loggedIn && direction != 'none'"
          :direction="direction"
          :currentRoute="currentRoute"
        ></NavBar>
        <div
          :class="{
            'left-navbar': direction == 'left' && $store.state.loggedIn
          }"
          class="main-content"
        >
          <transition name="slide-fade">
            <Alerts v-show="$store.state.showAlerts"></Alerts>
          </transition>
          <GlobalFilters v-if="showGlobalFilters()"></GlobalFilters>
          <a-layout-content
            style="overflow:auto; margin: 0;"
            :class="{
              'main-content-two-bar':
                direction == 'top' && globalFilters && $store.state.loggedIn,
              'main-content-one-bar':
                ((direction == 'left' || direction == 'none') &&
                  globalFilters &&
                  $store.state.loggedIn) ||
                (direction == 'top' && !globalFilters && $store.state.loggedIn),
              'main-content-no-bar':
                (direction == 'left' || direction == 'none') &&
                !globalFilters &&
                $store.state.loggedIn,
              alerts: $store.state.showAlerts
            }"
          >
            <div
              :class="{
                'router-two-bar':
                  direction == 'top' && globalFilters && $store.state.loggedIn,
                'router-one-bar':
                  ((direction == 'left' || direction == 'none') &&
                    globalFilters &&
                    $store.state.loggedIn) ||
                  (direction == 'top' &&
                    !globalFilters &&
                    $store.state.loggedIn),
                'router-no-bar':
                  (direction == 'left' || direction == 'none') &&
                  !globalFilters &&
                  $store.state.loggedIn
              }"
            >
              <router-view
                v-if="$store.state.filtersLoaded || !$store.state.loggedIn"
              />
              <a-icon
                style="font-size: 100px; padding-top: 10%;"
                v-if="!$store.state.filtersLoaded && $store.state.loggedIn"
                type="loading"
              />
            </div>
          </a-layout-content>
        </div>
      </a-layout>
    </a-layout>

    <a-modal
      :cancelButtonProps="{ style: { display: 'none' } }"
      class="resetPasswordModal"
      @ok="handleTempPasswordUpdate()"
      :closable="false"
      :maskClosable="false"
      :width="750"
      title="Reset Password"
      :visible="checkTemppass()"
    >
      <a-alert
        v-if="message && message.length > 1"
        type="error"
        :message="message"
        banner
      />
      <a-form>
        <a-form-item
          label="Password"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="password"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a password!' }]
          }"
        >
          <a-input
            type="password"
            :key="`${selectedUser.id}password`"
            v-model="newPassword"
          />
        </a-form-item>
        <a-form-item
          label="Confirm"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="password"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a password!' }]
          }"
        >
          <a-input
            type="password"
            :key="`${selectedUser.id}password`"
            v-model="confirmPassword"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :cancelButtonProps="{ style: { display: 'none' } }"
      @ok="handleSystemAlertModal"
      :width="750"
      :title="alertModal ? alertModal.title : 'hi'"
      :visible="showSystemAlertModal == true"
    >
      <div v-html="alertModal ? alertModal.content : ''"></div>
    </a-modal>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import store from "@/store";
import FilterService from "@/services/FilterService.js";
import GlobalFilters from "./components/GlobalFilters.vue";
import Alerts from "./components/Alerts.vue";
import AdminService from "@/services/AdminService";
import ErrorService from "@/services/ErrorService.js";
import config from "@/configs/ui-config.js";

export default {
  name: "app",
  components: {
    NavBar,
    Header,
    GlobalFilters,
    Alerts
  },
  methods: {
    handleTempPasswordUpdate() {
      if (
        this.newPassword &&
        this.newPassword.length > 2 &&
        this.newPassword == this.confirmPassword
      ) {
        AdminService.resetPassword(this.newPassword)
          .then(resp => {
            this.message = "";
            this.updateTempPassProperty();
          })
          .catch(err => {
            ErrorService.errorHandler(
              err["response"]["status"],
              "update password"
            );
            this.clearForm();
          });
      } else {
        if (!this.newPassword || this.newPassword.length < 2) {
          this.message = "New password is not valid";
        } else if (this.newPassword != this.confirmPassword) {
          this.message = "Passwords do not match";
        }
      }
    },
    clearForm() {
      this.newPassword = null;
      this.confirmPassword = null;
    },
    checkTemppass() {
      if (this.$store.state.currentUser != null) {
        this.selectedUser = this.$store.state.currentUser;
        return this.$store.state.currentUser.temp_pass === true;
      }
      return false;
    },
    updateTempPassProperty() {
      AdminService.patchUser(this.selectedUser.id, { temp_pass: false })
        .then(resp => {
          this.message = "";
          // Set temp_pass val locally
          this.clearForm();
          this.$store.dispatch("update_temp_pass", false);
        })
        .catch(err => {
          ErrorService.errorHandler(
            err["response"]["status"],
            "update temp pass"
          );
        });
    },
    handleSystemAlertModal() {
      this.showSystemAlertModal = false;
      this.alertModal.status = false;
      this.alertModal = null;
    },
    showGlobalFilters() {
      return (
        this.$store.state.loggedIn &&
        this.globalFilters == true &&
        this.currentRoute != "admin"
      );
    }
  },
  created() {
    this.$store.dispatch("set_filters_loaded", !this.globalFilters);
  },
  data() {
    return {
      currentRoute: this.$route.name || "",
      direction: config["navBar"],
      globalFilters: config["globalFilters"],
      newPassword: "",
      confirmPassword: "",
      selectedUser: "",
      message: "",
      alertModal: null,
      showSystemAlertModal: false
    };
  },
  watch: {
    // This is needed because the component is sometimes
    // rendered before the route object is generated
    "$route.name": function(newRoute, oldRoute) {
      this.currentRoute = newRoute;
      const filteredAlerts = this.$store.state.systemAlerts.filter(alert => {
        return alert.status == true && alert.page == this.currentRoute;
      });
      if (filteredAlerts.length >= 1) {
        this.alertModal = filteredAlerts[0];
        this.showSystemAlertModal = true;
      }
    }
  }
};
</script>

<style lang="less">
.main-content {
  width: 100%;
}
</style>
