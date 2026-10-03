import { Component, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error('splash scene failed:', error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* SPLASH SCENE — the monolith protocol.
 *
 * Ported from the approved reference splash and re-themed to the site's own
 * tokens: the file's #00F0FF became --blue #00a8e8, its amber was already
 * --ember #ff9e00, its void became --ground. The reference's hand-rolled
 * five-pass post chain is replaced by the composer's Bloom/Noise/Vignette,
 * and the fake boot percentage lives nowhere — the DOM track is driven by
 * real milestones.
 *
 * Systems: hex-stacked monolith with fresnel + voronoi-crack crystal shells,
 * volumetric shafts, orbiting debris crystals, lensing rings, the
 * gravity-bent lattice, seam embers, starfield. Pointer parallax on the
 * monolith, rings and camera; on `sealed` the warp runs — the camera dollies
 * in and the FOV surges.
 *
 * Every shader material advances its own `t` in its own useFrame rather than
 * through a shared module registry — a module-level array survives remounts
 * and accumulates dead entries, which is a leak this scene cannot afford.
 */

const BLUE = '#00a8e8';
const BLUE_DEEP = '#0a6e7a';
const BLUE_LIGHT = '#6ff3ff';
const EMBER = '#ff9e00';
const EMBER_DEEP = '#ff5a00';
const EMBER_LIGHT = '#ffb347';
const BONE = '#f2e4cc';
const GROUND = '#070503';

const HASH = `
float h11(float p){return fract(sin(p*127.1)*43758.5453);}
float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 h22(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
return fract(sin(p)*43758.5453);}
`;

const VORONOI = `
float vorEdge(vec2 x){vec2 n=floor(x),f=fract(x);vec2 mg=vec2(0.),mr=vec2(0.);
float md=8.0;for(int j=-1;j<=1;j++){for(int i=-1;i<=1;i++){vec2 g=vec2(float(i),float(j));
vec2 o=h22(n+g);vec2 r=g+o-f;float d=dot(r,r);if(d<md){md=d;mr=r;mg=g;}}}
md=8.0;for(int j=-2;j<=2;j++){for(int i=-2;i<=2;i++){vec2 g=mg+vec2(float(i),float(j));
vec2 o=h22(n+g);vec2 r=g+o-f;vec2 d=r-mr;if(dot(d,d)>0.00001)
md=min(md,dot(0.5*(mr+r),normalize(d)));}}return md;}
`;

function crystalGeo(r, h, seg = 6) {
  const pts = [
    new THREE.Vector2(0.001, -h * 0.5),
    new THREE.Vector2(r * 0.42, -h * 0.30),
    new THREE.Vector2(r, -h * 0.04),
    new THREE.Vector2(r * 0.88, h * 0.30),
    new THREE.Vector2(r * 0.46, h * 0.40),
    new THREE.Vector2(0.001, h * 0.5),
  ];
  const g = new THREE.LatheGeometry(pts, seg);
  g.computeVertexNormals();
  return g;
}

function CrystalShell({ geometry, cA, cB, power, gain, crack = false, crackColor, reduceMotion }) {
  const uniforms = useMemo(() => ({
    cA: { value: new THREE.Color(cA) },
    cB: { value: new THREE.Color(cB) },
    cCrack: { value: new THREE.Color(crackColor || EMBER) },
    p: { value: power },
    k: { value: gain },
    t: { value: 0 },
    crack: { value: crack ? 1 : 0 },
  }), [cA, cB, power, gain, crack, crackColor]);

  useFrame((state) => {
    if (!reduceMotion) uniforms.t.value = state.clock.elapsedTime;
  });

  return (
    <mesh scale={1.015}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vN; varying vec3 vP; varying float vY; varying vec2 vUvv;
          void main(){vN=normalize(normalMatrix*normal); vY=position.y; vUvv=uv;
          vec4 mv=modelViewMatrix*vec4(position,1.0); vP=mv.xyz;
          gl_Position=projectionMatrix*mv;}
        `}
        fragmentShader={HASH + VORONOI + `
          uniform vec3 cA,cB,cCrack; uniform float p,k,t,crack;
          varying vec3 vN; varying vec3 vP; varying float vY; varying vec2 vUvv;
          void main(){
            float f=pow(1.0-abs(dot(normalize(-vP),vN)),p);
            float g=clamp(vY*0.2+0.5,0.0,1.0);
            float beat=0.90+0.06*sin(t*1.7)+0.04*sin(t*2.63+vY);
            vec3 col=mix(cB,cA,g)*f*k*beat; float a=f*k*beat;
            if(crack>0.5){
              float e=vorEdge(vUvv*vec2(9.0,5.0)+vec2(0.0,t*0.01));
              float line=smoothstep(0.035,0.0,e);
              float front=fract(t*0.035);
              float field=fract(h21(floor(vUvv*vec2(9.0,5.0)))*1.7+vUvv.y*0.4);
              float mask=smoothstep(front-0.30,front,field)*smoothstep(front+0.45,front+0.05,field);
              float flick=0.75+0.25*sin(t*6.0+field*30.0);
              col+=cCrack*line*mask*flick*2.6; a=max(a,line*mask*0.95);
            }
            gl_FragColor=vec4(col,a);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Monolith({ reduceMotion, warpRef, pointerRef }) {
  const group = useRef();
  const seam = useRef();
  const halo = useRef();
  const core = useRef();
  const cyanCore = useRef();
  const smooth = useRef({ x: 0, y: 0 });
  const pieces = useMemo(() => [], []);

  const obsidian = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#14141a', roughness: 0.2, metalness: 0.88, flatShading: true,
  }), []);
  const stone = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a2823', roughness: 0.85, metalness: 0.15, flatShading: true,
  }), []);

  const blocks = useMemo(() => ([
    { dims: [1.16, 1.30, 2.60], y: -2.35, rotY: 0, rotZ: 0, warm: false, body: 'stone' },
    { dims: [1.00, 1.14, 2.10], y: 0.20, rotY: 0.34, rotZ: 0.025, warm: false, body: 'obsidian' },
    { dims: [0.78, 0.98, 1.70], y: 2.30, rotY: -0.22, rotZ: -0.03, warm: true, body: 'obsidian' },
    { dims: [0.40, 0.76, 1.35], y: 3.90, rotY: 0.52, rotZ: 0.045, warm: true, body: 'obsidian' },
  ]).map((b) => ({
    ...b,
    geo: new THREE.CylinderGeometry(b.dims[0], b.dims[1], b.dims[2], 6, 1, false),
    edges: new THREE.EdgesGeometry(
      new THREE.CylinderGeometry(b.dims[0], b.dims[1], b.dims[2], 6, 1, false)
    ),
  })), []);

  const tipGeo = useMemo(() => crystalGeo(0.46, 2.2, 6), []);

  const haloTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,205,120,.95)');
    g.addColorStop(0.32, 'rgba(255,110,0,.30)');
    g.addColorStop(1, 'rgba(255,90,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const k = reduceMotion ? 0.25 : 1;
    const warp = warpRef.current;
    const s = smooth.current;
    s.x += (pointerRef.current.x - s.x) * 0.04;
    s.y += (pointerRef.current.y - s.y) * 0.04;

    if (group.current) {
      group.current.rotation.y = t * 0.075 * k + s.x * 0.75;
      group.current.rotation.x = s.y * 0.14;
    }
    pieces.forEach((p) => {
      p.m.position.y = p.base.y + Math.sin(t * 0.5 + p.ph) * p.amp * k;
      p.m.position.x = p.base.x + Math.sin(t * 0.37 + p.ph) * p.amp * 0.6 * k;
      p.m.rotation.y += p.spin * 0.004 * k;
    });
    if (core.current) core.current.intensity = 3.4 * (0.62 + 0.20 * Math.sin(t * 1.31) + 0.11 * Math.sin(t * 2.17 + 1.1) + 0.07 * Math.sin(t * 3.79 + 0.4)) + warp * 11;
    if (cyanCore.current) cyanCore.current.intensity = 1.0 * (0.62 + 0.20 * Math.sin(t * 1.31));
    if (halo.current) halo.current.material.opacity = 0.34 + (0.62 + 0.20 * Math.sin(t * 1.31)) * 0.24 + warp * 0.5;
    if (seam.current) {
      const sc = 0.75 + (0.62 + 0.20 * Math.sin(t * 1.31) + 0.11 * Math.sin(t * 2.17 + 1.1) + 0.07 * Math.sin(t * 3.79 + 0.4)) * 0.5 + warp * 3.4;
      seam.current.scale.x = sc;
      seam.current.scale.z = sc;
    }
  });

  return (
    <group ref={group}>
      {blocks.map((b, i) => (
        <MonolithBlock
          key={`blk-${i}`}
          geo={b.geo}
          edges={b.edges}
          body={b.body === 'stone' ? stone : obsidian}
          warm={b.warm}
          pieces={pieces}
          pos={[0, b.y, 0]}
          rotY={b.rotY}
          rotZ={b.rotZ}
          amp={0.05 + i * 0.035}
          ph={i * 1.3}
          spin={(i % 2 ? 1 : -1) * 0.05}
          reduceMotion={reduceMotion}
        />
      ))}
      <MonolithTip geo={tipGeo} obsidian={obsidian} pieces={pieces} reduceMotion={reduceMotion} />

      <mesh ref={seam} position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.10, 0.10, 11.5, 10]} />
        <meshBasicMaterial color="#ffd79a" />
      </mesh>

      <sprite ref={halo} position={[0, 1.0, 0]} scale={[9, 14, 1]}>
        <spriteMaterial
          map={haloTex}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
          opacity={0.4}
        />
      </sprite>

      <pointLight ref={core} position={[0, 1, 0]} intensity={3} color={EMBER} distance={30} decay={2} />
      <pointLight ref={cyanCore} position={[0, -3.2, 0]} intensity={1.1} color={BLUE} distance={20} decay={2} />
    </group>
  );
}

