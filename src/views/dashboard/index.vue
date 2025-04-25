<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="card-panel">
      <el-col :span="6" v-for="item in cardPanelData" :key="item.title">
        <el-card shadow="hover" class="card-item">
          <div class="card-item-content">
            <div class="left-icon" :style="{ background: item.bgColor }">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="right-content">
              <div class="card-title">{{ item.title }}</div>
              <div class="card-num">{{ item.number }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="8">
        <el-card shadow="hover">
          <div ref="loanRateChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div ref="usageTop5tRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div ref="usageChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="8">
        <el-card shadow="hover">
          <div ref="costYearChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div ref="userCostChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div ref="testChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import "echarts-wordcloud";

// 顶部卡片数据
const cardPanelData = ref([
  {
    title: "资产总数",
    number: "1,234",
    icon: "Goods",
    bgColor: "#409EFF",
  },
  {
    title: "资产总金额",
    number: "￥1,234,567",
    icon: "Money",
    bgColor: "#67C23A",
  },
  {
    title: "领用资产数",
    number: "328",
    icon: "Box",
    bgColor: "#E6A23C",
  },
  {
    title: "在库资产数",
    number: "735",
    icon: "House",
    bgColor: "#F56C6C",
  },
]);

// 图表DOM引用
const loanRateChartRef = ref<HTMLElement | null>(null);
const categoryChartRef = ref<HTMLElement | null>(null);
const usageTop5tRef = ref<HTMLElement | null>(null);
const trendChartRef = ref<HTMLElement | null>(null);
const usageChartRef = ref<HTMLElement | null>(null);
const costYearChart = ref<HTMLElement | null>(null);
const userCostChart = ref<HTMLElement | null>(null);
const testChart = ref<HTMLElement | null>(null);

// 资产借出率
const initLoanRateChart = () => {
  const chart = echarts.init(loanRateChartRef.value!);

  // 计算借出率
  const totalAssets = 1234; // 总资产数
  const loanedAssets = 328; // 借出数量
  const loanRate = Math.round((loanedAssets / totalAssets) * 100);

  const option = {
    title: {
      text: "资产借出率",
      left: "center",
    },
    tooltip: {
      formatter: "{a} <br/>{b} : {c}%",
    },
    series: [
      {
        name: "借出率",
        type: "gauge",
        min: 0,
        max: 100,
        progress: {
          show: true,
          roundCap: true,
          width: 18,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 18,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        anchor: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          fontSize: 40,
          offsetCenter: [0, 0],
          formatter: "{value}%",
          color: "inherit",
        },
        data: [
          {
            value: loanRate,
            name: "借出率",
            title: {
              show: true,
              offsetCenter: [0, "20%"],
              color: "#999",
              fontSize: 14,
            },
            detail: {
              valueAnimation: true,
              offsetCenter: [0, "-15%"],
              color: "#36a3f7",
            },
          },
        ],
      },
    ],
  };

  chart.setOption(option);
  return chart;
};

// 设备借出频率词云
const initTrendChart = () => {
  const chart = echarts.init(trendChartRef.value!);
  const option = {
    title: {
      text: "设备借出频率词云",
      left: "center",
    },
    tooltip: {
      show: true,
    },
    series: [
      {
        type: "wordCloud",
        shape: "circle",
        left: "center",
        top: "center",
        width: "90%",
        height: "90%",
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-45, 45],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          fontFamily: "sans-serif",
          fontWeight: "bold",
          color: function () {
            return (
              "rgb(" +
              [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
              ].join(",") +
              ")"
            );
          },
        },
        emphasis: {
          textStyle: {
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },
        data: [
          { name: "笔记本电脑", value: 458 },
          { name: "打印机", value: 386 },
          { name: "投影仪", value: 312 },
          { name: "办公座椅", value: 287 },
          { name: "显示器", value: 265 },
          { name: "会议室设备", value: 244 },
          { name: "摄像头", value: 223 },
          { name: "手机", value: 212 },
          { name: "平板电脑", value: 192 },
          { name: "办公桌", value: 187 },
          { name: "键盘", value: 165 },
          { name: "鼠标", value: 157 },
          { name: "耳机", value: 145 },
          { name: "文件柜", value: 132 },
          { name: "扫描仪", value: 128 },
          { name: "碎纸机", value: 115 },
          { name: "U盘", value: 108 },
          { name: "移动硬盘", value: 98 },
          { name: "复印机", value: 92 },
          { name: "传真机", value: 87 },
        ].sort(function (a, b) {
          return b.value - a.value;
        }),
      },
    ],
  };

  chart.setOption(option);
  return chart;
};

