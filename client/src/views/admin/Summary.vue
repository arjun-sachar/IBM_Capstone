<template>
  <div class="admin-summary">
    <h2>Activity</h2>
    <a-row justify="center" type="flex">
      <a-col :lg="12">
        <div class="admin-chart">
          <LineChart
            :loading="uniqueLoginData.length == 0"
            :layout="uniqueLoginLayout"
            :data="uniqueLoginData"
          ></LineChart>
        </div>
      </a-col>
      <a-col :lg="12">
        <div class="admin-chart">
          <LineChart
            :loading="loginData.length == 0"
            :layout="loginLayout"
            :data="loginData"
          ></LineChart>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import LineChart from "@/components/charts/LineChart.vue";
import AdminService from "@/services/AdminService";

export default {
  data() {
    return {
      uniqueLoginData: [],
      loginData: []
    };
  },
  components: {
    LineChart
  },
  created() {
    this.getLogins();
    this.getUniqueLogins();
  },
  methods: {
    getLogins() {
      AdminService.getLoginCount(false).then(resp => {
        this.$set(this.loginData, 0, resp.data[0]);
      });
    },
    getUniqueLogins() {
      AdminService.getLoginCount(true).then(resp => {
        this.$set(this.uniqueLoginData, 0, resp.data[0]);
      });
    }
  },
  computed: {
    loginCount: function() {
      if (this.loginData.length == 0) {
        return 0;
      }
      return this.loginData
        .flat()
        .map(obj => {
          return obj.y;
        })
        .flat()
        .reduce((a, b) => {
          return a + b;
        });
    },
    uniqueLoginCount: function() {
      if (this.uniqueLoginData.length == 0) {
        return 0;
      }
      return this.uniqueLoginData
        .flat()
        .map(obj => {
          return obj.y;
        })
        .flat()
        .reduce((a, b) => {
          return a + b;
        });
    },
    loginLayout: function() {
      return {
        title: "Total Logins Per Day (" + this.loginCount + ")"
      };
    },
    uniqueLoginLayout: function() {
      return {
        title: "Unique Logins Per Day (" + this.uniqueLoginCount + ")"
      };
    }
  }
};
</script>

<style lang="less">
.admin-chart {
  height: 0;
  min-height: 400px;
}
</style>
