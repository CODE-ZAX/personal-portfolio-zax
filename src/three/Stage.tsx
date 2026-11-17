import { View } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { setSceneView, type SceneViewProps } from "./bridge";

const cedar = "#c9844a";
const cedarHot = "#e7b184";
const silver = "#d9d3cb";
const graphite = "#141311";
const warm = "#c8c3bc";
const frost = "#f3f0ea";

function Backdrop({ color }: { color: string }) {
  return (
    <mesh position={[0, 0, -1.6]} frustumCulled={false}>
      <planeGeometry args={[14, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.72} />
      <directionalLight position={[3.2, 4.2, 5]} intensity={1.35} />
      <pointLight position={[-2.2, 1.2, 2.4]} intensity={0.55} color={cedarHot} />
    </>
  );
}

function Drift({
  children,
  speed = 0.7,
  amp = 0.08,
  spin = 0.12,
}: {
  children: ReactNode;
  speed?: number;
  amp?: number;
  spin?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group) return;
    const t = clock.elapsedTime;
    group.position.y = Math.sin(t * speed) * amp;
    group.rotation.y = Math.sin(t * speed * 0.45) * spin;
    group.rotation.z = Math.sin(t * speed * 0.3) * spin * 0.35;
  });
  return <group ref={ref}>{children}</group>;
}

function Bubble({
  position,
  scale = 1,
  color,
  phase,
  emissive = 0,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
  phase: number;
  emissive?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group) return;
    const t = clock.elapsedTime;
    group.position.set(
      position[0] + Math.sin(t * 0.45 + phase) * 0.08,
      position[1] + Math.sin(t * 0.7 + phase) * 0.1,
      position[2],
    );
    group.rotation.z = Math.sin(t * 0.4 + phase) * 0.14;
    group.rotation.y = Math.sin(t * 0.28 + phase) * 0.35;
  });
  return (
    <group ref={ref} scale={scale}>
      <mesh>
        <sphereGeometry args={[1, 28, 18]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.38}
          metalness={0.04}
          transparent
          opacity={0.92}
          clearcoat={0.85}
          clearcoatRoughness={0.32}
          emissive={cedar}
          emissiveIntensity={emissive}
        />
      </mesh>
      <mesh position={[0.35, -0.78, 0.15]} rotation={[0.2, 0.2, -0.7]}>
        <coneGeometry args={[0.32, 0.46, 5]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.38}
          metalness={0.04}
          transparent
          opacity={0.92}
          clearcoat={0.7}
          emissive={cedar}
          emissiveIntensity={emissive}
        />
      </mesh>
    </group>
  );
}

function WaveBars({ count = 26, width = 1.7, color = silver }: { count?: number; width?: number; color?: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    for (let index = 0; index < count; index += 1) {
      const u = index / (count - 1);
      const envelope = Math.sin(u * Math.PI);
      const h = 0.12 + Math.abs(Math.sin(u * 16 + t * 5.5)) * envelope * 0.95;
      dummy.position.set((u - 0.5) * width, 0, 0);
      dummy.scale.set(0.045, Math.max(0.08, h), 0.045);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color, toneMapped: false }), [color]);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  return <instancedMesh ref={ref} args={[geometry, material, count]} />;
}

