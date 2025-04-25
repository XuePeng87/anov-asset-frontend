<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="资产名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入资产名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="资产分类" prop="categoryCode">
          <el-select
            v-model="queryParams.categoryCode"
            placeholder="请选择资产分类"
            style="width: 200px"
            clearable
            filterable
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="领用人" prop="userCode">
          <el-select
            v-model="queryParams.userCode"
            placeholder="请选择领用人"
            filterable
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in userOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采购年份" prop="purchaseYear">
          <el-date-picker
            v-model="queryParams.purchaseYear"
            type="year"
            placeholder="请选择采购年份"
            value-format="YYYY"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="资产状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择资产状态"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="(label, value) in assetStatusOptions"
              :key="value"
              :label="label"
              :value="Number(value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"
            ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery()"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button
          type="success"
          @click="openDialog()"
          v-hasPerm="['ray:asset:info:create']"
          ><i-ep-plus />创建</el-button
        >
      </template>
      <el-table v-loading="loading" highlight-current-row :data="assetList">
        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left" inline class="asset-table-expand">
              <el-form-item label="资产名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="资产分类">
                <span>{{ props.row.categoryName }}</span>
              </el-form-item>
              <el-form-item label="品牌">
                <span>{{ props.row.brand || "-" }}</span>
              </el-form-item>
              <el-form-item label="型号">
                <span>{{ props.row.model || "-" }}</span>
              </el-form-item>
              <el-form-item label="规格">
                <span>{{ props.row.specification || "-" }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <el-tag v-if="props.row.status === 0" type="warning"
                  >在库</el-tag
                >
                <el-tag v-if="props.row.status === 1" type="success"
                  >使用</el-tag
                >
                <el-tag v-if="props.row.status === 2" type="danger"
                  >维修</el-tag
                >
                <el-tag v-if="props.row.status === 3" type="info">损坏</el-tag>
              </el-form-item>
              <el-form-item label="存放位置">
                <span>{{ props.row.location || "-" }}</span>
              </el-form-item>
              <el-form-item label="采购年份">
                <span>{{ props.row.purchaseYear || "-" }}</span>
              </el-form-item>
              <el-form-item label="设备金额">
                <span>{{
                  props.row.price ? `￥${props.row.price.toFixed(2)}` : "-"
                }}</span>
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
        <el-table-column label="资产名称" prop="name" width="180" />
        <el-table-column
          label="资产分类"
          prop="categoryName"
          width="120"
          align="center"
        />
        <el-table-column
          label="领用人"
          prop="userName"
          width="100"
          align="center"
        />
        <el-table-column label="品牌" prop="brand" width="120" />
        <el-table-column label="型号" prop="model" width="150" />
        <el-table-column label="规格" prop="specification" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="warning">在库</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">使用</el-tag>
            <el-tag v-if="scope.row.status === 2" type="danger">维修</el-tag>
            <el-tag v-if="scope.row.status === 3" type="info">损坏</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="采购年份"
          prop="purchaseYear"
          width="100"
          align="center"
        />
        <el-table-column
          label="设备金额"
          prop="price"
          width="12n0"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.price ? `￥${scope.row.price.toFixed(2)}` : "-" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.code)"
              v-hasPerm="['ray:asset:info:edit']"
              ><i-ep-edit />编辑</el-button
            >
            <el-button
              type="success"
              link
              size="small"
              @click.stop="openLoanDialog(scope.row)"
              v-hasPerm="['ray:asset:loan:create', 'ray:asset:loan:return']"
              :disabled="![0, 1].includes(scope.row.status)"
              ><i-ep-box />{{
                scope.row.status === 0 ? "领用" : "归还"
              }}</el-button
            >
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="handleOpenRepair(scope.row)"
              ><el-icon><Van /></el-icon>维修</el-button
            >
            <!-- <el-dropdown trigger="click">
              <el-button
                type="warning"
                link
                size="small"
                class="ml-2"
                style="margin-top: 2px"
              >
                <i-ep-document />日志
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="openLoanLog(scope.row)">
                    <i-ep-document style="margin-right: 4px" />领用日志
                  </el-dropdown-item>
                  <el-dropdown-item @click="openRepairLog(scope.row)">
                    <i-ep-tools style="margin-right: 4px" />维修日志
                  </el-dropdown-item>
                  <el-dropdown-item @click="openScrapLog(scope.row)">
                    <i-ep-delete style="margin-right: 4px" />报废日志
                  </el-dropdown-item>
                  <el-dropdown-item @click="openStatusLog(scope.row)">
                    <i-ep-info-filled style="margin-right: 4px" />状态日志
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown> -->
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
      :close-on-press-escape="false"
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
        <el-form-item label="资产名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入资产名称" />
        </el-form-item>
        <el-form-item label="资产分类" prop="categoryCode">
          <el-select
            v-model="formData.categoryCode"
            placeholder="请选择资产分类"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="formData.brand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="formData.model" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="formData.specification" placeholder="请输入规格" />
        </el-form-item>
        <el-form-item label="存放位置" prop="location">
          <el-input v-model="formData.location" placeholder="请输入存放位置" />
        </el-form-item>
        <el-form-item label="采购年份" prop="purchaseYear">
          <el-date-picker
            v-model="formData.purchaseYear"
            type="year"
            placeholder="请选择采购年份"
            value-format="YYYY"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="设备金额" prop="price">
          <el-input-number
            v-model="formData.price"
            :precision="2"
            :step="0.01"
            :min="0"
            style="width: 100%"
            placeholder="请输入设备金额"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="请输入备注信息"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="drawer-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 借用/归还表单侧边栏 -->
    <el-drawer
      v-model="loanDialog.visible"
      :title="loanDialog.title"
      :size="500"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      direction="rtl"
      class="custom-drawer"
      :before-close="handleLoanClose"
      :show-close="false"
    >
      <template #header="{ titleId, titleClass }">
        <div class="custom-drawer-header">
          <h4 :id="titleId" :class="titleClass">{{ loanDialog.title }}</h4>
          <el-button type="primary" link @click="handleLoanClose">
            <i-ep-close />
          </el-button>
        </div>
      </template>
      <el-form
        ref="loanFormRef"
        :model="loanForm"
        :rules="loanRules"
        label-width="100px"
      >
        <el-form-item label="资产名称">
          <span>{{ selectedAsset?.name }}</span>
        </el-form-item>
        <el-form-item label="借用人" prop="userCode">
          <el-select
            v-model="loanForm.userCode"
            placeholder="请选择借用人"
            filterable
            style="width: 100%"
            @change="handleUserChange"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="isReturn ? '归还原因' : '借用原因'" prop="reason">
          <el-input
            v-model="loanForm.reason"
            type="textarea"
            :placeholder="isReturn ? '请输入归还原因' : '请输入借用原因'"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="loanForm.remark"
            type="textarea"
            placeholder="请输入备注信息"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="drawer-footer">
          <el-button type="primary" @click="handleLoanSubmit">确 定</el-button>
          <el-button @click="handleLoanClose">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "AssetInfo",
  inheritAttrs: false,
});
import { AssetInfoAPI, AssetCategoryAPI, AssetLoanAPI } from "@/api/asset";
import UserAPI from "@/api/user";

