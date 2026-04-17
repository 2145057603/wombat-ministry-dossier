(() => {
window.WOMBAT = window.WOMBAT || {};

window.WOMBAT.dimensionMeta = [
  { key: "D1", name: "纪律执法", shortName: "执法", description: "面对风险、冲突与突发局势时的判断与介入能力。" },
  { key: "D2", name: "未知探索", shortName: "探索", description: "对复杂、冷门、长期问题的耐受与研究倾向。" },
  { key: "D3", name: "教学统筹", shortName: "统筹", description: "解释复杂内容、引导他人并组织多人协作的能力。" },
  { key: "D4", name: "精密工艺", shortName: "工艺", description: "对材料、结构、细节与匹配关系的敏感度。" },
  { key: "D5", name: "生物照料", shortName: "照料", description: "对生物、生态、培育与重复维护工作的耐心和观察力。" },
  { key: "D6", name: "行政治理", shortName: "治理", description: "处理流程、规则、协调与制度运转的适配度。" },
  { key: "D7", name: "传播叙事", shortName: "传播", description: "组织信息、面向公众表达并形成叙事的能力。" },
  { key: "D8", name: "现场反应", shortName: "反应", description: "在高压、公开、高速反馈场景下的表现稳定性。" },
  { key: "D9", name: "权力取向", shortName: "权力", description: "对集中决策、强势核心与等级秩序的接受程度。" }
];

window.WOMBAT.likertOptions = [
  { value: 1, label: "非常不同意", hint: "与你的直觉和行为明显不符" },
  { value: 2, label: "比较不同意", hint: "大多数情况下不符合你" },
  { value: 3, label: "不确定", hint: "取决于情境，难以明确偏向" },
  { value: 4, label: "比较同意", hint: "多数情况下符合你" },
  { value: 5, label: "非常同意", hint: "非常符合你的直觉与习惯" }
];

window.WOMBAT.questions = [
  { id: 1, dimension: "D1", reverse: false, phase: 1, text: "如果魔法部收到黑魔法活动的零散线索，而局势已经明显升级，我通常会倾向于先介入处理，再根据新情报调整策略。" },
  { id: 2, dimension: "D2", reverse: false, phase: 1, text: "面对神秘事务司里一项长期无人解释清楚的现象，我会愿意持续研究下去，即使短时间内看不见成果。" },
  { id: 3, dimension: "D3", reverse: false, phase: 1, text: "当霍格沃茨某个项目因为教师之间意见分歧而推进缓慢时，我会自然开始思考怎样重新划分职责与规则。" },
  { id: 4, dimension: "D4", reverse: false, phase: 1, text: "在接触不同木材、杖芯或魔法材料时，我往往会注意到其中非常细小但关键的差别。" },
  { id: 5, dimension: "D5", reverse: false, phase: 1, text: "比起立刻判断一种神奇动物是否危险，我更愿意先观察它在环境中的真实状态与反应模式。" },
  { id: 6, dimension: "D6", reverse: false, phase: 1, text: "当一项事务同时牵涉魔法部、霍格沃茨与其他机构时，我愿意花精力把流程与权限边界梳理清楚。" },
  { id: 7, dimension: "D7", reverse: true, phase: 1, text: "我通常不会特别在意一件魔法事件该如何被《预言家日报》或公众理解。" },
  { id: 8, dimension: "D8", reverse: false, phase: 1, text: "在魁地奇赛场、突发事故现场或高压对峙中，我的发挥通常不会因为节奏太快而明显下滑。" },
  { id: 9, dimension: "D9", reverse: false, phase: 1, text: "当局势混乱、意见分散时，我倾向于让少数关键角色集中作出决定，以减少整体失控的可能。" },
  { id: 10, dimension: "D1", reverse: false, phase: 2, text: "如果需要面对可疑黑巫师、危险违禁魔法物品或高压审讯场面，我通常能够先维持判断，再处理情绪。" },
  { id: 11, dimension: "D2", reverse: false, phase: 2, text: "我会被那些定义模糊、资料稀少、但可能改写既有认知的魔法课题吸引。" },
  { id: 12, dimension: "D3", reverse: false, phase: 2, text: "如果低年级学生或同伴对复杂咒语机制感到困惑，我通常会先想办法把原理讲清楚，而不是只给他们标准答案。" },
  { id: 13, dimension: "D4", reverse: false, phase: 2, text: "与其在很多魔法方向上浅尝辄止，我更享受把一项能力打磨到接近专业水准。" },
  { id: 14, dimension: "D5", reverse: true, phase: 2, text: "长时间照料曼德拉草、记录神奇动物习性或维护保护区日常秩序这类工作，很容易让我失去耐心。" },
  { id: 15, dimension: "D6", reverse: false, phase: 2, text: "在学院合作、跨部门项目或大型魔法活动中，我更习惯先建立可执行的流程，而不是只表达自己的判断。" },
  { id: 16, dimension: "D7", reverse: false, phase: 2, text: "当我掌握一条重要消息时，我会自然想到它该如何写成报道、公告或说明，才能让不同人都看懂重点。" },
  { id: 17, dimension: "D8", reverse: true, phase: 2, text: "我不太喜欢被魁地奇规则、岗位职责或明确的绩效标准持续约束。" },
  { id: 18, dimension: "D9", reverse: false, phase: 2, text: "在一个层级清晰的魔法组织里，如果上级已经明确下达方向，我通常能接受暂时压后自己的个人判断。" },
  { id: 19, dimension: "D1", reverse: false, phase: 3, text: "如果霍格沃茨或魔法部突然出现紧急状况，我通常能较快判断哪些风险必须立即处理，哪些可以延后。" },
  { id: 20, dimension: "D2", reverse: false, phase: 3, text: "我对那种外界几乎不了解、保密性很强、但内部逻辑极深的机构性工作有天然兴趣。" },
  { id: 21, dimension: "D3", reverse: false, phase: 3, text: "如果一套校园制度、部门规则或保密流程需要长期稳定运转，我愿意承担那些不显眼却关键的维护责任。" },
  { id: 22, dimension: "D4", reverse: true, phase: 3, text: "如果一根魔杖、一道工序或一件魔法用品已经基本可用，我通常不会反复调整它的细节精度。" },
  { id: 23, dimension: "D5", reverse: false, phase: 3, text: "进入禁林边缘、陌生保护区或新的魔法生态环境时，我往往会先观察其中的生物关系与环境结构，而不是先寻找社交焦点。" },
  { id: 24, dimension: "D6", reverse: false, phase: 3, text: "面对复杂校规、部规或国际协定时，我通常能在现实限制下找到一个各方都能执行的方案。" },
  { id: 25, dimension: "D7", reverse: false, phase: 3, text: "如果某件与魔法世界有关的事情值得被更多人理解，我愿意主动承担解释、记录、整理或报道的工作。" },
  { id: 26, dimension: "D8", reverse: false, phase: 3, text: "我并不排斥像魁地奇比赛那样，在众人注视下完成高强度、高风险、高反馈的表现。" },
  { id: 27, dimension: "D9", reverse: false, phase: 3, text: "当一个团队因持续争论而效率下降时，我更倾向于推动统一口径，而不是继续拉长协商过程。" },
  { id: 28, dimension: "D1", reverse: true, phase: 4, text: "即使我判断现场存在明确风险，只要职责没有直接要求，我通常不会主动进入一线处理。" },
  { id: 29, dimension: "D2", reverse: false, phase: 4, text: "如果一个课题与古代魔法、预言、未知生物或禁忌知识有关，且结构复杂、意义深远，我反而更容易持续投入。" },
  { id: 30, dimension: "D3", reverse: false, phase: 4, text: "当我带领学生、队员或项目成员时，我更重视让他们理解规则背后的理由，而不是只要求他们服从。" },
  { id: 31, dimension: "D4", reverse: false, phase: 4, text: "在为某人挑选魔杖、工具、资源或训练方案时，我会特别在意它是否真正适配那个人的特性。" },
  { id: 32, dimension: "D5", reverse: false, phase: 4, text: "即使一项工作像照料火龙、维护记录、重复巡查或整理档案一样琐碎耗时，只要它对整体运转必要，我也能长期稳定完成。" },
  { id: 33, dimension: "D6", reverse: true, phase: 4, text: "我对魔法部行政协调、跨机构沟通或国际巫师事务这类工作通常兴趣不高。" },
  { id: 34, dimension: "D7", reverse: false, phase: 4, text: "当一场魁地奇比赛、魔法事故或重大事件正在发生时，我通常能很快抓住重点，并把它转化为清晰的叙述或判断。" },
  { id: 35, dimension: "D9", reverse: false, phase: 4, text: "在层级明确、目标单一的组织中，我并不排斥由一个强势核心统一方向与节奏。" },
  { id: 36, dimension: "D8", reverse: false, phase: 4, text: "当别人因为礼堂嘈杂、赛场混乱或突发状况而失去节奏时，我往往还能继续稳定发挥。" }
];

window.WOMBAT.phaseNames = {
  1: "第一阶段：契约准入",
  2: "第二阶段：能力辨识",
  3: "第三阶段：制度与现场",
  4: "第四阶段：职业画像收束"
};
})();
