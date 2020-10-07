<template>
  <div :class="{ inverse: inverse }" class="gradientSlider">
    <a-slider
      :defaultValue="sliderValue"
      :disabled="disabled"
      :max="values.max"
      :min="values.min"
      @change="handleChange"
    />
  </div>
</template>

<script>
export default {
  name: "GradientSlider",
  data() {
    return {
      sliderValue: this.value
    };
  },
  props: {
    defaultValue: {
      type: Number,
      default: 50
    },
    value: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inverse: {
      type: Boolean,
      default: false
    },
    values: {
      type: Object,
      default: function() {
        return { max: 100, min: 0 };
      }
    }
  },
  methods: {
    handleChange(v) {
      this.sliderValue = v;
      console.log("handling change: v");
      console.log(v);
      console.log("handling change: sliderValue");
      console.log(this.sliderValue);
      this.$emit("input", this.sliderValue);
    }
  }
};
</script>

<style lang="less">
.gradientSlider {
  * {
    cursor: default !important;
  }
  .ant-slider .ant-slider-track {
    background: transparent !important;
  }
  .ant-slider-disabled .ant-slider-track {
    background: transparent !important;
  }
  .ant-slider-rail {
    background: linear-gradient(to right, red, green);
  }
}
.gradientSlider.inverse {
  .ant-slider-rail {
    background: linear-gradient(to right, green, red);
  }
}
</style>