// 借出率top5
const initUsageTop5 = () => {
  const chart = echarts.init(usageTop5tRef.value!);
  const option = {
    title: {
      text: "借出数量TOP5用户",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: "{b}: {c}件",
    },
    grid: {
      top: "50",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "借出数量",
      nameTextStyle: {
        color: "#666",
      },
      axisLabel: {
        formatter: "{value}件",
      },
    },
    yAxis: {
      type: "category",
      data: ["张三", "李四", "王五", "赵六", "钱七"],
      axisLabel: {
        color: "#666",
      },
    },
    series: [
      {
        name: "借出数量",
        type: "bar",
        data: [42, 38, 34, 29, 26],
        barWidth: "40%",
        label: {
          show: true,
          position: "right",
          formatter: "{c}件",
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#409EFF",
            },
            {
              offset: 1,
              color: "#36a3f7",
            },
          ]),
          borderRadius: [0, 4, 4, 0],
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: "#36a3f7",
              },
              {
                offset: 1,
                color: "#409EFF",
              },
            ]),
          },
        },
      },
    ],
  };

  chart.setOption(option);
  return chart;
};

// 初始化分类分布图表
const initCategoryChart = () => {
  const chart = echarts.init(categoryChartRef.value!);
  const option = {
    title: {
      text: "资产分类分布",
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: "80px",
      left: "3%",
      right: "8%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [
        "办公设备",
        "电子设备",
        "运输设备",
        "生产设备",
        "通信设备",
        "安防设备",
        "医疗设备",
        "实验设备",
        "教学设备",
        "体育器材",
        "家具用具",
        "工程设备",
        "消防设备",
        "清洁设备",
        "园艺设备",
        "测量设备",
        "照明设备",
        "音响设备",
        "视频设备",
        "空调设备",
        "供电设备",
        "网络设备",
        "存储设备",
        "打印设备",
        "扫描设备",
        "复印设备",
        "传真设备",
        "会议设备",
        "监控设备",
        "考勤设备",
        "门禁设备",
        "广播设备",
        "其他设备",
      ],
      axisLabel: {
        interval: 0, // 显示所有标签
        rotate: 45, // 45度角倾斜显示
        fontSize: 12,
        margin: 15, // 增加标签与轴线的距离
        formatter: function (value: string) {
          // 如果文字太长，截断并添加省略号
          if (value.length > 6) {
            return value.substring(0, 6) + "...";
          }
          return value;
        },
      },
    },
    yAxis: {
      type: "value",
      name: "数量",
      nameTextStyle: {
        padding: [0, 0, 0, 30], // 调整y轴名称位置
      },
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        bottom: 0,
        height: 20,
        start: 0,
        end: 50, // 默认显示前50%的数据
      },
    ],
    series: [
      {
        name: "资产数量",
        type: "bar",
        barWidth: "60%", // 调整柱子宽度
        data: Array(33)
          .fill(0)
          .map(() => Math.floor(Math.random() * 200 + 50)), // 模拟数据
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#83bff6" },
            { offset: 0.5, color: "#188df0" },
            { offset: 1, color: "#188df0" },
          ]),
        },
      },
    ],
  };
  chart.setOption(option);
  return chart;
};

// 初始化使用率图表
const initUsageChart = () => {
  const chart = echarts.init(usageChartRef.value!);
  const option = {
    title: {
      text: "资产使用率TOP5",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      max: 100,
    },
    yAxis: {
      type: "category",
      data: ["办公座椅", "会议室显示器", "打印机", "投影仪", "笔记本电脑"],
      axisLabel: {
        interval: 0,
      },
    },
    series: [
      {
        name: "使用率",
        type: "bar",
        data: [75, 78, 82, 88, 95],
        label: {
          show: true,
          position: "right",
          formatter: "{c}%",
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: "#f56c6c" },
            { offset: 1, color: "#e6a23c" },
          ]),
        },
      },
    ],
  };
  chart.setOption(option);
  return chart;
};

// 每年采购金额
const initCostYearChart = () => {
  const chart = echarts.init(costYearChart.value!);
  const option = {
    title: {
      text: "历年资产采购数量趋势",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["2018", "2019", "2020", "2021", "2022", "2023"],
      axisLabel: {
        color: "#666",
      },
      axisLine: {
        lineStyle: {
          color: "#ddd",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "采购数量",
      nameTextStyle: {
        color: "#666",
        padding: [0, 0, 0, 30],
      },
      axisLabel: {
        color: "#666",
        formatter: "{value}件",
      },
      splitLine: {
        lineStyle: {
          color: "#eee",
        },
      },
    },
    series: [
      {
        name: "采购数量",
        type: "line",
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#409EFF",
        },
        itemStyle: {
          color: "#409EFF",
          borderWidth: 2,
        },
        symbol: "circle",
        symbolSize: 8,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(64, 158, 255, 0.3)",
            },
            {
              offset: 1,
              color: "rgba(64, 158, 255, 0.1)",
            },
          ]),
        },
        emphasis: {
          scale: true,
          focus: "series",
        },
        data: [156, 230, 324, 475, 612, 789],
      },
    ],
  };

  chart.setOption(option);
  return chart;
};

