<template>
  <div class="permission-form">
    <div class="permission-form-header">
      Permissions for role <strong>{{ role.name }}</strong>
    </div>
    <div class="permission-form-hint">
      Hint: If the checkbox is checked, role has access to it. These values do
      not reflect access-control-level values set in
      <code>&lt;model&gt;.json</code>
      <br />
      For more information, please visit
      <a
        target="_blank"
        href="https://loopback.io/doc/en/lb3/Controlling-data-access.html"
        >Controlling Data Access</a
      >.
    </div>
    <div class="permission-form-label">Models:</div>
    <a-tree
      checkable
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      v-model="checkedKeys"
      @select="onSelect"
      :selectedKeys="selectedKeys"
      :treeNodes="treeData"
    />
  </div>
</template>

<script>
import AdminService from "@/services/AdminService";

const keySeparator = "-|-";

const ACL_PROPERTIES = [
  "create",
  "pathOrCreate",
  "exists",
  "findById",
  "find",
  "findOne",
  "destroyById",
  "count",
  "patchAttributes",
  "updateAll",
  "replaceOrCreate",
  "replaceById"
];

export default {
  name: "PermissionForm",
  data() {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      allKeys: [],
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      acls: [],
      modelData: {},
      swaggerData: {}
    };
  },
  props: {
    role: {
      type: Object,
      required: true
    },
    setCheckedPermissions: {
      type: Function
    }
  },
  watch: {
    checkedKeys(val) {
      console.log("onCheck", val);
    }
  },
  created() {
    this.getAllModels();
  },
  methods: {
    onExpand(expandedKeys) {
      console.log("onExpand", arguments);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      this.selectedKeys = selectedKeys;
    },
    getAllModels() {
      AdminService.getSwagger().then(resp => {
        this.swaggerData = resp.data;
        AdminService.getAllACLs().then(resp => {
          this.acls = resp.data;
          AdminService.getModels().then(resp => {
            this.modelData = resp.data;

            this.createPermissionTree();
          });
        });
      });
    },
    createPermissionTree() {
      this.allKeys = [];
      this.selectedKeys = [];
      this.checkedKeys = [];

      this.acls.forEach(acl => {
        if (
          acl.permission === "ALLOW" &&
          acl.principalType === "ROLE" &&
          acl.principalId === this.role.name
        ) {
          this.checkedKeys.push(`${acl.model}${keySeparator}${acl.property}`);
        }
      });

      // Update tree data on modelData changes
      this.modelData.forEach(modelObj => {
        const baseKeyVal = `${modelObj.modelName}${keySeparator}*`;
        const treeDataObj = {
          title: modelObj.modelName,
          key: baseKeyVal,
          children: []
        };

        this.allKeys.push(baseKeyVal);

        const swaggerDefinition = this.swaggerData.definitions[
          modelObj.modelName
        ];

        const uniqueAclList = [];

        this.acls
          .filter(acl => {
            return (
              acl.principalType === "ROLE" && acl.principalId === this.role.name
            );
          })
          .forEach(acl => {
            const aclKey = `${modelObj.modelName}${keySeparator}${
              acl.permission
            }${keySeparator}${acl.accessType ||
              "*"}${keySeparator}${acl.property || "*"}`;
            if (uniqueAclList.indexOf(aclKey) === -1) {
              uniqueAclList.push(aclKey);
            }
          });

        let allMethods = ACL_PROPERTIES;
        if (Object.keys(modelObj.remoteMethods).length > 0) {
          allMethods = allMethods.concat(Object.keys(modelObj.remoteMethods));
        }
        allMethods.forEach(method => {
          const methodKey = `${modelObj.modelName}${keySeparator}${method}`;
          treeDataObj.children.push({
            title: method,
            key: methodKey,
            children: []
          });
          this.allKeys.push(methodKey);
        });
        this.treeData.push(treeDataObj);
      });
    }
  },
  watch: {
    checkedKeys: function(val) {
      this.setCheckedPermissions({
        checked: val,
        unchecked: this.uncheckedKeys
      });
    }
  },
  computed: {
    uncheckedKeys() {
      return this.allKeys.filter(key => {
        return this.checkedKeys.indexOf(key) === -1;
      });
    }
  }
};
</script>

<style lang="less">
.permission-form-header {
  font-size: 19px;
  margin-bottom: 7px;
}
.permission-form-hint {
  font-size: 12px;
  margin-bottom: 20px;
}
</style>
