const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

const imageInput = document.getElementById("imageInput");
const topText = document.getElementById("topText");
const bottomText = document.getElementById("bottomText");
const fontSize = document.getElementById("fontSize");
const strokeWidth = document.getElementById("strokeWidth");
const fontFamily = document.getElementById("fontFamily");
const textColor = document.getElementById("textColor");
const shadowToggle = document.getElementById("shadowToggle");
const uppercaseToggle = document.getElementById("uppercaseToggle");
const downloadBtn = document.getElementById("downloadBtn");
const randomBtn = document.getElementById("randomBtn");
const resetBtn = document.getElementById("resetBtn");
const topCount = document.getElementById("topCount");
const bottomCount = document.getElementById("bottomCount");
const fontSizeValue = document.getElementById("fontSizeValue");
const strokeValue = document.getElementById("strokeValue");

let currentImage = null;
let dragActive = false;

const templates = [
  ["assets/neon.svg", "WHEN THE CODE FINALLY WORKS", "BUT I HAVE NO IDEA WHY"],
  ["assets/sunset.svg", "ME: I WILL FIX ONE BUG", "ALSO ME: CREATES FIVE MORE"],
  ["assets/ocean.svg", "DEVELOPER MODE", "COFFEE → CODE → REPEAT"],
  ["assets/space.svg", "DEPLOYMENT SUCCESS", "PLEASE DON'T CHECK THE CONSOLE"]
];

function fitImageCover(img, cw, ch) {
  const scale = Math.max(cw / img.width, ch / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  return { x: (cw - w) / 2, y: (ch - h) / 2, w, h };
}

function wrapText(text, maxWidth, font) {
  ctx.font = font;
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width <= maxWidth || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawText(text, y, align = "center") {
  if (!text.trim()) return;
  const size = Number(fontSize.value);
  const family = fontFamily.value;
  const weight = family === "Arial" ? "900" : "700";
  const font = `${weight} ${size}px "${family}"`;
  const maxWidth = canvas.width - 90;
  const lines = wrapText(text, maxWidth, font);
  const lineHeight = size * 1.02;

  ctx.save();
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = Number(strokeWidth.value);
  ctx.strokeStyle = "#080a12";
  ctx.fillStyle = textColor.value;

  if (shadowToggle.checked) {
    ctx.shadowColor = "rgba(0,0,0,.78)";
    ctx.shadowBlur = 13;
    ctx.shadowOffsetY = 7;
  }

  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    const yy = startY + i * lineHeight;
    ctx.strokeText(line, canvas.width / 2, yy);
    ctx.fillText(line, canvas.width / 2, yy);
  });
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentImage) {
    const pos = fitImageCover(currentImage, canvas.width, canvas.height);
    ctx.drawImage(currentImage, pos.x, pos.y, pos.w, pos.h);
  } else {
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, "#151a38");
    g.addColorStop(.5, "#6d28d9");
    g.addColorStop(1, "#ec4899");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,.08)";
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.arc(130 + i * 125, 180 + Math.sin(i) * 100, 75, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Subtle dark overlay for readable text.
  const overlay = ctx.createLinearGradient(0, 0, 0, canvas.height);
  overlay.addColorStop(0, "rgba(0,0,0,.22)");
  overlay.addColorStop(.25, "rgba(0,0,0,0)");
  overlay.addColorStop(.75, "rgba(0,0,0,0)");
  overlay.addColorStop(1, "rgba(0,0,0,.28)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const top = uppercaseToggle.checked ? topText.value.toUpperCase() : topText.value;
  const bottom = uppercaseToggle.checked ? bottomText.value.toUpperCase() : bottomText.value;
  drawText(top, 105);
  drawText(bottom, 975);

  updateCounts();
}

function updateCounts() {
  topCount.textContent = `${topText.value.length}/42`;
  bottomCount.textContent = `${bottomText.value.length}/42`;
  fontSizeValue.textContent = `${fontSize.value}px`;
  strokeValue.textContent = `${strokeWidth.value}px`;
}

function loadImage(src) {
  const img = new Image();
  img.onload = () => {
    currentImage = img;
    render();
  };
  img.src = src;
}

imageInput.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => loadImage(reader.result);
  reader.readAsDataURL(file);
});

["dragenter", "dragover"].forEach(type => {
  document.body.addEventListener(type, e => {
    e.preventDefault();
    dragActive = true;
    document.querySelector(".upload-zone").classList.add("dragging");
  });
});
["dragleave", "drop"].forEach(type => {
  document.body.addEventListener(type, e => {
    e.preventDefault();
    dragActive = false;
    document.querySelector(".upload-zone").classList.remove("dragging");
  });
});
document.body.addEventListener("drop", e => {
  const file = e.dataTransfer.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => loadImage(reader.result);
  reader.readAsDataURL(file);
});

document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", render);
  el.addEventListener("change", render);
});

document.querySelectorAll(".template").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".template").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadImage(btn.dataset.template);
    const found = templates.find(t => t[0] === btn.dataset.template);
    if (found) {
      topText.value = found[1];
      bottomText.value = found[2];
      render();
    }
  });
});

randomBtn.addEventListener("click", () => {
  const found = templates[Math.floor(Math.random() * templates.length)];
  const idx = templates.indexOf(found);
  document.querySelectorAll(".template").forEach((b, i) => b.classList.toggle("active", i === idx));
  topText.value = found[1];
  bottomText.value = found[2];
  fontSize.value = 46 + Math.floor(Math.random() * 28);
  strokeWidth.value = 5 + Math.floor(Math.random() * 6);
  const colors = ["#ffffff", "#fff200", "#7df9ff", "#ffb7f4"];
  textColor.value = colors[Math.floor(Math.random() * colors.length)];
  loadImage(found[0]);
});

resetBtn.addEventListener("click", () => {
  topText.value = "WHEN THE CODE FINALLY WORKS";
  bottomText.value = "IT WAS JUST A MISSING SEMICOLON";
  fontSize.value = 58;
  strokeWidth.value = 7;
  fontFamily.value = "Impact";
  textColor.value = "#ffffff";
  shadowToggle.checked = true;
  uppercaseToggle.checked = true;
  document.querySelectorAll(".template").forEach((b, i) => b.classList.toggle("active", i === 0));
  loadImage("assets/neon.svg");
});

downloadBtn.addEventListener("click", () => {
  render();
  const link = document.createElement("a");
  link.download = "memeforge-satyam-shukla.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

document.querySelector(".upload-zone").addEventListener("dragover", e => e.preventDefault());

loadImage("assets/neon.svg");