function HeroThreads() {
  const total = 14;
  const points = 42;
  const mouse = useRef(new THREE.Vector2(0.72, 0.46));
  const scroll = useRef(0);
  const geos = useMemo(
    () =>
      Array.from({ length: total }, () => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(points * 3), 3));
        geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(points * 3), 3));
        return geo;
      }),
    [],
  );
  const lines = useMemo(
    () => geos.map((geo) => new THREE.Line(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.92 }))),
    [geos],
  );

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mouse.current.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      lines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
    };
  }, [lines]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const mx = mouse.current.x - 0.5;
    const my = mouse.current.y - 0.5;
    geos.forEach((geo, index) => {
      const n = index / (total - 1);
      const position = geo.getAttribute("position");
      const color = geo.getAttribute("color");
      for (let point = 0; point < points; point += 1) {
        const u = point / (points - 1);
        const x = (u - 0.5) * 7.4;
        const y =
          (n - 0.5) * 3.15 +
          Math.sin(u * (2.6 + n * 5.4) + t * (0.32 + n * 0.18) + index) * (0.16 + n * 0.1) +
          Math.sin(u * 10.5 - t * 0.22 + index) * 0.045 +
          my * 0.28 * Math.sin(u * 3.1 + index) +
          scroll.current * 0.35 * (n - 0.5);
        const z = Math.sin(u * 3.4 + t * 0.28 + index) * 0.42 + mx * (0.15 + n * 0.2);
        position.setXYZ(point, x, y, z);
        const cedarMix = Math.min(1, Math.max(0, (x + 0.4) / 2.4));
        color.setXYZ(
          point,
          0.78 * (1 - cedarMix) + 0.86 * cedarMix,
          0.8 * (1 - cedarMix) + 0.52 * cedarMix,
          0.82 * (1 - cedarMix) + 0.3 * cedarMix,
        );
      }
      position.needsUpdate = true;
      color.needsUpdate = true;
    });
  });

  return (
    <group>
      {lines.map((line, index) => (
        <primitive key={index} object={line} />
      ))}
    </group>
  );
}

function DottedRing({ radius, speed, color, tilt }: { radius: number; speed: number; color: string; tilt: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const count = 56;
    const data = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2;
      data[index * 3] = Math.cos(angle) * radius;
      data[index * 3 + 1] = 0;
      data[index * 3 + 2] = Math.sin(angle) * radius;
    }
    return data;
  }, [radius]);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return (
    <group ref={ref} rotation={tilt}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.045} toneMapped={false} />
      </points>
    </group>
  );
}

function Jarvis() {
  const core = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (core.current) core.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.1) * 0.12);
  });
  return (
    <Drift amp={0.1} speed={0.55} spin={0.18}>
      <mesh>
        <sphereGeometry args={[1.15, 40, 28]} />
        <meshStandardMaterial color="#2a2622" roughness={0.86} metalness={0.08} />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[0.28, 24, 16]} />
        <meshBasicMaterial color={cedarHot} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.16, 0.028, 12, 64]} />
        <meshStandardMaterial color={cedar} roughness={0.4} metalness={0.2} emissive={cedar} emissiveIntensity={0.35} />
      </mesh>
      <DottedRing radius={1.28} speed={0.35} color={silver} tilt={[0.4, 0, 0.2]} />
      <DottedRing radius={1.42} speed={-0.22} color={cedarHot} tilt={[1.1, 0.2, 0]} />
      <DottedRing radius={1.05} speed={0.5} color="#8d837a" tilt={[1.7, 0.4, 0.3]} />
    </Drift>
  );
}

function Chatli() {
  return (
    <>
      <Backdrop color={warm} />
      <Lights />
      <Bubble position={[-0.85, 0.7, -0.4]} scale={0.62} color={frost} phase={0.2} />
      <Bubble position={[0.9, 0.55, -0.2]} scale={0.5} color="#e7e2dc" phase={1.4} />
      <Bubble position={[-0.7, -0.75, 0.1]} scale={0.58} color={frost} phase={2.1} />
      <Bubble position={[0.85, -0.7, 0]} scale={0.48} color="#ddd8d2" phase={2.8} />
      <Bubble position={[0.05, 0.05, 0.45]} scale={0.78} color={cedarHot} phase={0.6} emissive={0.18} />
    </>
  );
}

function Interviewee() {
  return (
    <>
      <Backdrop color={graphite} />
      <Lights />
      <Bubble position={[-1.15, 0.05, 0]} scale={0.72} color="#b7b1aa" phase={0.4} emissive={0.12} />
      <Bubble position={[1.15, -0.02, 0]} scale={0.72} color="#b7b1aa" phase={1.8} emissive={0.12} />
      <WaveBars />
    </>
  );
}

