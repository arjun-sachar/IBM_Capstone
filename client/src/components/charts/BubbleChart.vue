<script>
import BaseChart from "@/mixins/Chart";
import { Bubble, mixins } from "vue-chartjs";
export default {
  name: "BubbleChart",
  mixins: [BaseChart], // Inherit all options from BaseChart
  extends: Bubble,
  data() {
    return {
      defaultOptions: {}
    };
  }
};
</script>
