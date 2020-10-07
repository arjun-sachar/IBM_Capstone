<template>
  <div class="filter-form">
    <div class="existing-filters">
      <a-table :columns="columns" :dataSource="data">
        <template slot="actions" slot-scope="filter">
          <span class="buttons-wrapper">
            <a-button size="small" type="danger">
              <a-popconfirm
                title="Are you sure you want to delete this filter"
                @confirm="removeFilterData(filter)"
                okText="Yes"
                cancelText="No"
              >
                <a href="#">Delete</a>
              </a-popconfirm>
            </a-button>
          </span>
        </template>
      </a-table>
    </div>
    <div class="new-filter-form">
      <h2>Filter Form</h2>

      <div
        style="width:100%;"
        v-if="formErrorMessage != ''"
        class="form-error-message"
      >
        {{ formErrorMessage }}
      </div>

      <a-form-item
        label="Model"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        fieldDecoratorId="model"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: 'Please select a model!' }]
        }"
      >
        <a-select v-model="selectedModel" style="width: 100%">
          <a-select-option
            :key="model.modelName"
            v-for="model in models"
            :value="model.modelName"
            >{{ model.modelName }}</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item
        label="Filter Type"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        fieldDecoratorId="filterType"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: 'Please select a filter type!' }]
        }"
      >
        <a-select v-model="selectedFilterType" style="width: 100%">
          <a-select-option key="where">where</a-select-option>
          <a-select-option key="limit">limit</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        v-if="selectedFilterType == 'where'"
        label="Field"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        fieldDecoratorId="field"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: 'Please select a field!' }]
        }"
      >
        <a-select
          :disabled="selectedModel == ''"
          v-model="selectedField"
          style="width: 100%"
        >
          <a-select-option
            :key="field"
            v-for="field in availableFields"
            :value="field"
            >{{ field }}</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item
        v-if="selectedFilterType == 'where'"
        label="Operator"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        fieldDecoratorId="operator"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: 'Please select an operator!' }]
        }"
      >
        <a-select v-model="selectedOperator" style="width: 100%">
          <a-select-option key="=" value="=">Equal To</a-select-option>
          <a-select-option key="!=" value="!=">Not Equal To</a-select-option>
          <a-select-option key="matches" value="matches"
            >matches regex (eg: a(bc){2,5})
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="Value"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        fieldDecoratorId="value"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: 'Please select a value!' }]
        }"
      >
        <a-input style="width:100%;" v-model="selectedValue" />

        <div v-if="selectedFilterType == 'where'" style="display:inline-block;">
          <a-switch size="small" v-model="convertToInt" />
          <label style="font-size:10px;">
            Convert value to integer? (useful if value is something like an ID)
          </label>
        </div>
      </a-form-item>

      <a-form-item class="text-center">
        <a-button @click="submitFilterData" type="primary">Submit</a-button>
      </a-form-item>
    </div>
  </div>
</template>

<script>
import AdminService from "@/services/AdminService";

const columns = [
  {
    title: "Model",
    dataIndex: "relatedModel"
  },
  {
    title: "Filter Type",
    dataIndex: "filterType"
  },
  {
    title: "Field",
    dataIndex: "foreignField"
  },
  {
    title: "Operator",
    dataIndex: "compareOperator"
  },
  {
    title: "Value",
    dataIndex: "compareValue"
  },
  {
    title: "Actions",
    scopedSlots: {
      customRender: "actions"
    }
  }
];

