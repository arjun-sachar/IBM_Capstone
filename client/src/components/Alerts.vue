<template>
  <div class="alert-container">
    <div v-for="alert in alerts" class="alert-bar">
      <div class="alert-bar--icon">
        <a-icon type="warning" />
      </div>
      <div class="alert-bar--text">
        {{ alert.title }}
      </div>
      <div class="alert-bar--actions">
        <div
          :class="{
            'alert-bar--actions-icon__danger': alert.type == 'danger',
            'alert-bar--actions-icon__success': alert.type == 'success'
          }"
          class="alert-bar--actions-icon"
        >
          <a-icon v-if="alert.type == 'danger'" type="caret-down" />
          <a-icon v-if="alert.type == 'success'" type="caret-up" />
        </div>
        <div class="alert-bar--actions-button">
          <a-button size="small">
            Info
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Alerts",
  computed: {
    alerts() {
      return this.$store.state.alerts;
    }
  }
};
</script>
