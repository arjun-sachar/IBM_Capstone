<template>
  <div
    class="title-bar"
    :style="{ 'text-align': position }"
    :class="styleClass"
  >
    {{ title }}
  </div>
</template>

<script>
export default {
  name: "TitleBar",
  props: {
    title: { type: String, required: true },
    position: { type: String, default: "left" },
    styleClass: { type: String }
  }
};
</script>
