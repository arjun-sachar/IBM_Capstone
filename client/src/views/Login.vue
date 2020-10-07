<template>
  <div class="login vibrant-background">
    <a-row
      style="height:100vh"
      type="flex"
      justify="space-around"
      align="middle"
    >
      <a-col :span="9">
        <a-form @submit="loginUser" class="white-form">
          <div style="margin:10px">
            <a-row>
              <img style="height:80px" src="../images/ibm_logo_black.png" />
            </a-row>
            <a-row type="flex" justify="center" align="middle">
              <h1 style="margin:0px;">{{ clientName }}</h1>
            </a-row>
            <div style="font-size:16px;color:gray">{{ tagLine }}</div>
          </div>
          <div v-if="loginError" class="form-error-message">
            {{ loginError }}
          </div>
          <a-form-item
            label="Email"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 19 }"
            fieldDecoratorId="email"
            :fieldDecoratorOptions="{
              rules: [{ required: true, message: 'Please input your email.' }]
            }"
          >
            <a-input v-model="email" />
          </a-form-item>
          <a-form-item
            label="Password"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 19 }"
            fieldDecoratorId="password"
            :fieldDecoratorOptions="{
              rules: [
                { required: true, message: 'Please input your password.' }
              ]
            }"
          >
            <a-input v-model="password" type="password" />
          </a-form-item>
          <a-form-item class="thin-form-item" :wrapperCol="{ span: 24 }">
            <pre class="form-hint">
Hint: Default email and password is <strong>admin@ibm.com</strong>/<em>ibm_admin123</em> </pre
            >
          </a-form-item>
          <a-form-item
            class="thin-form-item"
            :wrapperCol="{ span: 12, offset: 6 }"
          >
            <a-button size="large" type="primary" htmlType="submit">
              Login
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ActivityService from "@/services/ActivityService";
export default {
  name: "home",
  data() {
    return {
      email: "",
      password: "",
      loginError: null,
      clientName: "Dashblocks",
      tagLine: "Application Starterpack"
    };
  },
  mounted() {
    if (this.$route.params.nextUrl) {
      this.$notify({
        group: "global",
        title: "Restricted Page",
        text: "You must be logged in to view that page."
      });
    }
  },
  methods: {
    loginUser: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      this.$store
        .dispatch("login", {
          creds: {
            email: this.email,
            password: this.password
          },
          redirectPath: this.$route.params.nextUrl || "/"
        })
        .then(() => {
          this.loginError = false;
          ActivityService("login");
        })
        .catch(err => {
          this.loginError = err;
        });
    }
  }
};
</script>

<style lang="less"></style>
