import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ChevronDown, ChevronUp, Layers, Orbit, RotateCw, Zap } from 'lucide-react';
import { COLORWAYS, createSneakerModel } from '../three/sneakerModel.js';
import { createContactShadowTexture } from '../three/textures.js';

const CAMERA_PRESETS = {
  hero: { label: 'Hero 3/4', pos: [3.2, 1.85, 3.45], target: [0, 0.55, 0] },
  side: { label: 'Side', pos: [0.1, 0.85, 4.15], target: [0, 0.52, 0] },
  sole: { label: 'Sole', pos: [2.2, -1.05, 2.75], target: [0, 0.2, 0] },
  top: { label: 'Top', pos: [0.05, 4.1, 0.85], target: [0, 0.4, 0] },
};

const MODES = [
  { id: 'levitate', label: 'Zero-G', icon: Orbit },
  { id: 'explode', label: 'Explode', icon: Layers },
  { id: 'sprint', label: 'Hyper-Sprint', icon: Zap },
  { id: 'turntable', label: 'Turntable', icon: RotateCw },
];

// Reusable math helpers outside render loop (zero GC)
const _dummy = new THREE.Object3D();
const _targetCamPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

function detectSoftwareWebGL() {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export default function Sneaker3DShowcase({
  initialColorway = 'chalk-volt',
  height = 'clamp(480px, 72vh, 660px)',
  title = 'SOLE STUDIO · 3D KINETIC LAB',
  subtitle = 'Drag to orbit · Scroll to zoom · Switch kinetic modes below',
}) {
  const mountRef = useRef(null);
  const [mode, setMode] = useState('levitate');
  const [colorway, setColorway] = useState(initialColorway);
  const [explodeValue, setExplodeValue] = useState(0);
  const [activePreset, setActivePreset] = useState('hero');
  const [dockCollapsed, setDockCollapsed] = useState(false);

  // Mutable ref bridge so React UI state never tears down the WebGL context
  const stateRef = useRef({
    mode: 'levitate',
    colorway: initialColorway,
    explodeTarget: 0,
    explodeCurrent: 0,
    flexAmpCurrent: 0,
    cameraPreset: null,
    userInteracting: false,
  });

  const modelApiRef = useRef(null);

  useEffect(() => {
    stateRef.current.mode = mode;
    if (mode === 'explode' && explodeValue === 0) {
      setExplodeValue(85);
      stateRef.current.explodeTarget = 0.85;
    } else if (mode !== 'explode' && explodeValue > 0) {
      setExplodeValue(0);
      stateRef.current.explodeTarget = 0;
    }
  }, [mode]);

  useEffect(() => {
    stateRef.current.explodeTarget = explodeValue / 100;
  }, [explodeValue]);

  useEffect(() => {
    stateRef.current.colorway = colorway;
    if (modelApiRef.current) {
      modelApiRef.current.setColorway(colorway);
    }
  }, [colorway]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'h' || e.key === 'H') {
        const tag = document.activeElement?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          setDockCollapsed((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const triggerCameraPreset = (presetKey) => {
    setActivePreset(presetKey);
    const preset = CAMERA_PRESETS[presetKey];
    if (preset) {
      stateRef.current.cameraPreset = {
        pos: preset.pos,
        target: preset.target,
      };
      stateRef.current.userInteracting = false;
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 960;
    const clientHeight = container.clientHeight || 540;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111214);
    scene.fog = new THREE.FogExp2(0x111214, 0.055);

    const camera = new THREE.PerspectiveCamera(38, width / clientHeight, 0.1, 60);
    camera.position.set(3.2, 1.85, 3.45);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio environment map (mandatory for realistic PBR reflections)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.1;
    controls.maxDistance = 6.8;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.target.set(0, 0.55, 0);

    controls.addEventListener('start', () => {
      stateRef.current.cameraPreset = null;
      stateRef.current.userInteracting = true;
    });
    controls.addEventListener('end', () => {
      stateRef.current.userInteracting = false;
    });

    // Balanced 3-point + studio softbox lighting rig
    const hemiLight = new THREE.HemisphereLight(0xdbe8ff, 0x2a2520, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.35);
    keyLight.position.set(4.5, 6.5, 4.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -2.8;
    keyLight.shadow.camera.right = 2.8;
    keyLight.shadow.camera.top = 2.8;
    keyLight.shadow.camera.bottom = -2.8;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.SpotLight(0xc7ff4d, 16, 14, Math.PI * 0.28, 0.75, 1.5);
    rimLight.position.set(-3.4, 2.8, -3.0);
    scene.add(rimLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softboxTop = new THREE.RectAreaLight(0xffffff, 2.6, 5, 2.5);
      softboxTop.position.set(0, 4.5, 1.8);
      softboxTop.lookAt(0, 0.4, 0);
      scene.add(softboxTop);
    }

    // Studio Ground Plinth & Contact Grounding
    const floorGeo = new THREE.CircleGeometry(14, 64);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x16171a,
      roughness: 0.88,
      metalness: 0.12,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.58;
    floor.receiveShadow = true;
    scene.add(floor);

    // Architectural Pedestal Disc
    const plinthGeo = new THREE.CylinderGeometry(1.95, 2.15, 0.12, 64);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x1e2024,
      roughness: 0.55,
      metalness: 0.25,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -0.5;
    plinth.receiveShadow = true;
    scene.add(plinth);

    // Glowing Kinetic Energy Rings around plinth
    const ringGeo = new THREE.TorusGeometry(2.05, 0.014, 12, 96);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc7ff4d,
      transparent: true,
      opacity: 0.78,
    });
    const energyRing = new THREE.Mesh(ringGeo, ringMat);
    energyRing.position.y = -0.42;
    scene.add(energyRing);

    const orbitHaloGeo = new THREE.TorusGeometry(1.75, 0.008, 10, 80);
    const orbitHaloMat = new THREE.MeshBasicMaterial({
      color: 0xc7ff4d,
      transparent: true,
      opacity: 0.36,
    });
    const orbitHalo = new THREE.Mesh(orbitHaloGeo, orbitHaloMat);
    orbitHalo.position.y = 0.55;
    orbitHalo.rotation.x = Math.PI * 0.42;
    scene.add(orbitHalo);

    // Soft radial contact shadow directly beneath sneaker
    const shadowTex = createContactShadowTexture();
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 1.8),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.43;
    scene.add(shadowPlane);

    // 9-Part Procedural Sneaker Model
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const sneaker = createSneakerModel(maxAnisotropy);
    sneaker.setColorway(stateRef.current.colorway);
    scene.add(sneaker.group);
    modelApiRef.current = sneaker;

    // Instanced Kinetic Particles (Dust Motes -> Hyper-Sprint Wind Streaks)
    const particleCount = 110;
    const particleGeo = new THREE.BoxGeometry(0.03, 0.03, 0.03);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xc7ff4d,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    particles.frustumCulled = false;

    const particleSeeds = Array.from({ length: particleCount }, (_, idx) => ({
      angle: (idx / particleCount) * Math.PI * 2 + (idx % 5) * 0.4,
      radius: 1.55 + ((idx * 37) % 100) * 0.025,
      y: -0.25 + ((idx * 53) % 100) * 0.022,
      speed: 0.6 + ((idx * 19) % 100) * 0.015,
      xPos: ((idx * 71) % 100) * 0.09 - 4.5,
    }));
    scene.add(particles);

    // Post-processing selective subtle bloom on GPU only
    let composer = null;
    let bloomPass = null;
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, clientHeight),
        0.28,
        0.55,
        0.92
      );
      composer.addPass(bloomPass);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb) {
      const gl = renderer.getContext();
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      // Smoothly damp Exploded View separation
      st.explodeCurrent = THREE.MathUtils.damp(
        st.explodeCurrent,
        st.explodeTarget,
        5.5,
        delta
      );
      sneaker.setExplodeAmount(st.explodeCurrent);

      // Smoothly damp midsole flex shader amplitude
      const targetFlex = st.mode === 'sprint' ? 1.0 : 0.0;
      st.flexAmpCurrent = THREE.MathUtils.damp(
        st.flexAmpCurrent,
        targetFlex,
        6.0,
        delta
      );
      sneaker.flexUniforms.uFlexTime.value = elapsed;
      sneaker.flexUniforms.uFlexAmp.value = st.flexAmpCurrent;

      // Kinetic Mode Choreography
      if (st.mode === 'levitate') {
        sneaker.group.position.y = 0.22 + Math.sin(elapsed * 2.1) * 0.14;
        sneaker.group.rotation.z = Math.sin(elapsed * 1.4) * 0.08 + 0.08;
        sneaker.group.rotation.x = Math.cos(elapsed * 1.1) * 0.06;
        sneaker.group.rotation.y += delta * 0.42;
      } else if (st.mode === 'explode') {
        sneaker.group.position.y = THREE.MathUtils.damp(
          sneaker.group.position.y,
          0.26 + Math.sin(elapsed * 1.5) * 0.04,
          4.5,
          delta
        );
        sneaker.group.rotation.z = THREE.MathUtils.damp(
          sneaker.group.rotation.z,
          0.05,
          5.0,
          delta
        );
        sneaker.group.rotation.x = THREE.MathUtils.damp(
          sneaker.group.rotation.x,
          0.0,
          5.0,
          delta
        );
        sneaker.group.rotation.y += delta * 0.28;
      } else if (st.mode === 'sprint') {
        const stride = Math.sin(elapsed * 5.6);
        sneaker.group.position.y = 0.28 + Math.abs(stride) * 0.24;
        sneaker.group.rotation.z = -0.22 + Math.cos(elapsed * 5.6) * 0.24;
        sneaker.group.rotation.x = Math.sin(elapsed * 2.8) * 0.06;
        sneaker.group.rotation.y = THREE.MathUtils.damp(
          sneaker.group.rotation.y,
          Math.sin(elapsed * 1.1) * 0.35,
          4.0,
          delta
        );
      } else {
        // Turntable luxury showroom rotation
        sneaker.group.position.y = THREE.MathUtils.damp(
          sneaker.group.position.y,
          0.04,
          5.0,
          delta
        );
        sneaker.group.rotation.z = THREE.MathUtils.damp(
          sneaker.group.rotation.z,
          0,
          5.0,
          delta
        );
        sneaker.group.rotation.x = THREE.MathUtils.damp(
          sneaker.group.rotation.x,
          0,
          5.0,
          delta
        );
        sneaker.group.rotation.y += delta * 0.72;
      }

      // Orbiting telemetry halo + rim spotlight
      orbitHalo.rotation.z = elapsed * 0.9;
      orbitHalo.rotation.y = Math.sin(elapsed * 0.5) * 0.35;
      orbitHalo.scale.setScalar(1 + st.explodeCurrent * 0.28);
      ringMat.opacity = st.mode === 'sprint' ? 0.95 : 0.65 + Math.sin(elapsed * 2.5) * 0.15;

      rimLight.position.x = Math.cos(elapsed * 0.85) * 3.8;
      rimLight.position.z = Math.sin(elapsed * 0.85) * 3.8;

      // Contact shadow scale reacts smoothly to levitation height
      const shadowScale = THREE.MathUtils.clamp(1.05 - sneaker.group.position.y * 0.32, 0.62, 1.1);
      shadowPlane.scale.set(shadowScale, shadowScale, 1);

      // Animate Instanced Particles (orbital motes vs hyper-sprint wind streaks)
      const isSprint = st.mode === 'sprint';
      for (let i = 0; i < particleCount; i += 1) {
        const p = particleSeeds[i];
        if (isSprint) {
          p.xPos -= delta * (4.5 + p.speed * 3.2);
          if (p.xPos < -4.8) p.xPos = 4.8;
          _dummy.position.set(
            p.xPos,
            p.y + Math.sin(elapsed * 3 + i) * 0.08,
            Math.sin(p.angle) * 1.45
          );
          _dummy.rotation.set(0, 0, 0);
          _dummy.scale.set(8.5, 0.35, 0.35);
        } else {
          const theta = p.angle + elapsed * p.speed * 0.35;
          const r = p.radius + Math.sin(elapsed + i) * 0.12;
          _dummy.position.set(
            Math.cos(theta) * r,
            p.y + Math.sin(elapsed * 1.4 + i) * 0.18,
            Math.sin(theta) * r
          );
          _dummy.rotation.set(elapsed * 0.8 + i, elapsed * 0.6, 0);
          _dummy.scale.setScalar(0.85 + Math.sin(elapsed * 2 + i) * 0.35);
        }
        _dummy.updateMatrix();
        particles.setMatrixAt(i, _dummy.matrix);
      }
      particles.instanceMatrix.needsUpdate = true;

      // Smooth damped camera preset transitions
      if (st.cameraPreset && !st.userInteracting) {
        _targetCamPos.set(...st.cameraPreset.pos);
        _targetLook.set(...st.cameraPreset.target);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 5.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 5.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 5.5, delta);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLook.x, 5.5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLook.y, 5.5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLook.z, 5.5, delta);

        if (camera.position.distanceTo(_targetCamPos) < 0.02) {
          st.cameraPreset = null;
        }
      }

      controls.update();

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          if (composer) composer.setSize(w, h);
          if (bloomPass) bloomPass.resolution.set(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      sneaker.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      plinthGeo.dispose();
      plinthMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      orbitHaloGeo.dispose();
      orbitHaloMat.dispose();
      shadowTex.dispose();
      shadowPlane.geometry.dispose();
      shadowPlane.material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (composer) composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      modelApiRef.current = null;
    };
  }, []);

  return (
    <div className="kinetic-lab-shell" style={{ height }}>
      {/* Dedicated WebGL Mount Ref (zero sibling DOM clutter inside) */}
      <div ref={mountRef} className="kinetic-canvas-mount" aria-label="Interactive 3D footwear studio" />

      {/* Minimal Top-Left Header */}
      <div className="kinetic-hud-top">
        <span className="kinetic-hud-title">{title}</span>
        <span className="kinetic-hud-sub">{subtitle}</span>
      </div>

      {/* Collapsible Bottom Control Dock */}
      <div className={`kinetic-dock-wrap ${dockCollapsed ? 'collapsed' : ''}`}>
        <button
          type="button"
          className="kinetic-dock-toggle"
          onClick={() => setDockCollapsed((c) => !c)}
          aria-expanded={!dockCollapsed}
        >
          {dockCollapsed ? (
            <>
              <ChevronUp size={14} aria-hidden="true" /> Show Controls (H)
            </>
          ) : (
            <>
              <ChevronDown size={14} aria-hidden="true" /> Hide Controls (H)
            </>
          )}
        </button>

        <div className="kinetic-dock">
          {/* Animation Modes */}
          <div className="kinetic-dock-group" role="group" aria-label="3D animation mode">
            {MODES.map((m) => {
              const Icon = m.icon;
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  className={`kinetic-mode-btn ${active ? 'active' : ''}`}
                  onClick={() => setMode(m.id)}
                  aria-pressed={active}
                >
                  <Icon size={14} aria-hidden="true" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="kinetic-dock-divider" aria-hidden="true" />

          {/* Explode Slider */}
          <div className="kinetic-slider-group">
            <label htmlFor="explode-slider" className="kinetic-slider-label">
              Explode <span className="tabular-nums">{explodeValue}%</span>
            </label>
            <input
              id="explode-slider"
              type="range"
              min="0"
              max="100"
              value={explodeValue}
              onChange={(e) => {
                const val = Number(e.target.value);
                setExplodeValue(val);
                if (val > 0 && mode !== 'explode') setMode('explode');
              }}
              className="kinetic-slider"
            />
          </div>

          <div className="kinetic-dock-divider" aria-hidden="true" />

          {/* Live Finish Swatches */}
          <div className="kinetic-dock-group" role="group" aria-label="3D shoe colorway">
            {COLORWAYS.map((cw) => {
              const active = colorway === cw.id;
              return (
                <button
                  key={cw.id}
                  type="button"
                  className={`kinetic-swatch ${active ? 'active' : ''}`}
                  style={{ backgroundColor: cw.swatch }}
                  title={cw.name}
                  aria-label={`Colorway ${cw.name}`}
                  aria-pressed={active}
                  onClick={() => setColorway(cw.id)}
                />
              );
            })}
          </div>

          <div className="kinetic-dock-divider" aria-hidden="true" />

          {/* Camera Angles */}
          <div className="kinetic-dock-group" role="group" aria-label="Camera angle">
            {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                className={`kinetic-cam-btn ${activePreset === key ? 'active' : ''}`}
                onClick={() => triggerCameraPreset(key)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
