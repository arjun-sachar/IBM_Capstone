<template>
  <div style="height:100%;width:100%;margin-top:10%">
    <a-col :span="3"></a-col>
    <a-col :span="18">
      <div class="tile tile__header">
        <TitleBar title="Feedback" />
        <div class="tile-content">
          <div class="flex-col">
            <div class="flex">
              <a-form class="flex" style="padding:12px">
                <a-form-item
                  label="Feedback Subject"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 12 }"
                  fieldDecoratorId="subject"
                  :fieldDecoratorOptions="{
                    rules: [
                      { required: true, message: 'Please select a subject' }
                    ]
                  }"
                >
                  <a-select
                    placeholder="Select an option"
                    v-model="selectedSubject"
                    @change="this.updateSelectedSubject"
                  >
                    <a-select-option value="data">Data</a-select-option>
                    <a-select-option value="ui"
                      >User Interaction/Experience</a-select-option
                    >
                    <a-select-option value="bug">Bug Report</a-select-option>
                    <a-select-option value="other">Other</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="Page"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 12 }"
                  fieldDecoratorId="page"
                  :fieldDecoratorOptions="{
                    rules: [{ required: true, message: 'Please select a page' }]
                  }"
                >
                  <a-select
                    placeholder="Select an option"
                    v-model="selectedPage"
                    @change="this.updateSelectedPage"
                  >
                    <a-select-option
                      v-for="page in pages"
                      :value="page.name"
                      :key="page.name"
                      >{{ page.display }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="Browser"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 12 }"
                  fieldDecoratorId="browser"
                  :fieldDecoratorOptions="{
                    rules: [
                      { required: true, message: 'Please select a browser' }
                    ]
                  }"
                >
                  <a-select
                    placeholder="Select an option"
                    v-model="selectedBrowser"
                    @change="this.updateSelectedBrowser"
                  >
                    <a-select-option
                      v-for="browser in browsers"
                      :value="browser.name"
                      :key="browser.name"
                      >{{ browser.display }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="Message"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 18 }"
                  fieldDecoratorId="message"
                  :fieldDecoratorOptions="{
                    rules: [
                      { required: true, message: 'Please include the message' }
                    ]
                  }"
                >
                  <a-input
                    :autosize="{ minrows: 1, maxRows: 6 }"
                    v-model="feedbackMessage"
                  />
                </a-form-item>
              </a-form>
            </div>
            <div style="height:80px">
              <a-button
                type="primary"
                :disabled="
                  this.selectedPage == null ||
                    this.selectedSubject == null ||
                    this.selectedBrowser == null ||
                    this.feedbackMessage.length == 0
                "
                @click="submitFeedback"
                >Submit</a-button
              >
            </div>
          </div>
        </div>
      </div>
    </a-col>
    <a-col :span="3"></a-col>
  </div>
</template>

<script>
import LineChart from "@/components/charts/LineChart";
import TitleBar from "@/components/TitleBar.vue";
import AdminService from "@/services/AdminService.js";
import store from "@/store";

const pageNames = ["Home", "Admin", "About", "Feedback", "Profile"];
const pages = [];
pageNames.forEach(page => {
  pages.push({ display: page, name: page.toLowerCase() });
});

const browserNames = ["Chrome", "Firefox", "Edge", "Internet Explorer", "Other"];
const browsers = [];
browserNames.forEach(browser => {
  browsers.push({ display: browser, name: browser.toLowerCase() });
});

export default {
  components: {
    TitleBar
  },
  methods: {
    updateSelectedSubject(value) {
      this.selectedSubject = value;
    },
    updateSelectedPage(value) {
      this.selectedPage = value;
    },
    updateSelectedBrowser(value) {
      this.selectedBrowser = value;
    },
    submitFeedback() {
      const feedbackObj = {
        subject: this.selectedSubject,
        page: this.selectedPage,
        browser: this.selectedBrowser,
        message: this.feedbackMessage,
        date: new Date(),
        userId: store.state.currentUser.id
      };
      AdminService.submitFeedback(feedbackObj);
      this.clearForm();
    },
    clearForm() {
      this.selectedSubject = null;
      this.selectedPage = null;
      this.selectedBrowser = null;
      this.feedbackMessage = null;
    }
  },
  data() {
    return {
      selectedPage: null,
      selectedSubject: null,
      selectedBrowser: null,
      feedbackMessage: "",
      pages: pages,
      browsers: browsers
    };
  }
};
</script>
