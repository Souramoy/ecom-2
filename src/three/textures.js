import * as THREE from 'three';

export function createKnitTextures(maxAnisotropy = 4) {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cctx = colorCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d');

  cctx.fillStyle = '#ecebe7';
  cctx.fillRect(0, 0, size, size);

  bctx.fillStyle = '#707070';
  bctx.fillRect(0, 0, size, size);

  const cellW = 16;
  const cellH = 16;

  for (let y = 0; y < size; y += cellH) {
    for (let x = 0; x < size; x += cellW) {
      const offset = (y / cellH) % 2 === 0 ? 0 : cellW * 0.5;
      const px = (x + offset) % size;

      // Albedo rib stitch
      cctx.fillStyle = '#ffffff';
      cctx.fillRect(px + 2, y + 2, cellW - 5, cellH - 6);
      cctx.fillStyle = '#d3d1cb';
      cctx.fillRect(px + 4, y + cellH - 5, cellW - 8, 3);

      // Height / bump weave
      bctx.fillStyle = '#e8e8e8';
      bctx.fillRect(px + 2, y + 2, cellW - 5, cellH - 6);
      bctx.fillStyle = '#2b2b2b';
      bctx.fillRect(px + 4, y + cellH - 5, cellW - 8, 3);
    }
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(5, 5);
  map.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(5, 5);
  bumpMap.anisotropy = maxAnisotropy;

  return { map, bumpMap };
}

export function createLeatherBumpTexture(maxAnisotropy = 4) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Deterministic pseudo-random pebble grain
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 3200; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 1 + rand() * 2.2;
    const shade = Math.floor(105 + rand() * 85);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const bumpMap = new THREE.CanvasTexture(canvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(6, 6);
  bumpMap.anisotropy = maxAnisotropy;
  return bumpMap;
}

export function createTreadBumpTexture(maxAnisotropy = 4) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#222222';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = '#f2f2f2';
  ctx.lineWidth = 10;
  ctx.lineCap = 'square';

  const step = 32;
  for (let y = -size; y < size * 2; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size * 0.5, y + step * 0.75);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createCarbonWeaveTexture(maxAnisotropy = 4) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#18191b';
  ctx.fillRect(0, 0, size, size);

  const step = 16;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const diag = ((x + y) / step) % 2 === 0;
      ctx.fillStyle = diag ? '#2d3036' : '#121316';
      ctx.fillRect(x, y, step - 1, step - 1);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 3);
  map.anisotropy = maxAnisotropy;
  return map;
}

export function createContactShadowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.5
  );
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
