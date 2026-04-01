const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ── ASSETS ──
const A = {
  logo: path.resolve("website/public/logo.png"),
  hero: path.resolve("website/public/hero-product.png"),
  campus: path.resolve("website/public/campus.png"),
  aiVision: path.resolve("website/public/ai-vision.png"),
  flowchart: path.resolve("docs/images/uml_system_flowchart.png"),
  component: path.resolve("docs/images/uml_component_diagram.png"),
  classDiag: path.resolve("docs/images/uml_class_diagram.png"),
  adam: path.resolve("website/public/team/adam.jpg"),
  bassam: path.resolve("website/public/team/bassam.jpg"),
  mahmoud: path.resolve("website/public/team/mahmoud.jpg"),
  zivan: path.resolve("website/public/team/zivan.jpg"),
};

// ── PALETTE — Charcoal + Teal (not generic green) ──
const C = {
  midnight: "0F172A",
  charcoal: "1E293B",
  slate: "334155",
  slateLight: "64748B",
  teal: "0D9488",
  tealDark: "0F766E",
  tealLight: "5EEAD4",
  mint: "CCFBF1",
  offWhite: "F8FAFC",
  warmWhite: "F1F5F9",
  white: "FFFFFF",
  black: "0F172A",
  codeBg: "1E1E2E",
  codeText: "CDD6F4",
  codeGreen: "A6E3A1",
  codeBlue: "89B4FA",
  codePurple: "CBA6F7",
  codeOrange: "FAB387",
  codeComment: "6C7086",
};

// ── FONTS ──
const TITLE_FONT = "Cambria";
const BODY_FONT = "Calibri";

// ── HELPERS ──
// Never reuse shadow objects (pptxgenjs mutates them)
const mkShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.10 });

function logoWatermark(slide) {
  slide.addText("RECYCLA", {
    x: 8.4, y: 5.15, w: 1.4, h: 0.35, fontSize: 8, color: C.slateLight,
    fontFace: BODY_FONT, align: "right", charSpacing: 3, valign: "middle", margin: 0
  });
}

// ── BUILD ──
let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Recycla Team";
pres.title = "Recycla – Smart Waste Sorting System";

// ════════════════════════════════════════════════════
// SLIDE 1 — TITLE (dark, half-bleed product image)
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.midnight };

  // Left content
  s.addText("CMPE 246  —  University of British Columbia", {
    x: 0.7, y: 0.5, w: 5, h: 0.4, fontSize: 10, color: C.slateLight,
    fontFace: BODY_FONT, charSpacing: 2, margin: 0
  });

  s.addText("Recycla", {
    x: 0.7, y: 1.3, w: 5, h: 1.1, fontSize: 56, bold: true, color: C.white,
    fontFace: TITLE_FONT, margin: 0
  });

  s.addText("Smart Waste Sorting System", {
    x: 0.7, y: 2.35, w: 5, h: 0.6, fontSize: 20, color: C.tealLight,
    fontFace: BODY_FONT, margin: 0
  });

  s.addText([
    { text: "AI-powered image classification", options: { breakLine: true } },
    { text: "on a Raspberry Pi 4 with MobileNetV2.", options: {} },
  ], {
    x: 0.7, y: 3.2, w: 4.5, h: 0.8, fontSize: 13, color: C.slateLight,
    fontFace: BODY_FONT, margin: 0
  });

  // Tagline
  s.addText("Stop guessing. Start recycling right.", {
    x: 0.7, y: 4.3, w: 4.5, h: 0.45, fontSize: 15, italic: true, color: C.teal,
    fontFace: TITLE_FONT, margin: 0
  });

  // Right — product image (half-bleed)
  if (fs.existsSync(A.hero)) {
    s.addImage({ path: A.hero, x: 5.8, y: 0.3, w: 4.0, h: 4.8,
      sizing: { type: "contain", w: 4.0, h: 4.8 } });
  }

  // Teal bottom strip
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.35, w: 10, h: 0.275, fill: { color: C.teal } });
}

