<template>
  <div style="width:100%;height:100%;">
    <a-row class="flex">
      <a-col :span="10">
        <a-row class="flex-60">
          <a-col :span="24">
            <div class="tile tile__top tile__left  tile__header">
              <TitleBar title="Primary" />
              <div class="tile-content"></div>
            </div>
          </a-col>
        </a-row>
        <a-row class="flex-40">
          <a-col :span="12">
            <div class="tile tile__bottom tile__left tile__header">
              <TitleBar title="Primary" />
              <div class="tile-content"></div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="tile tile__bottom tile__hmiddle tile__header">
              <TitleBar title="Primary" />
              <div class="tile-content"></div>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="14">
        <a-row style="height:100px" class="non-flex">
          <a-col :span="24">
            <div class="tile tile__top tile__right">
              <div class="tile-content"></div>
            </div>
          </a-col>
        </a-row>
        <a-row class="flex-60">
          <a-col :span="12">
            <div class="tile tile__vmiddle tile__hmiddle tile__header">
              <TitleBar title="Primary" />
              <div class="tile-content"></div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="tile tile__vmiddle tile__right tile__header">
              <TitleBar title="Primary" />
              <div class="tile-content"></div>
            </div>
          </a-col>
        </a-row>
        <a-row class="non-flex" style="height:calc(40% - 100px)">
          <a-col :span="12">
            <div class="tile tile__bottom tile__hmiddle tile__header">
              <TitleBar title="Primary" />
              <div class="tile-content"></div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="tile tile__bottom tile__right tile__header">
              <TitleBar title="Primary" />
              <div class="tile-content"></div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import LineChart from "@/components/charts/LineChart";
import TitleBar from "@/components/TitleBar.vue";
import FilterService from "@/services/FilterService.js";
const data = [];

export default {
  components: {
    TitleBar,
    LineChart
  },
  created() {},
  methods: {},
  data() {
    return {
      data
    };
  }
};
</script>
