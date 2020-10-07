<template>
  <div class="admin-summary">
    <h2>Roles &amp; Permissions</h2>
    <a-row>
      <a-col :span="6"></a-col>
      <a-col :span="12">
        <div class="table-search-wrapper">
          <a-input placeholder="Filter users..." v-model="searchFilter" />
        </div>
      </a-col>
      <a-col>
        <a-row type="flex" justify="end">
          <a-button @click="createRole()">Add New Role</a-button>
        </a-row>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="filteredData">
      <template slot="name" slot-scope="role">
        <span>{{ role }}</span>
      </template>
      <template slot="actions" slot-scope="role">
        <span class="buttons-wrapper">
          <a-button
            :disabled="isDefaultRole(role.name) || role.name == 'admin'"
            @click="openRoleModal(role)"
            type="primary"
            >Rename</a-button
          >
          <a-button
            :disabled="isDefaultRole(role.name) || role.name == 'admin'"
            @click="openFilterModal(role)"
            type="primary"
            >Filters</a-button
          >
          <a-button
            :disabled="role.name == 'admin'"
            @click="openPermissionsModal(role)"
            type="primary"
            >Permissions</a-button
          >
          <a-button
            type="primary"
            :disabled="isDefaultRole(role.name) || role.name == 'admin'"
          >
            <a-popconfirm
              title="Are you sure you want to delete this role"
              @confirm="deleteRole(role)"
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
      @ok="updateRoleName"
      @cancel="showRoleModal = false"
      title="Edit Role"
      :visible="showRoleModal"
    >
      <a-form @submit="handleUpdateRole">
        <a-form-item
          label="Role"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="role"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a role name!' }]
          }"
        >
          <a-input
            v-model="newRoleName"
            :key="selectedRole.id"
            :defaultValue="selectedRole.name"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      @ok="updateACLs()"
      @cancel="showPermissionsModal = false"
      :title="`Edit Permissions for Role`"
      :visible="showPermissionsModal"
    >
      <PermissionForm
        :key="selectedRole.id"
        :role="selectedRole"
        :setCheckedPermissions="setCheckedPermissions"
      />
    </a-modal>
    <a-modal
      @ok="showFiltersModal = false"
      :destroyOnClose="true"
      @cancel="showFiltersModal = false"
      :title="`Edit Filters for Role`"
      :visible="showFiltersModal"
      :width="1024"
    >
      <FilterForm :key="selectedRole.id" :role="selectedRole" />
    </a-modal>
    <a-modal
      @ok="handleCreateRole"
      @cancel="
        newRoleName = '';
        showCreateRole = false;
      "
      title="Edit Role"
      :visible="showCreateRole"
    >
      <a-form>
        <a-form-item
          label="Role"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="role"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a role name!' }]
          }"
        >
          <a-input v-model="newRoleName" :key="selectedRole.id" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import AdminService from "@/services/AdminService";
import PermissionForm from "@/components/forms/PermissionForm";
import FilterForm from "@/components/forms/FilterForm";

const defaultRoles = [
  {
    name: "$everyone",
    id: "$everyone"
  },
  {
    name: "$authenticated",
    id: "$authenticated"
  }
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    scopedSlots: {
      customRender: "name"
    }
  },
  {
    title: "Actions",
    scopedSlots: {
      customRender: "actions"
    },
    width: "450px"
  }
];

const data = [];
export default {
  name: "RolesPermissions",
  data() {
    return {
      data,
      columns,
      showPermissionsModal: false,
      showRoleModal: false,
      showFiltersModal: false,
      selectedRole: "",
      newRoleName: "",
      searchFilter: "",
      showCreateRole: false
    };
  },
  components: {
    PermissionForm,
    FilterForm
  },
  created() {
    this.getAllRoles();
  },
  methods: {
    getAllRoles() {
      AdminService.getAllRoles().then(resp => {
        this.data = defaultRoles.concat(resp.data);
      });
    },
    handleUpdateRole(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    },
    handleCreateRole() {
      AdminService.createRole(this.newRoleName).then(resp => {
        this.showCreateRole = false;
        this.newRoleName = "";
        this.getAllRoles();
      });
    },
    createRole() {
      this.showCreateRole = true;
    },
    deleteRole(role) {
      AdminService.deleteRole(role.id).then(resp => {
        this.getAllRoles();
      });
    },
    openRoleModal(role) {
      this.selectedRole = role;
      this.newRoleName = role.name;
      this.showRoleModal = !this.showRoleModal;
    },
    openPermissionsModal(role) {
      this.selectedRole = role;
      this.showPermissionsModal = !this.showPermissionsModel;
    },
    openFilterModal(role) {
      this.selectedRole = role;
      this.showFiltersModal = !this.showFiltersModal;
    },
    updateSelectedRoleName(a, b, c) {
      console.log(a, b, c);
    },
    isDefaultRole(roleName) {
      return (
        defaultRoles
          .map(roleObj => {
            return roleObj.id;
          })
          .indexOf(roleName) > -1
      );
    },
    updateRoleName() {
      const roleNameExists = roleName => {
        return (
          this.data.filter(role => {
            return role.name == roleName;
          }).length > 0
        );
      };

      if (this.newRoleName != "" && !roleNameExists(this.newRoleName)) {
        AdminService.updateRoleName(
          this.selectedRole.id,
          this.newRoleName
        ).then(resp => {
          this.getAllRoles();
          this.showRoleModal = false;
        });
      } else {
        this.$notify({
          group: "global",
          title: "Error",
          type: "error",
          text: "New role name is invalid."
        });
      }
    },
    updateACLs() {
      AdminService.updateRoleACLs(
        this.selectedRole.name,
        this.checkedPermissions
      ).then(resp => {
        if (resp.data.success) {
          this.$notify({
            group: "global",
            type: "success",
            title: "Success",
            text: "You have successfully updated permissions for this role."
          });
          this.showPermissionsModal = false;
        } else {
          this.$notify({
            group: "global",
            title: "Error",
            text: "There was an error updating permissions."
          });
        }
      });
    },
    setCheckedPermissions(checkedPermissions) {
      this.checkedPermissions = checkedPermissions;
    }
  },
  computed: {
    filteredData() {
      return this.data.filter(role => {
        return role.name.indexOf(this.searchFilter) > -1;
      });
    }
  }
};
</script>

<style lang="less">
.buttons-wrapper {
  > button {
    margin-right: 10px;
  }
}
</style>
