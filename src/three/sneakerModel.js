import * as THREE from 'three';
import {
  createCarbonWeaveTexture,
  createKnitTextures,
  createLeatherBumpTexture,
  createTreadBumpTexture,
} from './textures.js';

export const COLORWAYS = [
  {
    id: 'chalk-volt',
    name: 'Chalk & Volt',
    swatch: '#F2F1EC',
    upper: '#F2F1EC',
    panel: '#D9D7D0',
    midsole: '#FAFAF7',
    outsole: '#202124',
    accent: '#C7FF4D',
    lace: '#FFFFFF',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Carbon',
    swatch: '#1C1D20',
    upper: '#1E1F22',
    panel: '#2F3136',
    midsole: '#141517',
    outsole: '#C7FF4D',
    accent: '#C7FF4D',
    lace: '#2A2C30',
  },
  {
    id: 'sand',
    name: 'Alabaster Sand',
    swatch: '#D8CEBE',
    upper: '#EFE9DE',
    panel: '#CBBBA4',
    midsole: '#F6F2EA',
    outsole: '#A67C52',
    accent: '#8D6E4E',
    lace: '#F7F4EC',
  },
  {
    id: 'terracotta',
    name: 'Terracotta Clay',
    swatch: '#B9745B',
    upper: '#B9745B',
    panel: '#9A5942',
    midsole: '#F3EFE8',
    outsole: '#8E6747',
    accent: '#F5E7DC',
    lace: '#F3EFE8',
  },
  {
    id: 'cobalt',
    name: 'Deep Cobalt',
    swatch: '#1E314D',
    upper: '#223656',
    panel: '#8A94A3',
    midsole: '#F3F4F6',
    outsole: '#182233',
    accent: '#C7FF4D',
    lace: '#EEF1F4',
  },
];

function buildFootprintShape(scaleX = 1, scaleZ = 1) {
  const s = new THREE.Shape();
  s.moveTo(-1.35 * scaleX, 0.0);
  s.bezierCurveTo(-1.35 * scaleX, 0.42 * scaleZ, -1.05 * scaleX, 0.48 * scaleZ, -0.55 * scaleX, 0.42 * scaleZ);
  s.bezierCurveTo(-0.15 * scaleX, 0.36 * scaleZ, 0.25 * scaleX, 0.56 * scaleZ, 0.72 * scaleX, 0.56 * scaleZ);
  s.bezierCurveTo(1.22 * scaleX, 0.56 * scaleZ, 1.48 * scaleX, 0.32 * scaleZ, 1.48 * scaleX, 0.02 * scaleZ);
  s.bezierCurveTo(1.48 * scaleX, -0.34 * scaleZ, 1.15 * scaleX, -0.52 * scaleZ, 0.65 * scaleX, -0.5 * scaleZ);
  s.bezierCurveTo(0.2 * scaleX, -0.48 * scaleZ, -0.15 * scaleX, -0.35 * scaleZ, -0.58 * scaleX, -0.41 * scaleZ);
  s.bezierCurveTo(-1.05 * scaleX, -0.47 * scaleZ, -1.35 * scaleX, -0.4 * scaleZ, -1.35 * scaleX, 0.0);
  return s;
}

function buildSideProfileShape() {
  // Side silhouette in XY plane, extruded along Z for anatomical upper
  const s = new THREE.Shape();
  s.moveTo(-1.32, 0.02);
  s.lineTo(1.36, 0.04);
  s.bezierCurveTo(1.46, 0.14, 1.44, 0.32, 1.16, 0.44);
  s.bezierCurveTo(0.76, 0.58, 0.38, 0.72, 0.05, 0.98);
  // Tongue notch / ankle collar scoop
  s.bezierCurveTo(-0.22, 0.94, -0.42, 0.76, -0.68, 0.76);
  s.bezierCurveTo(-0.94, 0.76, -1.16, 0.94, -1.25, 0.94);
  s.bezierCurveTo(-1.36, 0.72, -1.38, 0.32, -1.32, 0.02);
  return s;
}

function buildQuarterPanelShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.78, 0.06);
  s.lineTo(0.45, 0.08);
  s.bezierCurveTo(0.54, 0.25, 0.38, 0.56, 0.12, 0.78);
  s.bezierCurveTo(-0.18, 0.74, -0.42, 0.62, -0.68, 0.64);
  s.bezierCurveTo(-0.88, 0.45, -0.88, 0.2, -0.78, 0.06);
  return s;
}

function buildMidsoleSideShape() {
  const s = new THREE.Shape();
  s.moveTo(-1.42, 0.0);
  s.bezierCurveTo(-0.7, -0.02, 0.45, -0.02, 1.44, 0.12);
  s.bezierCurveTo(1.48, 0.2, 1.42, 0.28, 1.32, 0.29);
  s.bezierCurveTo(0.65, 0.24, -0.4, 0.31, -1.36, 0.36);
  s.bezierCurveTo(-1.46, 0.24, -1.46, 0.1, -1.42, 0.0);
  return s;
}

export function createSneakerModel(maxAnisotropy = 4) {
  const root = new THREE.Group();
  root.name = 'SoleStudioSneaker';

  const { map: knitMap, bumpMap: knitBump } = createKnitTextures(maxAnisotropy);
  const leatherBump = createLeatherBumpTexture(maxAnisotropy);
  const treadBump = createTreadBumpTexture(maxAnisotropy);
  const carbonMap = createCarbonWeaveTexture(maxAnisotropy);

  const initial = COLORWAYS[0];

  // Shared uniform for midsole hyper-sprint kinetic flex shader
  const flexUniforms = {
    uFlexTime: { value: 0 },
    uFlexAmp: { value: 0 },
  };

  // Materials with distinct PBR roughness contrast (>= 0.25 between adjacent layers)
  const outsoleMat = new THREE.MeshStandardMaterial({
    color: initial.outsole,
    roughness: 0.88,
    metalness: 0.05,
    bumpMap: treadBump,
    bumpScale: 0.025,
  });

  const carbonMat = new THREE.MeshPhysicalMaterial({
    map: carbonMap,
    roughness: 0.22,
    metalness: 0.25,
    clearcoat: 0.9,
    clearcoatRoughness: 0.14,
  });

  const midsoleMat = new THREE.MeshStandardMaterial({
    color: initial.midsole,
    roughness: 0.48,
    metalness: 0.02,
  });

  // Inject vertex wave flex onto midsole for Hyper-Sprint mode
  midsoleMat.onBeforeCompile = (shader) => {
    shader.uniforms.uFlexTime = flexUniforms.uFlexTime;
    shader.uniforms.uFlexAmp = flexUniforms.uFlexAmp;
    shader.vertexShader = `
      uniform float uFlexTime;
      uniform float uFlexAmp;
      ${shader.vertexShader}
    `.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      float toeFactor = smoothstep(0.15, 1.35, transformed.x);
      float heelFactor = smoothstep(-0.2, -1.35, transformed.x);
      float wave = sin(uFlexTime * 7.0 - transformed.x * 2.4);
      transformed.y += (toeFactor * 0.14 * max(0.0, wave) - heelFactor * 0.06 * wave) * uFlexAmp;
      `
    );
  };

  const insoleMat = new THREE.MeshStandardMaterial({
    color: '#D4B483',
    roughness: 0.85,
    metalness: 0.0,
    bumpMap: leatherBump,
    bumpScale: 0.008,
  });

  const upperMat = new THREE.MeshStandardMaterial({
    color: initial.upper,
    map: knitMap,
    bumpMap: knitBump,
    bumpScale: 0.022,
    roughness: 0.82,
    metalness: 0.02,
  });

  const panelMat = new THREE.MeshPhysicalMaterial({
    color: initial.panel,
    bumpMap: leatherBump,
    bumpScale: 0.015,
    roughness: 0.42,
    metalness: 0.05,
    clearcoat: 0.15,
    clearcoatRoughness: 0.55,
  });

  const heelClipMat = new THREE.MeshPhysicalMaterial({
    color: '#202226',
    roughness: 0.22,
    metalness: 0.72,
    clearcoat: 0.75,
    clearcoatRoughness: 0.2,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: initial.accent,
    emissive: initial.accent,
    emissiveIntensity: 0.35,
    roughness: 0.3,
    metalness: 0.15,
  });

  const laceMat = new THREE.MeshStandardMaterial({
    color: initial.lace,
    roughness: 0.7,
    metalness: 0.02,
  });

  const eyeletMat = new THREE.MeshStandardMaterial({
    color: '#D5D8DC',
    roughness: 0.18,
    metalness: 0.92,
  });

  const layers = [];
  const registerLayer = (group, explodeOffset) => {
    group.userData.basePos = group.position.clone();
    group.userData.explodeOffset = explodeOffset;
    layers.push(group);
    root.add(group);
  };

  // 1. Outsole Layer
  const outsoleGroup = new THREE.Group();
  const outsoleGeo = new THREE.ExtrudeGeometry(buildFootprintShape(1.01, 1.01), {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 4,
    curveSegments: 28,
  });
  outsoleGeo.rotateX(Math.PI / 2);
  const outsoleMesh = new THREE.Mesh(outsoleGeo, outsoleMat);
  outsoleMesh.position.y = 0.09;
  outsoleMesh.castShadow = true;
  outsoleMesh.receiveShadow = true;
  outsoleGroup.add(outsoleMesh);

  // Forefoot & heel tread pods
  const podGeo = new THREE.BoxGeometry(0.48, 0.03, 0.62);
  const forePod = new THREE.Mesh(podGeo, accentMat);
  forePod.position.set(0.75, 0.015, 0.02);
  outsoleGroup.add(forePod);
  registerLayer(outsoleGroup, new THREE.Vector3(0, -0.95, 0));

  // 2. Carbon Propulsion Plate (Nested inside sole)
  const carbonGroup = new THREE.Group();
  const plateGeo = new THREE.ExtrudeGeometry(buildFootprintShape(0.84, 0.72), {
    depth: 0.035,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
    curveSegments: 24,
  });
  plateGeo.rotateX(Math.PI / 2);
  const plateMesh = new THREE.Mesh(plateGeo, carbonMat);
  plateMesh.position.y = 0.14;
  plateMesh.castShadow = true;
  carbonGroup.add(plateMesh);
  registerLayer(carbonGroup, new THREE.Vector3(0, -0.52, 0));

  // 3. Sculpted AeroFoam Midsole
  const midsoleGroup = new THREE.Group();
  const midsoleGeo = new THREE.ExtrudeGeometry(buildMidsoleSideShape(), {
    depth: 0.88,
    bevelEnabled: true,
    bevelThickness: 0.075,
    bevelSize: 0.05,
    bevelSegments: 5,
    curveSegments: 24,
  });
  midsoleGeo.translate(0, 0.08, -0.44);
  const midsoleMesh = new THREE.Mesh(midsoleGeo, midsoleMat);
  midsoleMesh.castShadow = true;
  midsoleMesh.receiveShadow = true;
  midsoleGroup.add(midsoleMesh);

  // Sidewall AeroFoam Accent Channel
  const channelGeo = new THREE.BoxGeometry(1.1, 0.06, 0.99);
  const channelMesh = new THREE.Mesh(channelGeo, accentMat);
  channelMesh.position.set(-0.42, 0.24, 0);
  midsoleGroup.add(channelMesh);
  registerLayer(midsoleGroup, new THREE.Vector3(0, -0.18, 0));

  // 4. Anatomical Cork/EVA Insole
  const insoleGroup = new THREE.Group();
  const insoleGeo = new THREE.ExtrudeGeometry(buildFootprintShape(0.86, 0.78), {
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 3,
    curveSegments: 24,
  });
  insoleGeo.rotateX(Math.PI / 2);
  const insoleMesh = new THREE.Mesh(insoleGeo, insoleMat);
  insoleMesh.position.y = 0.39;
  insoleGroup.add(insoleMesh);

  const heelPadGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.025, 24);
  const heelPad = new THREE.Mesh(heelPadGeo, accentMat);
  heelPad.position.set(-0.82, 0.405, 0);
  insoleGroup.add(heelPad);
  registerLayer(insoleGroup, new THREE.Vector3(0, 0.26, 0));

  // 5. Main Knit Upper Body
  const upperGroup = new THREE.Group();
  const upperGeo = new THREE.ExtrudeGeometry(buildSideProfileShape(), {
    depth: 0.74,
    bevelEnabled: true,
    bevelThickness: 0.11,
    bevelSize: 0.08,
    bevelSegments: 6,
    curveSegments: 26,
  });
  upperGeo.translate(0, 0.34, -0.37);
  const upperMesh = new THREE.Mesh(upperGeo, upperMat);
  upperMesh.castShadow = true;
  upperMesh.receiveShadow = true;
  upperGroup.add(upperMesh);

  // Sculpted Toe Cap Mudguard
  const toeCapGeo = new THREE.SphereGeometry(0.47, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.58);
  toeCapGeo.scale(1.38, 0.72, 0.96);
  const toeCapMesh = new THREE.Mesh(toeCapGeo, panelMat);
  toeCapMesh.position.set(0.92, 0.36, 0);
  toeCapMesh.castShadow = true;
  upperGroup.add(toeCapMesh);
  registerLayer(upperGroup, new THREE.Vector3(0, 0.62, 0));

  // 6. Architectural Quarter Side Panels (Left & Right separate out along Z)
  const leftPanelGroup = new THREE.Group();
  const qGeoL = new THREE.ExtrudeGeometry(buildQuarterPanelShape(), {
    depth: 0.055,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3,
    curveSegments: 20,
  });
  const leftPanel = new THREE.Mesh(qGeoL, panelMat);
  leftPanel.position.set(0, 0.33, 0.43);
  leftPanel.castShadow = true;
  leftPanelGroup.add(leftPanel);
  registerLayer(leftPanelGroup, new THREE.Vector3(0, 0.74, 0.42));

  const rightPanelGroup = new THREE.Group();
  const rightPanel = new THREE.Mesh(qGeoL.clone(), panelMat);
  rightPanel.position.set(0, 0.33, -0.49);
  rightPanel.castShadow = true;
  rightPanelGroup.add(rightPanel);
  registerLayer(rightPanelGroup, new THREE.Vector3(0, 0.74, -0.42));

  // 7. TPU Heel Stability Clip & Volt Tab
  const heelGroup = new THREE.Group();
  const heelArcGeo = new THREE.CylinderGeometry(0.45, 0.48, 0.36, 28, 1, true, Math.PI * 0.58, Math.PI * 0.84);
  const heelClip = new THREE.Mesh(heelArcGeo, heelClipMat);
  heelClip.material.side = THREE.DoubleSide;
  heelClip.position.set(-1.02, 0.56, 0);
  heelClip.rotation.y = Math.PI / 2;
  heelClip.castShadow = true;
  heelGroup.add(heelClip);

  const heelVoltBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.24, 0.26),
    accentMat
  );
  heelVoltBar.position.set(-1.46, 0.64, 0);
  heelGroup.add(heelVoltBar);
  registerLayer(heelGroup, new THREE.Vector3(-0.48, 0.92, 0));

  // 8. Padded Tongue & Pull Loop
  const tongueGroup = new THREE.Group();
  const tongueCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.75, 0.66, 0),
    new THREE.Vector3(0.32, 0.96, 0),
    new THREE.Vector3(-0.08, 1.32, 0),
  ]);
  const tongueGeo = new THREE.TubeGeometry(tongueCurve, 24, 0.22, 12, false);
  tongueGeo.scale(1, 0.45, 1.45);
  const tongueMesh = new THREE.Mesh(tongueGeo, upperMat);
  tongueMesh.position.y = 0.48;
  tongueMesh.castShadow = true;
  tongueGroup.add(tongueMesh);

  const tongueBadge = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.04, 0.26),
    accentMat
  );
  tongueBadge.position.set(-0.02, 1.15, 0);
  tongueBadge.rotation.z = -0.65;
  tongueGroup.add(tongueBadge);
  registerLayer(tongueGroup, new THREE.Vector3(0, 1.24, 0));

  // 9. 3D Tube Laces & Instanced Metallic Eyelets
  const lacesGroup = new THREE.Group();
  const laceRows = 5;
  const eyeletGeo = new THREE.TorusGeometry(0.032, 0.01, 10, 18);
  const eyeletInstanced = new THREE.InstancedMesh(eyeletGeo, eyeletMat, laceRows * 2);
  const dummy = new THREE.Object3D();
  let eyeletIdx = 0;

  for (let i = 0; i < laceRows; i += 1) {
    const t = i / (laceRows - 1);
    const x = THREE.MathUtils.lerp(0.58, -0.04, t);
    const y = THREE.MathUtils.lerp(0.74, 1.12, t);
    const zSpan = THREE.MathUtils.lerp(0.28, 0.34, t);

    // Left & right eyelets
    [-zSpan, zSpan].forEach((zPos) => {
      dummy.position.set(x, y, zPos);
      dummy.rotation.set(Math.PI / 2 - 0.3, 0, 0);
      dummy.updateMatrix();
      eyeletInstanced.setMatrixAt(eyeletIdx, dummy.matrix);
      eyeletIdx += 1;
    });

    // Crisscross lace tubes
    if (i < laceRows - 1) {
      const nextT = (i + 1) / (laceRows - 1);
      const nextX = THREE.MathUtils.lerp(0.58, -0.04, nextT);
      const nextY = THREE.MathUtils.lerp(0.74, 1.12, nextT);
      const nextZ = THREE.MathUtils.lerp(0.28, 0.34, nextT);

      const c1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, y + 0.015, zSpan),
        new THREE.Vector3((x + nextX) * 0.5, (y + nextY) * 0.5 + 0.045, 0),
        new THREE.Vector3(nextX, nextY + 0.015, -nextZ),
      ]);
      const c2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, y + 0.015, -zSpan),
        new THREE.Vector3((x + nextX) * 0.5, (y + nextY) * 0.5 + 0.03, 0),
        new THREE.Vector3(nextX, nextY + 0.015, nextZ),
      ]);

      lacesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c1, 14, 0.019, 8, false), laceMat));
      lacesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c2, 14, 0.019, 8, false), laceMat));
    }
  }
  eyeletInstanced.instanceMatrix.needsUpdate = true;
  eyeletInstanced.computeBoundingSphere();
  lacesGroup.add(eyeletInstanced);
  registerLayer(lacesGroup, new THREE.Vector3(0.12, 1.56, 0));

  // Center sneaker slightly so pivot feels balanced
  root.position.y = 0.05;

  const setColorway = (colorwayId) => {
    const cw = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0];
    upperMat.color.set(cw.upper);
    panelMat.color.set(cw.panel);
    midsoleMat.color.set(cw.midsole);
    outsoleMat.color.set(cw.outsole);
    accentMat.color.set(cw.accent);
    accentMat.emissive.set(cw.accent);
    laceMat.color.set(cw.lace);
  };

  const setExplodeAmount = (amount) => {
    layers.forEach((layer) => {
      const base = layer.userData.basePos;
      const off = layer.userData.explodeOffset;
      layer.position.set(
        base.x + off.x * amount,
        base.y + off.y * amount,
        base.z + off.z * amount
      );
    });
  };

  const dispose = () => {
    root.traverse((obj) => {
      if (obj.isMesh || obj.isInstancedMesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    knitMap.dispose();
    knitBump.dispose();
    leatherBump.dispose();
    treadBump.dispose();
    carbonMap.dispose();
  };

  return {
    group: root,
    flexUniforms,
    setColorway,
    setExplodeAmount,
    dispose,
  };
}
