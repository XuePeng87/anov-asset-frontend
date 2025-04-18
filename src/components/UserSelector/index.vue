<!-- 用户选择器 -->
<template>
  <div>
    <!-- 选择用户按钮 -->
    <el-button type="primary" @click="openDialog">
      <slot>选择用户</slot>
    </el-button>

    <!-- 用户选择弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="选择用户"
      width="900px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      destroy-on-close
    >
      <el-row :gutter="20">
        <!-- 部门树 -->
        <el-col :lg="6" :xs="24" class="mb-[12px]">
          <dept-tree v-model="queryParams.deptCode" @node-click="handleQuery" />
        </el-col>

        <!-- 用户列表 -->
        <el-col :lg="18" :xs="24">
          <div class="search-container mb-[12px]">
            <el-form ref="queryFormRef" :model="queryParams" :inline="true">
              <el-form-item label="用户名" prop="name">
                <el-input
                  v-model="queryParams.name"
                  placeholder="用户名"
                  clearable
                  style="width: 200px"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleQuery">
                  <i-ep-search />搜索
                </el-button>
                <el-button @click="resetQuery">
                  <i-ep-refresh />重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table
            v-loading="loading"
            :data="pageData"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              key="username"
              label="用户名"
              align="left"
              prop="name"
            />
            <el-table-column
              label="电话"
              width="180"
              align="left"
              prop="phoneNumber"
            />
            <el-table-column
              label="邮箱"
              width="220"
              align="left"
              prop="email"
            />
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">{{
                  scope.row.status == 1 ? "启用" : "禁用"
                }}</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.offset"
            v-model:limit="queryParams.limit"
            @pagination="handleQuery"
          />
        </el-col>
      </el-row>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import UserAPI from "@/api/user";
import { UserQueryRequest, UserResponse } from "@/api/user/model";

const props = defineProps({
  // 是否多选
  multiple: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// 弹窗可见性
const dialogVisible = ref(false);
const queryFormRef = ref();
const loading = ref(false);

// 查询参数
const queryParams = reactive<UserQueryRequest>({
  offset: 1,
  limit: 10,
  deptCode: "",
});

const total = ref(0);
const pageData = ref<UserResponse[]>();
const selectedUsers = ref<UserResponse[]>([]);

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
  handleQuery();
};

// 查询用户
const handleQuery = () => {
  loading.value = true;
  UserAPI.getUserPage(queryParams)
    .then((data) => {
      pageData.value = data.records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 重置查询
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.offset = 1;
  queryParams.deptCode = undefined;
  handleQuery();
};

// 选择变更
const handleSelectionChange = (selection: UserResponse[]) => {
  selectedUsers.value = selection;
};

// 确认选择
// 修改 handleConfirm 方法
const handleConfirm = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning("请选择用户");
    return;
  }

  if (!props.multiple && selectedUsers.value.length > 1) {
    ElMessage.warning("只能选择一个用户");
    return;
  }

  const result = props.multiple
    ? selectedUsers.value.map((user) => ({
        userCode: user.code || "", // 添加空字符串作为默认值
        userName: user.name || "", // 添加空字符串作为默认值
      }))
    : {
        userCode: selectedUsers.value[0].code || "", // 添加空字符串作为默认值
        userName: selectedUsers.value[0].name || "", // 添加空字符串作为默认值
      };

  emit("update:modelValue", result);
  emit("change", result);
  dialogVisible.value = false;
};
</script>