function MonolithBlock({ geo, edges, body, warm, pieces, pos, rotY, rotZ, amp, ph, spin, reduceMotion }) {
  const holder = useRef();
  const piece = useMemo(
    () => ({ m: null, base: new THREE.Vector3(...pos), amp, ph, spin }),
    [pos, amp, ph, spin]
  );

  useEffect(() => {
    pieces.push(piece);
    return () => {
      const i = pieces.indexOf(piece);
      if (i >= 0) pieces.splice(i, 1);
    };
  }, [pieces, piece]);

  return (
    <group
      ref={(el) => {
        holder.current = el;
        piece.m = el;
      }}
      position={pos}
      rotation={[0, rotY, rotZ]}
    >
      <mesh>
        <primitive object={geo} attach="geometry" />
        <primitive object={body} attach="material" />
      </mesh>
      <CrystalShell
        geometry={geo}
        cA={warm ? EMBER : BLUE}
        cB={warm ? EMBER_DEEP : BLUE_DEEP}
        power={2.6}
        gain={warm ? 0.85 : 0.55}
        crack
        crackColor={warm ? EMBER_LIGHT : BLUE_LIGHT}
        reduceMotion={reduceMotion}
      />
      <lineSegments>
        <primitive object={edges} attach="geometry" />
        <lineBasicMaterial color={warm ? EMBER : BLUE} transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function MonolithTip({ geo, obsidian, pieces, reduceMotion }) {
  const piece = useMemo(
    () => ({ m: null, base: new THREE.Vector3(0, 5.6, 0), amp: 0.09, ph: 2.2, spin: 0.12 }),
    []
  );

  useEffect(() => {
    pieces.push(piece);
    return () => {
      const i = pieces.indexOf(piece);
      if (i >= 0) pieces.splice(i, 1);
    };
  }, [pieces, piece]);

  return (
    <group
      ref={(el) => {
        piece.m = el;
      }}
      position={[0, 5.6, 0]}
    >
      <mesh>
        <primitive object={geo} attach="geometry" />
        <primitive object={obsidian} attach="material" />
      </mesh>
      <CrystalShell
        geometry={geo}
        cA="#ffd08a"
        cB={EMBER}
        power={2.1}
        gain={1.35}
        crack
        crackColor="#ffc98a"
        reduceMotion={reduceMotion}
      />
    </group>
  );
}

function Shafts({ reduceMotion, easeRef, warpRef, pointerRef }) {
  const group = useRef();
  const smooth = useRef({ x: 0, y: 0 });
  const shafts = useMemo(() => {
    const arr = [];
    for (let s = 0; s < 6; s++) {
      const h = 16 + Math.random() * 10;
      const r = 1.6 + Math.random() * 1.5;
      const geo = new THREE.ConeGeometry(r, h, 22, 10, true);
      geo.translate(0, -h / 2, 0);
      geo.rotateX(Math.PI);
      arr.push({
        geo,
        rotZ: (Math.random() - 0.5) * 2.4,
        rotX: (Math.random() - 0.5) * 2.4,
        rotY: Math.random() * 6.28,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const k = reduceMotion ? 0.25 : 1;
    const s = smooth.current;
    s.x += (pointerRef.current.x - s.x) * 0.04;

    if (group.current) {
      group.current.rotation.y = t * 0.05 * k + s.x * 0.4;
      group.current.rotation.x = Math.sin(t * 0.21) * 0.12;
    }
  });

  return (
    <group ref={group} position={[0, 1.0, 0]}>
      {shafts.map((sh, i) => (
        <Shaft
          key={`shaft-${i}`}
          geo={sh.geo}
          rot={[sh.rotX, sh.rotY, sh.rotZ]}
          index={i}
          reduceMotion={reduceMotion}
          easeRef={easeRef}
          warpRef={warpRef}
        />
      ))}
    </group>
  );
}

function Shaft({ geo, rot, index, reduceMotion, easeRef, warpRef }) {
  const uniforms = useMemo(() => ({
    t: { value: 0 },
    i: { value: 0.5 },
    cA: { value: new THREE.Color('#ffd08a') },
    cB: { value: new THREE.Color(index % 3 === 0 ? BLUE : EMBER_DEEP) },
    seed: { value: Math.random() * 10 },
  }), [index]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.t.value = t;
    uniforms.i.value =
      (0.34 + 0.30 * (0.62 + 0.20 * Math.sin(t * 1.31)) + 0.12 * Math.sin(t * 0.7 + index)) * easeRef.current
      + warpRef.current * 0.9;
  });

  return (
    <mesh geometry={geo} rotation={rot}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader="varying vec2 vU; varying float vD;
          void main(){vU=uv; vec4 mv=modelViewMatrix*vec4(position,1.0); vD=-mv.z;
          gl_Position=projectionMatrix*mv;}"
        fragmentShader={`
          uniform float t,i,seed; uniform vec3 cA,cB; varying vec2 vU; varying float vD;
          void main(){
            float fade=pow(1.0-vU.y,1.7);
            float edge=pow(sin(vU.x*3.14159),1.4);
            float n=0.55+0.30*sin(t*1.3+seed+vU.x*17.0)+0.15*sin(t*2.9+vU.y*11.0+seed*3.0);
            float dust=0.85+0.15*sin(t*4.1+vU.y*40.0+seed);
            float a=fade*edge*n*dust*i*0.5;
            vec3 c=mix(cB,cA,pow(1.0-vU.y,2.2));
            gl_FragColor=vec4(c*a,a);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function DebrisField({ reduceMotion }) {
  const group = useRef();
  const orbits = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 44; i++) {
      const near = i < 8;
      const sc = near ? 0.30 + Math.random() * 0.5 : 0.5 + Math.random() * 1.5;
      arr.push({
        geo: crystalGeo(sc, sc * (2.4 + Math.random() * 2.6), Math.random() < 0.4 ? 5 : 6),
        warm: i % 3 !== 0,
        rad: near ? 3.4 + Math.random() * 3.0 : 15 + Math.random() * 25,
        ang: Math.random() * 6.283,
        y: near ? -3 + Math.random() * 7 : -14 + Math.random() * 30,
        sp: (near ? 0.05 : 0.012) * (i % 2 ? 1 : -1),
        bob: near ? 0.3 : 0.12,
        ph: Math.random() * 6.28,
        rx: (Math.random() - 0.5) * (near ? 0.3 : 0.08),
        ry: (Math.random() - 0.5) * (near ? 0.3 : 0.08),
        rot: [Math.random() * 3, Math.random() * 3, Math.random() * 3],
        near,
      });
    }
    return arr;
  }, []);

  const meshRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const k = reduceMotion ? 0.25 : 1;
    orbits.forEach((o, i) => {
      o.ang += o.sp * 0.004 * k;
      const m = meshRefs.current[i];
      if (!m) return;
      m.position.set(Math.cos(o.ang) * o.rad, o.y + Math.sin(t * 0.4 + o.ph) * o.bob * k, Math.sin(o.ang) * o.rad);
      m.rotation.x += o.rx * 0.004 * k;
      m.rotation.y += o.ry * 0.004 * k;
    });
  });

  return (
    <group ref={group}>
      {orbits.map((o, i) => (
        <group key={`orb-${i}`} ref={(el) => { meshRefs.current[i] = el; }} rotation={o.rot}>
          <mesh>
            <primitive object={o.geo} attach="geometry" />
            <meshStandardMaterial color="#14141a" roughness={0.2} metalness={0.88} flatShading />
          </mesh>
          <CrystalShell
            geometry={o.geo}
            cA={o.warm ? '#ffc168' : '#9bf7ff'}
            cB={o.warm ? EMBER_DEEP : '#0b7c88'}
            power={2.3}
            gain={o.near ? 1.1 : 0.7}
            reduceMotion={reduceMotion}
          />
        </group>
      ))}
    </group>
  );
}

function LensingRings({ reduceMotion, pointerRef }) {
  const group = useRef();
  const smooth = useRef({ x: 0, y: 0 });
  const rings = useMemo(() => ([
    [4.6, BLUE, 0.34, 0.010],
    [6.2, EMBER, 0.26, 0.008],
    [8.0, BLUE, 0.15, 0.006],
    [10.2, EMBER_DEEP, 0.10, 0.005],
  ]), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const k = reduceMotion ? 0.25 : 1;
    const s = smooth.current;
    s.x += (pointerRef.current.x - s.x) * 0.04;

    if (group.current) {
      group.current.rotation.y = -t * (0.040 + 0.012 * Math.sin(t * 0.53)) * k + s.x * 0.4;
      group.current.rotation.z = Math.sin(t * 0.13) * 0.07 + Math.sin(t * 0.37) * 0.02;
    }
  });

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2 - 0.26 - i * 0.07, 0, i * 0.42]} scale={[1, 1 + i * 0.06, 1]}>
          <torusGeometry args={[r[0], r[3], 8, 240]} />
          <meshBasicMaterial color={r[1]} transparent opacity={r[2]} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Lattice({ reduceMotion }) {
  const entry = useMemo(() => {
    const SPAN = 130;
    const LINES = 44;
    const SEG = 90;
    const pos = [];
    const step = SPAN / LINES;
    const half = SPAN / 2;
    for (let l = 0; l <= LINES; l++) {
      const c = -half + l * step;
      for (let s2 = 0; s2 < SEG; s2++) {
        const a = -half + (s2 / SEG) * SPAN;
        const b = -half + ((s2 + 1) / SEG) * SPAN;
        pos.push(a, 0, c, b, 0, c);
        pos.push(c, 0, a, c, 0, b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, []);

  const uniforms = useMemo(() => ({
    t: { value: 0 },
    cA: { value: new THREE.Color(BLUE) },
    cB: { value: new THREE.Color(EMBER_DEEP) },
  }), []);

  useFrame((state) => {
    if (!reduceMotion) uniforms.t.value = state.clock.elapsedTime;
  });

  return (
    <lineSegments position={[0, -6.6, 0]}>
      <primitive object={entry} attach="geometry" />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          uniform float t; varying float vD; varying float vW;
          void main(){vec3 p=position; float d=length(p.xz);
          float well=-34.0/(1.0+d*d*0.045);
          well+=sin(d*0.55-t*0.9)*0.5/(1.0+d*0.16);
          p.y+=well; vD=d; vW=clamp(-well/34.0,0.0,1.0);
          gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}
        `}
        fragmentShader={`
          uniform vec3 cA,cB; varying float vD; varying float vW;
          void main(){float fade=smoothstep(66.0,6.0,vD);
          vec3 c=mix(cA,cB,pow(vW,0.7));
          float a=fade*(0.16+vW*0.75);
          gl_FragColor=vec4(c*a*1.6,a);}
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function Embers({ reduceMotion }) {
  const entry = useMemo(() => {
    const N = 220;
    const p = new Float32Array(N * 3);
    const seed = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * 6.283;
      const r = 0.2 + Math.random() * 1.9;
      p[i * 3] = Math.cos(a) * r;
      p[i * 3 + 1] = 0;
      p[i * 3 + 2] = Math.sin(a) * r;
      seed[i * 3] = 0.4 + Math.random() * 1.1;
      seed[i * 3 + 1] = Math.random();
      seed[i * 3 + 2] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3));
    return g;
  }, []);

  const uniforms = useMemo(() => ({
    t: { value: 0 },
    dpr: { value: Math.min(window.devicePixelRatio || 1, 2) },
  }), []);

  useFrame((state) => {
    if (!reduceMotion) uniforms.t.value = state.clock.elapsedTime;
  });

  return (
    <points position={[0, 0.5, 0]} geometry={entry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          attribute vec3 aSeed; uniform float t,dpr; varying float vA; varying float vH;
          void main(){float life=fract(t*aSeed.x*0.10+aSeed.y);
          vec3 p=position;
          p.y=mix(-4.5,10.0,life);
          p.x+=sin(t*0.7+aSeed.z*6.28+p.y*0.45)*(0.4+aSeed.y);
          p.z+=cos(t*0.6+aSeed.z*5.10+p.y*0.38)*(0.4+aSeed.z);
          vA=sin(life*3.14159); vH=life;
          vec4 mv=modelViewMatrix*vec4(p,1.0);
          gl_PointSize=(1.5+aSeed.y*3.5)*dpr*(46.0/max(-mv.z,0.1))*vA;
          gl_Position=projectionMatrix*mv;}
        `}
        fragmentShader={`
          varying float vA; varying float vH;
          void main(){vec2 d=gl_PointCoord-0.5; float r=length(d);
          float a=smoothstep(0.5,0.0,r)*vA;
          vec3 c=mix(vec3(1.0,0.72,0.22), vec3(1.0,0.35,0.05), vH);
          gl_FragColor=vec4(c*a*1.5,a);}
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Starfield({ reduceMotion }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const n = 1900;
    const p = new Float32Array(n * 3);
    const c = new Float32Array(n * 3);
    const cs = [new THREE.Color(BONE), new THREE.Color(BLUE), new THREE.Color(EMBER)];
    for (let i = 0; i < n; i++) {
      const r = 45 + Math.random() * 120;
      const th = Math.random() * 6.283;
      const ph = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(ph) * Math.cos(th);
      p[i * 3 + 1] = r * Math.cos(ph) * 0.65;
      p[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      const col = Math.random() < 0.1 ? cs[2] : (Math.random() < 0.3 ? cs[1] : cs[0]);
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (ref.current && !reduceMotion) ref.current.rotation.y = state.clock.elapsedTime * 0.004;
  });

  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <pointsMaterial size={0.22} sizeAttenuation vertexColors transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

function Rig({ reduceMotion, warpRef, easeRef, frameRef, onPainted, pointerRef, sealedRef }) {
  const intro = useRef(0);
  const smooth = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    frameRef.current += 1;
    if (frameRef.current === 3 && onPainted) onPainted();

    if (reduceMotion) return;

    intro.current = Math.min(1, intro.current + 0.006);
    easeRef.current = 1 - Math.pow(1 - intro.current, 3);

    if (sealedRef.current && warpRef.current === 0) warpRef.current = 0.001;
    if (warpRef.current > 0 && warpRef.current < 1) warpRef.current = Math.min(1, warpRef.current + 0.016);

    const k = reduceMotion ? 0.25 : 1;
    const s = smooth.current;
    s.x += (pointerRef.current.x - s.x) * 0.03;
    s.y += (pointerRef.current.y - s.y) * 0.03;

    const camera = state.camera;
    const targetZ = warpRef.current > 0 ? 1.4 : 13 - easeRef.current * 1.4;
    camera.position.z += (targetZ - camera.position.z) * 0.035;
    camera.position.x += ((s.x * 2.2) - camera.position.x) * 0.03;
    camera.position.y += ((1.6 - s.y * 1.6) - camera.position.y) * 0.03;
    camera.lookAt(0, 0.8, 0);
    const targetFov = 42 + warpRef.current * 42 * k;
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

export default function SplashScene({ sealed = false, reduceMotion = false, onPainted }) {
  const warpRef = useRef(0);
  const easeRef = useRef(0);
  const frameRef = useRef(0);
  const sealedRef = useRef(sealed);
  sealedRef.current = sealed;

  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      const p = e.touches ? e.touches[0] : e;
      pointerRef.current.x = p.clientX / window.innerWidth - 0.5;
      pointerRef.current.y = p.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 13], fov: 42, near: 0.1, far: 400 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[GROUND]} />
      <fogExp2 attach="fog" args={[GROUND, 0.026]} />

      <ambientLight intensity={1.0} color="#181c24" />
      <directionalLight position={[-8, 9, 5]} intensity={0.7} color={BLUE} />

      <SceneBoundary>
        <Monolith reduceMotion={reduceMotion} warpRef={warpRef} pointerRef={pointerRef} />
        <Shafts reduceMotion={reduceMotion} easeRef={easeRef} warpRef={warpRef} pointerRef={pointerRef} />
        <DebrisField reduceMotion={reduceMotion} />
        <LensingRings reduceMotion={reduceMotion} pointerRef={pointerRef} />
        <Lattice reduceMotion={reduceMotion} />
        <Embers reduceMotion={reduceMotion} />
        <Starfield reduceMotion={reduceMotion} />
        <Rig
          reduceMotion={reduceMotion}
          warpRef={warpRef}
          easeRef={easeRef}
          frameRef={frameRef}
          onPainted={onPainted}
          pointerRef={pointerRef}
          sealedRef={sealedRef}
        />

        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.62} luminanceSmoothing={0.28} mipmapBlur />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.24} darkness={0.62} />
        </EffectComposer>
      </SceneBoundary>
    </Canvas>
  );
}
