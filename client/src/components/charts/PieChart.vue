<script>
import BaseChart from "@/mixins/Chart";
import { Pie, mixins } from "vue-chartjs";
export default {
  name: "PieChart",
  mixins: [BaseChart], // Inherit all options from BaseChart
  extends: Pie,
  data() {
    return {
      defaultOptions: {}
    };
  }
};
</script>