// ════════════════════════════════════════════════════
// SLIDE 2 — TEAM
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addText("The Team", {
    x: 0.7, y: 0.4, w: 9, h: 0.8, fontSize: 38, bold: true, color: C.midnight,
    fontFace: TITLE_FONT, margin: 0
  });
  s.addText("Built by students, for students.", {
    x: 0.7, y: 1.1, w: 5, h: 0.4, fontSize: 13, italic: true, color: C.slateLight,
    fontFace: BODY_FONT, margin: 0
  });

  const team = [
    { name: "Adam Hassan", role: "Hardware Lead", tasks: [
      "Built bin structure & wiring",
      "Selected materials & components",
      "Designed physical layout"
    ], img: A.adam },
    { name: "Zivan Erdevicki", role: "Integration Lead", tasks: [
      "Integrated Raspberry Pi + camera",
      "Combined ML & hardware system",
      "Tested real-time classification"
    ], img: A.zivan },
    { name: "Bassam AlGhamdi", role: "ML Lead", tasks: [
      "Collected & labeled dataset",
      "Trained MobileNetV2 classifier",
      "Tuned accuracy & augmentation"
    ], img: A.bassam },
    { name: "Mahmoud Rabie", role: "Project Lead", tasks: [
      "Defined scope & goals",
      "Developed control system code",
      "Managed timeline & delivery"
    ], img: A.mahmoud },
  ];

  team.forEach((m, i) => {
    const cx = 0.45 + i * 2.35;
    const cy = 1.7;

    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 2.15, h: 3.5,
      fill: { color: C.white }, shadow: mkShadow()
    });

    // Teal top accent bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 2.15, h: 0.05, fill: { color: C.teal }
    });

    // Photo
    if (fs.existsSync(m.img)) {
      s.addImage({ path: m.img, x: cx + 0.45, y: cy + 0.25, w: 1.25, h: 1.25, rounding: true });
    }

    // Name
    s.addText(m.name, {
      x: cx + 0.1, y: cy + 1.6, w: 1.95, h: 0.35, fontSize: 12, bold: true,
      color: C.midnight, fontFace: BODY_FONT, align: "center", margin: 0
    });

    // Role badge
    s.addText(m.role, {
      x: cx + 0.35, y: cy + 1.95, w: 1.45, h: 0.28, fontSize: 9, bold: true,
      color: C.tealDark, fontFace: BODY_FONT, align: "center", margin: 0
    });

    // Tasks
    const taskText = m.tasks.map((t, ti) => ({
      text: t,
      options: { bullet: true, breakLine: ti < m.tasks.length - 1 }
    }));
    s.addText(taskText, {
      x: cx + 0.15, y: cy + 2.3, w: 1.85, h: 1.0, fontSize: 8.5,
      color: C.slate, fontFace: BODY_FONT, paraSpaceAfter: 2, margin: 0
    });
  });

  logoWatermark(s);
}

// ════════════════════════════════════════════════════
// SLIDE 3 — THE PROBLEM (dark, stat callouts)
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.midnight };

  s.addText("The Problem", {
    x: 0.7, y: 0.4, w: 9, h: 0.8, fontSize: 38, bold: true, color: C.white,
    fontFace: TITLE_FONT, margin: 0
  });

  s.addText("Recycling contamination is a growing crisis on university campuses.", {
    x: 0.7, y: 1.15, w: 7, h: 0.5, fontSize: 14, color: C.slateLight,
    fontFace: BODY_FONT, margin: 0
  });

  // 3 stat cards
  const stats = [
    { num: "25%", sub: "of campus recycling", detail: "is contaminated with\nnon-recyclable waste" },
    { num: "62%", sub: "of students say", detail: "they're unsure which\nbin to use" },
    { num: "40%", sub: "of recyclable materials", detail: "end up in landfills\ndue to missorting" },
  ];

  stats.forEach((st, i) => {
    const sx = 0.5 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: 1.9, w: 2.85, h: 2.6,
      fill: { color: C.charcoal }, shadow: mkShadow()
    });

    // Left teal accent
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: 1.9, w: 0.06, h: 2.6, fill: { color: C.teal }
    });

    s.addText(st.num, {
      x: sx + 0.2, y: 2.05, w: 2.5, h: 0.85, fontSize: 48, bold: true, color: C.tealLight,
      fontFace: TITLE_FONT, margin: 0
    });
    s.addText(st.sub, {
      x: sx + 0.2, y: 2.85, w: 2.5, h: 0.35, fontSize: 11, bold: true, color: C.white,
      fontFace: BODY_FONT, margin: 0
    });
    s.addText(st.detail, {
      x: sx + 0.2, y: 3.2, w: 2.5, h: 0.8, fontSize: 10, color: C.slateLight,
      fontFace: BODY_FONT, margin: 0
    });
  });

  s.addText("Manual sorting is slow, inconsistent, and doesn't scale. We need automation.", {
    x: 0.7, y: 4.7, w: 8, h: 0.4, fontSize: 12, italic: true, color: C.teal,
    fontFace: TITLE_FONT, margin: 0
  });
}