export default {
  name: "FilterForm",
  data() {
    return {
      columns,
      swaggerData: [],
      models: [],
      data: [],
      selectedModel: null,
      selectedField: null,
      selectedFilterType: null,
      selectedOperator: null,
      selectedValue: null,
      formErrorMessage: "",
      convertToInt: false
    };
  },
  props: {
    role: {
      type: Object
    },
    user: {
      type: Object
    }
  },
  watch: {},
  created() {
    console.log("creating");
    this.selectedModel = null;
    this.selectedOperator = null;
    this.selectedValue = null;
    this.selectedFilterType = null;
    this.selectedField = null;
    this.getAllFilterData();
  },
  methods: {
    getAllFilterData() {
      AdminService.getSwagger().then(resp => {
        this.swaggerData = resp.data;
        AdminService.getModels().then(resp => {
          const modelsToExclude = ["user"];
          this.models = resp.data.filter(model => {
            return modelsToExclude.indexOf(model.modelName) === -1;
          });
          AdminService.getAllFilterData().then(resp => {
            let authCategory = "";
            let authId = "";

            if (this.user) {
              authCategory = "USER";
              authId = this.user.id;
            } else if (this.role) {
              authCategory = "ROLE";
              authId = this.role.id;
            }

            this.data = resp.data.filter(filterData => {
              return (
                filterData.authCategory === authCategory &&
                filterData.authId === authId
              );
            });
          });
        });
      });
    },
    updateFilterData(filter) {
      console.log("this is filter", filter);
      this.selectedModel = filter.relatedModel;
      this.selectedOperator = filter.compareOperator;
      this.selectedValue = filter.compareValue;
      this.selectedFilterType = filter.filterType;
      this.selectedField = filter.foreignField;
    },
    validFields() {
      let valid = true;

      if (this.selectedFilterType === "where") {
        if (this.selectedField == "" || this.selectedOperator == "") {
          valid = false;
        }
      }

      if (this.selectedFilterType === "limit") {
        if (isNaN(this.selectedValue)) {
          valid = false;
        } else {
          this.selectedValue = parseInt(this.selectedValue);
        }
      }

      if (this.convertToInt) {
        if (isNaN(this.selectedValue)) {
          valid = false;
        }
      }

      if (
        this.selectedModel == "" ||
        this.selectedFilterType == "" ||
        this.selectedValue == ""
      ) {
        valid = false;
      }

      return valid;
    },
    submitFilterData() {
      if (!this.validFields()) {
        this.formErrorMessage = "Please fill out all of the required fields";
      } else {
        this.formErrorMessage = "";

        let authCategory = "";
        let authId = "";

        if (this.user) {
          authCategory = "USER";
          authId = this.user.id;
        } else if (this.role) {
          authCategory = "ROLE";
          authId = this.role.id;
        }

        if (this.convertToInt || this.selectedFilterType === "limit") {
          this.selectedValue = parseInt(this.selectedValue);
        }

        const filterDataPayload = {
          filterType: this.selectedFilterType,
          authCategory: authCategory,
          authId: authId,
          relatedModel: this.selectedModel,
          compareOperator: this.selectedOperator,
          compareValue: this.selectedValue,
          foreignField: this.selectedField
        };

        AdminService.createFilterData(filterDataPayload)
          .then(resp => {
            this.selectedModel = null;
            this.selectedOperator = null;
            this.selectedValue = null;
            this.selectedField = null;
            this.selectedFilterType = null;
            this.visible = false;
            this.getAllFilterData();
            this.$notify({
              group: "global",
              type: "success",
              title: "Success",
              text: "You have successfully updated filters."
            });
          })
          .catch(err => {
            this.formErrorMessage = "There was an error creating this filter.";
          });
      }
    },
    removeFilterData(filterData) {
      AdminService.removeFilterData(filterData.id)
        .then(resp => {
          this.getAllFilterData();
          this.$notify({
            group: "global",
            type: "success",
            title: "Success",
            text: "You have successfully removed the filter."
          });
        })
        .catch(err => {
          this.$notify({
            group: "global",
            type: "error",
            title: "Success",
            text: "Error removing the filter."
          });
        });
    }
  },
  watch: {
    selectedModel: function(newSelectedModel) {
      // Reset selectedField since fields for new model are different
      this.selectedField = "";
    }
  },
  computed: {
    availableFields() {
      if (this.selectedModel === "") {
        return [];
      }
      return Object.keys(
        this.swaggerData.definitions[this.selectedModel].properties
      );
    }
  }
};
</script>

<style lang="less">
.new-filter-form {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid lightgrey;
}
</style>
