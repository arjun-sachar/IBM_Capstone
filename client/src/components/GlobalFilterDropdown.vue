<template>
  <div style="display: flex;">
    <a-button
      :type="filter.show ? 'primary' : 'default'"
      class="global-dropdown-button"
      @click="toggleFilter()"
    >
      <span
        :style="{
          fontWeight: filterChanged ? 'bold' : '500',
        }"
      >
        {{ filter.label }}
      </span>
    </a-button>

    <a-select
      v-if="filter.group == 'dropdown' && filter.show"
      style="min-width: 200px; max-width: 500px;"
      :mode="filter.type"
      :maxTagCount="filter.maxCount"
      @change="updateSelected"
      placeholder="Select an option"
      v-model="filter.selected"
    >
      <a-select-option
        v-if="filter.all"
        class="global-filter-all"
        key="all"
        value="all"
        >All</a-select-option
      >
      <a-select-option
        v-for="value in filter.values"
        :key="value.key"
        :value="value.key"
        >{{ value.value }}</a-select-option
      >
    </a-select>
    <a-input
      v-if="filter.group == 'input' && filter.show"
      style="min-width: 200px; max-width: 500px;"
      :maxTagCount="filter.maxCount"
      @change="(e) => updateSelected(e.target.value)"
      placeholder="Filter by value..."
      :type="filter.type"
      v-model="filter.selected"
    />
    <a-date-picker
      v-if="filter.group == 'date' && filter.type == 'date' && filter.show"
      :disabledDate="filter.data"
      @change="updateSelected"
      :defaultValue="filter.selected"
      v-model="filter.selected"
    />
    <a-month-picker
      v-if="filter.group == 'date' && filter.type == 'month' && filter.show"
      :disabledDate="filter.data"
      @change="updateSelected"
      v-model="filter.selected"
    />
    <a-week-picker
      v-if="filter.group == 'date' && filter.type == 'week' && filter.show"
      :disabledDate="filter.data"
      @change="updateSelected"
      v-model="filter.selected"
    />
  </div>
</template>

<script>
import DataService from "@/services/DataService";
import FilterService from "@/services/FilterService.js";

export default {
  name: "GlobalFilterDropdown",
  props: {
    name: { type: String, required: true },
  },
  data() {
    return {
      filter: FilterService.getFilter(this.name),
    };
  },
  created() {},
  methods: {
    toggleFilter() {
      FilterService.hideFilters(this.filter.name);
      this.filter.show = !this.filter.show;
    },
    updateSelected(value) {
      if (this.filter.group === "dropdown" && this.filter.type == "multiple") {
        if (
          (value.indexOf("all") == -1 &&
            value.length == this.filter.values.length) ||
          value.length == 0
        ) {
          this.filter.selected = "all";
        } else if (
          value[value.length - 1] != "all" &&
          value.indexOf("all") >= 0
        ) {
          this.filter.selected = value.filter(function (val) {
            return val != "all";
          });
        } else if (value[value.length - 1] == "all") {
          this.filter.selected = ["all"];
        }
      } else {
        this.filter.selected = value;
        this.filter.defaultValue = value;
      }
    },
  },
  computed: {
    filterChanged() {
      return (
        JSON.stringify(this.filter.selected) !=
        JSON.stringify(this.filter._originalSelected)
      );
    },
  },
  watch: {
    filter: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.$emit("change", newVal);
      },
    },
  },
};
</script>
