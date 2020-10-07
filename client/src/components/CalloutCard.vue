<template>
  <a-row style="height:100%" type="flex" align="middle" justify="center">
    <a-col :span="24">
      <a-row>
        <a-col
          :style="{ 'font-size': fontSizeValue, color: color }"
          :span="24"
          style="font-weight:bold;line-height:1"
        >
          {{ value
          }}<span
            style="vertical-align:middle"
            :style="{ 'font-size': fontSizeSign }"
          >
            <a-icon
              type="caret-down"
              v-if="sign.sign == 'down-arrow'"
              :style="{ color: sign.color ? sign.color : color }"
            />
            <a-icon
              type="caret-up"
              v-if="sign.sign == 'up-arrow'"
              :style="{ color: sign.color ? sign.color : color }"
            />
            <span
              v-if="
                sign && sign.sign != 'up-arrow' && sign.sign != 'down-arrow'
              "
              :style="{ color: sign.color ? sign.color : color }"
              >{{ sign ? sign.sign : "" }}</span
            >
          </span>
        </a-col>
        <a-col :span="24" :style="{ 'font-size': fontSizeTagline }">{{
          tagline
        }}</a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: "CalloutCard",
  props: {
    size: { type: String, required: false },
    sign: { required: false },
    value: { required: true },
    tagline: { type: String, required: false },
    color: { type: String, required: false, default: "black" }
  },
  computed: {
    fontSizeValue() {
      return this.size == "large"
        ? "72px"
        : this.size == "medium"
        ? "42px"
        : "24px";
    },
    fontSizeSign() {
      return this.size == "large"
        ? "30px"
        : this.size == "medium"
        ? "24px"
        : "12px";
    },
    fontSizeTagline() {
      return this.size == "large"
        ? "18px"
        : this.size == "medium"
        ? "14px"
        : "10px";
    }
  }
};
</script>