// ════════════════════════════════════════════════════
// SLIDE 4 — WHAT IS RECYCLA (two-column + image)
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("What is Recycla?", {
    x: 0.7, y: 0.4, w: 9, h: 0.8, fontSize: 38, bold: true, color: C.midnight,
    fontFace: TITLE_FONT, margin: 0
  });

  // Left column
  s.addText([
    { text: "Recycla is an ", options: {} },
    { text: "embedded system", options: { bold: true, color: C.tealDark } },
    { text: " that uses ", options: {} },
    { text: "computer vision", options: { bold: true, color: C.tealDark } },
    { text: " and ", options: {} },
    { text: "machine learning", options: { bold: true, color: C.tealDark } },
    { text: " to classify waste in real time and automatically sort it into the correct bin.", options: {} },
  ], {
    x: 0.7, y: 1.4, w: 5, h: 1.0, fontSize: 14, color: C.slate,
    fontFace: BODY_FONT, margin: 0
  });

  // Key specs in a mini grid
  const specs = [
    { label: "Inference", value: "<200ms" },
    { label: "Categories", value: "6 classes" },
    { label: "Model", value: "MobileNetV2" },
    { label: "Platform", value: "Raspberry Pi 4" },
  ];

  specs.forEach((sp, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const sx = 0.7 + col * 2.6;
    const sy = 2.7 + row * 1.1;

    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: sy, w: 2.35, h: 0.9,
      fill: { color: C.offWhite }, shadow: mkShadow()
    });
    s.addText(sp.value, {
      x: sx + 0.15, y: sy + 0.08, w: 2.05, h: 0.45, fontSize: 18, bold: true,
      color: C.tealDark, fontFace: TITLE_FONT, margin: 0
    });
    s.addText(sp.label, {
      x: sx + 0.15, y: sy + 0.5, w: 2.05, h: 0.3, fontSize: 10,
      color: C.slateLight, fontFace: BODY_FONT, margin: 0
    });
  });

  // Right — campus image
  if (fs.existsSync(A.campus)) {
    s.addImage({ path: A.campus, x: 6.1, y: 1.3, w: 3.6, h: 3.8,
      sizing: { type: "cover", w: 3.6, h: 3.8 } });
  }

  logoWatermark(s);
}

