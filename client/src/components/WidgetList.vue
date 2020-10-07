<template>
  <div class="admin-summary">
    <h2>Widgets</h2>
    <div class="table-search-wrapper">
      <a-input placeholder="Search" v-model="searchFilter" />
    </div>
    <a-table :columns="columns" :dataSource="filteredData"> </a-table>
  </div>
</template>

<script>
import DataService from "@/services/DataService";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Organization",
    dataIndex: "organization",
    key: "organization"
  }
];

const data = [];
export default {
  name: "WidgetList",
  data() {
    return {
      data,
      columns,
      searchFilter: ""
    };
  },
  created() {
    this.getAllWidgets();
  },
  computed: {
    filteredData() {
      return this.data.filter(widget => {
        return (
          widget.name.toLowerCase().indexOf(this.searchFilter.toLowerCase()) >
            -1 ||
          widget.organization
            .toLowerCase()
            .indexOf(this.searchFilter.toLowerCase()) > -1
        );
      });
    }
  },
  methods: {
    getAllWidgets() {
      DataService.getAllWidgets().then(resp => {
        this.data = resp.data;
      });
    }
  }
};
</script>

<style lang="less"></style>