import {
  AssetInfoQueryRequest,
  AssetInfoResponse,
  AssetInfoFormRequest,
  AssetStatus,
  AssetLoanFormRequest,
  AssetLoanStatus,
} from "@/api/asset/model";
import { AssetCategoryResponse } from "@/api/asset/model";
import { UserResponse } from "@/api/user/model";

import router from "@/router";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);
const loanFormRef = ref(ElForm);
const selectedAsset = ref<AssetInfoResponse>();
const isReturn = ref(false);

const loanDialog = reactive({
  title: "资产借用",
  visible: false,
});

const loading = ref(false);
const total = ref(0);
const categoryOptions = ref<AssetCategoryResponse[]>([]);
const userOptions = ref<UserResponse[]>([]);

// 资产状态选项
const assetStatusOptions = {
  [AssetStatus.IN_STOCK]: "在库",
  [AssetStatus.IN_USE]: "使用中",
  [AssetStatus.UNDER_REPAIR]: "维修中",
  [AssetStatus.SCRAPPED]: "已报废",
};

const queryParams = reactive<AssetInfoQueryRequest>({
  offset: 1,
  limit: 10,
});

const assetList = ref<AssetInfoResponse[]>();

const dialog = reactive({
  title: "",
  visible: false,
  width: 600,
});

const formData = reactive<AssetInfoFormRequest>({});

const loanForm = reactive<AssetLoanFormRequest>({
  assetCode: "",
  userCode: "",
  userName: "",
  reason: "",
  status: AssetLoanStatus.LOANED,
  remark: "",
});

const rules = reactive({
  code: [{ required: true, message: "请输入资产编号", trigger: "blur" }],
  name: [{ required: true, message: "请输入资产名称", trigger: "blur" }],
  categoryCode: [
    { required: true, message: "请选择资产分类", trigger: "change" },
  ],
});

const loanRules = reactive({
  userCode: [{ required: true, message: "请选择借用人", trigger: "change" }],
  reason: [{ required: true, message: "请输入原因", trigger: "blur" }],
});

// 加载资产分类选项
async function loadCategoryOptions() {
  try {
    const result = await AssetCategoryAPI.getAssetCategories();
    categoryOptions.value = result;
  } catch (error) {
    console.error("加载资产分类失败", error);
  }
}

