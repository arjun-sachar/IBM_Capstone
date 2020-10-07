<script>
import BaseChart from "@/mixins/Chart";
import { Radar, mixins } from "vue-chartjs";
export default {
  name: "RadarChart",
  mixins: [BaseChart], // Inherit all options from BaseChart
  extends: Radar,
  data() {
    return {
      defaultOptions: {}
    };
  }
};
</script>
