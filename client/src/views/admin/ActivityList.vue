<template>
  <div style="height:100%;width:100%" class="admin-summary">
    <h2>Activity</h2>
    <a-row justify="center" type="flex">
      <a-col :span="24">
        <a-table :columns="columns" :dataSource="activities"> </a-table>
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
      loginData: [],
      activities: null,
      columns: [
        {
          title: "Id",
          dataIndex: "id",
          key: "id"
        },
        {
          title: "Activity",
          dataIndex: "name",
          key: "activity"
        },

        {
          title: "Name",
          dataIndex: "user.username",
          key: "username"
        },
        {
          title: "Email",
          dataIndex: "user.email",
          key: "email"
        },
        {
          title: "Date",
          dataIndex: "date",
          key: "date"
        }
      ]
    };
  },
  components: {
    LineChart
  },
  created() {
    this.getLogins();
    this.getUniqueLogins();
    this.getActivities();
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
    },
    getActivities() {
      AdminService.getAllActivities().then(resp => {
        console.log("this is activity resp", resp);
        this.activities = resp.data;
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