// 用户使用设备金额
const initUserCostChart = () => {
  const chart = echarts.init(userCostChart.value!);
  const option = {
    title: {
      text: "用户借用设备总金额占比",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>金额：￥{c}<br/>占比：{d}%",
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "middle",
      itemWidth: 10,
      itemHeight: 10,
      icon: "circle",
    },
    series: [
      {
        name: "借用金额",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["60%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{b}\n{d}%",
          fontSize: 14,
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
          smooth: true,
        },
        data: [
          {
            value: 45600,
            name: "张三",
            itemStyle: { color: "#409EFF" },
          },
          {
            value: 38400,
            name: "李四",
            itemStyle: { color: "#67C23A" },
          },
          {
            value: 32800,
            name: "王五",
            itemStyle: { color: "#E6A23C" },
          },
          {
            value: 28900,
            name: "赵六",
            itemStyle: { color: "#F56C6C" },
          },
          {
            value: 25600,
            name: "钱七",
            itemStyle: { color: "#909399" },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
      },
    ],
  };

  chart.setOption(option);
  return chart;
};

const initTestChart = () => {
  const chart = echarts.init(testChart.value!);
  const option = {
    title: {
      text: "资产价值区间分布",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "25",
      orient: "horizontal",
      left: "center",
      icon: "circle",
    },
    series: [
      {
        name: "价值区间",
        type: "pie",
        radius: ["20%", "80%"],
        center: ["50%", "55%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{b}\n{c}个",
          alignTo: "edge",
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: 15,
        },
        labelLine: {
          smooth: true,
          length: 15,
          length2: 10,
        },
        data: [
          {
            value: 320,
            name: "1000元以下",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 1, color: "#409EFF" },
              ]),
            },
          },
          {
            value: 240,
            name: "1000-3000元",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#95d475" },
                { offset: 1, color: "#67C23A" },
              ]),
            },
          },
          {
            value: 180,
            name: "3000-5000元",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#fcd594" },
                { offset: 1, color: "#E6A23C" },
              ]),
            },
          },
          {
            value: 150,
            name: "5000-10000元",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#f89898" },
                { offset: 1, color: "#F56C6C" },
              ]),
            },
          },
          {
            value: 100,
            name: "1-3万元",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#b7b7b7" },
                { offset: 1, color: "#909399" },
              ]),
            },
          },
          {
            value: 60,
            name: "3-5万元",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#c8a7ff" },
                { offset: 1, color: "#9a60b4" },
              ]),
            },
          },
          {
            value: 30,
            name: "5万元以上",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#ffa1c1" },
                { offset: 1, color: "#ff6b9b" },
              ]),
            },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  chart.setOption(option);
  return chart;
};

// 保存图表实例
let charts: echarts.ECharts[] = [];

// 监听窗口大小变化
const handleResize = () => {
  charts.forEach((chart) => chart?.resize());
};

onMounted(() => {
  // 初始化所有图表并保存实例
  charts = [
    initLoanRateChart(),
    initCategoryChart(),
    initUsageTop5(),
    initTrendChart(),
    initUsageChart(),
    initCostYearChart(),
    initUserCostChart(),
    initTestChart(),
  ];

  // 添加窗口大小变化监听
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  // 移除窗口大小变化监听
  window.removeEventListener("resize", handleResize);
  // 销毁图表实例
  charts.forEach((chart) => chart?.dispose());
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f0f2f5;

  .card-panel {
    margin-bottom: 20px;

    .card-item {
      .card-item-content {
        display: flex;
        align-items: center;
        padding: 20px;

        .left-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          margin-right: 15px;
          border-radius: 8px;

          :deep(.el-icon) {
            font-size: 30px;
            color: #fff;
          }
        }

        .right-content {
          .card-title {
            margin-bottom: 8px;
            font-size: 14px;
            color: #909399;
          }

          .card-num {
            font-size: 24px;
            font-weight: bold;
          }
        }
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;

    .chart-container {
      height: 350px;
      padding: 20px;
    }
  }
}
</style>
