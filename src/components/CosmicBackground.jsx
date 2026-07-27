import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window;

const mouse = { x: 0, y: 0, prevX: 0, prevY: 0, active: false };

if (typeof document !== 'undefined' && !isMobile) {
  document.addEventListener('mousemove', (e) => {
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.active = true;
  });
  document.addEventListener('mouseleave', () => {
    mouse.active = false;
  });
}

let _randSeed = 2027;
function rand() {
  _randSeed |= 0;
  _randSeed = (_randSeed + 0x6D2B79F5) | 0;
  let t = Math.imul(_randSeed ^ (_randSeed >>> 15), 1 | _randSeed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function resetRand() { _randSeed = 2027; }

const DUST_COUNT = isMobile ? 650 : 1600;
const SPICE_COUNT = isMobile ? 80 : 200;
const NODE_COUNT = isMobile ? 50 : 200;
const MAX_CONNECTIONS = isMobile ? 90 : 1000;
const CONNECTION_DIST = isMobile ? 4.0 : 7.8;

function ConstellationField() {
  resetRand();
  const pointsRef = useRef();
  const dustRef = useRef();
  const spiceRef = useRef();
  const linesRef = useRef();
  const { viewport } = useThree();

  const bounds = useMemo(() => ({
    width: viewport.width * 2.8,
    height: viewport.height * 2.8,
  }), [viewport.width, viewport.height]);

  const colorDistribution = useMemo(() => {
    const r = rand();
    if (r < 0.35) return { goldRatio: 0.7, cyanRatio: 0.8 };
    if (r < 0.7) return { goldRatio: 0.35, cyanRatio: 0.8 };
    return { goldRatio: 0.55, cyanRatio: 0.8 };
  }, []);

  const sizeScales = useMemo(() => {
    const scale = 0.85 + rand() * 0.4;
    return {
      dustSize: (isMobile ? 0.08 : 0.13) * scale,
      nodeSize: (isMobile ? 0.15 : 0.25) * scale,
      lineWidth: (isMobile ? 0.95 : 1.2) * scale,
    };
  }, []);

  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const hx = (rand() - 0.5) * bounds.width;
      const hy = (rand() - 0.5) * bounds.height;
      arr.push({
        x: hx, y: hy,
        z: (rand() - 0.5) * (isMobile ? 12 : 22) - (isMobile ? 3 : 6),
        vx: (rand() - 0.5) * (isMobile ? 0.012 : 0.024),
        vy: (rand() - 0.5) * (isMobile ? 0.012 : 0.024),
        vz: (rand() - 0.5) * 0.004,
        phase: rand() * Math.PI * 2,
        speed: 0.04 + rand() * 0.08,
        range: isMobile ? (2.8 + rand() * 2.2) : (3.8 + rand() * 3.8),
      });
    }
    return arr;
  }, [bounds]);

  const nodePositions = useMemo(() => new Float32Array(NODE_COUNT * 3), []);
  const nodeColors = useMemo(() => {
    const c = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      const r = rand();
      if (r < colorDistribution.goldRatio) {
        c[i * 3] = 0.82; c[i * 3 + 1] = 0.61; c[i * 3 + 2] = 0.22;
      } else if (r < colorDistribution.cyanRatio) {
        c[i * 3] = 0.0; c[i * 3 + 1] = 0.9; c[i * 3 + 2] = 1.0;
      } else {
        c[i * 3] = 1.0; c[i * 3 + 1] = 0.2; c[i * 3 + 2] = 0.33;
      }
    }
    return c;
  }, [colorDistribution]);

  const dustData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      const hx = (rand() - 0.5) * bounds.width * 1.25;
      const hy = (rand() - 0.5) * bounds.height * 1.25;
      arr.push({
        x: hx, y: hy,
        z: (rand() - 0.5) * 36 - 10,
        vx: (rand() - 0.5) * 0.005,
        vy: (rand() - 0.5) * 0.005,
        vz: (rand() - 0.5) * 0.002,
        phase: rand() * Math.PI * 2,
        speed: 0.07 + rand() * 0.14,
        flicker: 0.3 + rand() * 0.7,
      });
    }
    return arr;
  }, [bounds]);

  const dustPositions = useMemo(() => new Float32Array(DUST_COUNT * 3), []);
  const dustColors = useMemo(() => {
    const c = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      const r = rand();
      if (r < colorDistribution.goldRatio) {
        c[i * 3] = 0.78; c[i * 3 + 1] = 0.53; c[i * 3 + 2] = 0.18;
      } else if (r < colorDistribution.cyanRatio) {
        c[i * 3] = 0.0; c[i * 3 + 1] = 0.78; c[i * 3 + 2] = 0.88;
      } else {
        c[i * 3] = 0.82; c[i * 3 + 1] = 0.18; c[i * 3 + 2] = 0.28;
      }
    }
    return c;
  }, [colorDistribution]);

  const linePositions = useMemo(() => new Float32Array(MAX_CONNECTIONS * 2 * 3), []);
  const lineColors = useMemo(() => new Float32Array(MAX_CONNECTIONS * 2 * 3), []);
  const dustOpacities = useMemo(() => new Float32Array(DUST_COUNT), []);

  const spiceData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < SPICE_COUNT; i++) {
      arr.push({
        x: (rand() - 0.5) * bounds.width * 1.25,
        y: (rand() - 0.5) * bounds.height * 1.25,
        z: (rand() - 0.5) * 36 - 10,
        vx: (rand() - 0.5) * 0.0015,
        vy: (rand() - 0.5) * 0.0015 + 0.0006,
        phase: rand() * Math.PI * 2,
        flicker: 0.3 + rand() * 0.5,
      });
    }
    return arr;
  }, [bounds]);

  const spicePositions = useMemo(() => new Float32Array(SPICE_COUNT * 3), []);
  const spiceColors = useMemo(() => {
    const c = new Float32Array(SPICE_COUNT * 3);
    for (let i = 0; i < SPICE_COUNT; i++) {
      c[i * 3] = 0.78 + rand() * 0.08;
      c[i * 3 + 1] = 0.5 + rand() * 0.1;
      c[i * 3 + 2] = 0.12 + rand() * 0.08;
    }
    return c;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const mx = mouse.x * viewport.width * 0.5;
    const my = mouse.y * viewport.height * 0.5;
    const boundX = viewport.width * 1.85;
    const boundY = viewport.height * 1.85;

    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i];
      n.x += n.vx + Math.sin(time * n.speed + n.phase) * (isMobile ? 0.0012 : 0.0025);
      n.y += n.vy + Math.cos(time * n.speed * 0.85 + n.phase) * (isMobile ? 0.0012 : 0.0025);
      n.z += n.vz;
      if (Math.abs(n.x) > boundX) n.x = -Math.sign(n.x) * boundX * 0.98;
      if (Math.abs(n.y) > boundY) n.y = -Math.sign(n.y) * boundY * 0.98;
      if (Math.abs(n.z) > 16) n.vz = -n.vz;
      if (mouse.active && !isMobile) {
        const dx = n.x - mx, dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 8.0 && dist > 0.01) {
          const force = (1 - dist / 8.0) * 0.06;
          n.x += (dx / dist) * force;
          n.y += (dy / dist) * force;
        }
      }
      const i3 = i * 3;
      nodePositions[i3] = n.x;
      nodePositions[i3 + 1] = n.y;
      nodePositions[i3 + 2] = n.z;
    }
    if (pointsRef.current) pointsRef.current.geometry.attributes.position.needsUpdate = true;

    const dBoundX = viewport.width * 2.1;
    const dBoundY = viewport.height * 2.1;
    for (let i = 0; i < DUST_COUNT; i++) {
      const d = dustData[i];
      d.x += d.vx + Math.sin(time * 0.07 + d.phase) * 0.0018;
      d.y += d.vy + Math.cos(time * 0.05 + d.phase) * 0.0018 + 0.0014;
      d.z += d.vz;
      if (Math.abs(d.x) > dBoundX) d.x = -Math.sign(d.x) * dBoundX * 0.98;
      if (d.y > dBoundY) d.y = -dBoundY;
      if (d.y < -dBoundY) d.y = dBoundY;
      const i3 = i * 3;
      dustPositions[i3] = d.x;
      dustPositions[i3 + 1] = d.y;
      dustPositions[i3 + 2] = d.z;
      dustOpacities[i] = d.flicker + Math.sin(time * 1.5 + d.phase) * 0.2;
    }
    if (dustRef.current) {
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }

    const sBoundX = viewport.width * 2.1;
    const sBoundY = viewport.height * 2.1;
    for (let i = 0; i < SPICE_COUNT; i++) {
      const s = spiceData[i];
      s.x += s.vx + Math.sin(time * 0.021 + s.phase) * 0.0005;
      s.y += s.vy + Math.cos(time * 0.015 + s.phase) * 0.0005;
      if (Math.abs(s.x) > sBoundX) s.x = -Math.sign(s.x) * sBoundX * 0.98;
      if (s.y > sBoundY) s.y = -sBoundY;
      if (s.y < -sBoundY) s.y = sBoundY;
      const i3 = i * 3;
      spicePositions[i3] = s.x;
      spicePositions[i3 + 1] = s.y;
      spicePositions[i3 + 2] = s.z;
    }
    if (spiceRef.current) {
      spiceRef.current.geometry.attributes.position.needsUpdate = true;
    }

    let lineCount = 0;
    linePositions.fill(0);
    lineColors.fill(0);
    for (let i = 0; i < NODE_COUNT; i++) {
      if (lineCount >= MAX_CONNECTIONS) break;
      const n1 = nodes[i];
      if (mouse.active && !isMobile) {
        const dx = n1.x - mx, dy = n1.y - my;
        const dMouse = Math.sqrt(dx * dx + dy * dy);
        if (dMouse < 7.2) {
          const idx = lineCount * 6;
          linePositions[idx] = n1.x; linePositions[idx + 1] = n1.y; linePositions[idx + 2] = n1.z;
          linePositions[idx + 3] = mx; linePositions[idx + 4] = my; linePositions[idx + 5] = 0;
          const alpha = (1.0 - dMouse / 7.2) * 0.9;
          lineColors[idx] = 0.0; lineColors[idx + 1] = 0.9 * alpha; lineColors[idx + 2] = 1.0 * alpha;
          lineColors[idx + 3] = 0.0; lineColors[idx + 4] = 0.3 * alpha; lineColors[idx + 5] = 0.9 * alpha;
          lineCount++;
        }
      }
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (lineCount >= MAX_CONNECTIONS) break;
        const n2 = nodes[j];
        const dx = n1.x - n2.x, dy = n1.y - n2.y, dz = n1.z - n2.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const activeDist = isMobile ? CONNECTION_DIST : ((n1.range + n2.range) / 2.0);
        if (d < activeDist) {
          const idx = lineCount * 6;
          linePositions[idx] = n1.x; linePositions[idx + 1] = n1.y; linePositions[idx + 2] = n1.z;
          linePositions[idx + 3] = n2.x; linePositions[idx + 4] = n2.y; linePositions[idx + 5] = n2.z;
          const i3_1 = i * 3, i3_2 = j * 3;
          const alpha = (1.0 - d / activeDist) * 0.45;
          lineColors[idx] = nodeColors[i3_1] * alpha;
          lineColors[idx + 1] = nodeColors[i3_1 + 1] * alpha;
          lineColors[idx + 2] = nodeColors[i3_1 + 2] * alpha;
          lineColors[idx + 3] = nodeColors[i3_2] * alpha;
          lineColors[idx + 4] = nodeColors[i3_2 + 1] * alpha;
          lineColors[idx + 5] = nodeColors[i3_2 + 2] * alpha;
          lineCount++;
        }
      }
    }
    if (linesRef.current) {
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      linesRef.current.geometry.attributes.color.needsUpdate = true;
    }

    const targetCamX = Math.sin(time * 0.04) * 0.35 + mx * 0.55;
    const targetCamY = Math.cos(time * 0.03) * 0.18 + my * 0.4;
    state.camera.position.x += (targetCamX - state.camera.position.x) * 0.03;
    state.camera.position.y += (targetCamY - state.camera.position.y) * 0.03;
    state.camera.lookAt(state.camera.position.x * 0.45, state.camera.position.y * 0.45, -2);
  });

  return (
    <>
      <points ref={spiceRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[spicePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[spiceColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={sizeScales.dustSize}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={sizeScales.nodeSize}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          linewidth={sizeScales.lineWidth}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

export default function CosmicBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 70 }}>
        <color attach="background" args={['#070503']} />
        <ConstellationField />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse, transparent 40%, rgba(5,3,2,0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </div>
  );
}