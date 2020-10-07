<template>
  <div style="height:100%;width:100%">
    <a-row style="height:100%;width:100%">
      <div class="tile tile__header">
        <TitleBar title="Admin" />
        <div class="tile-content" style="overflow:auto">
          <a-layout style="background:white;min-height:100%;">
            <a-layout-sider
              width="200"
              style="background: white; padding-right: 10px;border-right:1px solid lightgray"
            >
              <a-menu
                @select="updateSelectedAdminMenu"
                mode="inline"
                :defaultSelectedKeys="['activity']"
                :defaultOpenKeys="['summary']"
                :style="{ height: '100%', borderRight: 0 }"
              >
                <a-sub-menu key="summary">
                  <span slot="title"><a-icon type="user" />Activity</span>
                  <a-menu-item key="activity_chart">Charts</a-menu-item>
                  <a-menu-item key="activity_list">List</a-menu-item>
                </a-sub-menu>

                <a-sub-menu key="users">
                  <span slot="title"><a-icon type="laptop" />Profiles</span>
                  <a-menu-item key="users_list">Users</a-menu-item>
                  <a-menu-item key="roles_permissions"
                    >Roles/Permissions</a-menu-item
                  >
                </a-sub-menu>

                <a-menu-item key="explorer"
                  ><a-icon type="compass" />API Explorer</a-menu-item
                >
                <a-menu-item key="feedback"
                  ><a-icon type="notification" />Feedback</a-menu-item
                >
                <a-menu-item key="system_alerts"
                  ><a-icon type="alert" />System Alerts</a-menu-item
                >
              </a-menu>
            </a-layout-sider>
            <a-layout style="background:white">
              <a-layout-content
                :style="{
                  background: 'white',
                  padding: '15px',
                  margin: 0,
                  height: '100%'
                }"
              >
                <AdminList v-if="selectedAdminMenu == 'activity_list'" />
                <AdminSummary v-if="selectedAdminMenu == 'activity_chart'" />
                <UsersList v-if="selectedAdminMenu == 'users_list'" />
                <Explorer v-if="selectedAdminMenu == 'explorer'" />
                <RemoteMethod v-if="selectedAdminMenu == 'remote_methods'" />
                <RolesPermissions
                  v-if="selectedAdminMenu == 'roles_permissions'"
                />
                <Feedback v-if="selectedAdminMenu == 'feedback'" />
                <SystemAlerts v-if="selectedAdminMenu == 'system_alerts'" />
              </a-layout-content>
            </a-layout>
          </a-layout>
        </div>
      </div>
    </a-row>
  </div>
</template>

<script>
import TitleBar from "@/components/TitleBar";
import AdminSummary from "./admin/Summary";
import AdminList from "./admin/ActivityList";
import UsersList from "./admin/UsersList";
import Explorer from "./admin/Explorer";
import RemoteMethod from "./admin/RemoteMethod";
import RolesPermissions from "./admin/RolesPermissions";
import Feedback from "./admin/Feedback";
import SystemAlerts from "./admin/SystemAlerts";

export default {
  name: "Admin",
  components: {
    AdminSummary,
    AdminList,
    UsersList,
    Explorer,
    RolesPermissions,
    TitleBar,
    Feedback,
    RemoteMethod,
    SystemAlerts
  },
  data() {
    return {
      selectedAdminMenu: "activity_chart"
    };
  },
  methods: {
    updateSelectedAdminMenu: function(val) {
      this.selectedAdminMenu = val.key;
    }
  }
};
</script>

<style lang="less">
.admin {
  margin: 10px;
  box-shadow: 0px 5px 2px 3px rgba(0, 0, 0, 0.05);
  .ant-layout {
    min-height: 500px;
  }
}
.admin-header {
  text-align: left;
  padding-left: 40px;
}
</style>
