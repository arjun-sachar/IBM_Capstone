<template>
  <div class="admin-summary">
    <h2>Users</h2>
    <a-row>
      <a-col :span="6"></a-col>
      <a-col :span="12">
        <div class="table-search-wrapper">
          <a-input placeholder="Filter users..." v-model="searchFilter" />
        </div>
      </a-col>
      <a-col>
        <a-row type="flex" justify="end">
          <a-button @click="createUser()">Add New User</a-button>
        </a-row>
      </a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="filteredData">
      <span slot="roles" slot-scope="roles">
        <a-tag v-for="role in roles" color="blue" :key="role.name">{{
          role.name
        }}</a-tag>
      </span>
      <template slot="actions" slot-scope="user">
        <span class="buttons-wrapper">
          <a-button @click="editUser(user)" type="primary">Edit</a-button>
          <a-button type="primary">
            <a-popconfirm
              title="Are you sure you want to delete this user"
              @confirm="deleteUser(user)"
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </a-popconfirm>
          </a-button>
          <a-button @click="updatePassword(user)" type="primary"
            >Update Password</a-button
          >
        </span>
      </template>
    </a-table>

    <a-modal
      :width="750"
      @ok="handleCreateUser"
      @cancel="
        clearForm();
        showCreateUser = false;
      "
      title="Create User"
      :visible="showCreateUser"
    >
      <a-form style="width:100%">
        <a-form-item
          label="Name"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="username"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a user name!' }]
          }"
        >
          <a-input :key="`${selectedUser.id}username`" v-model="newUsername" />
        </a-form-item>
        <a-form-item
          label="Email"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="username"
          :fieldDecoratorOptions="{
            rules: [
              { required: true, message: 'Please input an email address!' }
            ]
          }"
        >
          <a-input
            type="email"
            :key="`${selectedUser.id}email`"
            v-model="newEmail"
          />
        </a-form-item>
        <a-form-item
          label="Password"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="password"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a password!' }]
          }"
        >
          <a-input
            type="password"
            :key="`${selectedUser.id}password`"
            v-model="newPassword"
          />
        </a-form-item>
        <a-form-item
          label="Roles"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="roles"
        >
          <a-select
            :key="selectedUser.id"
            mode="multiple"
            v-model="newRoles"
            style="width: 100%"
            placeholder="Please select a role"
          >
            <a-select-option v-for="role in roles" :key="role.name">{{
              role.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-button @click="generateRandomPassword()"
          >Generate Random Password</a-button
        >
        <a-form-item
          label="Temporary Password"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 19 }"
          fieldDecoratorId="temp_pass"
        >
          <a-switch style="width:50px" v-model="tempPassword" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :width="750"
      @ok="handleUpdateUser"
      @cancel="
        clearForm();
        showUserModal = false;
      "
      :title="`Edit User ${selectedUser.username}`"
      :visible="showUserModal"
    >
      <a-form>
        <a-form-item
          label="Name"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="username"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a user name!' }]
          }"
        >
          <a-input :key="`${selectedUser.id}username`" v-model="newUsername" />
        </a-form-item>
        <a-form-item
          label="Email"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="username"
          :fieldDecoratorOptions="{
            rules: [
              { required: true, message: 'Please input an email address!' }
            ]
          }"
        >
          <a-input
            type="email"
            :key="`${selectedUser.id}email`"
            v-model="newEmail"
          />
        </a-form-item>
        <a-form-item
          label="Roles"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="roles"
        >
          <a-select
            :key="selectedUser.id"
            mode="multiple"
            v-model="newRoles"
            style="width: 100%"
            placeholder="Please select a role"
          >
            <a-select-option v-for="role in roles" :key="role.name">{{
              role.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="Status"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="active"
        >
          <a-switch
            style="width:75px"
            checkedChildren="Active"
            v-model="newStatus"
            unCheckedChildren="Disabled"
          />
        </a-form-item>
        <a-form-item
          v-if="showAPIKey"
          label="API Key"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="roles"
        >
          <a-button @click="generateRandomAPIKey()" v-if="!newKeyGenerated"
            >Generate New API Key</a-button
          >
          <span
            style="margin-left:5px;font-weight:bold;color:green"
            v-if="newKeyGenerated == 'generated'"
            >Generated</span
          >
          <span
            style="margin-left:5px;font-weight:bold;color:red"
            v-if="newKeyGenerated == 'failed'"
            >Failed</span
          >
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :width="750"
      @ok="handleUpdatePassword"
      @cancel="
        clearForm();
        showUpdatePassword = false;
      "
      :title="`Reset Password for ${selectedUser.username}`"
      :visible="showUpdatePassword"
    >
      <a-alert
        v-if="message && message.length > 1"
        type="error"
        :message="message"
        banner
      />
      <a-form>
        <a-form-item
          label="Password"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="password"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a password!' }]
          }"
        >
          <a-input
            type="password"
            :key="`${selectedUser.id}password`"
            v-model="newPassword"
          />
        </a-form-item>
        <a-form-item
          label="Confirm"
          :labelCol="{ span: 3 }"
          :wrapperCol="{ span: 21 }"
          fieldDecoratorId="password"
          :fieldDecoratorOptions="{
            rules: [{ required: true, message: 'Please input a password!' }]
          }"
        >
          <a-input
            type="password"
            :key="`${selectedUser.id}password`"
            v-model="confirmPassword"
          />
        </a-form-item>

        <a-button @click="generateRandomPassword()"
          >Generate Random Password</a-button
        >
        <a-form-item
          label="Temporary Password"
          :labelCol="{ span: 5 }"
          :wrapperCol="{ span: 19 }"
          fieldDecoratorId="temp_pass"
        >
          <a-switch style="width:50px" v-model="tempPassword" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import AdminService from "@/services/AdminService";