// ════════════════════════════════════════════════════
// SLIDE 5 — HOW IT WORKS (horizontal pipeline)
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.warmWhite };

  s.addText("How It Works", {
    x: 0.7, y: 0.4, w: 9, h: 0.8, fontSize: 38, bold: true, color: C.midnight,
    fontFace: TITLE_FONT, margin: 0
  });

  const steps = [
    { num: "1", title: "DETECT", desc: "HC-SR04 ultrasonic sensor triggers when object is within 30 cm", detail: "GPIO 23/24" },
    { num: "2", title: "CAPTURE", desc: "Arducam 8MP camera captures a 640×480 RGB frame via CSI", detail: "Sony IMX219" },
    { num: "3", title: "CLASSIFY", desc: "MobileNetV2 (TFLite INT8) classifies material in under 200ms", detail: "6 categories" },
    { num: "4", title: "SORT", desc: "Servo opens the correct bin lid; defaults to trash if unsure", detail: "SG90 servos" },
  ];

  steps.forEach((st, i) => {
    const sx = 0.35 + i * 2.45;
    const sy = 1.5;

    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: sy, w: 2.2, h: 3.4,
      fill: { color: C.white }, shadow: mkShadow()
    });

    // Number circle
    s.addShape(pres.shapes.OVAL, {
      x: sx + 0.75, y: sy + 0.3, w: 0.7, h: 0.7, fill: { color: C.teal }
    });
    s.addText(st.num, {
      x: sx + 0.75, y: sy + 0.3, w: 0.7, h: 0.7, fontSize: 22, bold: true,
      color: C.white, fontFace: TITLE_FONT, align: "center", valign: "middle", margin: 0
    });

    // Title
    s.addText(st.title, {
      x: sx + 0.1, y: sy + 1.15, w: 2.0, h: 0.4, fontSize: 13, bold: true,
      color: C.midnight, fontFace: BODY_FONT, align: "center", charSpacing: 2, margin: 0
    });

    // Description
    s.addText(st.desc, {
      x: sx + 0.15, y: sy + 1.6, w: 1.9, h: 1.0, fontSize: 10.5,
      color: C.slate, fontFace: BODY_FONT, align: "center", margin: 0
    });

    // Detail chip
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx + 0.45, y: sy + 2.75, w: 1.3, h: 0.3, fill: { color: C.mint }
    });
    s.addText(st.detail, {
      x: sx + 0.45, y: sy + 2.75, w: 1.3, h: 0.3, fontSize: 8.5, bold: true,
      color: C.tealDark, fontFace: BODY_FONT, align: "center", valign: "middle", margin: 0
    });

    // Arrow between cards (except last)
    if (i < 3) {
      s.addText("→", {
        x: sx + 2.15, y: sy + 0.85, w: 0.35, h: 0.4, fontSize: 20,
        color: C.teal, fontFace: BODY_FONT, align: "center", valign: "middle", margin: 0
      });
    }
  });

  logoWatermark(s);
}

// ════════════════════════════════════════════════════
// SLIDE 6 — HARDWARE + COMPONENT DIAGRAM
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Hardware Architecture", {
    x: 0.7, y: 0.4, w: 5, h: 0.7, fontSize: 34, bold: true, color: C.midnight,
    fontFace: TITLE_FONT, margin: 0
  });

  // Component diagram
  if (fs.existsSync(A.component)) {
    s.addImage({ path: A.component, x: 0.3, y: 1.2, w: 9.4, h: 4.0,
      sizing: { type: "contain", w: 9.4, h: 4.0 } });
  }

  // GPIO reference strip at bottom
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.1, w: 10, h: 0.525, fill: { color: C.charcoal }
  });
  s.addText([
    { text: "GPIO 23/24 ", options: { bold: true, color: C.tealLight } },
    { text: "Ultrasonic   ", options: { color: C.slateLight } },
    { text: "GPIO 17 ", options: { bold: true, color: C.tealLight } },
    { text: "Recycle Servo   ", options: { color: C.slateLight } },
    { text: "GPIO 22 ", options: { bold: true, color: C.tealLight } },
    { text: "Trash Servo   ", options: { color: C.slateLight } },
    { text: "CSI ", options: { bold: true, color: C.tealLight } },
    { text: "Arducam 8MP", options: { color: C.slateLight } },
  ], {
    x: 0.5, y: 5.1, w: 9, h: 0.525, fontSize: 10,
    fontFace: BODY_FONT, valign: "middle", margin: 0
  });
}

