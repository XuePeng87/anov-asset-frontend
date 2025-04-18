<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入类别名称" />
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
          v-hasPerm="['ray:asset:category:create']"
          ><i-ep-plus />创建</el-button
        >
      </template>
      <el-table
        v-loading="loading"
        highlight-current-row
        :data="categoryList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="类别名称" prop="name" width="400" />
        <el-table-column
          label="排序号"
          prop="sequence"
          width="300"
          align="center"
        />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="openDialog(scope.row.code)"
              v-hasPerm="['ray:asset:category:edit']"
              ><i-ep-edit />编辑</el-button
            >
            <el-button
              type="primary"
              link
              size="small"
              @click.stop="handleDelete(scope.row.code)"
              v-hasPerm="['ray:asset:category:delete']"
              ><i-ep-delete />删除</el-button
            >
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
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入类别名称" />
        </el-form-item>
        <el-form-item label="排序号" prop="sequence">
          <el-input-number
            v-model="formData.sequence"
            :min="0"
            :max="9999"
            placeholder="请输入排序号"
            style="width: 100%"
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
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "AssetCategory",
  inheritAttrs: false,
});

import { AssetCategoryAPI } from "@/api/asset";
import {
  AssetCategoryQueryRequest,
  AssetCategoryResponse,
  AssetCategoryFormRequest,
} from "@/api/asset/model";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const codes = ref<string[]>([]);
const total = ref(0);

const queryParams = reactive<AssetCategoryQueryRequest>({
  offset: 1,
  limit: 10,
  sort: "sequence",
  order: "asc",
});

const categoryList = ref<AssetCategoryResponse[]>();

const dialog = reactive({
  title: "",
  visible: false,
  width: 500,
});

const formData = reactive<AssetCategoryFormRequest>({
  code: undefined,
  name: undefined,
  sequence: 1,
  remark: undefined,
});

const rules = reactive({
  name: [{ required: true, message: "请输入类别名称", trigger: "blur" }],
  sequence: [{ required: true, message: "请输入排序值", trigger: "blur" }],
});

// 查询列表
function handleQuery() {
  loading.value = true;
  AssetCategoryAPI.getAssetCategoryPage(queryParams)
    .then((data) => {
      categoryList.value = data.records;
      total.value = data.total;
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

// 表格多选
function handleSelectionChange(selection: any) {
  codes.value = selection.map((item: any) => item.code);
}

// 打开对话框
function openDialog(code?: string) {
  dialog.visible = true;
  if (code) {
    dialog.title = "修改资产类别";
    AssetCategoryAPI.getAssetCategoryByCode(code).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "创建资产类别";
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
    sequence: 1,
    remark: undefined,
  });
}

// 提交表单
function handleSubmit() {
  dataFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      const categoryCode = formData.code;
      if (categoryCode) {
        // 修改
        AssetCategoryAPI.updateAssetCategory(categoryCode, formData)
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
        AssetCategoryAPI.createAssetCategory(formData)
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

// 删除
function handleDelete(code: string) {
  ElMessageBox.confirm("是否确认删除该资产类别?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    AssetCategoryAPI.deleteAssetCategory([code])
      .then(() => {
        ElMessage.success("删除成功");
        handleQuery();
      })
      .finally(() => {
        loading.value = false;
      });
  });
}

// 初始化数据
onMounted(() => {
  handleQuery();
});
</script>
