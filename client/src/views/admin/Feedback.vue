<template>
  <div class="admin-summary">
    <h2>Feedback</h2>
    <a-table :customRow="customRow" :columns="columns" :dataSource="feedbacks">
      <template slot="message" slot-scope="message">
        <div style="max-width:300px" class="truncated">{{ message }}</div>
      </template>
    </a-table>

    <a-modal
      :width="750"
      @ok="feedbackModal = false"
      @cancel="feedbackModal = false"
      :title="title"
      :visible="feedbackModal"
    >
      <a-row style="font-size:16px"><b>Page: </b>{{ message.page }}</a-row>
      <a-row style="font-size:16px"
        ><b>Subject: </b>{{ message.subject }}</a-row
      >
      <a-row style="font-size:16px"
        ><b>Browser: </b>{{ message.browser }}</a-row
      >
      <div style="font-size:16px;margin-top:20px">{{ message.message }}</div>
    </a-modal>
  </div>
</template>

<script>
import AdminService from "@/services/AdminService";

const columns = [
  {
    title: "User",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Email",
    dataIndex: "user.email",
    key: "email"
  },
  {
    title: "Date",
    key: "date",
    dataIndex: "date"
  },
  {
    title: "Message",
    key: "message",
    dataIndex: "message",
    width: "30%",
    scopedSlots: {
      customRender: "message"
    }
  }
];

export default {
  data() {
    return {
      feedbacks: [],
      columns: columns,
      feedbackModal: false,
      message: {},
      title: null
    };
  },
  created() {
    this.getFeedback();
  },
  methods: {
    getFeedback() {
      AdminService.getFeedback().then(resp => {
        console.log("feedback res", resp);
        this.feedbacks = resp.data;
        // this.$set(this.loginData, 0, resp.data[0]);
      });
    },
    customRow(row) {
      return {
        on: {
          click: () => {
            console.log("this is row", row);
            this.message = row;
            this.title =
              "Feedback from " +
              row.user.username +
              " on " +
              row.date.split("T")[0];
            this.feedbackModal = true;
          }
        }
      };
    }
  }
};
</script>
