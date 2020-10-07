<template>
  <div class="about">
    <h1>
      Thank you for using DashBlocks. Here are some helpful links that can aid
      in your development:
    </h1>
    <a-list itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta :description="item.description">
          <a slot="title" target="_blank" :href="item.link">{{ item.title }}</a>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
const data = [
  {
    title: "Vue.js Official Documentation",
    link: "https://vuejs.org/"
  },
  {
    title: "Vue.js Router Official Documentation",
    link: "https://router.vuejs.org/"
  },
  {
    title: "Ant Design Documentation",
    link: "https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce/"
  }
];
export default {
  data() {
    return {
      data
    };
  }
};
</script>
