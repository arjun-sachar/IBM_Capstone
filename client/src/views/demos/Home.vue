<template>
  <div class="home" style="height:100%;width:100%;">
    <HelloWorld msg="Welcome to DashBlocks" />
    <div class="flex flex-col">
      <a-row style="height:400px" class="non-flex">
        <a-col :span="12">
          <div class="tile tile__top tile__left tile__header">
            <TitleBar title="Line Chart" />
            <div class="tile-content">
              <ChartJS type="line" :datasets="lineData" :layout="lineLayout" :labels="lineLabels" />
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="tile tile__top tile__right tile__header">
            <TitleBar title="Bar Chart" />
            <div class="tile-content" style="display:flex;flex-direction:column">
              <div style="flex:1;">
                <ChartJS
                  type="bar"
                  :datasets="barChartData"
                  :labels="barLabels"
                  :layout="barChartLayout"
                />
              </div>
              <div style="display:flex;justify-content:center;margin:5px">
                <button @click="updateData()">Change data</button>
                <button @click="updateLayout()">Change layout</button>
                <button @click="updateLabels()">Change labels</button>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row style="height:400px" class="non-flex">
        <a-col :span="12">
          <div class="tile tile__top tile__left tile__header">
            <TitleBar title="Stacked Bar Chart" />
            <div class="tile-content">
              <ChartJS
                type="stacked"
                :datasets="barChartData"
                :labels="barLabels"
                :layout="barChartLayout"
              />
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="tile tile__top tile__right tile__header">
            <TitleBar title="Stages Chart" />
            <div class="tile-content">
              <StagesChart class="chart-component" :config="stages_config" />
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row style="height:400px" class="non-flex">
        <a-col :span="12">
          <div class="tile tile__top tile__left tile__header">
            <TitleBar title="Treemap Chart" />
            <div class="tile-content">
              <TreemapChart
                class="chart-component"
                :config="treemapConfig"
                style="height:100%;width:100%"
              />
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="tile tile__top tile__right tile__header">
            <TitleBar title="Pie Chart" />
            <div class="tile-content">
              <ChartJS
                type="pie"
                :options="{ cutoutPercentage: 80 }"
                :datasets="pieData"
                :layout="pieLayout"
                :labels="pieLabels"
              />
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row style="height:400px" class="non-flex">
        <a-col :span="12">
          <div class="tile tile__top tile__left tile__header">
            <TitleBar title="Radar Chart" />
            <div class="tile-content">
              <ChartJS
                type="radar"
                :datasets="radarData"
                :layout="radarLayout"
                :labels="radarLabels"
              />
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="tile tile__top tile__right tile__header">
            <TitleBar title="Bubble Chart" />
            <div class="tile-content">
              <ChartJS
                type="bubble"
                :options="{ cutoutPercentage: 80 }"
                :datasets="bubbleData"
                :layout="bubbleLayout"
              />
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row style="margin: 10px; background: white;">
        <a-col :span="24">
          My gradient slider value is: {{ gradientSliderValue }}
          <GradientSlider v-model="gradientSliderValue" :disabled="false"></GradientSlider>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <WidgetList style="background: white; margin: 12px; padding: 24px;" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import ChartJS from "@/components/charts/ChartJS.vue";
import TitleBar from "@/components/TitleBar.vue";
import WidgetList from "@/components/WidgetList";
import StagesChart from "@/components/charts/StagesChart";
import TreemapChart from "@/components/charts/TreemapChart.vue";
import GradientSlider from "@/components/GradientSlider.vue";
import { scaleLinear } from "d3-scale";
import Filter from '@/mixins/Filter';

const treemapdata = [
  {
    level1: "America",
    level2: "USA",
    level3: "City A",
    value: 10,
    secondary_value: 9
  },
  {
    level1: "America",
    level2: "USA",
    level3: "City B",
    value: 10,
    secondary_value: 11
  },
  {
    level1: "America",
    level2: "USA",
    level3: "City C",
    value: 10,
    secondary_value: 11
  },
  {
    level1: "America",
    level2: "Mexico",
    level3: "City A",
    value: 10,
    secondary_value: 11
  },
  {
    level1: "America",
    level2: "Mexico",
    level3: "City B",
    value: 10,
    secondary_value: 11
  },
  {
    level1: "America",
    level2: "Canada",
    level3: "City C",
    value: 10,
    secondary_value: 12
  },
  {
    level1: "America",
    level2: "Canada",
    level3: "City B",
    value: 10,
    secondary_value: 9
  },
  {
    level1: "Europe",
    level2: "United Kingdom",
    level3: "City A",
    value: 8,
    secondary_value: 10
  },
  {
    level1: "Europe",
    level2: "France",
    level3: "City B",
    value: 10,
    secondary_value: 8
  },
  {
    level1: "Europe",
    level2: "France",
    level3: "City A",
    value: 10,
    secondary_value: 10
  },
  {
    level1: "Asia",
    level2: "China",
    level3: "City B",
    value: 10,
    secondary_value: 10
  },
  {
    level1: "Asia",
    level2: "China",
    level3: "City A",
    value: 10,
    secondary_value: 11
  },
  {
    level1: "Asia",
    level2: "Japan",
    level3: "City A",
    value: 10,
    secondary_value: 12
  },
  {
    level1: "Asia",
    level2: "Thailand",
    level3: "City A",
    value: 10,
    secondary_value: 7
  },
  {
    level1: "Africa",
    level2: "South Africa",
    level3: "City B",
    value: 12,
    secondary_value: 10
  },
  {
    level1: "Africa",
    level2: "South Africa",
    level3: "City A",
    value: 14,
    secondary_value: 11
  },
  {
    level1: "Africa",
    level2: "Egypt",
    level3: "City A",
    value: 11,
    secondary_value: 12
  },
  {
    level1: "Africa",
    level2: "Morocco",
    level3: "City A",
    value: 10,
    secondary_value: 9
  }
];

