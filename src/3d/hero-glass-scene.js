/**
 * Mugilan Saravana Perumal — Interactive 3D Power Electronics DC-DC Converter PCB (Three.js)
 * Contained inside dedicated #hero3dViewport so 100% of the model is unobstructed.
 * Features:
 *  - Rounded-bevel Liquid-Glass PCB substrate with 4 gold corner standoffs & PCB vias
 *  - Central 40-pin QFP Switching Controller IC with Pin-1 marker & glowing silicon die
 *  - True Toroidal Ferrite Power Inductor (L1) with 20 angled enameled copper windings
 *  - Schottky Power Catch Diode (D2) with cathode band + SMD 0805 MLCCs & Resistors
 *  - Finned Aluminum Heatsink + TO-220 Power MOSFET (Q1)
 *  - Twin Electrolytic Filter Capacitors (C1, C2) + Screw Terminal Block + Power LED
 *  - Animated electrical pulses + OrbitControls (drag 360°, double-click resets view)
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const initHero3DScene = () => {
  const canvas = document.getElementById('hero3dCanvas');
  const viewport = document.getElementById('hero3dViewport');
  if (!canvas || !viewport) return;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = reducedMotionQuery.matches;
  const isMobileViewport = () => window.innerWidth < 768;

  let renderer = null;
  let scene = null;
  let camera = null;
  let controls = null;
  let pmremGenerator = null;
  let envRenderTarget = null;
  let rafId = null;
  let isVisible = true;

  const disposables = { geometries: [], materials: [] };
  const trackGeo = (g) => { disposables.geometries.push(g); return g; };
  const trackMat = (m) => { disposables.materials.push(m); return m; };

  try {
    // 1. Renderer
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobileViewport(),
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(35, 16 / 10, 0.1, 100);
    const defaultCamPos = new THREE.Vector3(0.2, 2.85, 4.35);
    camera.position.copy(defaultCamPos);

    // Drag-to-rotate OrbitControls (zoom disabled so page scrolling never gets trapped)
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.14;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(0, 0.14, 0);

    // Double-click or Reset button restores default studio camera framing
    const resetCamera = () => {
      camera.position.copy(defaultCamPos);
      controls.target.set(0, 0.14, 0);
      controls.update();
    };
    canvas.addEventListener('dblclick', resetCamera);
    const resetBtn = document.getElementById('hero3dResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetCamera();
      });
    }

    // 2. Studio HDRI Environment & Rim Lights
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    envRenderTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRenderTarget.texture;
    scene.environmentIntensity = 1.1;

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const cobaltRim = new THREE.PointLight(0x2997ff, 15, 18);
    cobaltRim.position.set(-4, 2.5, 3);
    scene.add(cobaltRim);

    const emeraldRim = new THREE.PointLight(0x30d158, 10, 18);
    emeraldRim.position.set(4, 1.5, -2.5);
    scene.add(emeraldRim);

    // 3. Power Electronics DC-DC Converter Board Assembly
    const boardGroup = new THREE.Group();
    scene.add(boardGroup);

    const glassSubstrateMat = isMobileViewport()
      ? trackMat(new THREE.MeshPhysicalMaterial({
          color: 0x0d2137,
          metalness: 0.15,
          roughness: 0.16,
          clearcoat: 1.0,
          transparent: true,
          opacity: 0.88,
          ior: 1.45
        }))
      : trackMat(new THREE.MeshPhysicalMaterial({
          color: 0xd4ebff,
          transmission: 0.85,
          ior: 1.45,
          roughness: 0.11,
          thickness: 0.52,
          metalness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          attenuationColor: new THREE.Color(0x0a2e52),
          attenuationDistance: 1.85
        }));

    const darkCoreMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x161922, metalness: 0.35, roughness: 0.4 }));
    const aluminumMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xd0d7e2, metalness: 0.92, roughness: 0.2 }));
    const copperMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xde7e3a, metalness: 0.92, roughness: 0.18 }));
    const goldMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xf4c965, emissive: 0x382805, emissiveIntensity: 0.3, metalness: 0.94, roughness: 0.16 }));
    const ferriteMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x262932, metalness: 0.25, roughness: 0.55 }));
    const capBlueMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x1459a8, metalness: 0.45, roughness: 0.26 }));
    const terminalGreenMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x1e8f4e, metalness: 0.12, roughness: 0.38 }));
    const ceramicSmdMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xc2935b, metalness: 0.1, roughness: 0.45 }));
    const ledGlowMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x30d158, emissive: 0x30d158, emissiveIntensity: 2.3, roughness: 0.15 }));
    const pulseMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x64d2ff }));

    // A) Rounded Beveled Liquid-Glass PCB (4.0 x 2.6)
    const shape = new THREE.Shape();
    const w = 2.0, h = 1.3, r = 0.16;
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);

    const pcbGeo = trackGeo(new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3
    }));
    pcbGeo.rotateX(Math.PI / 2);
    const pcbMesh = new THREE.Mesh(pcbGeo, glassSubstrateMat);
    pcbMesh.position.y = 0.06;
    boardGroup.add(pcbMesh);

    // 4 Gold Corner Mounting Pads & Hex Standoff Screws
    const padGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 20));
    const screwGeo = trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.09, 6));
    [[-1.78, -1.08], [1.78, -1.08], [-1.78, 1.08], [1.78, 1.08]].forEach(([px, pz]) => {
      const pad = new THREE.Mesh(padGeo, goldMat);
      pad.position.set(px, 0.08, pz);
      boardGroup.add(pad);
      const screw = new THREE.Mesh(screwGeo, aluminumMat);
      screw.position.set(px, 0.11, pz);
      boardGroup.add(screw);
    });

    // Gold PCB Via Holes along edges
    const viaGeo = trackGeo(new THREE.CylinderGeometry(0.032, 0.032, 0.028, 12));
    [[-0.9, -1.05], [-0.45, -1.05], [0.45, -1.05], [-0.9, 1.05], [0.45, 1.05], [0.9, 1.05]].forEach(([vx, vz]) => {
      const via = new THREE.Mesh(viaGeo, goldMat);
      via.position.set(vx, 0.08, vz);
      boardGroup.add(via);
    });

    // B) Central 40-Pin QFP Switching Controller IC
    const icGroup = new THREE.Group();
    icGroup.position.set(-0.05, 0.15, 0.08);
    boardGroup.add(icGroup);

    icGroup.add(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.92, 0.14, 0.92)), darkCoreMat));

    const dieGlass = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.48, 0.035, 0.48)),
      trackMat(new THREE.MeshPhysicalMaterial({
        color: 0x2997ff,
        emissive: 0x0b46a8,
        emissiveIntensity: 0.9,
        metalness: 0.25,
        roughness: 0.08,
        clearcoat: 1.0
      }))
    );
    dieGlass.position.y = 0.08;
    icGroup.add(dieGlass);

    const pin1Dot = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16)), goldMat);
    pin1Dot.position.set(-0.34, 0.075, -0.34);
    icGroup.add(pin1Dot);

    const pinGeo = trackGeo(new THREE.BoxGeometry(0.038, 0.035, 0.15));
    for (let i = 0; i < 10; i++) {
      const o = -0.36 + i * 0.08;
      const pN = new THREE.Mesh(pinGeo, aluminumMat); pN.position.set(o, -0.04, -0.52); icGroup.add(pN);
      const pS = new THREE.Mesh(pinGeo, aluminumMat); pS.position.set(o, -0.04, 0.52); icGroup.add(pS);
      const pE = new THREE.Mesh(pinGeo, aluminumMat); pE.rotation.y = Math.PI / 2; pE.position.set(0.52, -0.04, o); icGroup.add(pE);
      const pW = new THREE.Mesh(pinGeo, aluminumMat); pW.rotation.y = Math.PI / 2; pW.position.set(-0.52, -0.04, o); icGroup.add(pW);
    }

    // C) True Toroidal Ferrite Power Inductor (L1) with 20 Copper Windings
    const toroidGroup = new THREE.Group();
    toroidGroup.position.set(-1.18, 0.34, -0.28);
    toroidGroup.rotation.x = Math.PI / 2;
    boardGroup.add(toroidGroup);

    toroidGroup.add(new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.32, 0.12, 20, 48)), ferriteMat));

    const windingGeo = trackGeo(new THREE.TorusGeometry(0.135, 0.022, 10, 20));
    const windingCount = 20;
    for (let wIdx = 0; wIdx < windingCount; wIdx++) {
      const theta = (wIdx / windingCount) * Math.PI * 2;
      const wire = new THREE.Mesh(windingGeo, copperMat);
      wire.position.set(Math.cos(theta) * 0.32, Math.sin(theta) * 0.32, 0);
      wire.rotation.z = theta;
      wire.rotation.y = Math.PI / 2;
      toroidGroup.add(wire);
    }

    // D) Schottky Catch Diode (D2) with Cathode Silver Band
    const diodeGroup = new THREE.Group();
    diodeGroup.position.set(-0.22, 0.18, -0.78);
    boardGroup.add(diodeGroup);
    const diodeBody = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.38, 20)), darkCoreMat);
    diodeBody.rotation.z = Math.PI / 2;
    diodeGroup.add(diodeBody);
    const cathodeBand = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.113, 0.113, 0.07, 20)), aluminumMat);
    cathodeBand.rotation.z = Math.PI / 2;
    cathodeBand.position.x = 0.11;
    diodeGroup.add(cathodeBand);
    const diodeLead = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.54, 10)), aluminumMat);
    diodeLead.rotation.z = Math.PI / 2;
    diodeGroup.add(diodeLead);

    // E) Finned Aluminum Heatsink + TO-220 Power MOSFET (Q1)
    const mosfetGroup = new THREE.Group();
    mosfetGroup.position.set(1.12, 0.08, -0.62);
    boardGroup.add(mosfetGroup);

    const hsPlate = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.92, 0.54, 0.07)), aluminumMat);
    hsPlate.position.y = 0.27;
    mosfetGroup.add(hsPlate);

    const finGeo = trackGeo(new THREE.BoxGeometry(0.045, 0.54, 0.22));
    for (let f = -3; f <= 3; f++) {
      const fin = new THREE.Mesh(finGeo, aluminumMat);
      fin.position.set(f * 0.13, 0.27, -0.14);
      mosfetGroup.add(fin);
    }

    const to220Tab = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.36, 0.18, 0.04)), aluminumMat);
    to220Tab.position.set(0, 0.44, 0.06);
    mosfetGroup.add(to220Tab);

    const to220Body = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.36, 0.32, 0.11)), darkCoreMat);
    to220Body.position.set(0, 0.23, 0.09);
    mosfetGroup.add(to220Body);

    const leadGeo = trackGeo(new THREE.BoxGeometry(0.03, 0.14, 0.03));
    [-0.1, 0, 0.1].forEach((lx) => {
      const l = new THREE.Mesh(leadGeo, aluminumMat);
      l.position.set(lx, 0.05, 0.09);
      mosfetGroup.add(l);
    });

    // F) Twin Brushed-Aluminum Electrolytic Capacitors (C1, C2)
    const addCapacitor = (x, z, rCap, hCap) => {
      const cap = new THREE.Group();
      cap.position.set(x, 0.08, z);
      const body = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(rCap, rCap, hCap, 28)), capBlueMat);
      body.position.y = hCap / 2;
      cap.add(body);
      const top = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(rCap * 0.92, rCap * 0.92, 0.025, 28)), aluminumMat);
      top.position.y = hCap + 0.01;
      cap.add(top);
      boardGroup.add(cap);
    };
    addCapacitor(1.15, 0.62, 0.22, 0.56);
    addCapacitor(1.56, 0.18, 0.17, 0.44);

    // G) SMD 0805 MLCC Capacitors & Resistors + Terminal Block + Power LED
    const smdBodyGeo = trackGeo(new THREE.BoxGeometry(0.14, 0.06, 0.08));
    const smdCapGeo = trackGeo(new THREE.BoxGeometry(0.035, 0.064, 0.084));
    [[-0.4, 0.85], [-0.15, 0.85], [0.25, 0.85], [0.55, 0.85]].forEach(([sx, sz]) => {
      const smd = new THREE.Mesh(smdBodyGeo, ceramicSmdMat);
      smd.position.set(sx, 0.11, sz);
      boardGroup.add(smd);
      [-0.06, 0.06].forEach((capX) => {
        const cap = new THREE.Mesh(smdCapGeo, aluminumMat);
        cap.position.set(sx + capX, 0.11, sz);
        boardGroup.add(cap);
      });
    });

    const termGeo = trackGeo(new THREE.BoxGeometry(0.32, 0.26, 0.52));
    const termIn = new THREE.Mesh(termGeo, terminalGreenMat);
    termIn.position.set(-1.62, 0.21, 0.62);
    boardGroup.add(termIn);

    const termScrewGeo = trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.04, 16));
    [-0.12, 0.12].forEach((tz) => {
      const ts = new THREE.Mesh(termScrewGeo, aluminumMat);
      ts.position.set(-1.62, 0.35, 0.62 + tz);
      boardGroup.add(ts);
    });

    const powerLed = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.06, 0.06)), ledGlowMat);
    powerLed.position.set(-0.78, 0.11, 0.85);
    boardGroup.add(powerLed);

    // H) Raised Gold PCB Traces & Animated Switching Energy Pulses
    const traceSpecs = [
      { w: 0.72, d: 0.045, x: -0.95, z: 0.62 },
      { w: 0.68, d: 0.045, x: -0.78, z: -0.25 },
      { w: 0.72, d: 0.045, x: 0.76, z: -0.35 },
      { w: 0.72, d: 0.045, x: 0.76, z: 0.45 }
    ];
    traceSpecs.forEach((tr) => {
      const tMesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(tr.w, 0.025, tr.d)), goldMat);
      tMesh.position.set(tr.x, 0.09, tr.z);
      boardGroup.add(tMesh);
    });

    const pulseGeo = trackGeo(new THREE.SphereGeometry(0.044, 12, 12));
    const pulses = [
      { mesh: new THREE.Mesh(pulseGeo, pulseMat), min: -1.32, max: -0.58, z: 0.62, speed: 1.2, phase: 0 },
      { mesh: new THREE.Mesh(pulseGeo, pulseMat), min: 0.42, max: 1.12, z: -0.35, speed: 1.6, phase: 0.9 },
      { mesh: new THREE.Mesh(pulseGeo, pulseMat), min: 0.42, max: 1.12, z: 0.45, speed: 1.4, phase: 1.8 }
    ];
    pulses.forEach((p) => {
      p.mesh.position.y = 0.11;
      boardGroup.add(p.mesh);
    });

    // 4. Resize Strictly to #hero3dViewport
    const updateSize = () => {
      if (!renderer || !camera) return;
      const width = Math.max(viewport.clientWidth, 260);
      const height = Math.max(viewport.clientHeight, 240);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(updateSize).observe(viewport);
    }

    // 5. Theme Sync
    const syncThemeLighting = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      scene.environmentIntensity = isLight ? 1.28 : 1.08;
      cobaltRim.intensity = isLight ? 10 : 15;
      glassSubstrateMat.color.setHex(isLight ? 0xc2dffb : 0xd4ebff);
    };
    syncThemeLighting();
    window.addEventListener('themeChange', syncThemeLighting);

    // 6. Pause When Out of Viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) animate();
      });
    }, { threshold: 0.02 });
    observer.observe(viewport);

    reducedMotionQuery.addEventListener('change', (e) => {
      isReducedMotion = e.matches;
    });

    // 7. Render Loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (!isVisible || !renderer || !scene || !camera) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      if (!isReducedMotion) {
        boardGroup.rotation.y = -0.32 + Math.sin(t * 0.42) * 0.22;
        boardGroup.position.y = 0.04 + Math.sin(t * 1.15) * 0.05;
        pulses.forEach((p) => {
          const u = (t * p.speed + p.phase) % 1;
          p.mesh.position.x = p.min + (p.max - p.min) * u;
          p.mesh.position.z = p.z;
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Clean Resource Disposal
    window.addEventListener('pagehide', () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (controls) controls.dispose();
      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      if (envRenderTarget) envRenderTarget.dispose();
      if (pmremGenerator) pmremGenerator.dispose();
      if (renderer) renderer.dispose();
    });
  } catch (err) {
    console.warn('3D WebGL Hero disabled (fallback active):', err);
    viewport.style.display = 'none';
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3DScene);
} else {
  initHero3DScene();
}
