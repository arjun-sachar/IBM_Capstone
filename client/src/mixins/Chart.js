import * as deepmerge from "deepmerge";
import { mixins } from "vue-chartjs";

export default {
  mixins: [mixins.reactiveProp],
  data() {
    return {
      defaultBaseOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      defaultOptions: {},
      data: null,
    };
  },
  props: {
    datasets: {
      type: Array,
      default: function () {
        return [];
      },
    },
    labels: {
      type: Array,
      default: function () {
        return [];
      },
    },
    layout: {
      type: Array,
      default: function () {
        return [];
      },
    },
    chartData: {
      type: Object,
      default: function () {
        return null;
      },
    },
    options: {
      type: Object,
      default: function () {
        return {
          position: "relative",
          height: "100%",
        };
      },
    },
  },
  computed: {
    mergedOptions() {
      const mergedOptions = deepmerge.all([
        this.options,
        this.defaultOptions,
        this.defaultBaseOptions,
      ]);
      console.log("mergedOptions");
      console.log(mergedOptions);
      return mergedOptions;
    },
  },
  methods: {
    updateData() {
      const data = { labels: this.labels, datasets: [] };
      if (this.layout.length > 0) {
        this.datasets.forEach((dat, ind) => {
          const obj = deepmerge({}, this.layout[ind] || {});
          obj["data"] = dat;
          data["datasets"].push(obj);
        });
      } else {
        data["datasets"] = this.datasets;
      }
      console.log("this is data", data);
      return data;
    },
  },
  mounted() {
    // this.chartData = this.updateData();
    this.renderChart(this.updateData(), this.mergedOptions);
  },
  watch: {
    datasets: {
      handler: function () {
        console.log("this is this,", this);
        this._data._chart.destroy();
        this.renderChart(this.updateData(), this.mergedOptions);
      },
    },
    labels: {
      handler: function () {
        this._data._chart.destroy();
        this.renderChart(this.updateData(), this.mergedOptions);
      },
    },
    layout: {
      handler: function () {
        this._data._chart.destroy();
        this.renderChart(this.updateData(), this.mergedOptions);
      },
    },
  },
};