function Applix() {
  return (
    <>
      <Backdrop color={graphite} />
      <Lights />
      <Drift>
        <mesh>
          <boxGeometry args={[2.15, 2.55, 0.08]} />
          <meshStandardMaterial color="#3a342e" roughness={0.72} />
        </mesh>
        <mesh position={[-0.45, 0.9, 0.06]}>
          <boxGeometry args={[0.7, 0.08, 0.04]} />
          <meshStandardMaterial color={silver} />
        </mesh>
        <mesh position={[0, 0.35, 0.06]}>
          <boxGeometry args={[1.55, 0.22, 0.05]} />
          <meshStandardMaterial color={cedar} emissive={cedar} emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[-0.38, -0.15, 0.06]}>
          <boxGeometry args={[0.7, 0.22, 0.04]} />
          <meshStandardMaterial color="#1a1816" />
        </mesh>
        <mesh position={[0.4, -0.15, 0.06]}>
          <boxGeometry args={[0.7, 0.22, 0.04]} />
          <meshStandardMaterial color="#1a1816" />
        </mesh>
        <mesh position={[0, -0.65, 0.06]}>
          <boxGeometry args={[1.55, 0.18, 0.04]} />
          <meshStandardMaterial color="#1a1816" />
        </mesh>
      </Drift>
    </>
  );
}

function Bill() {
  return (
    <>
      <Backdrop color={graphite} />
      <Lights />
      <Drift speed={0.5} amp={0.06} spin={0.08}>
        <mesh>
          <boxGeometry args={[1.45, 2.5, 0.06]} />
          <meshStandardMaterial color="#3a342e" roughness={0.8} />
        </mesh>
        {[0.7, 0.45, 0.2].map((y) => (
          <mesh key={y} position={[0, y, 0.05]}>
            <boxGeometry args={[0.95, 0.045, 0.02]} />
            <meshStandardMaterial color={silver} />
          </mesh>
        ))}
        <mesh position={[0, -0.35, 0.05]}>
          <boxGeometry args={[0.95, 0.22, 0.03]} />
          <meshStandardMaterial color={cedar} emissive={cedar} emissiveIntensity={0.3} />
        </mesh>
      </Drift>
    </>
  );
}

function Proposal() {
  const seal = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (seal.current) seal.current.rotation.z = clock.elapsedTime * 0.25;
  });
  return (
    <>
      <Backdrop color={graphite} />
      <Lights />
      <Drift spin={0.05}>
        <group rotation={[0.1, -0.25, -0.12]}>
          <mesh>
            <boxGeometry args={[1.7, 2.2, 0.05]} />
            <meshStandardMaterial color="#262320" roughness={0.75} />
          </mesh>
          <mesh ref={seal} position={[0.4, -0.55, 0.08]}>
            <torusGeometry args={[0.28, 0.05, 10, 32]} />
            <meshStandardMaterial color={cedar} emissive={cedar} emissiveIntensity={0.4} />
          </mesh>
        </group>
      </Drift>
    </>
  );
}

function Youtube() {
  return (
    <>
      <Backdrop color={graphite} />
      <Lights />
      <Drift>
        <mesh>
          <torusGeometry args={[1.15, 0.015, 8, 64]} />
          <meshBasicMaterial color={silver} transparent opacity={0.45} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.72, 0.05, 10, 48]} />
          <meshStandardMaterial color="#3a342e" />
        </mesh>
        <WaveBars count={22} width={2.6} />
      </Drift>
    </>
  );
}

function Xclipy() {
  return (
    <>
      <Backdrop color={graphite} />
      <Lights />
      <Drift spin={0.1}>
        {[
          [-0.28, -0.22, -0.2, "#2a2622", 0],
          [-0.08, 0, 0, "#322e2a", 0],
          [0.16, 0.22, 0.2, "#3a342e", 0.25],
        ].map(([x, y, z, color, glow]) => (
          <mesh key={`${x}`} position={[Number(x), Number(y), Number(z)]}>
            <boxGeometry args={[1.7, 1.15, 0.06]} />
            <meshStandardMaterial color={String(color)} emissive={cedar} emissiveIntensity={Number(glow)} />
          </mesh>
        ))}
      </Drift>
    </>
  );
}