// ════════════════════════════════════════════════════
// SLIDE 7 — ML PIPELINE (code snippet + details)
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addText("ML Training Pipeline", {
    x: 0.7, y: 0.3, w: 9, h: 0.7, fontSize: 34, bold: true, color: C.midnight,
    fontFace: TITLE_FONT, margin: 0
  });

  // Left — code block (dark terminal style)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 5.0, h: 4.0,
    fill: { color: C.codeBg }, shadow: mkShadow()
  });

  // Terminal title bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 5.0, h: 0.35, fill: { color: "181825" }
  });
  s.addText("●  ●  ●   AI_Model.ipynb — Model Architecture", {
    x: 0.65, y: 1.2, w: 4.7, h: 0.35, fontSize: 8, color: C.codeComment,
    fontFace: "Consolas", valign: "middle", margin: 0
  });

  // Code content
  s.addText([
    { text: "# Transfer Learning with MobileNetV2\n", options: { color: C.codeComment, breakLine: true, fontFace: "Consolas" } },
    { text: "base = ", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "MobileNetV2", options: { color: C.codeOrange, fontFace: "Consolas" } },
    { text: "(weights=", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "'imagenet'", options: { color: C.codeGreen, fontFace: "Consolas" } },
    { text: ",\n", options: { color: C.codeText, breakLine: true, fontFace: "Consolas" } },
    { text: "             include_top=", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "False", options: { color: C.codePurple, fontFace: "Consolas" } },
    { text: ",\n", options: { color: C.codeText, breakLine: true, fontFace: "Consolas" } },
    { text: "             input_shape=(", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "224, 224, 3", options: { color: C.codeBlue, fontFace: "Consolas" } },
    { text: "))\n\n", options: { color: C.codeText, breakLine: true, fontFace: "Consolas" } },
    { text: "base.trainable = ", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "False", options: { color: C.codePurple, fontFace: "Consolas" } },
    { text: "  # freeze\n\n", options: { color: C.codeComment, breakLine: true, fontFace: "Consolas" } },
    { text: "model = Sequential([\n", options: { color: C.codeText, breakLine: true, fontFace: "Consolas" } },
    { text: "  base,\n", options: { color: C.codeText, breakLine: true, fontFace: "Consolas" } },
    { text: "  GlobalAveragePooling2D(),\n", options: { color: C.codeOrange, breakLine: true, fontFace: "Consolas" } },
    { text: "  Dropout(", options: { color: C.codeOrange, fontFace: "Consolas" } },
    { text: "0.3", options: { color: C.codeBlue, fontFace: "Consolas" } },
    { text: "),\n", options: { color: C.codeText, breakLine: true, fontFace: "Consolas" } },
    { text: "  Dense(num_classes, ", options: { color: C.codeOrange, fontFace: "Consolas" } },
    { text: "'softmax'", options: { color: C.codeGreen, fontFace: "Consolas" } },
    { text: ")\n])", options: { color: C.codeText, fontFace: "Consolas" } },
  ], {
    x: 0.65, y: 1.65, w: 4.7, h: 3.4, fontSize: 9.5,
    fontFace: "Consolas", valign: "top", margin: 0
  });

  // Right — details
  const details = [
    { title: "Base Model", desc: "MobileNetV2 pretrained on ImageNet (1.2M images), frozen backbone" },
    { title: "Augmentation", desc: "Rotation ±30°, brightness [0.6–1.4], channel shift, zoom, shear — handles glare on glossy paper" },
    { title: "Training", desc: "Adam optimizer, lr=1e-4, EarlyStopping (patience 5), ReduceLROnPlateau, 30 epochs max" },
    { title: "Export", desc: "TFLite INT8 quantization → ~5–10 MB model deployed to Pi via scp" },
  ];

  details.forEach((d, i) => {
    const dy = 1.2 + i * 1.0;
    s.addText(d.title, {
      x: 5.8, y: dy, w: 3.8, h: 0.3, fontSize: 12, bold: true,
      color: C.tealDark, fontFace: BODY_FONT, margin: 0
    });
    s.addText(d.desc, {
      x: 5.8, y: dy + 0.3, w: 3.8, h: 0.55, fontSize: 10,
      color: C.slate, fontFace: BODY_FONT, margin: 0
    });
  });

  logoWatermark(s);
}

