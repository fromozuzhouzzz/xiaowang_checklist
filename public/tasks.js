// 根据开店流程.csv重新设计的两级菜单任务列表
export const OPEN_TASKS = [
  {
    id: 1,
    category: '检查外围',
    tasks: [
      { id: 101, title: '招牌干净无异物无污染' },
      { id: 102, title: '地面无垃圾' },
      { id: 103, title: '外墙无异物无污染' },
      { id: 104, title: '玻璃整洁无手指纹无油污' },
      { id: 105, title: '门锁正常锁闭，正常开启' }
    ]
  },
  {
    id: 2,
    category: '进入店内，检查常开设备',
    tasks: [
      { id: 201, title: '饮料冷藏柜正常开启，温度0-5℃' },
      { id: 202, title: '冷藏展示柜正常开启，保温毯覆盖，温度0-5℃' },
      { id: 203, title: '检查地面是否有水、有油污' },
      { id: 204, title: '检查晚班是否清洁所有托盘，设备，不能有油污，有异物' }
    ]
  },
  {
    id: 3,
    category: '检查开启设备',
    tasks: [
      { id: 301, title: '检查炸锅油液面是否达标，油面不超过滤网，不低于滤网5公分，开启炸锅，温度设置160℃' },
      { id: 302, title: '粉锅加水开启温度100℃，开锅后关闭电源' },
      { id: 303, title: '检查猪油加热槽，必须有四分之一水，严禁干烧' },
      { id: 304, title: '检查煎蛋器是否正常通电' },
      { id: 305, title: '检查电陶炉是否通电' },
      { id: 306, title: '开启收银机，登录账户，检查打印机是否正常通电，打印纸是否有储备' }
    ]
  },
  {
    id: 4,
    category: '检查物料',
    tasks: [
      { id: 401, title: '检视冷藏展示柜内各种食材，观察颜色，闻气味，有变质物料及时废弃，并打入收银机' },
      { id: 402, title: '按照补货数量表，补充冷藏展示柜里面的货物，保证最低解冻产品储存在展示柜' },
      { id: 403, title: '检查饮料展示柜，按照补货数量表补充饮料' },
      { id: 404, title: '检查米粉、各种小料并补充' },
      { id: 405, title: '检查番茄包、一次性手套、筷子，并补充' },
      { id: 406, title: '检查串桶、托盘、纸碗、垃圾袋，并补充' },
      { id: 407, title: '摆好外围候客区凳子' }
    ]
  },
  {
    id: 5,
    category: '检查个人装备',
    tasks: [
      { id: 501, title: '围裙、帽子、口罩、纱手套、一次性手套' }
    ]
  },
  {
    id: 6,
    category: '检查仓库',
    tasks: [
      { id: 601, title: '所有小菜类放置在仓库，并用篮子装好' },
      { id: 602, title: '所有解冻物料是否在冷藏柜中摆放' },
      { id: 603, title: '摆好仓库外围桌椅，室内桌椅' },
      { id: 604, title: '放置好垃圾桶' }
    ]
  },
  {
    id: 7,
    category: '重点关注',
    tasks: [
      { id: 701, title: '店内不允许有整袋产品' },
      { id: 702, title: '店内不允许有袋装各种小菜' },
      { id: 703, title: '店内各种设备、小件、物料摆放请对照摆放图，按图摆放' }
    ]
  }
];

// 关店流程，基于开店流程逆向设计
export const CLOSE_TASKS = [
  {
    id: 1,
    category: '清洁设备',
    tasks: [
      { id: 101, title: '清洁炸锅，更换滤油' },
      { id: 102, title: '清洁粉锅，排空水' },
      { id: 103, title: '清洁猪油加热槽' },
      { id: 104, title: '关闭煎蛋器' },
      { id: 105, title: '关闭电陶炉' }
    ]
  },
  {
    id: 2,
    category: '整理物料',
    tasks: [
      { id: 201, title: '整理冷藏展示柜，覆盖保温毯' },
      { id: 202, title: '整理饮料展示柜' },
      { id: 203, title: '收拾串桶、托盘、纸碗' },
      { id: 204, title: '处理垃圾袋' },
      { id: 205, title: '收拾候客区凳子' }
    ]
  },
  {
    id: 3,
    category: '清洁卫生',
    tasks: [
      { id: 301, title: '清洁地面，清除水渍和油污' },
      { id: 302, title: '清洁玻璃，去除手指纹和油污' },
      { id: 303, title: '清洁外墙' },
      { id: 304, title: '清理地面垃圾' }
    ]
  },
  {
    id: 4,
    category: '收银结算',
    tasks: [
      { id: 401, title: '结算当日营业额' },
      { id: 402, title: '备份收银数据' },
      { id: 403, title: '关闭收银机' }
    ]
  },
  {
    id: 5,
    category: '安全检查',
    tasks: [
      { id: 501, title: '检查所有设备是否关闭' },
      { id: 502, title: '检查水电气开关' },
      { id: 503, title: '锁好门窗' },
      { id: 504, title: '关闭招牌灯' }
    ]
  }
];

// 店铺列表
export const STORES = [
  { id: 'store_331', name: '331店' },
  { id: 'store_bbg', name: '步步高店' }
]; 