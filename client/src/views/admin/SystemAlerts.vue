<template>
  <div class="admin-summary">
    <a-row>
      <a-col :span="8"></a-col>
      <a-col :span="8">
        <h2>System Alerts</h2>
      </a-col>
      <a-col :span="8">
        <a-button style="float:right" @click="createSystemAlert"
          >Add New Alert</a-button
        >
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="alerts">
      <template slot="status" slot-scope="status">
        {{ status ? "Active" : "Disabled" }}
      </template>
      <template slot="actions" slot-scope="alert">
        <span class="buttons-wrapper">
          <a-button @click="updateSystemAlert(alert)" type="primary"
            >Edit</a-button
          >
          <a-button type="primary">
            <a-popconfirm
              title="Are you sure you want to delete this alert"
              @confirm="deleteSystemAlert(alert)"
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </a-popconfirm>
          </a-button>
        </span>
      </template>
    </a-table>

    <a-modal
      :width="750"
      @ok="handleCreateSystemAlert"
      @cancel="
        clearForm();
        showCreateSystemAlertsModal = false;
      "
      title="Create New System Alert"
      :visible="showCreateSystemAlertsModal"
    >
      <a-alert
        v-if="message && message.length > 1"
        type="error"
        :message="message"
        banner
      />
      <a-form>
        <a-form-item
          label="Title"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="title"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please create a title' }]
          }"
        >
          <a-input v-model="title" />
        </a-form-item>
        <a-form-item
          label="Page"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="page"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please choose a page' }]
          }"
        >
          <a-select
            :key="page"
            v-model="page"
            style="width: 100%"
            placeholder="Please select a role"
          >
            <a-select-option v-for="route in routes" :key="route">{{
              route
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="Content"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="content"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a content' }]
          }"
        >
          <a-textarea
            placeholder="Content for alert"
            v-model="content"
            :autosize="{ minRows: 2 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :width="750"
      @ok="handleUpdateSystemAlert"
      @cancel="
        clearForm();
        showUpdateSystemAlertsModal = false;
      "
      title="Update System Alert"
      :visible="showUpdateSystemAlertsModal"
    >
      <a-alert
        v-if="message && message.length > 1"
        type="error"
        :message="message"
        banner
      />
      <a-form>
        <a-form-item
          label="Title"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="title"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please create a title' }]
          }"
        >
          <a-input v-model="title" />
        </a-form-item>
        <a-form-item
          label="Page"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="page"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please choose a page' }]
          }"
        >
          <a-select
            :key="page"
            v-model="page"
            style="width: 100%"
            placeholder="Please select a role"
          >
            <a-select-option v-for="route in routes" :key="route">{{
              route
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="Content"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="content"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a content' }]
          }"
        >
          <a-textarea
            placeholder="Content for alert"
            v-model="content"
            :autosize="{ minRows: 2 }"
          />
        </a-form-item>
        <a-form-item
          label="Active"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="status"
        >
          <a-switch style="width:50px" v-model="status" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import AdminService from "@/services/AdminService";
import ErrorService from "@/services/ErrorService";
import router from "@/router";

const columns = [
  {
    title: "Alert",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Name",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "Page",
    key: "page",
    dataIndex: "page"
  },
  {
    title: "Content",
    key: "content",
    dataIndex: "content"
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    scopedSlots: {
      customRender: "status"
    }
  },
  {
    title: "Actions",
    scopedSlots: {
      customRender: "actions"
    },
    width: "400px"
  }
];

const defaultRoutes = ["admin", "demo", "chartWizard", "styling", "about"];

export default {
  data() {
    return {
      alerts: [],
      columns: columns,
      showCreateSystemAlertsModal: false,
      showUpdateSystemAlertsModal: false,
      message: {},
      content: null,
      title: null,
      page: null,
      status: null,
      alertId: null,
      routes: null,
      defaultRoutes
    };
  },
  created() {
    this.getAlerts();
    console.log("routes", router);
    this.routes = router.options.routes.filter(route => {
      if (defaultRoutes.indexOf(route.name) == -1) {
        return route.name;
      }
    });
    this.routes = this.routes.map(route => route.name);
    console.log("this is routes", this.routes);
  },
  methods: {
    getAlerts() {
      AdminService.getSystemAlerts().then(resp => {
        this.alerts = resp.data;
      });
    },
    createSystemAlert() {
      this.showCreateSystemAlertsModal = true;
    },
    updateSystemAlert(alert) {
      this.content = alert.content;
      this.title = alert.title;
      this.page = alert.page;
      this.alertId = alert.id;
      this.status = alert.status;
      this.showUpdateSystemAlertsModal = true;
    },
    handleUpdateSystemAlert() {
      this.message = "Please fill in ";
      if (this.title == null || this.title.length < 1) {
        this.message += "a title";
      } else if (this.page == null || this.page.length < 1) {
        this.message += "a page";
      } else if (this.content == null || this.content.length < 1) {
        this.message += "the content";
      } else {
        this.message = null;
        AdminService.updateSystemAlert(this.alertId, {
          status: true,
          content: this.content,
          page: this.page,
          title: this.title,
          status: this.status
        })
          .then(resp => {
            this.showUpdateSystemAlertsModal = false;
            this.clearForm();
            this.getAlerts();
          })
          .catch(err => {
            ErrorService.errorHandler(
              err["response"]["status"],
              "update system alert"
            );
          });
      }
    },
    handleCreateSystemAlert() {
      this.message = "Please fill in ";
      if (this.title == null || this.title.length < 1) {
        this.message += "a title";
      } else if (this.page == null || this.page.length < 1) {
        this.message += "a page";
      } else if (this.content == null || this.content.length < 1) {
        this.message += "the content";
      } else {
        this.message = null;
        AdminService.createSystemAlert({
          status: true,
          content: this.content,
          page: this.page,
          title: this.title
        })
          .then(resp => {
            this.showCreateSystemAlertsModal = false;
            this.clearForm();
            this.getAlerts();
          })
          .catch(err => {
            ErrorService.errorHandler(
              err["response"]["status"],
              "create system alert"
            );
          });
      }
    },
    deleteSystemAlert(alert) {
      AdminService.deleteSystemAlert(alert.id)
        .then(resp => {
          this.getAlerts();
        })
        .catch(err => {
          ErrorService.errorHandler(
            err["response"]["status"],
            "delete system alert"
          );
        });
    },
    clearForm() {
      this.content = null;
      this.page = null;
      this.title = null;
      this.alertId = null;
      this.status = null;
    }
  }
};
</script>