import ErrorService from "@/services/ErrorService.js";
import config from "@/configs/ui-config.js";

const columns = [
  {
    title: "Name",
    dataIndex: "username",
    key: "username"
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Roles",
    key: "roles",
    dataIndex: "roles",
    scopedSlots: {
      customRender: "roles"
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

const data = [];
export default {
  name: "UserList",
  data() {
    return {
      data,
      newKeyGenerated: null,
      columns,
      selectedUser: "",
      showUserModal: false,
      showCreateUser: false,
      showAPIKey: config["showAPIKey"],
      roles: [],
      newUsername: "",
      newEmail: "",
      newPassword: "",
      tempPassword: false,
      newEmailVerified: false,
      newRoles: [],
      searchFilter: "",
      createUserVisible: false,
      showUpdatePassword: false,
      confirmPassword: "",
      message: "",
      newStatus: false
    };
  },
  created() {
    this.getAllUsers();
  },
  computed: {
    newRoleIds() {
      return this.newRoles.map(roleName => {
        return this.roles.filter(roleObj => {
          return roleObj.name === roleName;
        })[0].id;
      });
    },
    filteredData() {
      return this.data.filter(user => {
        return (
          user.username.toLowerCase().indexOf(this.searchFilter.toLowerCase()) >
            -1 ||
          user.email.toLowerCase().indexOf(this.searchFilter.toLowerCase()) > -1
        );
      });
    }
  },
  methods: {
    getAllUsers() {
      const promises = [];
      AdminService.getAllRoles()
        .then(resp => {
          this.roles = resp.data;
          AdminService.getAllUsers()
            .then(resp => {
              const data = resp.data;
              data.forEach(user => {
                promises.push(AdminService.getUserRoles(user.id));
              });
              Promise.all(promises).then(responses => {
                let i = 0;
                responses.forEach(resp => {
                  data[i].roles = resp.data;
                  i++;
                });
                this.data = data;
              });
            })
            .catch(err => {
              ErrorService.errorHandler(err["response"]["status"], "get users");
            });
        })
        .catch(err => {
          ErrorService.errorHandler(err["response"]["status"], "get roles");
        });
    },
    createUser() {
      this.showCreateUser = true;
    },
    editUser(user) {
      this.selectedUser = user;
      this.showUserModal = true;

      this.newUsername = user.username;
      this.newStatus = user.active;
      this.newEmail = user.email;
      this.tempPassword = user.temp_pass;
      this.newRoles = user.roles.map(role => {
        return role.name;
      });
    },
    generateRandomPassword() {
      let passtoken = "";
      const chars = "bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ";
      for (let i = 0; i < 12; i++) {
        passtoken += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.newPassword = passtoken;
      this.confirmPassword = passtoken;
      this.tempPassword = true;
      this.$notification.open({
        message: "Temporary Password:",
        description: passtoken
      });
      return passtoken;
    },
    updatePassword(user) {
      this.selectedUser = user;
      this.showUpdatePassword = true;
    },
    deleteUser(user) {
      AdminService.deleteUser(user.id)
        .then(resp => {
          this.getAllUsers();
        })
        .catch(err => {
          ErrorService.errorHandler(err["response"]["status"], "delete user");
        });
    },
    generateRandomAPIKey() {
      let apiKey = "";
      const chars = "bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ";
      for (let i = 0; i < 12; i++) {
        apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      AdminService.patchUser(this.selectedUser.id, { apikey: apiKey })
        .then(resp => {
          this.newKeyGenerated = "generated";
        })
        .catch(err => {
          this.newKeyGenerated = "failed";
          ErrorService.errorHandler(
            err["response"]["status"],
            "generate the api key"
          );
        });
    },
    clearForm() {
      this.newUsername = null;
      this.newRoles = [];
      this.newPassword = null;
      this.newEmail = null;
      this.confirmPassword = null;
      this.newKeyGenerated = null;
    },
    handleUpdatePassword() {
      if (
        this.newPassword &&
        this.newPassword.length > 2 &&
        this.newPassword == this.confirmPassword
      ) {
        AdminService.updatePassword(this.selectedUser.id, this.newPassword)
          .then(resp => {
            this.message = "";
            this.updateTempPassProperty();
          })
          .catch(err => {
            ErrorService.errorHandler(
              err["response"]["status"],
              "update password"
            );
            this.clearForm();
          });
      } else {
        if (!this.newPassword || this.newPassword.length < 2) {
          this.message = "New passwords is not valid";
        } else if (this.newPassword != this.confirmPassword) {
          this.message = "Passwords do not match";
        }
      }
    },

    updateTempPassProperty() {
      AdminService.patchUser(this.selectedUser.id, {
        temp_pass: this.tempPassword
      })
        .then(resp => {
          this.message = "";
          this.clearForm();
          this.showUpdatePassword = false;
        })
        .catch(err => {
          ErrorService.errorHandler(
            err["response"]["status"],
            "update temp pass"
          );
        });
    },

    handleCreateUser() {
      AdminService.createUser({
        username: this.newUsername,
        email: this.newEmail,
        roles: this.newRoleIds,
        password: this.newPassword,
        temp_pass: this.tempPassword
      })
        .then(resp => {
          if (resp.status == 200) {
            this.selectedUser = { id: resp.data.id };
            this.handleUpdateUser();
            this.showCreateUser = false;
          } else {
            this.$notify({
              group: "global",
              type: "error",
              title: "Error",
              text: "There was an error creating user."
            });
            this.clearForm();
          }
        })
        .catch(err => {
          ErrorService.errorHandler(err["response"]["status"], "create user");
          this.clearForm();
        });
    },
    handleUpdateUser() {
      const userObj = {
        username: this.newUsername,
        email: this.newEmail,
        roles: this.newRoleIds,
        active: this.newStatus,
        temp_pass: this.tempPassword
      };
      AdminService.updateUser(this.selectedUser.id, userObj)
        .then(resp => {
          if (resp.data.success) {
            this.getAllUsers();
            this.showUserModal = false;
            this.$notify({
              group: "global",
              type: "success",
              title: "Success",
              text: "You have successfully updated this user."
            });
            this.clearForm();
            this.showPermissionsModal = false;
          } else {
            this.$notify({
              group: "global",
              type: "error",
              title: "Error",
              text: "There was an error updating user."
            });
            this.clearForm();
          }
        })
        .catch(err => {
          ErrorService.errorHandler(err["response"]["status"], "update users");
          this.clearForm();
        });
    }
  }
};
</script>

<style lang="less"></style>
