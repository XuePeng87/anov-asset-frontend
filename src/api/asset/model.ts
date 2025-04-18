// 资产类别查询请求对象
export interface AssetCategoryQueryRequest extends PageQuery {
  code?: string;
  name?: string;
}

// 资产类别响应对象
export interface AssetCategoryResponse {
  code: string;
  name: string;
  sequence: number;
  remark: string;
  createTime: string;
}

// 资产类别分页列表对象
export type AssetCategoryPageResponse = PageResult<AssetCategoryResponse[]>;

// 资产类别创建、修改请求对象
export interface AssetCategoryFormRequest {
  code?: string;
  name?: string;
  sequence: number;
  remark?: string;
}

// 资产状态枚举
export enum AssetStatus {
  IN_STOCK = 0, // 在库
  IN_USE = 1, // 使用
  UNDER_REPAIR = 2, // 维修
  SCRAPPED = 3, // 报废
}

// 资产信息查询请求对象
export interface AssetInfoQueryRequest extends PageQuery {
  code?: string; // 资产编号
  name?: string; // 资产名称
  categoryCode?: string; // 资产分类编号
  status?: AssetStatus; // 资产状态
}

// 资产信息响应对象
export interface AssetInfoResponse {
  code: string; // 资产编号
  name: string; // 资产名称
  categoryCode: string; // 资产分类编号
  categoryName: string; // 资产分类名称
  brand?: string; // 品牌
  model?: string; // 型号
  specification?: string; // 规格
  status: AssetStatus; // 状态
  location?: string; // 存放位置
  purchaseYear?: string; // 采购年份
  price?: number; // 设备金额
  remark?: string; // 备注
  createTime: string; // 创建时间
}

// 资产信息分页列表对象
export type AssetInfoPageResponse = PageResult<AssetInfoResponse[]>;

// 资产信息创建、修改请求对象
export interface AssetInfoFormRequest {
  code?: string; // 资产编号
  name?: string; // 资产名称
  categoryCode?: string; // 资产分类编号
  brand?: string; // 品牌
  model?: string; // 型号
  specification?: string; // 规格
  location?: string; // 存放位置
  purchaseYear?: string; // 采购年份
  price?: number; // 设备金额
  remark?: string; // 备注
}

// 资产状态更新请求对象
export interface AssetStatusUpdateRequest {
  status: AssetStatus; // 状态
  remark?: string; // 备注
}

// 资产状态更新请求对象
export interface AssetStatusUpdateRequest {
  status: AssetStatus; // 状态
  remark?: string; // 备注
}

// 资产借用状态枚举
export enum AssetLoanStatus {
  LOANED = 0, // 借用
  RETURNED = 1, // 归还
}

// 资产借用查询请求对象
export interface AssetLoanQueryRequest extends PageQuery {
  code?: string; // 借用编号
  assetCode?: string; // 设备编号
  status?: AssetLoanStatus; // 借用状态
}

// 资产借用响应对象
export interface AssetLoanResponse {
  code: string; // 借用编号
  assetCode: string; // 设备编号
  assetName: string; // 设备名称
  reason: string; // 借用原因
  status: AssetLoanStatus; // 状态
  remark?: string; // 备注
  createTime: string; // 创建时间
}

// 资产借用分页列表对象
export type AssetLoanPageResponse = PageResult<AssetLoanResponse[]>;

// 资产借用创建请求对象
export interface AssetLoanFormRequest {
  userCode: string;
  userName?: string;
  assetCode: string; // 必填，设备编号
  reason: string; // 必填，借用原因
  status: AssetLoanStatus; // 必填，借用状态
  remark?: string; // 选填，备注
}

// 资产归还请求对象
export interface AssetReturnRequest {
  remark?: string; // 选填，备注
}

// 资产维修状态枚举
export enum AssetRepairStatus {
  PENDING = 0, // 待维修
  IN_PROGRESS = 1, // 维修中
  COMPLETED = 2, // 已完成
  CANCELLED = 3, // 已取消
}

// 资产维修记录查询请求对象
export interface AssetRepairQueryRequest extends PageQuery {
  code?: string; // 维修单号
  assetCode?: string; // 资产编号
  status?: AssetRepairStatus; // 维修状态
  startTime?: string; // 维修开始时间
  endTime?: string; // 维修结束时间
}

// 资产维修记录响应对象
export interface AssetRepairResponse {
  code: string; // 维修单号
  assetCode: string; // 资产编号
  assetName: string; // 资产名称
  repairReason: string; // 维修原因
  repairContent: string; // 维修内容
  repairCost: number; // 维修费用
  status: AssetRepairStatus; // 维修状态
  startTime: string; // 维修开始时间
  endTime?: string; // 维修结束时间
  repairer?: string; // 维修人员
  remark?: string; // 备注
  createTime: string; // 创建时间
}

// 资产维修记录分页列表对象
export type AssetRepairPageResponse = PageResult<AssetRepairResponse[]>;

// 资产维修记录创建请求对象
export interface AssetRepairFormRequest {
  assetCode: string; // 必填，资产编号
  repairReason: string; // 必填，维修原因
  repairContent: string; // 必填，维修内容
  repairCost: number; // 必填，维修费用
  repairer?: string; // 选填，维修人员
  startTime: string; // 必填，维修开始时间
  endTime?: string; // 选填，维修结束时间
  remark?: string; // 选填，备注
}

// 资产维修状态更新请求对象
export interface AssetRepairStatusUpdateRequest {
  status: AssetRepairStatus; // 必填，维修状态
  endTime?: string; // 选填，维修结束时间（当状态为已完成时必填）
  remark?: string; // 选填，备注
}
