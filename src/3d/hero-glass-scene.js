/**
 * Mugilan Saravana Perumal — Interactive 3D Liquid Glass Power Electronics PCB & IC Module (Three.js)
 * Domain: Electrical & Electronics Engineering (DC-DC Power Converter Hardware)
 * Components:
 *  - Physical Refractive Liquid-Glass PCB Substrate
 *  - Central QFP Microcontroller / Switching Controller IC with 32 metallic pins & glass die window
 *  - Enameled Copper-Wound Power Inductor (L1) on ferrite drum core
 *  - Finned Brushed-Aluminum Heatsink + TO-220 Power MOSFET (Q1)
 *  - Twin Brushed-Aluminum Electrolytic Filter Capacitors (C1, C2)
 *  - Metallic Gold/Cyan PCB Traces & Animated Switching Energy Pulses
 * Performance & Safety:
 *  - Clamped DPR [1, 2], IntersectionObserver pause, mobile <768px PBR fallback,
 *    prefers-reduced-motion support, WebGL error boundary, and full dispose() on pagehide
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const initHero3DScene = () => {
  const canvas = document.getElementById('hero3dCanvas');
  const heroSection = document.getElementById('home');
  if (!canvas || !heroSection) return;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = reducedMotionQuery.matches;
  const isMobileViewport = () => window.innerWidth < 768;

  let renderer = null;
  let scene = null;
  let camera = null;
  let pmremGenerator = null;
  let envRenderTarget = null;
  let rafId = null;
  let isVisible = true;

  const disposables = {
    geometries: [],
    materials: []
  };

  const trackGeo = (g) => { disposables.geometries.push(g); return g; };
  const trackMat = (m) => { disposables.materials.push(m); return m; };

  try {
    // 1. Renderer with WebGL Error Boundary
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobileViewport(),
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.45, 7.0);

    // 2. High-Contrast Studio Environment Lighting
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    envRenderTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRenderTarget.texture;
    scene.environmentIntensity = 0.95;

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const cobaltRim = new THREE.PointLight(0x2997ff, 16, 20);
    cobaltRim.position.set(-4.5, 2.5, 2.5);
    scene.add(cobaltRim);

    const emeraldRim = new THREE.PointLight(0x30d158, 10, 18);
    emeraldRim.position.set(4.5, -1.5, 3.0);
    scene.add(emeraldRim);

    const violetRim = new THREE.PointLight(0xbf5af2, 10, 18);
    violetRim.position.set(0, 4.0, -3.0);
    scene.add(violetRim);

    // 3. EEE Power Converter Board Assembly
    const boardGroup = new THREE.Group();
    scene.add(boardGroup);

    // Shared Materials
    const glassBoardMat = isMobileViewport()
      ? trackMat(new THREE.MeshPhysicalMaterial({
          color: 0x162538,
          metalness: 0.12,
          roughness: 0.15,
          clearcoat: 1.0,
          transparent: true,
          opacity: 0.78,
          ior: 1.45
        }))
      : trackMat(new THREE.MeshPhysicalMaterial({
          color: 0xd9ecff,
          transmission: 0.88,
          ior: 1.45,
          roughness: 0.12,
          thickness: 0.55,
          metalness: 0.04,
          clearcoat: 1.0,
          clearcoatRoughness: 0.06,
          attenuationColor: new THREE.Color(0x0d3b66),
          attenuationDistance: 2.2
        }));

    const aluminumMat = trackMat(new THREE.MeshStandardMaterial({
      color: 0xc5ccd6,
      metalness: 0.92,
      roughness: 0.22
    }));

    const darkSiliconMat = trackMat(new THREE.MeshStandardMaterial({
      color: 0x1b1d24,
      metalness: 0.35,
      roughness: 0.38
    }));

    const copperMat = trackMat(new THREE.MeshStandardMaterial({
      color: 0xd97b3e,
      metalness: 0.9,
      roughness: 0.2
    }));

    const goldTraceMat = trackMat(new THREE.MeshStandardMaterial({
      color: 0xf0c25e,
      emissive: 0x3b2a06,
      emissiveIntensity: 0.35,
      metalness: 0.92,
      roughness: 0.18
    }));

    const capSleeveMat = trackMat(new THREE.MeshStandardMaterial({
      color: 0x13549e,
      metalness: 0.45,
      roughness: 0.28
    }));

    const pulseMat = trackMat(new THREE.MeshBasicMaterial({
      color: 0x64d2ff
    }));

    // A) Liquid-Glass PCB Substrate (3.8 x 0.14 x 2.6)
    const pcbGeo = trackGeo(new THREE.BoxGeometry(3.8, 0.14, 2.6));
    const pcbMesh = new THREE.Mesh(pcbGeo, glassBoardMat);
    boardGroup.add(pcbMesh);

    // Metallic Edge Trim Frame around Glass PCB
    const frameBarXGeo = trackGeo(new THREE.BoxGeometry(3.84, 0.05, 0.04));
    const frameBarZGeo = trackGeo(new THREE.BoxGeometry(0.04, 0.05, 2.64));
    [-1.3, 1.3].forEach((z) => {
      const bar = new THREE.Mesh(frameBarXGeo, aluminumMat);
      bar.position.set(0, 0, z);
      boardGroup.add(bar);
    });
    [-1.9, 1.9].forEach((x) => {
      const bar = new THREE.Mesh(frameBarZGeo, aluminumMat);
      bar.position.set(x, 0, 0);
      boardGroup.add(bar);
    });

    // B) Central QFP Switching Controller IC Chip + 32 Pins + Glass Die Window
    const icGroup = new THREE.Group();
    icGroup.position.set(0, 0.14, 0.15);
    boardGroup.add(icGroup);

    const icBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.95, 0.14, 0.95)), darkSiliconMat);
    icGroup.add(icBody);

    // Liquid Glass Die Showcase Window on top of IC
    const dieWindow = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.54, 0.04, 0.54)),
      trackMat(new THREE.MeshPhysicalMaterial({
        color: 0x2997ff,
        emissive: 0x0a3d91,
        emissiveIntensity: 0.75,
        metalness: 0.2,
        roughness: 0.1,
        clearcoat: 1.0
      }))
    );
    dieWindow.position.y = 0.08;
    icGroup.add(dieWindow);

    // 32 Metallic Gull-Wing IC Pins (8 per side)
    const pinGeo = trackGeo(new THREE.BoxGeometry(0.045, 0.04, 0.16));
    for (let i = 0; i < 8; i++) {
      const offset = -0.35 + i * 0.1;
      // North & South pins
      const pN = new THREE.Mesh(pinGeo, aluminumMat);
      pN.position.set(offset, -0.04, -0.55);
      icGroup.add(pN);
      const pS = new THREE.Mesh(pinGeo, aluminumMat);
      pS.position.set(offset, -0.04, 0.55);
      icGroup.add(pS);
      // East & West pins
      const pE = new THREE.Mesh(pinGeo, aluminumMat);
      pE.rotation.y = Math.PI / 2;
      pE.position.set(0.55, -0.04, offset);
      icGroup.add(pE);
      const pW = new THREE.Mesh(pinGeo, aluminumMat);
      pW.rotation.y = Math.PI / 2;
      pW.position.set(-0.55, -0.04, offset);
      icGroup.add(pW);
    }

    // C) Copper-Wound Power Inductor (L1) on Left Side
    const inductorGroup = new THREE.Group();
    inductorGroup.position.set(-1.2, 0.34, -0.35);
    boardGroup.add(inductorGroup);

    const ferriteCore = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.36, 0.36, 0.44, 28)), darkSiliconMat);
    inductorGroup.add(ferriteCore);
    const flangeGeo = trackGeo(new THREE.CylinderGeometry(0.45, 0.45, 0.06, 28));
    const flangeTop = new THREE.Mesh(flangeGeo, darkSiliconMat);
    flangeTop.position.y = 0.24;
    inductorGroup.add(flangeTop);
    const flangeBot = new THREE.Mesh(flangeGeo, darkSiliconMat);
    flangeBot.position.y = -0.24;
    inductorGroup.add(flangeBot);

    // 5 stacked copper coil turns around the drum
    const coilTurnGeo = trackGeo(new THREE.TorusGeometry(0.38, 0.036, 12, 32));
    for (let c = -2; c <= 2; c++) {
      const turn = new THREE.Mesh(coilTurnGeo, copperMat);
      turn.rotation.x = Math.PI / 2;
      turn.position.y = c * 0.082;
      inductorGroup.add(turn);
    }

    // D) Finned Brushed-Aluminum Heatsink + Power MOSFET (Q1) at Back-Right
    const mosfetGroup = new THREE.Group();
    mosfetGroup.position.set(1.15, 0.07, -0.68);
    boardGroup.add(mosfetGroup);

    const hsBase = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.92, 0.56, 0.08)), aluminumMat);
    hsBase.position.y = 0.28;
    mosfetGroup.add(hsBase);

    const finGeo = trackGeo(new THREE.BoxGeometry(0.05, 0.56, 0.22));
    for (let f = -3; f <= 3; f++) {
      const fin = new THREE.Mesh(finGeo, aluminumMat);
      fin.position.set(f * 0.13, 0.28, -0.14);
      mosfetGroup.add(fin);
    }

    const mosfetBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.38, 0.36, 0.12)), darkSiliconMat);
    mosfetBody.position.set(0, 0.24, 0.1);
    mosfetGroup.add(mosfetBody);

    // 3 MOSFET Leads (Gate, Drain, Source)
    const leadGeo = trackGeo(new THREE.BoxGeometry(0.03, 0.16, 0.03));
    [-0.1, 0, 0.1].forEach((lx) => {
      const lead = new THREE.Mesh(leadGeo, aluminumMat);
      lead.position.set(lx, 0.04, 0.1);
      mosfetGroup.add(lead);
    });

    // E) Twin Electrolytic Filter Capacitors (C1, C2) on Front-Right
    const buildCapacitor = (x, z, scale = 1) => {
      const cap = new THREE.Group();
      cap.position.set(x, 0.07, z);
      cap.scale.setScalar(scale);
      const sleeve = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.56, 24)), capSleeveMat);
      sleeve.position.y = 0.28;
      cap.add(sleeve);
      const topVent = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 24)), aluminumMat);
      topVent.position.y = 0.57;
      cap.add(topVent);
      boardGroup.add(cap);
    };
    buildCapacitor(1.18, 0.62, 1.0);
    buildCapacitor(1.56, 0.18, 0.78);

    // F) Screw Terminal Blocks (Vin & Vout) on Left Edge
    const termMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x1f8a4c, roughness: 0.4, metalness: 0.15 }));
    const termGeo = trackGeo(new THREE.BoxGeometry(0.32, 0.26, 0.46));
    const termIn = new THREE.Mesh(termGeo, termMat);
    termIn.position.set(-1.62, 0.2, 0.65);
    boardGroup.add(termIn);

    // G) Raised Gold PCB Traces & Animated Switching Energy Pulses
    const traceSpecs = [
      { w: 0.7, d: 0.04, x: -0.82, z: -0.15 },
      { w: 0.04, d: 0.55, x: -0.48, z: -0.4 },
      { w: 0.75, d: 0.04, x: 0.75, z: -0.35 },
      { w: 0.72, d: 0.04, x: 0.78, z: 0.45 },
      { w: 0.88, d: 0.04, x: -0.95, z: 0.65 }
    ];
    traceSpecs.forEach((tr) => {
      const mesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(tr.w, 0.025, tr.d)), goldTraceMat);
      mesh.position.set(tr.x, 0.082, tr.z);
      boardGroup.add(mesh);
    });

    // Animated signal pulses gliding along key power bus paths
    const pulseGeo = trackGeo(new THREE.SphereGeometry(0.042, 12, 12));
    const pulses = [
      { mesh: new THREE.Mesh(pulseGeo, pulseMat), axis: 'x', min: -1.35, max: -0.5, fixed: 0.65, speed: 1.4, phase: 0 },
      { mesh: new THREE.Mesh(pulseGeo, pulseMat), axis: 'x', min: 0.45, max: 1.15, fixed: -0.35, speed: 1.8, phase: 1.2 },
      { mesh: new THREE.Mesh(pulseGeo, pulseMat), axis: 'x', min: 0.45, max: 1.15, fixed: 0.45, speed: 1.6, phase: 2.5 }
    ];
    pulses.forEach((p) => {
      p.mesh.position.y = 0.095;
      boardGroup.add(p.mesh);
    });

    // Initial Showcase Pose
    boardGroup.position.set(0, -0.1, 0);
    boardGroup.rotation.set(0.46, -0.42, -0.06);

    // 4. Responsive Resize
    const updateSize = () => {
      if (!renderer || !camera) return;
      const rect = heroSection.getBoundingClientRect();
      const width = Math.max(rect.width, 320);
      const height = Math.max(rect.height, 440);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const scale = width < 640 ? 0.66 : width < 960 ? 0.84 : 1.02;
      boardGroup.scale.setScalar(scale);
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });

    // 5. Theme Sync (Studio Light vs OLED Dark)
    const syncThemeLighting = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      scene.environmentIntensity = isLight ? 1.15 : 0.95;
      cobaltRim.intensity = isLight ? 10 : 16;
      emeraldRim.intensity = isLight ? 6 : 10;
      glassBoardMat.color.setHex(isLight ? 0xcfe5fc : 0xd9ecff);
      aluminumMat.color.setHex(isLight ? 0x9aa2b0 : 0xc5ccd6);
    };
    syncThemeLighting();
    window.addEventListener('themeChange', syncThemeLighting);

    // 6. Spring-Damped Mouse Parallax & Scroll-Driven Rotation
    const pointer = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
    let scrollProgress = 0;

    window.addEventListener('mousemove', (e) => {
      if (isReducedMotion) return;
      pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const maxHeroScroll = Math.max(heroSection.offsetHeight, 600);
      scrollProgress = Math.min(1.5, window.scrollY / maxHeroScroll);
    }, { passive: true });

    // 7. Visibility Pause via IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) animate();
      });
    }, { threshold: 0.02 });
    observer.observe(heroSection);

    reducedMotionQuery.addEventListener('change', (e) => {
      isReducedMotion = e.matches;
    });

    // 8. Render Loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (!isVisible || !renderer || !scene || !camera) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.05;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.05;

      if (!isReducedMotion) {
        boardGroup.position.y = -0.1 + Math.sin(t * 1.15) * 0.1 - scrollProgress * 0.45;
        boardGroup.rotation.y = -0.42 + Math.sin(t * 0.35) * 0.22 + pointer.currentX * 0.32 + scrollProgress * 0.85;
        boardGroup.rotation.x = 0.46 + Math.cos(t * 0.4) * 0.06 - pointer.currentY * 0.2 + scrollProgress * 0.25;
        camera.position.z = 7.0 + scrollProgress * 0.9;

        // Animate electrical pulses along PCB traces
        pulses.forEach((p) => {
          const u = ((t * p.speed + p.phase) % 1);
          p.mesh.position.x = p.min + (p.max - p.min) * u;
          p.mesh.position.z = p.fixed;
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Clean Resource Disposal
    window.addEventListener('pagehide', () => {
      if (rafId) cancelAnimationFrame(rafId);
      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      if (envRenderTarget) envRenderTarget.dispose();
      if (pmremGenerator) pmremGenerator.dispose();
      if (renderer) renderer.dispose();
    });
  } catch (err) {
    console.warn('3D WebGL Hero disabled (fallback active):', err);
    canvas.style.display = 'none';
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3DScene);
} else {
  initHero3DScene();
}