// ════════════════════════════════════════════════════
// SLIDE 8 — PI DEPLOYMENT CODE
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addText("Raspberry Pi Control System", {
    x: 0.7, y: 0.3, w: 9, h: 0.7, fontSize: 34, bold: true, color: C.midnight,
    fontFace: TITLE_FONT, margin: 0
  });

  // Code block — main loop
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 5.0, h: 4.0,
    fill: { color: C.codeBg }, shadow: mkShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 5.0, h: 0.35, fill: { color: "181825" }
  });
  s.addText("●  ●  ●   smart_bin.py — Main Loop", {
    x: 0.65, y: 1.2, w: 4.7, h: 0.35, fontSize: 8, color: C.codeComment,
    fontFace: "Consolas", valign: "middle", margin: 0
  });

  s.addText([
    { text: "while ", options: { color: C.codePurple, fontFace: "Consolas" } },
    { text: "True:\n", options: { color: C.codeText, breakLine: true, fontFace: "Consolas" } },
    { text: "  distance = sensor.distance * ", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "100\n\n", options: { color: C.codeBlue, breakLine: true, fontFace: "Consolas" } },
    { text: "  if ", options: { color: C.codePurple, fontFace: "Consolas" } },
    { text: "distance < THRESHOLD_CM:\n", options: { color: C.codeText, breakLine: true, fontFace: "Consolas" } },
    { text: "    label, conf = ", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "classify_image()\n\n", options: { color: C.codeOrange, breakLine: true, fontFace: "Consolas" } },
    { text: "    if ", options: { color: C.codePurple, fontFace: "Consolas" } },
    { text: "label ", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "in ", options: { color: C.codePurple, fontFace: "Consolas" } },
    { text: "RECYCLABLE_CLASSES\n", options: { color: C.codeText, breakLine: true, fontFace: "Consolas" } },
    { text: "       and ", options: { color: C.codePurple, fontFace: "Consolas" } },
    { text: "conf > ", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "0.65", options: { color: C.codeBlue, fontFace: "Consolas" } },
    { text: ":\n", options: { color: C.codeText, breakLine: true, fontFace: "Consolas" } },
    { text: "      open_recycle_servos()\n", options: { color: C.codeOrange, breakLine: true, fontFace: "Consolas" } },
    { text: "    else:\n", options: { color: C.codePurple, breakLine: true, fontFace: "Consolas" } },
    { text: "      open_trash_servos()\n\n", options: { color: C.codeOrange, breakLine: true, fontFace: "Consolas" } },
    { text: "    time.sleep(", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "2", options: { color: C.codeBlue, fontFace: "Consolas" } },
    { text: ")  ", options: { color: C.codeText, fontFace: "Consolas" } },
    { text: "# cooldown", options: { color: C.codeComment, fontFace: "Consolas" } },
  ], {
    x: 0.65, y: 1.65, w: 4.7, h: 3.4, fontSize: 9.5,
    fontFace: "Consolas", valign: "top", margin: 0
  });

  // Right — explanation cards
  const cards = [
    { title: "Ultrasonic Trigger", desc: "HC-SR04 polls every 0.2s.\nObject within 30cm starts classification.", color: C.teal },
    { title: "Classification", desc: "Camera captures frame → resize to 224×224 → normalize → model inference.", color: C.tealDark },
    { title: "Decision Logic", desc: "If recyclable AND confidence > 65%: open recycle bin.\nOtherwise: default to trash.", color: C.teal },
    { title: "Servo Control", desc: "GPIO.PWM at 50Hz.\nDuty cycle 10 = open, 3 = closed.\n0.8s per movement.", color: C.tealDark },
  ];

  cards.forEach((c, i) => {
    const cy = 1.2 + i * 1.0;
    // Accent dot
    s.addShape(pres.shapes.OVAL, {
      x: 5.75, y: cy + 0.12, w: 0.18, h: 0.18, fill: { color: c.color }
    });
    s.addText(c.title, {
      x: 6.05, y: cy, w: 3.5, h: 0.3, fontSize: 12, bold: true,
      color: C.midnight, fontFace: BODY_FONT, margin: 0
    });
    s.addText(c.desc, {
      x: 6.05, y: cy + 0.3, w: 3.5, h: 0.6, fontSize: 9.5,
      color: C.slate, fontFace: BODY_FONT, margin: 0
    });
  });

  logoWatermark(s);
}

// ════════════════════════════════════════════════════
// SLIDE 9 — SYSTEM FLOWCHART
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("System Flowchart", {
    x: 0.7, y: 0.3, w: 5, h: 0.7, fontSize: 34, bold: true, color: C.midnight,
    fontFace: TITLE_FONT, margin: 0
  });

  if (fs.existsSync(A.flowchart)) {
    s.addImage({ path: A.flowchart, x: 2.0, y: 1.0, w: 6.0, h: 4.5,
      sizing: { type: "contain", w: 6.0, h: 4.5 } });
  }

  logoWatermark(s);
}