// 加载用户选项
async function loadUserOptions() {
  try {
    const result = await UserAPI.getUser();
    userOptions.value = result;
  } catch (error) {
    console.error("加载用户列表失败", error);
  }
}

// 查询列表
function handleQuery() {
  loading.value = true;
  AssetInfoAPI.getAssetInfoPage(queryParams)
    .then((res) => {
      assetList.value = res.records;
      total.value = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 重置查询
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.offset = 1;
  handleQuery();
}

// 打开对话框
function openDialog(code?: string) {
  dialog.visible = true;
  if (code) {
    dialog.title = "修改资产信息";
    AssetInfoAPI.getAssetInfoByCode(code).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "创建资产信息";
  }
}

// 关闭对话框
function handleClose() {
  ElMessageBox.confirm("确认关闭？未保存的数据将会丢失", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      dialog.visible = false;
      resetForm();
    })
    .catch(() => {});
}

// 重置表单
function resetForm() {
  dataFormRef.value?.resetFields();
  Object.assign(formData, {
    code: undefined,
    name: undefined,
    categoryCode: undefined,
    userCode: undefined,
    brand: undefined,
    model: undefined,
    specification: undefined,
    location: undefined,
    purchaseYear: undefined,
    price: undefined,
    remark: undefined,
  });
}

// 提交表单
function handleSubmit() {
  dataFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      const assetCode = formData.code;
      if (assetCode) {
        // 修改
        AssetInfoAPI.updateAssetInfo(assetCode, formData)
          .then(() => {
            ElMessage.success("修改成功");
            dialog.visible = false;
            resetForm();
            handleQuery();
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        // 新增
        AssetInfoAPI.createAssetInfo(formData)
          .then(() => {
            ElMessage.success("创建成功");
            dialog.visible = false;
            resetForm();
            handleQuery();
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
}

// 打开借用/归还对话框
function openLoanDialog(row: AssetInfoResponse) {
  selectedAsset.value = row;
  isReturn.value = row.status === AssetStatus.IN_USE;
  loanDialog.title = isReturn.value ? "资产归还" : "资产借用";
  loanForm.assetCode = row.code;
  loanDialog.visible = true;
}

// 关闭借用对话框
function handleLoanClose() {
  ElMessageBox.confirm("确认关闭？未保存的数据将会丢失", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      loanDialog.visible = false;
      resetLoanForm();
    })
    .catch(() => {});
}

// 重置借用表单
function resetLoanForm() {
  loanFormRef.value?.resetFields();
  Object.assign(loanForm, {
    assetCode: "",
    userCode: "",
    userName: "",
    reason: "",
    status: AssetLoanStatus.LOANED,
    remark: "",
  });
  selectedAsset.value = undefined;
  isReturn.value = false;
}

// 提交借用/归还表单
function handleLoanSubmit() {
  loanFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      if (isReturn.value) {
        // 归还
        AssetLoanAPI.returnAsset(loanForm)
          .then(() => {
            ElMessage.success("归还成功");
            loanDialog.visible = false;
            resetLoanForm();
            handleQuery();
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        // 借用
        AssetLoanAPI.loanAsset(loanForm)
          .then(() => {
            ElMessage.success("借用成功");
            loanDialog.visible = false;
            resetLoanForm();
            handleQuery();
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
}

// 处理用户选择变更
function handleUserChange(value: string) {
  const selectedUser = userOptions.value.find((item) => item.code === value);
  if (selectedUser) {
    loanForm.userName = selectedUser.name;
  }
}

// 打开字典项
function handleOpenRepair(row: AssetInfoResponse) {
  router.push({
    path: "/asset/repair",
    query: { assetCode: row.code, assetName: row.name },
  });
}

// 打开领用日志
function openLoanLog(row: AssetInfoResponse) {
  // TODO: 实现领用日志查看功能
  console.log("查看领用日志", row.code);
}

// 打开维修日志
function openRepairLog(row: AssetInfoResponse) {
  // TODO: 实现维修日志查看功能
  console.log("查看维修日志", row.code);
}

// 打开报废日志
function openScrapLog(row: AssetInfoResponse) {
  // TODO: 实现报废日志查看功能
  console.log("查看报废日志", row.code);
}

// 打开状态日志
function openStatusLog(row: AssetInfoResponse) {
  // TODO: 实现状态日志查看功能
  console.log("查看状态日志", row.code);
}

// 初始化数据
onMounted(() => {
  loadCategoryOptions();
  loadUserOptions();
  handleQuery();
});
</script>

<style lang="scss" scoped>
.asset-table-expand {
  padding: 20px;

  .el-form-item {
    width: 33.33%;
    padding: 10px 40px 10px 0;
    margin-right: 0;
    margin-bottom: 0;

    :deep(.el-form-item__label) {
      width: 90px;
      color: #99a9bf;
    }

    :deep(.el-form-item__content) {
      margin-left: 90px;
    }
  }
}
</style>
