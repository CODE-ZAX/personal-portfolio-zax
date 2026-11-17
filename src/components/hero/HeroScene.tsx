import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    vec3 col = vec3(0.078, 0.075, 0.071);
    vec3 silver = vec3(0.78, 0.80, 0.82);
    vec3 cedar = vec3(0.84, 0.54, 0.31);
    vec2 delta = uv - uMouse;
    float influence = exp(-5.5 * dot(delta, delta));

    for (float i = 0.0; i < 24.0; i += 1.0) {
      float n = i / 23.0;
      float amp = 0.02 + n * 0.018;
      float freq = 2.4 + n * 4.8;
      float y = 0.06 + n * 0.88;
      y += sin(uv.x * freq + t * (0.22 + n * 0.14) + i * 0.55) * amp;
      y += sin(uv.x * freq * 1.8 - t * 0.15 + i) * amp * 0.28;
      y += (uScroll - 0.12) * 0.1 * (n - 0.5);
      y += (uMouse.y - 0.5) * 0.045 * sin(uv.x * 3.1 + i);
      y += (uMouse.x - 0.5) * 0.02 * n;
      float dist = abs(uv.y - y);
      float line = smoothstep(0.0026, 0.0, dist);
      float cedarAmt = influence * smoothstep(0.55, 0.95, uv.x) * (0.35 + 0.65 * n);
      vec3 tone = mix(silver, cedar, clamp(cedarAmt, 0.0, 1.0));
      float edge = smoothstep(0.0, 0.04, uv.x) * smoothstep(1.0, 0.92, uv.x);
      col += tone * line * (0.55 + n * 0.45) * edge;
    }

    float vignette = smoothstep(1.2, 0.32, length(uv - vec2(0.52, 0.48)));
    col *= mix(0.42, 1.0, vignette);
    gl_FragColor = vec4(col, 1.0);
  }
`;

type SceneProps = {
  mouse: RefObject<THREE.Vector2>;
  scroll: RefObject<number>;
  hidden: RefObject<boolean>;
};

const FlowField = memo(function FlowField({ mouse, scroll, hidden }: SceneProps) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.68, 0.46) },
      uScroll: { value: 0 },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (hidden.current) return;
    uniforms.uTime.value += Math.min(delta, 0.05);
    uniforms.uMouse.value.lerp(mouse.current, 0.08);
    uniforms.uScroll.value += (scroll.current - uniforms.uScroll.value) * 0.08;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
});

const ParticleField = memo(function ParticleField({
  count,
  mouse,
  scroll,
  hidden,
}: SceneProps & { count: number }) {
  const points = useRef<THREE.Points>(null);
  const base = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      data[index * 3] = (Math.random() - 0.5) * 7.2;
      data[index * 3 + 1] = (Math.random() - 0.5) * 4.2;
      data[index * 3 + 2] = (Math.random() - 0.5) * 1.4;
    }
    return data;
  }, [count]);
  const positions = useMemo(() => new Float32Array(base), [base]);

  useFrame(({ clock }) => {
    const mesh = points.current;
    if (!mesh || hidden.current) return;
    const attribute = mesh.geometry.getAttribute("position");
    const time = clock.getElapsedTime();
    const mx = (mouse.current.x - 0.5) * 6.2;
    const my = (mouse.current.y - 0.5) * 3.4;
    const drift = scroll.current * 0.55;
    for (let index = 0; index < count; index += 1) {
      const i3 = index * 3;
      const bx = base[i3];
      const by = base[i3 + 1];
      const dx = bx - mx;
      const dy = by - my;
      const dist = Math.hypot(dx, dy) + 0.001;
      const push = Math.min(0.42, 0.55 / dist);
      attribute.setXYZ(index, bx + dx * push * 0.22, by + dy * push * 0.22 + Math.sin(time * 0.6 + index) * 0.03 - drift, base[i3 + 2]);
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e4ddd4" size={0.018} transparent opacity={0.55} depthWrite={false} toneMapped={false} sizeAttenuation />
    </points>
  );
});

export function HeroScene({ count }: { count: number }) {
  const mouse = useRef(new THREE.Vector2(0.68, 0.46));
  const scroll = useRef(0);
  const hidden = useRef(false);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mouse.current.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    const onVisibility = () => {
      hidden.current = document.hidden;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 48 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x141311, 0);
      }}
    >
      <FlowField mouse={mouse} scroll={scroll} hidden={hidden} />
      <ParticleField count={count} mouse={mouse} scroll={scroll} hidden={hidden} />
    </Canvas>
  );
}
