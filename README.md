# Mugilan Saravana Perumal — Personal Engineering Portfolio

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/i18n-9%20Languages-brightgreen.svg)](#internationalization-i18n)
[![Stack](https://img.shields.io/badge/tech-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange.svg)](#technology-stack)
[![Status](https://img.shields.io/badge/status-Live%20Ready-success.svg)](#github-pages-deployment)

> High-performance, Apple-inspired personal engineering portfolio for **Mugilan Saravana Perumal**, an Electrical and Electronics Engineering student specializing in power converters, circuit simulations, MATLAB & Simulink control systems, and EV technologies.

---

## ⚡ Key Highlights & Features

- **🌐 9-Language Internationalization Engine**:
  - Live in-browser dynamic translation without page reload across **English (EN)**, **Tamil (TA - தமிழ்)**, **Telugu (TE - తెలుగు)**, **Hindi (HI - हिन्दी)**, **French (FR)**, **German (DE)**, **Russian (RU)**, **Japanese (JA - 日本語)**, and **Chinese (ZH - 中文)**.
  - Native script rendering and `localStorage` state persistence.

- **🔬 5 Comprehensive Engineering Case Studies**:
  1. **Buck Converter Simulation**: LTspice step-down power conversion (12V to 5V, IRFZ44N, 1N5819, 143µH, 200µF, 25kHz PWM).
  2. **Boost Converter Simulation**: LTspice step-up power conversion (5V to ~10V, 100kHz, 50% duty, 100µH).
  3. **Closed-Loop Speed Control of a DC Motor (MATLAB/Simulink)**: PI-regulated armature drive with dynamic load disturbance rejection and interactive block diagram.
  4. **Smart Wireless Power Transfer System for EV Charging**: Hardware prototype with dual charging bays, inductive resonant coils, LCD telemetry, and Arduino control.
  5. **Interactive Multilingual Portfolio Website**: Pure vanilla web engineering architecture with client-side translation runtime.

- **🎨 Premium Visual & Motion Design**:
  - HTML5 2D Canvas electrical waveform generator simulating AC sine and PWM switching ripples.
  - Apple-inspired slate dark mode with glassmorphism design tokens.
  - Universal fullscreen image lightbox with zoom toggle and mobile swipe gestures.

- **🛠️ 4-Domain Technical Skills Architecture**:
  - **Engineering & Simulation**: Simulink (*MATLAB Certified*), LTSpice (*Power & Analog Electronics*), Autodesk Fusion 360 (*CAD Certified*), Proteus (*PCB & Schematic*).
  - **Programming**: C (*Firmware*), Python (*Data Analysis*).
  - **Front-End Development**: HTML5, CSS3, Modern JavaScript (ES6+).
  - **Database**: MSSQL (*Relational Database Management*).

---

## 📂 Project Structure

```
portfolio/
├── index.html         # Main semantic structure, SEO metadata, 8 core sections
├── style.css          # Design system tokens, glassmorphism, responsive media queries
├── translations.js    # Comprehensive 9-language translation dictionary (269 keys each)
├── script.js          # i18n engine, project filter, canvas waveforms, universal lightbox
└── images/            # High-resolution technical schematics, plots, photos & certificates
    ├── pro1.jpg       # Profile portrait
    ├── cer1.jpg       # Autodesk Fusion 360 Certificate
    ├── cer2.jpg       # MathWorks Simulink Onramp Certificate
    ├── cer3.jpg       # Skill Development Awareness Certificate
    ├── cir1.jpg       # Buck Converter Schematic
    ├── out1.jpg       # Buck Converter Waveform
    ├── cir2.jpg       # Boost Converter Schematic
    ├── out2.jpg       # Boost Converter Waveform
    ├── cir3.jpg       # Simulink DC Motor Closed-Loop Model
    ├── out3.jpg       # Simulink Speed & Current Scope Response
    ├── pro_im1.jpg    # Smart Wireless EV Charging Hardware Prototype
    ├── web_showcase.jpg # Portfolio Web Application Showcase
    └── g1.jpg - g3.jpg  # 5-Day TVS EV Training Program Gallery
```

---

## 🚀 GitHub Pages Deployment Instructions

To host this repository on **GitHub Pages** under your account (`https://mugilan2008.github.io/portfolio` or `https://mugilan2008.github.io`):

### Step 1: Create a New Repository on GitHub
1. Go to [GitHub New Repository](https://github.com/new).
2. Name the repository `portfolio` (or `mugilan2008.github.io` for your root personal site).
3. Set the visibility to **Public**.
4. Leave "Add a README file" unchecked (since we already have one).
5. Click **Create repository**.

### Step 2: Push Local Code to GitHub
Run the following commands in your terminal:
```bash
# Navigate to the portfolio directory
cd "C:\Users\Mugil\.gemini\antigravity-ide\scratch\portfolio"

# Add your GitHub remote URL
git remote add origin https://github.com/Mugilan2008/portfolio.git

# Set main branch and push
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. On GitHub, navigate to your repository **Settings** → **Pages** (in the left sidebar).
2. Under **Build and deployment** → **Source**, select **Deploy from a branch**.
3. Under **Branch**, select **`main`** and folder **`/ (root)`**, then click **Save**.
4. In about 1–2 minutes, your website will be live at:
   👉 **`https://mugilan2008.github.io/`**

---

## 👤 Author

**Mugilan Saravana Perumal**  
*Electrical & Electronics Engineering Student*  
Sri Manakula Vinayagar Engineering College  
- **Email**: [Mugilan02767@gmail.com](mailto:Mugilan02767@gmail.com)  
- **LinkedIn**: [linkedin.com/in/mugilan-eee](https://www.linkedin.com/in/mugilan-eee)  
- **GitHub**: [github.com/Mugilan2008](https://github.com/Mugilan2008)  
- **Phone**: +91 9363158774
