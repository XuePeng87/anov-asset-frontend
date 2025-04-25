<template>
  <div class="app-container">
    <div class="search-container">
      <h3>设备：{{ assetName }}</h3>
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="维修单号" prop="code">
          <el-input v-model="queryParams.code" placeholder="请输入维修单号" />
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
        <el-table-column label="维修原因" prop="reason" />
        <el-table-column label="维修费用" prop="cost" width="120" />
        <el-table-column label="维修公司" prop="company" width="150" />
        <el-table-column label="开始时间" prop="startDate" width="120" />
        <el-table-column label="维修状态" prop="status" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">维修中</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="endDate" width="120" />
        <el-table-column label="维修结果" prop="result" />
        <el-table-column label="操作" width="160" fixed="right">
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
        <el-form-item label="维修原因" prop="reason">
          <el-input
            v-model="formData.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入维修原因"
          />
        </el-form-item>
        <el-form-item label="维修费用" prop="cost">
          <el-input-number
            v-model="formData.cost"
            :min="0"
            :precision="2"
            :step="100"
            style="width: 100%"
            placeholder="请输入维修费用"
          />
        </el-form-item>
        <el-form-item label="维修公司" prop="company">
          <el-input v-model="formData.company" placeholder="请输入维修公司" />
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

    <!-- 完成维修抽屉 -->
    <el-drawer
      v-model="completeDialog.visible"
      :title="completeDialog.title"
      :size="completeDialog.width"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      direction="rtl"
      class="custom-drawer"
      :before-close="handleCompleteClose"
      :show-close="false"
    >
      <template #header="{ titleId, titleClass }">
        <div class="custom-drawer-header">
          <h4 :id="titleId" :class="titleClass">{{ completeDialog.title }}</h4>
          <el-button type="primary" link @click="handleCompleteClose">
            <i-ep-close />
          </el-button>
        </div>
      </template>

      <el-form
        ref="completeFormRef"
        :model="completeFormData"
        :rules="completeRules"
        label-width="100px"
      >
        <el-form-item label="维修结果" prop="result">
          <el-input
            v-model="completeFormData.result"
            type="textarea"
            :rows="3"
            placeholder="请输入维修结果"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="completeFormData.endDate"
            type="date"
            placeholder="请选择结束时间"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCompleteClose">取 消</el-button>
          <el-button
            type="primary"
            @click="submitCompleteForm"
            :loading="completeSubmitLoading"
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
import { AssetRepairAPI } from "@/api/asset";
import { AssetStatus, AssetRepairStatus } from "@/api/asset/model";
import { useRoute } from "vue-router";
import type {
  AssetRepairQueryRequest,
  AssetRepairResponse,
  AssetRepairFormRequest,
} from "@/api/asset/model";

// 状态选项
const repairStatusOptions = {
  [AssetRepairStatus.IN_PROGRESS]: "维修中",
  [AssetRepairStatus.COMPLETED]: "已完成",
};

const route = useRoute();
const assetCode = ref(route.query.assetCode as string);
const assetName = ref(route.query.assetName as string);

// 查询参数
const queryParams = reactive<AssetRepairQueryRequest>({
  offset: 1,
  limit: 10,
  code: undefined,
  assetCode: assetCode.value,
  status: undefined,
});

// 表单数据
const formData = reactive<AssetRepairFormRequest>({
  assetCode: assetCode.value,
  reason: "",
  cost: 0,
  company: "",
  remark: "",
});

// 完成维修表单数据
const completeFormData = reactive({
  code: "",
  assetCode: "",
  result: "",
  endDate: "",
});

// 表单校验规则
const rules = {
  assetCode: [{ required: true, message: "请输入资产编号", trigger: "blur" }],
  reason: [{ required: true, message: "请输入维修原因", trigger: "blur" }],
  cost: [{ required: true, message: "请输入维修费用", trigger: "blur" }],
  company: [{ required: true, message: "请输入维修公司", trigger: "blur" }],
  startDate: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
};

// 完成维修表单校验规则
const completeRules = {
  result: [{ required: true, message: "请输入维修结果", trigger: "blur" }],
  endDate: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
};

// 弹窗配置
const dialog = reactive({
  visible: false,
  title: "",
  width: "600px",
});

// 完成维修弹窗配置
const completeDialog = reactive({
  visible: false,
  title: "完成维修",
  width: "600px",
});

// 其他响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const completeSubmitLoading = ref(false);
const total = ref(0);
const repairList = ref<AssetRepairResponse[]>([]);
const queryFormRef = ref();
const dataFormRef = ref();
const completeFormRef = ref();

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
      reason: "",
      cost: 0,
      company: "",
      startDate: "",
      remark: "",
    });
  }
};

// 关闭弹窗
const handleClose = async () => {
  try {
    await ElMessageBox.confirm("确认关闭窗口？未保存的数据将会丢失", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    dialog.visible = false;
    dataFormRef.value?.resetFields();
  } catch {
    // 用户取消关闭，什么都不做
  }
};

// 提交表单
const submitForm = async () => {
  if (!dataFormRef.value) return;

  await dataFormRef.value.validate();

  try {
    submitLoading.value = true;
    await AssetRepairAPI.createAssetRepair(formData);
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
const handleComplete = (row: AssetRepairResponse) => {
  completeDialog.visible = true;
  completeFormData.code = row.code;
  completeFormData.assetCode = assetCode.value;

  // 设置默认的结束时间为今天
  const today = new Date();
  completeFormData.endDate = today.toISOString().split("T")[0];
};

// 关闭完成维修弹窗
const handleCompleteClose = async () => {
  try {
    await ElMessageBox.confirm("确认关闭窗口？未保存的数据将会丢失", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    completeDialog.visible = false;
    completeFormRef.value?.resetFields();
  } catch {
    // 用户取消关闭，什么都不做
  }
};

// 提交完成维修表单
const submitCompleteForm = async () => {
  if (!completeFormRef.value) return;

  await completeFormRef.value.validate();

  try {
    completeSubmitLoading.value = true;
    await AssetRepairAPI.completeAssetRepair(
      completeFormData.code,
      completeFormData.result
    );
    ElMessage.success("维修完成");
    completeDialog.visible = false;
    getList();
  } catch (error) {
    console.error("完成维修失败:", error);
  } finally {
    completeSubmitLoading.value = false;
  }
};

onMounted(() => {
  getList();
});
</script>
