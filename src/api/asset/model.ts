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
  code?: string;
  name?: string;
  categoryCode?: string;
  status?: AssetStatus;
}

// 资产信息响应对象
export interface AssetInfoResponse {
  code: string;
  name: string;
  categoryCode: string;
  categoryName: string;
  brand?: string;
  model?: string;
  specification?: string;
  status: AssetStatus;
  location?: string;
  purchaseYear?: string;
  price?: number;
  remark?: string;
  createTime: string;
}

// 资产信息分页列表对象
export type AssetInfoPageResponse = PageResult<AssetInfoResponse[]>;

// 资产信息创建、修改请求对象
export interface AssetInfoFormRequest {
  code?: string;
  name?: string;
  categoryCode?: string;
  brand?: string;
  model?: string;
  specification?: string;
  location?: string;
  purchaseYear?: string;
  price?: number;
  remark?: string;
}

// 资产借用状态枚举
export enum AssetLoanStatus {
  LOANED = 0, // 借用
  RETURNED = 1, // 归还
}

// 资产借用查询请求对象
export interface AssetLoanQueryRequest extends PageQuery {
  code?: string;
  assetCode?: string;
  status?: AssetLoanStatus;
}

// 资产借用响应对象
export interface AssetLoanResponse {
  code: string;
  assetCode: string;
  assetName: string;
  reason: string;
  status: AssetLoanStatus;
  remark?: string;
  createTime: string;
}

// 资产借用分页列表对象
export type AssetLoanPageResponse = PageResult<AssetLoanResponse[]>;

// 资产借用创建请求对象
export interface AssetLoanFormRequest {
  userCode: string;
  userName?: string;
  assetCode: string;
  reason: string;
  status: AssetLoanStatus;
  remark?: string;
}

// 资产维修状态枚举
export enum AssetRepairStatus {
  IN_PROGRESS = 0, // 维修中
  COMPLETED = 1, // 已完成
}

// 资产维修记录查询请求对象
export interface AssetRepairQueryRequest extends PageQuery {
  code?: string;
  assetCode?: string; // 资产编号
  status?: AssetRepairStatus; // 维修状态
  startDate?: string; // 维修开始时间
  endDate?: string; // 维修结束时间
}

// 资产维修记录响应对象
export interface AssetRepairResponse {
  code: string;
  status: AssetRepairStatus;
  assetCode: string;
  assetName: string;
  reason: string;
  cost: number;
  company?: string;
  startDate: string;
  endDate?: string;
  result?: string;
  remark?: string;
}

// 资产维修记录分页列表对象
export type AssetRepairPageResponse = PageResult<AssetRepairResponse[]>;

// 资产维修记录创建请求对象
export interface AssetRepairFormRequest {
  assetCode: string;
  reason: string;
  cost: number;
  company?: string;
  remark?: string;
}
