(() => {
window.WOMBAT = window.WOMBAT || {};

function renderRadarChart(container, dimensionSummary) {
  const width = 520;
  const height = 340;
  const centerX = width / 2;
  const centerY = height / 2 + 8;
  const radius = 112;
  const steps = 4;
  const angleStep = (Math.PI * 2) / dimensionSummary.length;

  const polygons = [];
  for (let step = 1; step <= steps; step += 1) {
    const scale = step / steps;
    const points = dimensionSummary.map((_, index) => {
      const angle = -Math.PI / 2 + index * angleStep;
      const x = centerX + Math.cos(angle) * radius * scale;
      const y = centerY + Math.sin(angle) * radius * scale;
      return `${x},${y}`;
    });
    polygons.push(
      `<polygon points="${points.join(" ")}" fill="none" stroke="rgba(212,175,55,0.16)" stroke-width="1" />`
    );
  }

  const axes = dimensionSummary.map((item, index) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const outerX = centerX + Math.cos(angle) * radius;
    const outerY = centerY + Math.sin(angle) * radius;
    const labelX = centerX + Math.cos(angle) * (radius + 30);
    const labelY = centerY + Math.sin(angle) * (radius + 30);

    const anchor = labelX < centerX - 12 ? "end" : labelX > centerX + 12 ? "start" : "middle";

    return `
      <line x1="${centerX}" y1="${centerY}" x2="${outerX}" y2="${outerY}" stroke="rgba(212,175,55,0.2)" stroke-width="1" />
      <text x="${labelX}" y="${labelY}" fill="rgba(244,239,230,0.92)" font-size="13" text-anchor="${anchor}">
        ${item.shortName}
      </text>
      <text x="${labelX}" y="${labelY + 16}" fill="rgba(167,167,173,0.95)" font-size="11" text-anchor="${anchor}">
        ${item.score}
      </text>
    `;
  });

  const scorePoints = dimensionSummary.map((item, index) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const pointRadius = radius * (item.score / 100);
    const x = centerX + Math.cos(angle) * pointRadius;
    const y = centerY + Math.sin(angle) * pointRadius;
    return { x, y };
  });

  const scorePolygon = scorePoints.map((point) => `${point.x},${point.y}`).join(" ");
  const markers = scorePoints
    .map(
      (point) =>
        `<circle cx="${point.x}" cy="${point.y}" r="4.5" fill="#D4AF37" stroke="#0B101E" stroke-width="2" />`
    )
    .join("");

  container.innerHTML = `
    <svg class="radar-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="九维雷达图">
      <defs>
        <linearGradient id="radarFill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(212,175,55,0.44)" />
          <stop offset="100%" stop-color="rgba(126,31,39,0.28)" />
        </linearGradient>
      </defs>
      ${polygons.join("")}
      ${axes.join("")}
      <polygon points="${scorePolygon}" fill="url(#radarFill)" stroke="#D4AF37" stroke-width="2.2" />
      ${markers}
    </svg>
  `;
}

window.WOMBAT.charts = {
  renderRadarChart
};
})();
