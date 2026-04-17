(() => {
window.WOMBAT = window.WOMBAT || {};

const questions = window.WOMBAT.questions;
const dimensionMeta = window.WOMBAT.dimensionMeta;
const careers = window.WOMBAT.careers;

const dimensionNames = dimensionMeta.reduce((acc, item) => {
  acc[item.key] = item.name;
  return acc;
}, {});

function normalizeDimension(rawScore) {
  return Math.round(((rawScore - 4) / 16) * 100);
}

function getAnswerScore(question, answer) {
  if (answer == null) {
    return 0;
  }
  return question.reverse ? 6 - answer : answer;
}

function computeDimensionScores(answerMap) {
  const raw = Object.fromEntries(dimensionMeta.map((item) => [item.key, 0]));

  for (const question of questions) {
    const answer = answerMap[question.id];
    const value = getAnswerScore(question, answer);
    raw[question.dimension] += value;
  }

  const normalized = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, normalizeDimension(value)])
  );

  return { raw, normalized };
}

function computeCareerMatch(normalizedScores, career) {
  let weightedTotal = 0;
  let weightSum = 0;

  for (const [dimensionKey, target] of Object.entries(career.targets)) {
    const importance = career.importance[dimensionKey] ?? 1;
    const closeness = 100 - Math.abs((normalizedScores[dimensionKey] ?? 0) - target);
    weightedTotal += closeness * importance;
    weightSum += importance;
  }

  return Number((weightedTotal / weightSum).toFixed(1));
}

function passesDarkThreshold(career, normalizedScores, mode) {
  if (!career.dark) {
    return true;
  }
  if (mode !== "entertainment") {
    return false;
  }
  if (career.id === "death_eater") {
    return normalizedScores.D9 >= 75;
  }
  if (career.id === "dark_lord") {
    return normalizedScores.D9 >= 85 && normalizedScores.D1 >= 70;
  }
  return true;
}

function rankCareers(normalizedScores, mode) {
  return careers
    .filter((career) => passesDarkThreshold(career, normalizedScores, mode))
    .map((career) => ({
      ...career,
      matchScore: computeCareerMatch(normalizedScores, career)
    }))
    .sort((left, right) => {
      if (right.matchScore !== left.matchScore) {
        return right.matchScore - left.matchScore;
      }

      const leftCore = Object.entries(left.importance)
        .filter(([, value]) => value === 3)
        .reduce((sum, [key]) => sum + normalizedScores[key], 0);
      const rightCore = Object.entries(right.importance)
        .filter(([, value]) => value === 3)
        .reduce((sum, [key]) => sum + normalizedScores[key], 0);

      return rightCore - leftCore;
    });
}

function describeScoreLevel(score) {
  if (score >= 80) return "极高";
  if (score >= 60) return "偏高";
  if (score >= 40) return "中段";
  if (score >= 20) return "偏低";
  return "极低";
}

function buildCareerInsights(normalizedScores, rankedCareers) {
  const primaryCareer = rankedCareers[0];
  if (!primaryCareer) {
    return {
      topDrivers: [],
      weakestGap: null,
      explanationBlocks: []
    };
  }

  const comparisons = Object.keys(primaryCareer.targets).map((dimensionKey) => {
    const target = primaryCareer.targets[dimensionKey];
    const actual = normalizedScores[dimensionKey];
    const gap = Math.abs(actual - target);
    return {
      dimensionKey,
      target,
      actual,
      importance: primaryCareer.importance[dimensionKey] ?? 1,
      closeness: 100 - gap,
      gap
    };
  });

  const topDrivers = comparisons
    .slice()
    .sort((a, b) => {
      if (b.importance !== a.importance) {
        return b.importance - a.importance;
      }
      return b.closeness - a.closeness;
    })
    .slice(0, 3);

  const weakestGap = comparisons
    .slice()
    .filter((item) => item.importance >= 2)
    .sort((a, b) => b.gap - a.gap)[0];

  const runnerUp = rankedCareers[1];

  const explanationBlocks = [
    {
      title: "为什么会匹配到这个职业",
      text: `你的结果最靠近「${primaryCareer.name}」的原因，是 ${topDrivers
        .map((item) => `「${dimensionNames[item.dimensionKey]}」处于${describeScoreLevel(item.actual)}区间`)
        .join("、")}。这些维度与该职业的核心目标向量高度接近，因此它在整体匹配中自然上升到第一位。`
    }
  ];

  if (weakestGap) {
    explanationBlocks.push({
      title: "当前最值得补足的维度",
      text: `在「${primaryCareer.name}」的职业画像里，你与目标差距最大的关键维度是「${dimensionNames[weakestGap.dimensionKey]}」。你的当前分数为 ${weakestGap.actual}，而该职业的目标点位大约在 ${weakestGap.target}。这意味着你已经具备主职业轮廓，但这一维度仍会影响你在该角色中的发挥上限。`
    });
  }

  if (runnerUp) {
    explanationBlocks.push({
      title: "为什么不像第二职业那样收束",
      text: `第二匹配职业是「${runnerUp.name}」。它与你的画像同样接近，但「${primaryCareer.name}」之所以更靠前，是因为你在其核心维度上的贴合度更高，尤其是在 ${topDrivers
        .slice(0, 2)
        .map((item) => `「${dimensionNames[item.dimensionKey]}」`)
        .join("与 ")} 上更符合第一职业的目标结构。`
    });
  }

  return { topDrivers, weakestGap, explanationBlocks };
}

