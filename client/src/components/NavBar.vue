<template>
  <a-layout-sider
    :width="barSize"
    style="overflow:auto"
    v-if="direction == 'left'"
  >
    <a-menu mode="inline" class="navbar-menu-left">
      <router-link
        v-if="state.enabled"
        v-for="state in states"
        class="router-link"
        :key="state.id"
        :to="state.url"
      >
        <a-button
          v-bind:style="{ width: barSize + 'px', height: barSize + 'px' }"
          class="navbar-button button__left__sidebar"
          :type="sidebarLinkClass(state.name)"
          size="large"
          :icon="state.icon"
        ></a-button>
      </router-link>
    </a-menu>
  </a-layout-sider>
  <a-layout v-else-if="direction == 'top'" class="navbar-top">
    <a-menu mode="horizontal" class="navbar-menu-top">
      <router-link
        v-if="state.enabled"
        v-for="state in states"
        class="router-link"
        :key="state.id"
        :to="state.url"
      >
        <a-button
          class="navbar-button button__top__sidebar"
          :type="sidebarLinkClass(state.name)"
          size="large"
          :icon="state.icon"
          >{{ state.display_name }}</a-button
        >
      </router-link>
    </a-menu>
  </a-layout>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    currentRoute: String,
    direction: {
      type: String,
      default: "left"
    }
  },
  methods: {
    // Returns 'primary' if routeName is the currentRoute, else it returns 'default'
    sidebarLinkClass(routeName) {
      if (this.currentRoute === routeName) {
        return "primary";
      }
      return "default";
    }
  },
  created() {
    /* debugger; */
  },
  computed: {
    states() {
      return this.$router.options.routes
        .filter(route => {
          return route.meta && route.meta.inNav;
        })
        .map(route => {
          return {
            name: route.name,
            display_name: route.name,
            url: route.path,
            enabled: true,
            size: "large",
            icon: route.meta.icon
          };
        });
    }
  },
  data() {
    return {
      barSize: 60
    };
  }
};
</script>
