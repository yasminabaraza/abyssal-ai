// ── Meduses bioluminiscents ─────────────────────────────────────────
// Meduses translúcides i lluminoses que floten amunt amb una propulsió
// realista: contracció ràpida de la campana → impuls cap amunt →
// expansió lenta → deriva. Trajectòria sinuosa en S per a un moviment
// de natació natural.

export interface Jellyfish {
  x: number;
  y: number;
  size: number;
  baseSpeed: number;
  phase: number;
  pulseSpeed: number;
  hue: number;
  opacity: number;
  tentacleCount: number;
  tentacleLength: number;
  driftPhase: number;
  driftFreq: number;
  driftAmp: number;
}

const JELLY_HUES = [185, 200, 260, 290, 170];

function lateralX(w: number): number {
  const margin = w * 0.25;
  if (Math.random() > 0.5) {
    return w - Math.random() * margin;
  }
  return Math.random() * margin;
}

function propulsionCurve(phase: number): number {
  const raw = Math.sin(phase);
  if (raw > 0) {
    return Math.pow(raw, 1.5);
  }
  return 0;
}

export function createJellyfish(w: number, h: number): Jellyfish {
  const size = 20 + Math.random() * 40;
  return {
    x: lateralX(w),
    y: h * 0.4 + Math.random() * h * 0.6,
    size,
    baseSpeed: 0.12 + Math.random() * 0.15,
    phase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.012 + Math.random() * 0.008,
    hue: JELLY_HUES[Math.floor(Math.random() * JELLY_HUES.length)],
    opacity: 0.12 + Math.random() * 0.1,
    tentacleCount: 4 + Math.floor(Math.random() * 4),
    tentacleLength: size * (1.0 + Math.random() * 0.8),
    driftPhase: Math.random() * Math.PI * 2,
    driftFreq: 0.004 + Math.random() * 0.003,
    driftAmp: 15 + Math.random() * 20,
  };
}

function resetJellyfish(j: Jellyfish, w: number, h: number): void {
  j.x = lateralX(w);
  j.y = h + j.size + j.tentacleLength + 30;
  j.size = 20 + Math.random() * 40;
  j.tentacleLength = j.size * (1.0 + Math.random() * 0.8);
  j.hue = JELLY_HUES[Math.floor(Math.random() * JELLY_HUES.length)];
  j.opacity = 0.12 + Math.random() * 0.1;
  j.driftPhase = Math.random() * Math.PI * 2;
}

export function drawJellyfish(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  depthFraction: number,
  time: number,
  jellyfish: Jellyfish[],
): void {
  if (depthFraction < 0.3) return;

  const intensity = Math.min(1, (depthFraction - 0.3) / 0.25);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const j of jellyfish) {
    j.phase += j.pulseSpeed;
    const contraction = propulsionCurve(j.phase);

    const bellWidthMult = 1.0 - contraction * 0.2;
    const bellHeightMult = 1.0 + contraction * 0.15;

    const propulsionSpeed = j.baseSpeed * (0.4 + contraction * 1.2);
    j.y -= propulsionSpeed;

    j.driftPhase += j.driftFreq;
    const lateralOffset = Math.sin(j.driftPhase) * j.driftAmp;
    const currentX = j.x + lateralOffset;

    if (j.y < -j.size * 2 - j.tentacleLength - 30) {
      resetJellyfish(j, w, h);
    }

    const finalOpacity = j.opacity * intensity;
    if (finalOpacity < 0.008) continue;

    const glowOpacity = finalOpacity * (0.6 + contraction * 0.4);
    const sat = 70 + contraction * 25;
    const lit = 55 + contraction * 20;

    ctx.save();
    ctx.translate(currentX, j.y);

    const glowRadius = j.size * 2.0;
    const glow = ctx.createRadialGradient(
      0,
      -j.size * 0.1,
      0,
      0,
      0,
      glowRadius,
    );
    glow.addColorStop(
      0,
      `hsla(${j.hue}, ${sat}%, ${lit}%, ${glowOpacity * 0.5})`,
    );
    glow.addColorStop(
      0.4,
      `hsla(${j.hue}, ${sat}%, ${lit}%, ${glowOpacity * 0.2})`,
    );
    glow.addColorStop(1, `hsla(${j.hue}, ${sat}%, ${lit}%, 0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(-glowRadius, -glowRadius, glowRadius * 2, glowRadius * 2);

    const bellW = j.size * 0.5 * bellWidthMult;
    const bellH = j.size * 0.38 * bellHeightMult;

    ctx.beginPath();
    ctx.ellipse(0, 0, bellW, bellH, 0, Math.PI, 0);
    const scallops = 7;
    for (let i = 0; i <= scallops; i++) {
      const t = i / scallops;
      const sx = -bellW + t * bellW * 2;
      const scallop = Math.sin(t * Math.PI * scallops) * (2 + contraction * 2);
      ctx.lineTo(sx, scallop);
    }
    ctx.closePath();

    const bellGrad = ctx.createRadialGradient(
      0,
      -bellH * 0.3,
      0,
      0,
      0,
      bellW * 1.2,
    );
    bellGrad.addColorStop(
      0,
      `hsla(${j.hue}, ${sat + 10}%, ${lit + 15}%, ${glowOpacity * 0.8})`,
    );
    bellGrad.addColorStop(
      0.6,
      `hsla(${j.hue}, ${sat}%, ${lit}%, ${glowOpacity * 0.4})`,
    );
    bellGrad.addColorStop(
      1,
      `hsla(${j.hue}, ${sat - 10}%, ${lit - 10}%, ${glowOpacity * 0.1})`,
    );
    ctx.fillStyle = bellGrad;
    ctx.fill();

    const innerW = bellW * 0.4;
    const innerH = bellH * 0.5;
    ctx.beginPath();
    ctx.ellipse(0, bellH * 0.1, innerW, innerH, 0, Math.PI, 0);
    ctx.closePath();
    ctx.fillStyle = `hsla(${j.hue}, ${sat + 15}%, ${lit + 20}%, ${glowOpacity * 0.3})`;
    ctx.fill();

    const tentSpacing = (bellW * 2) / (j.tentacleCount + 1);
    for (let t = 0; t < j.tentacleCount; t++) {
      const tx = -bellW + tentSpacing * (t + 1);
      const tentLen = j.tentacleLength * (0.6 + ((t * 37 + 13) % 7) / 10);
      const splayFactor = contraction * 0.3;
      const waviness = 1.0 - contraction * 0.2;
      const freq1 = 0.4 + t * 0.08;
      const freq2 = 0.7 + t * 0.06;
      const sway1 =
        Math.sin(time * freq1 + j.driftPhase + t * 1.5) * 6 * waviness;
      const sway2 = Math.cos(time * freq2 + t * 0.9) * 4 * waviness;
      const splayX = (tx > 0 ? 1 : -1) * splayFactor * 15;

      ctx.beginPath();
      ctx.moveTo(tx, 3);
      const mid1Y = tentLen * 0.35;
      const mid2Y = tentLen * 0.7;
      ctx.bezierCurveTo(
        tx + sway1 + splayX,
        mid1Y,
        tx + sway2 - splayX * 0.5,
        mid2Y,
        tx + sway1 * 0.5 + sway2 * 0.3,
        tentLen * (1.0 - contraction * 0.3),
      );

      ctx.strokeStyle = `hsla(${j.hue}, ${sat}%, ${lit + 5}%, ${glowOpacity * 0.55})`;
      ctx.lineWidth = 1.2 + contraction * 0.8;
      ctx.stroke();
    }

    ctx.restore();
  }

  ctx.restore();
}