const pieData = [[10, 20, 30]];

const pieLayout = [
  {
    backgroundColor: ["#3b6caa", "#92374D", "#8C5383"]
  }
];

const pieLabels = ["Blue", "Red", "Purple"];

const key_hierarchy = ["level1", "level2", "level3"];

const stages_config = {
  pathColor: "#0097DA",
  data: [
    { name: "Stage 1", value: 0 },
    { name: "Stage 2", value: 8 },
    { name: "Stage 3", value: 0 },
    { name: "Stage 4", value: -1 },
    { name: "Stage 5", value: 2 },
    { name: "Stage 6", value: 5 }
  ],
  colorScale: scaleLinear()
    .domain([-1, 3, 8])
    .range(["green", "orange", "red"]),
  message: { positive: "days added", negative: "days saved" }
};

const treemapConfig = {
  data: treemapdata,
  colors: scaleLinear()
    .domain([1000, -1, -0.2, 0, 0.2, 1, 1000])
    .range([
      "#cc0000",
      "#cc0000",
      "tomato",
      "lightgray",
      "lime",
      "green",
      "green"
    ]),
  key_hierarchy: key_hierarchy,
  header: { background: "blue", font: "white" }
};

export default {
  mixins: [Filter],
  name: "home",
  components: {
    HelloWorld,
    ChartJS,
    TitleBar,
    WidgetList,
    StagesChart,
    TreemapChart,
    GradientSlider
  },
  created() {
    setTimeout(() => (this.showBar = true), 500);
  },
  data() {
    return {
      showBar: false,
      stages_config,
      treemapConfig,
      gradientSliderValue: 80,
      loadingChartData: false,
      lineLabels: ["A", "B"],
      lineData: [[40, 20], [30, 80]],
      lineLayout: [
        {
          fill: false,
          label: "Data One",
          backgroundColor: "#3b6caa",
          borderColor: "#3b6caa"
        },
        {
          fill: false,
          label: "Data One",
          backgroundColor: "#92374D",
          borderColor: "#92374D"
        }
      ],
      barChartLayout: [
        {
          fill: false,
          label: "Data One",
          backgroundColor: "#8C5383",
          borderColor: "#8C5383",
          data: [40, 20]
        },
        {
          fill: false,
          label: "Data One",
          backgroundColor: "#9DACFF",
          borderColor: "#9DACFF",
          data: [30, 80]
        }
      ],
      barChartData: [[40, 20], [30, 80]],
      pieData,
      pieLabels,
      pieLayout,
      barLabels: ["A", "B"],
      radarData: [[40, 33, 52, 60], [20, 53, 28, 48]],
      radarLabels: ["First", "Second", "Third", "Fourth"],
      radarLayout: [
        {
          label: "Sample Data",
          borderColor: "rgba(121, 183, 205, 1)",
          backgroundColor: "rgba(121, 183, 205, .5)"
        },
        {
          label: "Sample Data 2",
          borderColor: "rgba(189,106,186, 1)",
          backgroundColor: "rgba(189,106,186, .5)"
        }
      ],
      bubbleData: [
        [{ x: 1, y: 10, r: 10 }, { x: 2, y: 15, r: 6 }, { x: 3, y: 4, r: 3 }],
        [{ x: 1, y: 8, r: 3 }, { x: 2, y: 22, r: 10 }, { x: 3, y: 8, r: 5 }]
      ],
      bubbleLayout: [
        { backgroundColor: "green", label: "Set 1" },
        { backgroundColor: "pink", label: "Set 2" }
      ]
    };
  },
  methods: {
    onFilterChange(changes) {
      // This method comes from the Filter mixin
      console.log(changes);
      this.$notify({
              group: "global",
              type: "success",
              title: "Filter Change",
              text: "Filters have changed"
            });
    },
    updateData() {
      this.$set(this.barChartData, 0, [Math.random() * 10, Math.random() * 30]);
    },
    updateLayout() {
      if (this.barChartLayout[0]["backgroundColor"] == "#8C5383") {
        this.barChartLayout[0]["backgroundColor"] = "blue";
      } else if (this.barChartLayout[0]["backgroundColor"] == "blue") {
        this.barChartLayout[0]["backgroundColor"] = "pink";
      } else if (this.barChartLayout[0]["backgroundColor"] == "pink") {
        this.barChartLayout[0]["backgroundColor"] = "#8C5383";
      }
    },
    updateLabels() {
      const labelSet = ["A", "B", "C", "D", "E", "F", "G"];
      const first = Math.floor(Math.random() * 6);
      const second = Math.floor(Math.random() * 6);
      this.barLabels = [labelSet[first], labelSet[second]];
    }
  }
};
</script>
