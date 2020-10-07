<template>
  <div class="hello-world">
    <h1>{{ msg }}</h1>
    <span>{{ timeSpent }} seconds spent on this page</span>
  </div>
</template>

<script>
import DataService from "@/services/DataService";
import AdminService from "@/services/AdminService";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      people: [],
      timeSpent: 0
    };
  },
  created() {
    this.loadData();

    this.timeSpentInterval = setInterval(this.incTimeSpent, 1000);
  },
  destroyed() {
    clearInterval(this.timeSpentInterval);
  },
  methods: {
    loadData() {
      AdminService.getAllUsers().then(data => {
        this.people = data.data;
      });
    },
    incTimeSpent() {
      this.timeSpent += 1;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