function buildDimensionSummary(normalizedScores) {
  return dimensionMeta.map((item) => ({
    ...item,
    score: normalizedScores[item.key],
    level: describeScoreLevel(normalizedScores[item.key])
  }));
}

function computeNeutralRate(answerMap) {
  const answers = Object.values(answerMap);
  if (!answers.length) {
    return 0;
  }
  const neutralCount = answers.filter((value) => value === 3).length;
  return neutralCount / answers.length;
}

function calculateResult(answerMap, mode = "formal") {
  const { raw, normalized } = computeDimensionScores(answerMap);
  const rankedCareers = rankCareers(normalized, mode);
  const insights = buildCareerInsights(normalized, rankedCareers);
  const dimensionSummary = buildDimensionSummary(normalized);
  const neutralRate = computeNeutralRate(answerMap);

  return {
    raw,
    normalized,
    rankedCareers,
    topCareer: rankedCareers[0] ?? null,
    dimensionSummary,
    neutralRate,
    warnings: {
      broadProfile: neutralRate > 14 / 36
    },
    ...insights
  };
}

function buildLogicSummary(result, mode) {
  const lines = [
    `当前模式：${mode === "entertainment" ? "娱乐模式" : "正式模式"}。`,
    "系统先按题目映射把 36 道题折算为九个维度原始分，再统一换算到 0-100 标准化区间。",
    "随后每个职业会调用自己的九维目标向量与重要度权重，计算加权匹配度。",
    "匹配度越高，代表你的九维结构越接近该职业的目标画像，而不是代表某一项能力绝对更强。",
    result.warnings.broadProfile
      ? "本次作答中性选项比例较高，因此结果更适合被理解为职业家族趋势，而不是绝对单峰结果。"
      : "本次作答分辨率较稳定，因此主职业结果具有较好的可解释性。"
  ];

  if (mode !== "entertainment") {
    lines.push("正式模式下，食死徒与黑魔王这两个黑暗叙事结果位不会进入最终排序。");
  } else {
    lines.push("娱乐模式下，黑暗叙事结果位只有在 D9 权力取向与相关阈值满足时才会显示。");
  }

  return lines;
}

function buildCareerSpecificExplanation(normalizedScores, career, compareCareer = null) {
  const comparisons = Object.keys(career.targets).map((dimensionKey) => {
    const target = career.targets[dimensionKey];
    const actual = normalizedScores[dimensionKey];
    const gap = Math.abs(actual - target);
    return {
      dimensionKey,
      target,
      actual,
      importance: career.importance[dimensionKey] ?? 1,
      closeness: 100 - gap,
      gap
    };
  });

  const topDrivers = comparisons
    .slice()
    .sort((a, b) => {
      if (b.importance !== a.importance) {
        return b.importance - a.importance;
      }
      return b.closeness - a.closeness;
    })
    .slice(0, 3);

  const weakestGap = comparisons
    .slice()
    .filter((item) => item.importance >= 2)
    .sort((a, b) => b.gap - a.gap)[0];

  const blocks = [
    {
      title: "核心贴合点",
      text: `${career.name}之所以与你贴近，是因为 ${topDrivers
        .map((item) => `「${dimensionNames[item.dimensionKey]}」呈现${describeScoreLevel(item.actual)}状态`)
        .join("、")}，这些维度与该职业目标结构最为接近。`
    }
  ];

  if (weakestGap) {
    blocks.push({
      title: "当前最有张力的维度",
      text: `在「${career.name}」所需的关键维度里，你与目标差距最大的部分是「${dimensionNames[weakestGap.dimensionKey]}」。你的分数为 ${weakestGap.actual}，该职业目标约为 ${weakestGap.target}，因此这会决定你更偏向其哪一面。`
    });
  }

  if (compareCareer) {
    blocks.push({
      title: "与相近职业的差别",
      text: `与你同样接近的还有「${compareCareer.name}」，但你在 ${topDrivers
        .slice(0, 2)
        .map((item) => `「${dimensionNames[item.dimensionKey]}」`)
        .join("与 ")} 上更贴近「${career.name}」的职业目标，因此最终排序会向它倾斜。`
    });
  }

  return {
    topDrivers,
    weakestGap,
    blocks
  };
}

window.WOMBAT.scoring = {
  calculateResult,
  buildLogicSummary,
  buildCareerSpecificExplanation
};
})();