function TidyDesk() {
  return (
    <>
      <Backdrop color={graphite} />
      <Lights />
      <Drift amp={0.04} spin={0.06}>
        {Array.from({ length: 12 }, (_, index) => {
          const col = index % 4;
          const row = Math.floor(index / 4);
          const cedarTile = index === 6;
          return (
            <mesh key={index} position={[-0.9 + col * 0.6, 0.55 - row * 0.55, cedarTile ? 0.15 : 0]}>
              <boxGeometry args={[0.38, 0.42, 0.06]} />
              <meshStandardMaterial color={cedarTile ? cedar : "#2c2824"} emissive={cedar} emissiveIntensity={cedarTile ? 0.3 : 0} />
            </mesh>
          );
        })}
      </Drift>
    </>
  );
}

function Subtitles() {
  return (
    <>
      <Backdrop color={graphite} />
      <Lights />
      <Drift>
        <mesh>
          <boxGeometry args={[2.6, 1.55, 0.05]} />
          <meshStandardMaterial color="#1c1a17" />
        </mesh>
        <mesh position={[-0.35, -0.85, 0.08]}>
          <boxGeometry args={[1.3, 0.22, 0.04]} />
          <meshStandardMaterial color="#2a2622" />
        </mesh>
        <mesh position={[0.85, -0.85, 0.1]}>
          <boxGeometry args={[0.7, 0.22, 0.05]} />
          <meshStandardMaterial color={cedar} emissive={cedar} emissiveIntensity={0.35} />
        </mesh>
      </Drift>
    </>
  );
}

function Insiders() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.z = clock.elapsedTime * 0.12;
  });
  const nodes: [number, number, number][] = [
    [-1.1, 0.7, 0],
    [1.05, 0.75, 0.1],
    [-1.2, -0.45, 0],
    [1.2, -0.2, 0],
    [-0.35, -1.05, 0],
    [0.55, -1.05, 0.1],
  ];
  return (
    <>
      <Backdrop color={graphite} />
      <Lights />
      <group ref={group}>
        {nodes.map((position, index) => (
          <mesh key={index} position={position}>
            <sphereGeometry args={[0.16, 16, 12]} />
            <meshStandardMaterial color="#2a2622" />
          </mesh>
        ))}
      </group>
      <mesh>
        <sphereGeometry args={[0.38, 24, 16]} />
        <meshStandardMaterial color={cedar} emissive={cedar} emissiveIntensity={0.45} />
      </mesh>
    </>
  );
}

const scenes: Record<string, () => ReactNode> = {
  hero: () => (
    <>
      <Backdrop color={graphite} />
      <HeroThreads />
    </>
  ),
  jarvis: Jarvis,
  chatli: Chatli,
  interviewee: Interviewee,
  applix: Applix,
  bill: Bill,
  proposal: Proposal,
  youtube: Youtube,
  xclipy: Xclipy,
  tidydesk: TidyDesk,
  subtitles: Subtitles,
  insiders: Insiders,
};

function AimCamera({ kind }: { kind: string }) {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    camera.position.set(0, 0, kind === "hero" ? 5.2 : 3.35);
    camera.fov = kind === "hero" ? 46 : 38;
    camera.updateProjectionMatrix();
  }, [camera, kind]);
  return null;
}

function SceneSwitch({ kind }: { kind: string }) {
  const Scene = scenes[kind] ?? scenes.applix;
  return (
    <>
      <AimCamera kind={kind} />
      <Scene />
    </>
  );
}

let viewIndex = 1;

export function SceneView({ kind, className }: SceneViewProps) {
  const [index] = useState(() => viewIndex++);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!(node instanceof Element)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <View ref={ref} className={className} index={index} visible={visible}>
      {visible ? <SceneSwitch kind={kind} /> : null}
    </View>
  );
}

export function Stage() {
  const [hidden, setHidden] = useState(() => document.hidden);

  useEffect(() => {
    setSceneView(SceneView);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      setSceneView(null);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 h-[100dvh] w-screen">
      <Canvas
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        dpr={[1, 1.5]}
        frameloop={hidden ? "never" : "always"}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <View.Port />
      </Canvas>
    </div>
  );
}
