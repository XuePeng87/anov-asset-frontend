import request from "@/utils/request";
import {
  AssetCategoryQueryRequest,
  AssetCategoryResponse,
  AssetCategoryPageResponse,
  AssetCategoryFormRequest,
  AssetInfoQueryRequest,
  AssetInfoResponse,
  AssetInfoPageResponse,
  AssetInfoFormRequest,
  AssetLoanQueryRequest,
  AssetLoanResponse,
  AssetLoanPageResponse,
  AssetLoanFormRequest,
  AssetRepairQueryRequest,
  AssetRepairPageResponse,
  AssetRepairFormRequest,
  AssetRepairResponse,
} from "./model";

class AssetCategoryAPI {
  // 分页查询资产类别
  static getAssetCategoryPage(queryParams: AssetCategoryQueryRequest) {
    return request<any, AssetCategoryPageResponse>({
      url: "/v1/asset-categories/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  // 查询所有资产类别
  static getAssetCategories(queryParams?: AssetCategoryQueryRequest) {
    return request<any, AssetCategoryResponse[]>({
      url: "/v1/asset-categories/v1",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询资产类别
  static getAssetCategoryByCode(code: string) {
    return request<any, ResponseData<AssetCategoryResponse>>({
      url: "/v1/asset-categories/v1/" + code,
      method: "get",
    });
  }

  // 创建资产类别
  static createAssetCategory(data: AssetCategoryFormRequest) {
    return request({
      url: "/v1/asset-categories/v1",
      method: "post",
      data: data,
    });
  }

  // 修改资产类别
  static updateAssetCategory(code: string, data: AssetCategoryFormRequest) {
    return request({
      url: "/v1/asset-categories/v1/" + code,
      method: "put",
      data: data,
    });
  }

  // 删除资产类别
  static deleteAssetCategory(codes: string[]) {
    return request({
      url: "/v1/asset-categories/v1",
      method: "delete",
      data: codes,
    });
  }
}

class AssetInfoAPI {
  // 分页查询资产信息
  static getAssetInfoPage(queryParams: AssetInfoQueryRequest) {
    return request<any, AssetInfoPageResponse>({
      url: "/v1/assets/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  // 查询所有资产信息
  static getAssetInfos(queryParams?: AssetInfoQueryRequest) {
    return request<any, AssetInfoResponse[]>({
      url: "/v1/assets/v1/list",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询资产信息
  static getAssetInfoByCode(code: string) {
    return request<any, ResponseData<AssetInfoResponse>>({
      url: "/v1/assets/v1/" + code,
      method: "get",
    });
  }

  // 创建资产信息
  static createAssetInfo(data: AssetInfoFormRequest) {
    return request({
      url: "/v1/assets/v1",
      method: "post",
      data: data,
    });
  }

  // 修改资产信息
  static updateAssetInfo(code: string, data: AssetInfoFormRequest) {
    return request({
      url: "/v1/assets/v1/" + code,
      method: "put",
      data: data,
    });
  }

  // 删除资产信息
  static deleteAssetInfo(codes: string[]) {
    return request({
      url: "/v1/assets/v1",
      method: "delete",
      data: codes,
    });
  }
}

class AssetLoanAPI {
  // 分页查询资产借用记录
  static getAssetLoanPage(queryParams: AssetLoanQueryRequest) {
    return request<any, AssetLoanPageResponse>({
      url: "/v1/asset-loans/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询资产借用记录
  static getAssetLoanByCode(code: string) {
    return request<any, ResponseData<AssetLoanResponse>>({
      url: "/v1/asset-loans/v1/asset/" + code,
      method: "get",
    });
  }

  // 创建资产借用记录
  static loanAsset(data: AssetLoanFormRequest) {
    return request({
      url: "/v1/asset-loans/v1/loan",
      method: "post",
      data: data,
    });
  }

  // 归还资产
  static returnAsset(data: AssetLoanFormRequest) {
    return request({
      url: `/v1/asset-loans/v1/return`,
      method: "post",
      data: data,
    });
  }
}

class AssetRepairAPI {
  // 分页查询资产维修记录
  static getAssetRepairPage(queryParams: AssetRepairQueryRequest) {
    return request<any, AssetRepairPageResponse>({
      url: "/v1/asset-repairs/v1/page",
      method: "get",
      params: queryParams,
    });
  }

  // 根据编号查询资产维修记录
  static getAssetRepairByCode(code: string) {
    return request<any, ResponseData<AssetRepairResponse>>({
      url: "/v1/asset-repairs/v1/" + code,
      method: "get",
    });
  }

  // 创建资产维修记录
  static createAssetRepair(data: AssetRepairFormRequest) {
    return request({
      url: "/v1/asset-repairs/v1",
      method: "post",
      data: data,
    });
  }

  // 修改资产维修记录
  static completeAssetRepair(code: string, result: string) {
    return request({
      url: "/v1/asset-repairs/v1/" + code + "/complete?result=" + result,
      method: "put",
    });
  }
}

export { AssetCategoryAPI, AssetInfoAPI, AssetLoanAPI, AssetRepairAPI };
