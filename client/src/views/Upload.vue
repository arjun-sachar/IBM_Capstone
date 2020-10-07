<template>
  <div style="height:100%;width:100%">
    <a-row style="height:300px">
      <div class="tile tile__header tile__top">
        <TitleBar title="Rules" />
        <div class="tile-content">
          <a-row style="height:calc(100% - 140px);overflow:auto">
            <a-col :span="8">
              <ul class="rule-list">
                <li>Rule for uploading a file</li>
                <li>Rule for uploading a file</li>
                <li>Rule for uploading a file</li>
              </ul>
            </a-col>
            <a-col :span="8">
              <ul class="rule-list">
                <li>Rule for uploading a file</li>
                <li>Rule for uploading a file</li>
                <li>Rule for uploading a file</li>
              </ul>
            </a-col>
            <a-col :span="8">
              <ul class="rule-list">
                <li>Rule for uploading a file</li>
                <li>Rule for uploading a file</li>
                <li>Rule for uploading a file</li>
              </ul>
            </a-col>
          </a-row>
          <a-row
            style="margin:10px;height:120px"
            type="flex"
            align="bottom"
            justify="space-between"
          >
            <div style="width:calc(100% - 300px)">
              <div style="text-align:left;padding-left:10px">
                Please select an option using the dropdowns:
              </div>
              <div style="text-align:left;">
                <div
                  style="width:33%;display:inline-block;font-size:12px;padding-left:10px"
                >
                  Category 1
                </div>
                <div
                  style="width:33%;display:inline-block;font-size:12px;padding-left:10px"
                >
                  Category 2
                </div>
                <div
                  style="width:33%;display:inline-block;font-size:12px;padding-left:10px"
                >
                  Category 3
                </div>
              </div>
              <div>
                <a-select v-model="cat1" style="width: 33%;padding-right:10px">
                  <a-select-option v-for="option in ['IBM']" :value="option">{{
                    option
                  }}</a-select-option>
                </a-select>
                <a-select
                  :disabled="cat1 == null"
                  v-model="cat2"
                  style="width: 33%;padding-right:10px"
                >
                  <a-select-option v-for="option in ['GBS']" :value="option">{{
                    option
                  }}</a-select-option>
                </a-select>
                <a-select
                  :disabled="cat2 == null"
                  v-model="cat3"
                  style="width: 33%;padding-right:10px"
                >
                  <a-select-option
                    v-for="option in ['Public Sector']"
                    :value="option"
                    >{{ option }}</a-select-option
                  >
                </a-select>
              </div>
            </div>
            <div style="width:300px">
              <div style="width:100%;" align="right">
                <a-upload
                  style="margin:10px 0px;"
                  name="file"
                  accept=".txt,.pdf,.png,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  :multiple="false"
                  :fileList="fileList"
                  :remove="handleRemove"
                  :beforeUpload="beforeUpload"
                  :disabled="fileList.length > 0"
                >
                  <a-button> <a-icon type="upload" /> Choose a File </a-button>
                </a-upload>
              </div>
              <div style="width:100%" align="right">
                <a-button
                  type="primary"
                  @click="handleUpload"
                  :disabled="fileList.length === 0 || !jobSelected"
                  :loading="uploading"
                  style="margin-top:10px;"
                >
                  {{ uploading ? "Uploading" : "Upload" }}
                </a-button>
              </div>
            </div>
          </a-row>
        </div>
      </div>
    </a-row>
    <a-row style="height:calc(100% - 300px);min-height:300px">
      <div class="tile tile__bottom" style="padding:10px;overflow:auto">
        <a-table :columns="columns" :dataSource="uploads"></a-table>
      </div>
    </a-row>
  </div>
</template>

<script>
import TitleBar from "@/components/TitleBar.vue";
import DataService from "@/services/DataService";

const columns = [
  {
    title: "Upload ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "File Name",
    dataIndex: "file_name",
    key: "file_name"
  },
  {
    title: "File Content",
    dataIndex: "content",
    key: "content"
  }
];
export default {
  name: "Upload",
  components: {
    TitleBar
  },
  created() {
    this.getUploads();
  },
  computed: {
    jobSelected() {
      return this.cat1 != null && this.cat2 != null && this.cat3 != null;
    }
  },
  mounted() {
    this.getUploads();
    this.getUploadsInterval = setInterval(this.getUploads, 1000);
  },
  beforeDestroy() {
    clearInterval(this.getUploadsInterval);
  },
  data() {
    return {
      fileList: [],
      uploading: false,
      uploads: [],
      getUploadsInterval: null,
      columns,
      cat1: null,
      cat2: null,
      cat3: null
    };
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append("file", file);
      });
      this.uploading = true;

      DataService.uploadData(formData).then(resp => {
        this.uploading = false;
        this.fileList = [];
        this.$message.success("upload successful");
        this.getUploads();
      });
    },
    getUploads() {
      DataService.getUploads().then(resp => {
        this.uploads = resp.data;
      });
    }
  }
};
</script>

<style lang="less">
.ant-upload-list-item {
  // width: 500px;
  margin-right: 8px;
}

.table-header {
  display: inline-block;
  padding: 5px 10px;
}

.rule-list {
  padding: 10px;
  padding-left: 30px;

  li {
    text-align: left;
  }
}
</style>