// ════════════════════════════════════════════════════
// SLIDE 10 — CLASS DIAGRAM
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Class Diagram", {
    x: 0.7, y: 0.3, w: 5, h: 0.7, fontSize: 34, bold: true, color: C.midnight,
    fontFace: TITLE_FONT, margin: 0
  });

  if (fs.existsSync(A.classDiag)) {
    s.addImage({ path: A.classDiag, x: 0.5, y: 1.0, w: 9.0, h: 4.3,
      sizing: { type: "contain", w: 9.0, h: 4.3 } });
  }

  logoWatermark(s);
}

// ════════════════════════════════════════════════════
// SLIDE 11 — DATA AUGMENTATION & RESULTS
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.warmWhite };

  s.addText("Training Results", {
    x: 0.7, y: 0.3, w: 9, h: 0.7, fontSize: 34, bold: true, color: C.midnight,
    fontFace: TITLE_FONT, margin: 0
  });

  // Left — Augmentation details
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 4.5, h: 4.0,
    fill: { color: C.white }, shadow: mkShadow()
  });

  s.addText("Data Augmentation Strategy", {
    x: 0.7, y: 1.35, w: 4.1, h: 0.4, fontSize: 14, bold: true,
    color: C.midnight, fontFace: BODY_FONT, margin: 0
  });

  s.addText("Glossy paper was misclassified as plastic under certain lighting. We added aggressive augmentation to fix this:", {
    x: 0.7, y: 1.8, w: 4.1, h: 0.65, fontSize: 10.5,
    color: C.slate, fontFace: BODY_FONT, margin: 0
  });

  const augList = [
    "Rotation: ±30°",
    "Width/height shift: 20%",
    "Brightness range: 0.6 – 1.4",
    "Channel shift: 30.0 (simulates color cast)",
    "Shear: 15%, Zoom: 20%",
    "Horizontal flip: enabled",
  ];
  const augText = augList.map((a, i) => ({
    text: a,
    options: { bullet: true, breakLine: i < augList.length - 1 }
  }));
  s.addText(augText, {
    x: 0.7, y: 2.55, w: 4.1, h: 2.2, fontSize: 10.5,
    color: C.black, fontFace: BODY_FONT, paraSpaceAfter: 4, margin: 0
  });

  // Right — classification results
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.2, w: 4.3, h: 4.0,
    fill: { color: C.white }, shadow: mkShadow()
  });

  s.addText("Classification Categories", {
    x: 5.5, y: 1.35, w: 3.9, h: 0.4, fontSize: 14, bold: true,
    color: C.midnight, fontFace: BODY_FONT, margin: 0
  });

  // Categories table
  const cats = [
    ["Glass", "♻️  Recycle"],
    ["Metal", "♻️  Recycle"],
    ["Paper", "♻️  Recycle"],
    ["Plastic", "♻️  Recycle"],
    ["Cardboard", "♻️  Recycle"],
    ["Trash", "🗑️  Garbage"],
  ];

  const tableRows = cats.map(([mat, bin]) => [
    { text: mat, options: { fontSize: 11, fontFace: BODY_FONT, color: C.midnight, bold: true,
      margin: [4, 8, 4, 8] } },
    { text: bin, options: { fontSize: 11, fontFace: BODY_FONT,
      color: bin.includes("Recycle") ? C.tealDark : C.slate, margin: [4, 8, 4, 8] } },
  ]);

  s.addTable(
    [
      [
        { text: "Material", options: { fontSize: 10, bold: true, fontFace: BODY_FONT, color: C.white,
          fill: { color: C.charcoal }, margin: [4, 8, 4, 8] } },
        { text: "Bin Assignment", options: { fontSize: 10, bold: true, fontFace: BODY_FONT, color: C.white,
          fill: { color: C.charcoal }, margin: [4, 8, 4, 8] } },
      ],
      ...tableRows
    ],
    { x: 5.5, y: 1.85, w: 3.9, colW: [1.8, 2.1],
      border: { pt: 0.5, color: C.slateLight },
      rowH: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3] }
  );

  s.addText("Confidence threshold: 65%. Below threshold → defaults to trash bin.", {
    x: 5.5, y: 4.5, w: 3.9, h: 0.4, fontSize: 9, italic: true,
    color: C.slateLight, fontFace: BODY_FONT, margin: 0
  });

  logoWatermark(s);
}

