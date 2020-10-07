<template>
  <div
    class="globalfilters"
    style="background: white; z-index: 1000; overflow-x: auto;"
  >
    <a-row
      style="float: left; overflow-x: auto; width: calc(100% - 80px);"
      class="flex-row"
      type="flex"
      align="middle"
    >
      <a-col
        style="padding-left: 15px;"
        v-for="filter in filters"
        :key="filter.index"
      >
        <GlobalFilterDropdown @change="onChange" :name="filter.name" />
      </a-col>
    </a-row>
    <a-row
      style="float: right; margin-right: 10px; width: 70px;"
      class="flex-row"
      type="flex"
      align="middle"
    >
      <a-button @click="resetFilters()">Reset</a-button>
    </a-row>
  </div>
</template>

<script>
import FilterService from "@/services/FilterService.js";
import ErrorService from "@/services/ErrorService.js";
import DataService from "@/services/DataService.js";
import AdminService from "@/services/AdminService.js";
import GlobalFilterDropdown from "@/components/GlobalFilterDropdown.vue";
import moment from "moment";

const fakeFilterData = function () {
  return new Promise((resolve) => {
    DataService.getAllWidgets()
      .then((resp) => {
        const dat = [];
        resp.data.forEach((d) => {
          dat.push({ key: d.id, value: d.name });
        });
        resolve(dat);
      })
      .catch(() => {
        resolve([]);
      });
  });
};

const fakeFilterData2 = function () {
  return new Promise((resolve) => {
    AdminService.getAllUsers()
      .then((resp) => {
        const dat = [];
        resp.data.forEach((d) => {
          dat.push({ key: d.id, value: d.username });
        });
        resolve(dat);
      })
      .catch(() => {
        resolve([]);
      });
  });
};

const filterObj1 = {
  name: "test",
  group: "dropdown",
  type: "multiple",
  data: fakeFilterData,
  params: null,
  label: "Widgets",
};

const filterObj2 = {
  name: "test2",
  group: "dropdown",
  type: "single",
  data: fakeFilterData2,
  params: null,
  label: "Users",
};

const filterObj3 = {
  name: "test3",
  type: "text",
  group: "input",
  defaultValue: "",
  label: "Text Field",
};

const filterObj4 = {
  name: "test4",
  group: "dropdown",
  type: "single",
  data: [
    { key: "Option 1", value: "option1" },
    { key: "Option 2", value: "option2" },
    { key: "Option 3", value: "option3" },
  ],
  params: null,
  label: "Hardcoded Options",
};

const filterObj5 = {
  name: "start_date",
  type: "date",
  group: "date",
  data: null,
  defaultValue: moment(),
  date: {
    minDate: null,
    maxDate: moment(),
  },
  params: null,
  label: "Start Date",
};

export default {
  name: "GlobalFilters",
  props: {},
  components: {
    GlobalFilterDropdown,
  },
  created() {
    this.$cookies.set("filters", "");
    FilterService.addFilters([
      filterObj1,
      filterObj2,
      filterObj3,
      filterObj4,
      filterObj5,
    ])
      .then((resp) => {
        this.$store.dispatch("set_filters_loaded", true);
        this.filters = FilterService.getFilters();
      })
      .catch((e) => {
        ErrorService.errorHandler(500, "load filters");
      });
  },
  mounted() {},
  methods: {
    resetFilters() {
      FilterService.resetFilters();
      this.filters = FilterService.getFilters();
      FilterService.hideFilters();
    },
    onChange(val) {
      console.log("Filter Change");
      console.log(val);
      this.$cookies.set("filters", btoa(JSON.stringify(this.filters)));
    },
  },
  data() {
    return {
      filters: {},
      activeKey: ["1"],
      customStyle:
        "background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden",
    };
  },
};
</script>
