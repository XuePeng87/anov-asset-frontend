<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="维修单号" prop="code">
          <el-input v-model="queryParams.code" placeholder="请输入维修单号" />
        </el-form-item>
        <el-form-item label="资产编号" prop="assetCode">
          <el-input
            v-model="queryParams.assetCode"
            placeholder="请输入资产编号"
          />
        </el-form-item>
        <el-form-item label="维修状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择维修状态"
            style="width: 200px"
          >
            <el-option
              v-for="(label, value) in repairStatusOptions"
              :key="value"
              :label="label"
              :value="Number(value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()">
            <i-ep-search />搜索
          </el-button>
          <el-button @click="resetQuery()"> <i-ep-refresh />重置 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button
          type="success"
          @click="openDialog()"
          v-hasPerm="['ray:asset:repair:create']"
        >
          <i-ep-plus />创建维修
        </el-button>
      </template>

      <el-table v-loading="loading" highlight-current-row :data="repairList">
        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left" inline class="repair-table-expand">
              <el-form-item label="维修单号">
                <span>{{ props.row.code }}</span>
              </el-form-item>
              <el-form-item label="资产编号">
                <span>{{ props.row.assetCode }}</span>
              </el-form-item>
              <el-form-item label="资产名称">
                <span>{{ props.row.assetName }}</span>
              </el-form-item>
              <el-form-item label="维修原因">
                <span>{{ props.row.repairReason || "-" }}</span>
              </el-form-item>
              <el-form-item label="维修内容">
                <span>{{ props.row.repairContent || "-" }}</span>
              </el-form-item>
              <el-form-item label="维修状态">
                <el-tag v-if="props.row.status === 1" type="danger"
                  >维修中</el-tag
                >
                <el-tag v-if="props.row.status === 2" type="success"
                  >已完成</el-tag
                >
              </el-form-item>
              <el-form-item label="维修费用">
                <span>{{
                  props.row.repairCost
                    ? `￥${props.row.repairCost.toFixed(2)}`
                    : "-"
                }}</span>
              </el-form-item>
              <el-form-item label="维修人员">
                <span>{{ props.row.repairer || "-" }}</span>
              </el-form-item>
              <el-form-item label="开始时间">
                <span>{{ props.row.startTime }}</span>
              </el-form-item>
              <el-form-item label="结束时间">
                <span>{{ props.row.endTime || "-" }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remark || "-" }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="维修单号" prop="code" width="150" />
        <el-table-column label="资产编号" prop="assetCode" width="150" />
        <el-table-column label="资产名称" prop="assetName" width="150" />
        <el-table-column
          label="维修原因"
          prop="repairReason"
          show-overflow-tooltip
        />
        <el-table-column
          label="维修费用"
          prop="repairCost"
          width="120"
          align="center"
        >
          <template #default="scope">
            {{
              scope.row.repairCost
                ? `￥${scope.row.repairCost.toFixed(2)}`
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="success"
              link
              size="small"
              @click.stop="handleComplete(scope.row)"
              v-hasPerm="['ray:asset:repair:complete']"
            >
              <i-ep-check />完成维修
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.code)"
              v-hasPerm="['ray:asset:repair:edit']"
            >
              <i-ep-view />查看
            </el-button>
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
    </el-card>

    <!-- 编辑表单抽屉 -->
    <el-drawer
      v-model="dialog.visible"
      :title="dialog.title"
      :size="dialog.width"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      direction="rtl"
      class="custom-drawer"
      :before-close="handleClose"
      :show-close="false"
    >
      <template #header="{ titleId, titleClass }">
        <div class="custom-drawer-header">
          <h4 :id="titleId" :class="titleClass">{{ dialog.title }}</h4>
          <el-button type="primary" link @click="handleClose">
            <i-ep-close />
          </el-button>
        </div>
      </template>

      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="维修原因" prop="repairReason">
          <el-input
            v-model="formData.repairReason"
            type="textarea"
            :rows="3"
            placeholder="请输入维修原因"
          />
        </el-form-item>
        <el-form-item label="维修内容" prop="repairContent">
          <el-input
            v-model="formData.repairContent"
            type="textarea"
            :rows="3"
            placeholder="请输入维修内容"
          />
        </el-form-item>
        <el-form-item label="维修费用" prop="repairCost">
          <el-input-number
            v-model="formData.repairCost"
            :min="0"
            :precision="2"
            :step="100"
            style="width: 100%"
            placeholder="请输入维修费用"
          />
        </el-form-item>
        <el-form-item label="维修人员" prop="repairer">
          <el-input v-model="formData.repairer" placeholder="请输入维修人员" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button
            type="primary"
            @click="submitForm"
            :loading="submitLoading"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { AssetRepairAPI, AssetInfoAPI } from "@/api/asset";
import { AssetStatus, AssetRepairStatus } from "@/api/asset/model";
import type {
  AssetRepairQueryRequest,
  AssetRepairResponse,
  AssetRepairFormRequest,
} from "@/api/asset/model";

// 状态选项
const repairStatusOptions = {
  [AssetRepairStatus.PENDING]: "待维修",
  [AssetRepairStatus.IN_PROGRESS]: "维修中",
  [AssetRepairStatus.COMPLETED]: "已完成",
  [AssetRepairStatus.CANCELLED]: "已取消",
};

// 查询参数
const queryParams = reactive<AssetRepairQueryRequest>({
  offset: 1,
  limit: 10,
  code: undefined,
  assetCode: undefined,
  status: undefined,
});

// 表单数据
const formData = reactive<AssetRepairFormRequest>({
  assetCode: "",
  repairReason: "",
  repairContent: "",
  repairCost: 0,
  repairer: "",
  startTime: "",
  remark: "",
});

// 表单校验规则
const rules = {
  assetCode: [{ required: true, message: "请输入资产编号", trigger: "blur" }],
  repairReason: [
    { required: true, message: "请输入维修原因", trigger: "blur" },
  ],
  repairContent: [
    { required: true, message: "请输入维修内容", trigger: "blur" },
  ],
  repairCost: [{ required: true, message: "请输入维修费用", trigger: "blur" }],
  startTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
};

// 弹窗配置
const dialog = reactive({
  visible: false,
  title: "",
  width: "600px",
});

// 其他响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const total = ref(0);
const repairList = ref<AssetRepairResponse[]>([]);
const queryFormRef = ref();
const dataFormRef = ref();

// 获取维修记录列表
const getList = async () => {
  try {
    loading.value = true;
    const res = await AssetRepairAPI.getAssetRepairPage(queryParams);
    repairList.value = res.records;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
};

// 查询按钮点击
const handleQuery = () => {
  queryParams.offset = 1;
  getList();
};

// 重置按钮点击
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.offset = 1;
  getList();
};

// 打开弹窗
const openDialog = async (code?: string) => {
  dialog.title = code ? "查看维修记录" : "创建维修记录";
  dialog.visible = true;

  if (code) {
    const res = await AssetRepairAPI.getAssetRepairByCode(code);
    Object.assign(formData, res.data);
  } else {
    Object.assign(formData, {
      assetCode: "",
      repairReason: "",
      repairContent: "",
      repairCost: 0,
      repairer: "",
      startTime: "",
      remark: "",
    });
  }
};

// 关闭弹窗
const handleClose = () => {
  dialog.visible = false;
  dataFormRef.value?.resetFields();
};

// 提交表单
const submitForm = async () => {
  if (!dataFormRef.value) return;

  await dataFormRef.value.validate();

  try {
    submitLoading.value = true;
    await AssetRepairAPI.createAssetRepair(formData);

    // 更新资产状态为维修中
    await AssetInfoAPI.updateAssetStatus(formData.assetCode, {
      status: AssetStatus.UNDER_REPAIR,
    });

    ElMessage.success("创建成功");
    dialog.visible = false;
    getList();
  } catch (error) {
    console.error("提交表单失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

// 完成维修
const handleComplete = async (row: AssetRepairResponse) => {
  try {
    await ElMessageBox.confirm("确认完成该维修记录吗？", "提示", {
      type: "warning",
    });

    await AssetRepairAPI.updateAssetRepairStatus(row.code, {
      status: AssetRepairStatus.COMPLETED,
      endTime: new Date().toISOString(),
    });

    // 更新资产状态为在库
    await AssetInfoAPI.updateAssetStatus(row.assetCode, {
      status: AssetStatus.IN_STOCK,
    });

    ElMessage.success("维修完成");
    getList();
  } catch (error) {
    console.error("完成维修失败:", error);
  }
};

// 获取状态类型
const getStatusType = (status: AssetRepairStatus) => {
  const typeMap = {
    [AssetRepairStatus.PENDING]: "warning",
    [AssetRepairStatus.IN_PROGRESS]: "primary",
    [AssetRepairStatus.COMPLETED]: "success",
    [AssetRepairStatus.CANCELLED]: "info",
  };
  return typeMap[status];
};

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;

  .search-container {
    margin-bottom: 20px;
  }

  .repair-table-expand {
    padding: 20px;
  }
}

.custom-drawer {
  ::v-deep .el-drawer__header {
    padding: 16px 20px;
    margin-bottom: 0;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  ::v-deep .el-drawer__body {
    padding: 20px;
  }

  .custom-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h4 {
      margin: 0;
      font-size: 16px;
    }
  }

  .dialog-footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 16px 20px;
    text-align: right;
    background: #fff;
    border-top: 1px solid var(--el-border-color-light);
  }
}
</style>