// ════════════════════════════════════════════════════
// SLIDE 12 — REFLECTION & CONCLUSIONS
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Reflection & Conclusions", {
    x: 0.7, y: 0.3, w: 9, h: 0.7, fontSize: 34, bold: true, color: C.midnight,
    fontFace: TITLE_FONT, margin: 0
  });

  // 2x2 grid
  const boxes = [
    { title: "Key Takeaways", items: [
      "Successfully integrated ML, hardware, and software into one system",
      "Strong cross-functional collaboration",
      "Iterative testing improved accuracy significantly",
    ], x: 0.5, y: 1.2 },
    { title: "Challenges Faced", items: [
      "System integration between Pi, camera, and servos",
      "Debugging classification under varying lighting",
      "Managing timelines across parallel workstreams",
    ], x: 5.15, y: 1.2 },
    { title: "Team Reflection", items: [
      "Small design decisions had outsized impact",
      "Communication was critical during integration phases",
      "Testing early and often saved us weeks",
    ], x: 0.5, y: 3.3 },
    { title: "Skills Developed", items: [
      "Project planning and coordination",
      "System-level thinking across HW/SW boundary",
      "Real-world ML deployment on edge devices",
    ], x: 5.15, y: 3.3 },
  ];

  boxes.forEach((b) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: b.y, w: 4.4, h: 1.85,
      fill: { color: C.offWhite }, shadow: mkShadow()
    });

    // Left accent
    s.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: b.y, w: 0.05, h: 1.85, fill: { color: C.teal }
    });

    s.addText(b.title, {
      x: b.x + 0.2, y: b.y + 0.1, w: 4.0, h: 0.35, fontSize: 13, bold: true,
      color: C.tealDark, fontFace: BODY_FONT, margin: 0
    });

    const items = b.items.map((it, i) => ({
      text: it,
      options: { bullet: true, breakLine: i < b.items.length - 1 }
    }));
    s.addText(items, {
      x: b.x + 0.2, y: b.y + 0.5, w: 4.0, h: 1.2, fontSize: 10,
      color: C.slate, fontFace: BODY_FONT, paraSpaceAfter: 3, margin: 0
    });
  });

  logoWatermark(s);
}

// ════════════════════════════════════════════════════
// SLIDE 13 — THANK YOU (dark bookend)
// ════════════════════════════════════════════════════
{
  let s = pres.addSlide();
  s.background = { color: C.midnight };

  if (fs.existsSync(A.logo)) {
    s.addImage({ path: A.logo, x: 4.1, y: 0.8, w: 1.8, h: 1.8 });
  }

  s.addText("Thank You", {
    x: 1, y: 2.6, w: 8, h: 0.9, fontSize: 48, bold: true, color: C.white,
    fontFace: TITLE_FONT, align: "center", margin: 0
  });

  s.addText("Smarter recycling with AI. Turning waste into impact.", {
    x: 1, y: 3.5, w: 8, h: 0.5, fontSize: 14, color: C.tealLight,
    fontFace: BODY_FONT, align: "center", margin: 0
  });

  s.addText("github.com/robie1337/Recycla", {
    x: 1, y: 4.2, w: 8, h: 0.35, fontSize: 11, color: C.slateLight,
    fontFace: BODY_FONT, align: "center", margin: 0
  });

  s.addText("Questions?", {
    x: 1, y: 4.7, w: 8, h: 0.5, fontSize: 20, italic: true, color: C.teal,
    fontFace: TITLE_FONT, align: "center", margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.35, w: 10, h: 0.275, fill: { color: C.teal } });
}

// ── SAVE ──
const outPath = path.resolve("..", "Recycla – Smart Waste Sorting System V3.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Saved:", outPath);
}).catch(err => console.error("Error:", err));
