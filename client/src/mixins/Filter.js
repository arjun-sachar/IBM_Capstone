import _ from "lodash";
import FilterService from "@/services/FilterService";

export default {
  data() {
    return {
      filters: FilterService.getFilters(),
    };
  },
  computed: {
    computedFilters() {
      return _.cloneDeep(this.filters);
    },
  },
  watch: {
    computedFilters: {
      deep: true,
      handler: function (newVal, oldVal) {
        console.log(newVal);
        console.log(oldVal);
        const changed = FilterService.changedFilters(newVal, oldVal);
        if (changed.length > 0) {
          console.log("this.onFilterChange");
          console.log(this.onFilterChange);
          if (this.onFilterChange) {
            this.onFilterChange(changed);
          }
        }
      },
    },
  },
};
