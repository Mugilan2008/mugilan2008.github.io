/**
 * Mugilan Saravana Perumal — Interactive 3D Liquid Glass Power Core (Three.js)
 * Domain: Power Electronics & Inductive Energy Systems
 * Features:
 *  - Physical refractive glass torus + brushed anodized aluminum stator ring + copper/cobalt energy coils
 *  - Studio HDRI-style PMREM RoomEnvironment + theme-reactive rim lighting
 *  - Spring-damped mouse parallax, scroll-driven rotation/camera angle, and ambient float
 *  - 60 FPS optimizations: clamped DPR [1, 2], IntersectionObserver pause, mobile <768px shader fallback,
 *    prefers-reduced-motion support, and WebGL error boundary
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
    renderer.toneMappingExposure = 1.18;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.15, 6.2);

    // 2. High-Contrast Studio Environment Lighting (PMREM RoomEnvironment)
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    envRenderTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRenderTarget.texture;
    scene.environmentIntensity = 0.9;

    // Key, Fill & Rim Studio Lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const cobaltRim = new THREE.PointLight(0x2997ff, 14, 18);
    cobaltRim.position.set(-4.5, 2.2, 2.5);
    scene.add(cobaltRim);

    const violetRim = new THREE.PointLight(0xbf5af2, 12, 18);
    violetRim.position.set(4.5, -2.0, 2.0);
    scene.add(violetRim);

    const cyanFill = new THREE.PointLight(0x64d2ff, 8, 16);
    cyanFill.position.set(0, -3.5, 3.5);
    scene.add(cyanFill);

    // 3. Domain-Relevant 3D Assembly: Liquid Glass Toroidal Power Core + Aluminum Stator
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Physical Liquid Glass Torus (Desktop transmission vs Mobile lightweight PBR)
    const torusGeo = new THREE.TorusGeometry(1.38, 0.42, isMobileViewport() ? 24 : 48, isMobileViewport() ? 56 : 110);
    disposables.geometries.push(torusGeo);

    const glassMat = isMobileViewport()
      ? new THREE.MeshPhysicalMaterial({
          color: 0xd8ecff,
          metalness: 0.08,
          roughness: 0.14,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
          transparent: true,
          opacity: 0.72,
          ior: 1.45
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0xeaf4ff,
          transmission: 0.92,
          ior: 1.45,
          roughness: 0.12,
          thickness: 0.85,
          metalness: 0.02,
          clearcoat: 1.0,
          clearcoatRoughness: 0.06,
          iridescence: 0.35,
          iridescenceIOR: 1.3,
          attenuationColor: new THREE.Color(0x2997ff),
          attenuationDistance: 2.8
        });
    disposables.materials.push(glassMat);

    const glassTorus = new THREE.Mesh(torusGeo, glassMat);
    coreGroup.add(glassTorus);

    // Brushed Anodized Aluminum Precision Ring (Apple Hardware Accent)
    const ringGeo = new THREE.TorusGeometry(1.92, 0.045, 20, 96);
    const aluminumMat = new THREE.MeshStandardMaterial({
      color: 0xb8c0cc,
      metalness: 0.9,
      roughness: 0.24
    });
    disposables.geometries.push(ringGeo);
    disposables.materials.push(aluminumMat);

    const outerRing = new THREE.Mesh(ringGeo, aluminumMat);
    outerRing.rotation.x = Math.PI * 0.18;
    coreGroup.add(outerRing);

    // Inner Brushed Titanium Gimbal Ring
    const innerRingGeo = new THREE.TorusGeometry(0.82, 0.035, 16, 72);
    disposables.geometries.push(innerRingGeo);
    const innerRing = new THREE.Mesh(innerRingGeo, aluminumMat);
    innerRing.rotation.y = Math.PI * 0.28;
    coreGroup.add(innerRing);

    // Luminous Energy Core Sphere (Liquid Glass / Cobalt Core)
    const coreSphereGeo = new THREE.IcosahedronGeometry(0.42, 3);
    const coreSphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x2997ff,
      emissive: 0x0a3d91,
      emissiveIntensity: 0.65,
      metalness: 0.25,
      roughness: 0.15,
      clearcoat: 1.0
    });
    disposables.geometries.push(coreSphereGeo);
    disposables.materials.push(coreSphereMat);
    const coreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
    coreGroup.add(coreSphere);

    // 12 Inductive Winding Accent Nodes around the Torus (Power Converter Coils)
    const coilGeo = new THREE.TorusGeometry(0.455, 0.024, 12, 32);
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0x64d2ff,
      emissive: 0x104a7a,
      emissiveIntensity: 0.55,
      metalness: 0.85,
      roughness: 0.2
    });
    disposables.geometries.push(coilGeo);
    disposables.materials.push(coilMat);

    const coilCount = 10;
    for (let i = 0; i < coilCount; i++) {
      const angle = (i / coilCount) * Math.PI * 2;
      const coil = new THREE.Mesh(coilGeo, coilMat);
      coil.position.set(Math.cos(angle) * 1.38, Math.sin(angle) * 1.38, 0);
      coil.rotation.z = angle;
      coil.rotation.x = Math.PI / 2;
      coreGroup.add(coil);
    }

    // Position the focal sculpture cleanly behind/offset for balanced editorial framing
    coreGroup.position.set(0, 0.25, 0);
    coreGroup.rotation.set(0.32, -0.35, 0.12);

    // 4. Resize Handler
    const updateSize = () => {
      if (!renderer || !camera) return;
      const rect = heroSection.getBoundingClientRect();
      const width = Math.max(rect.width, 320);
      const height = Math.max(rect.height, 420);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const scale = width < 640 ? 0.68 : width < 960 ? 0.84 : 1.0;
      coreGroup.scale.setScalar(scale);
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });

    // 5. Theme Sync (Adjust studio lighting intensity for Light vs Dark Mode)
    const syncThemeLighting = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      scene.environmentIntensity = isLight ? 1.15 : 0.88;
      cobaltRim.intensity = isLight ? 9 : 14;
      violetRim.intensity = isLight ? 8 : 12;
      glassMat.color.setHex(isLight ? 0xdbeafe : 0xeaf4ff);
      aluminumMat.color.setHex(isLight ? 0x8e95a3 : 0xc0c7d4);
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

    // 7. Visibility Pause via IntersectionObserver (60 FPS Battery & GPU Saver)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          animate();
        }
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

      // Smooth spring damping
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.05;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.05;

      if (!isReducedMotion) {
        coreGroup.position.y = 0.25 + Math.sin(t * 1.1) * 0.12 - scrollProgress * 0.45;
        coreGroup.rotation.y = -0.35 + t * 0.16 + pointer.currentX * 0.35 + scrollProgress * 0.9;
        coreGroup.rotation.x = 0.32 + Math.sin(t * 0.6) * 0.06 - pointer.currentY * 0.25 + scrollProgress * 0.35;
        outerRing.rotation.z = t * 0.22;
        innerRing.rotation.x = -t * 0.28;
        coreSphere.rotation.y = -t * 0.35;
        camera.position.z = 6.2 + scrollProgress * 0.85;
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
    // WebGL Error Boundary: degrade gracefully to CSS ambient aurora
    console.warn('3D WebGL Hero disabled (fallback active):', err);
    canvas.style.display = 'none';
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3DScene);
} else {
  initHero3DScene();
}
