# 资产管理系统API文档

## 目录
- [1. 资产类别管理](#1-资产类别管理-asset-category)
- [2. 资产信息管理](#2-资产信息管理-asset-info)
- [3. 资产借用管理](#3-资产借用管理-asset-loan)
- [4. 资产维修管理](#4-资产维修管理-asset-repair)
- [5. 资产报废管理](#5-资产报废管理-asset-scrap)
- [6. 资产状态日志](#6-资产状态日志-asset-status-log)

## 通用说明

### 状态码定义
- 资产分类错误编码：51010 - 51019
- 资产错误编码：51020 - 51029
- 资产报废错误编码：51030 - 51039
- 资产维修错误编码：51040 - 51049
- 资产借用错误编码：51050 - 51059

### 枚举值定义

#### 资产状态(AssetStatus)
```json
{
  "IN_STOCK": 0,     // 在库
  "IN_USE": 1,       // 使用
  "UNDER_REPAIR": 2, // 维修
  "SCRAPPED": 3      // 报废
}
```

#### 资产维修状态(AssetRepairStatus)
```json
{
  "PENDING": 0,    // 待维修
  "REPAIRING": 1,  // 维修中
  "COMPLETED": 2   // 已完成
}
```

#### 资产报废状态(AssetScrapStatus)
```json
{
  "SCRAPPED": 0,   // 已报废
  "CANCELLED": 1   // 取消报废
}
```

#### 资产借用状态(AssetLoanStatus)
```json
{
  "LOANED": 0,    // 借用
  "RETURNED": 1   // 归还
}
```

## 1. 资产类别管理 (Asset Category)
基础路径: `/v1/asset-categories`

### 1.1 创建资产类别
- **路径**: `/v1`
- **方法**: POST
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求体**:
```json
{
  "code": "string(32)",    // 必填，类别编号
  "name": "string(64)",    // 必填，类别名称
  "remark": "string(256)"  // 选填，备注
}
```
- **响应体**:
```json
{
  "code": 200,
  "msg": "创建资产类别成功",
  "data": true
}
```

### 1.2 修改资产类别
- **路径**: `/v1/{code}`
- **方法**: PUT
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求体**:
```json
{
  "code": "string(32)",    // 必填，类别编号
  "name": "string(64)",    // 必填，类别名称
  "remark": "string(256)"  // 选填，备注
}
```
- **响应体**:
```json
{
  "code": 200,
  "msg": "修改资产类别成功",
  "data": true
}
```

### 1.3 删除资产类别
- **路径**: `/v1`
- **方法**: DELETE
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求体**: `string[]` (类别编号数组)
- **响应体**:
```json
{
  "code": 200,
  "msg": "删除资产类别成功",
  "data": true
}
```

### 1.4 查询单个资产类别
- **路径**: `/v1/{code}`
- **方法**: GET
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **响应体**:
```json
{
  "code": 200,
  "msg": "查询资产类别成功",
  "data": {
    "code": "string",      // 类别编号
    "name": "string",      // 类别名称
    "remark": "string",    // 备注
    "createTime": "string" // 创建时间
  }
}
```

### 1.5 分页查询资产类别
- **路径**: `/v1/page`
- **方法**: GET
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求参数**:
```json
{
  "code": "string(32)",    // 选填，类别编号
  "name": "string(64)",    // 选填，类别名称
  "pageNum": 1,           // 必填，页码
  "pageSize": 10          // 必填，每页数量
}
```
- **响应体**:
```json
{
  "code": 200,
  "msg": "分页查询资产类别成功",
  "data": {
    "total": 100,
    "list": [
      {
        "code": "string",      // 类别编号
        "name": "string",      // 类别名称
        "remark": "string",    // 备注
        "createTime": "string" // 创建时间
      }
    ]
  }
}
```

## 2. 资产信息管理 (Asset Info)
基础路径: `/v1/assets`

### 2.1 创建资产信息
- **路径**: `/v1`
- **方法**: POST
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求体**:
```json
{
  "categoryCode": "string(32)",     // 必填，资产分类编号
  "name": "string(64)",            // 必填，资产名称
  "brand": "string(64)",           // 选填，品牌
  "model": "string(64)",           // 选填，型号
  "specification": "string(128)",   // 选填，规格
  "location": "string(100)",       // 选填，存放位置
  "purchaseYear": "string(10)",    // 选填，采购年份
  "price": "decimal(10,2)",        // 选填，设备金额
  "remark": "string(256)"          // 选填，备注
}
```
- **响应体**:
```json
{
  "code": 200,
  "msg": "创建资产信息成功",
  "data": true
}
```

### 2.2 修改资产信息
- **路径**: `/v1/{code}`
- **方法**: PUT
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求体**: 同创建资产信息
- **响应体**:
```json
{
  "code": 200,
  "msg": "修改资产信息成功",
  "data": true
}
```

### 2.3 更新资产状态
- **路径**: `/v1/{code}/status`
- **方法**: PUT
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求参数**:
  - status: AssetStatus (必填)
  - remark: string (选填)
- **响应体**:
```json
{
  "code": 200,
  "msg": "更新资产状态成功",
  "data": true
}
```

### 2.4 查询单个资产
- **路径**: `/v1/{code}`
- **方法**: GET
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **响应体**:
```json
{
  "code": 200,
  "msg": "查询资产信息成功",
  "data": {
    "categoryCode": "string",    // 资产分类编号
    "categoryName": "string",    // 资产分类名称
    "code": "string",           // 资产编号
    "name": "string",           // 资产名称
    "brand": "string",          // 品牌
    "model": "string",          // 型号
    "specification": "string",   // 规格
    "status": 0,                // 状态
    "location": "string",       // 存放位置
    "purchaseYear": "string",   // 采购年份
    "price": "decimal",         // 设备金额
    "remark": "string",         // 备注
    "createTime": "string"      // 创建时间
  }
}
```

## 3. 资产借用管理 (Asset Loan)
基础路径: `/v1/asset-loans`

### 3.1 创建借用记录
- **路径**: `/v1`
- **方法**: POST
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求体**:
```json
{
  "assetCode": "string(32)", // 必填，设备编号
  "reason": "string(256)",   // 必填，借用原因
  "status": 0,              // 必填，借用状态
  "remark": "string(256)"   // 选填，备注
}
```
- **响应体**:
```json
{
  "code": 200,
  "msg": "创建资产借用记录成功",
  "data": true
}
```

### 3.2 归还资产
- **路径**: `/v1/{code}/return`
- **方法**: PUT
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求参数**:
  - remark: string (选填)
- **响应体**:
```json
{
  "code": 200,
  "msg": "归还资产成功",
  "data": true
}
```

### 3.3 查询借用记录
- **路径**: `/v1/{code}`
- **方法**: GET
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **响应体**:
```json
{
  "code": 200,
  "msg": "查询资产借用记录成功",
  "data": {
    "code": "string",       // 借用编号
    "assetCode": "string",  // 设备编号
    "assetName": "string",  // 设备名称
    "reason": "string",     // 借用原因
    "status": 0,           // 状态
    "remark": "string",     // 备注
    "createTime": "string"  // 创建时间
  }
}
```

## 4. 资产维修管理 (Asset Repair)
基础路径: `/v1/asset-repairs`

### 4.1 创建维修记录
- **路径**: `/v1`
- **方法**: POST
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求体**:
```json
{
  "assetCode": "string(32)",    // 必填，设备编号
  "startDate": "date",          // 必填，报修时间
  "company": "string(128)",     // 选填，维修公司
  "cost": "decimal(10,2)",      // 选填，维修费用
  "faultCause": "string(512)",  // 选填，问题描述
  "status": 0,                  // 必填，维修状态
  "result": "string(512)",      // 选填，维修结果
  "endDate": "date",           // 选填，完成时间
  "remark": "string(256)"      // 选填，备注
}
```
- **响应体**:
```json
{
  "code": 200,
  "msg": "创建资产维修记录成功",
  "data": true
}
```

### 4.2 完成维修
- **路径**: `/v1/{code}/complete`
- **方法**: PUT
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求参数**:
  - remark: string (选填)
- **响应体**:
```json
{
  "code": 200,
  "msg": "完成维修成功",
  "data": true
}
```

## 5. 资产报废管理 (Asset Scrap)
基础路径: `/v1/asset-scraps`

### 5.1 创建报废记录
- **路径**: `/v1`
- **方法**: POST
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求体**:
```json
{
  "assetCode": "string(32)", // 必填，设备编号
  "reason": "string(512)",   // 必填，报废原因
  "status": 0,              // 必填，报废状态
  "remark": "string(256)"   // 选填，备注
}
```
- **响应体**:
```json
{
  "code": 200,
  "msg": "创建资产报废记录成功",
  "data": true
}
```

### 5.2 取消报废
- **路径**: `/v1/{code}/cancel`
- **方法**: PUT
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求参数**:
  - remark: string (选填)
- **响应体**:
```json
{
  "code": 200,
  "msg": "取消报废成功",
  "data": true
}
```

## 6. 资产状态日志 (Asset Status Log)
基础路径: `/v1/asset-status-logs`

### 6.1 查询资产状态日志
- **路径**: `/v1/asset/{assetCode}`
- **方法**: GET
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **响应体**:
```json
{
  "code": 200,
  "msg": "查询资产状态日志成功",
  "data": [
    {
      "assetCode": "string",    // 资产编号
      "statusFrom": 0,          // 原状态
      "statusTo": 1,            // 新状态
      "remark": "string",       // 备注
      "createTime": "string"    // 创建时间
    }
  ]
}
```

### 6.2 分页查询状态日志
- **路径**: `/v1/page`
- **方法**: GET
- **权限**: ROLE_SUPER_ADMIN 或 ROLE_SYSTEM_ADMIN
- **请求参数**:
```json
{
  "assetCode": "string(32)", // 选填，资产编号
  "statusFrom": 0,          // 选填，原状态
  "statusTo": 1,            // 选填，新状态
  "pageNum": 1,            // 必填，页码
  "pageSize": 10           // 必填，每页数量
}
```
- **响应体**:
```json
{
  "code": 200,
  "msg": "分页查询资产状态日志成功",
  "data": {
    "total": 100,
    "list": [
      {
        "assetCode": "string",    // 资产编号
        "statusFrom": 0,          // 原状态
        "statusTo": 1,            // 新状态
        "remark": "string",       // 备注
        "createTime": "string"    // 创建时间
      }
    ]
  }
}
```

## 通用说明
1. 所有接口都需要登录认证 (@SaCheckLogin)
2. 所有接口都需要超级管理员或系统管理员角色权限
3. 分页接口都支持标准的分页参数
4. 所有响应都使用统一的 Result 格式封装
5. 接口都有操作日志记录 (@OperateLog)
6. 时间格式统一使用 ISO-8601 标准: `YYYY-MM-DDTHH:mm:ss.sssZ`
7. 所有请求参数的验证规则都在相应的 Request 类中定义
