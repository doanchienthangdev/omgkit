---
name: building-3d-graphics
description: Claude builds immersive 3D web experiences with Three.js and React Three Fiber. Use when creating WebGL scenes, 3D animations, shaders, or physics simulations.
---

# Building 3D Graphics

## Quick Start

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

export function Scene() {
  return (
    <Canvas shadows camera={{ position: [5, 3, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} castShadow />
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4ecdc4" />
      </mesh>
      <OrbitControls enableDamping />
      <Environment preset="city" />
    </Canvas>
  );
}
```

## Features

| Feature | Description | Guide |
|---------|-------------|-------|
| Scene Management | Renderer, camera, controls setup with proper disposal | `ref/scene-manager.md` |
| React Three Fiber | Declarative 3D with React components and hooks | `ref/r3f-patterns.md` |
| Custom Shaders | GLSL vertex/fragment shaders with uniforms | `ref/shader-materials.md` |
| Physics | Rapier physics with rigid bodies and colliders | `ref/physics-system.md` |
| Animation | GSAP and Three.js animation mixer integration | `ref/animation.md` |
| Performance | LOD, instancing, frustum culling, texture optimization | `ref/optimization.md` |

## Common Patterns

### Animated Component with Interaction

```tsx
function AnimatedBox({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      const scale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#ff6b6b' : '#4ecdc4'} />
    </mesh>
  );
}
```

### Instanced Mesh for Performance

```tsx
function InstancedBoxes({ count = 1000 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const temp = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      temp.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      temp.updateMatrix();
      meshRef.current?.setMatrixAt(i, temp.matrix);
    }
    meshRef.current!.instanceMatrix.needsUpdate = true;
  }, [count, temp]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
```

### Custom Shader Material

```tsx
const GradientMaterial = shaderMaterial(
  { uTime: 0, uColorA: new THREE.Color('#ff6b6b'), uColorB: new THREE.Color('#4ecdc4') },
  // Vertex shader
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  // Fragment shader
  `uniform float uTime;
   uniform vec3 uColorA;
   uniform vec3 uColorB;
   varying vec2 vUv;
   void main() {
     vec3 color = mix(uColorA, uColorB, vUv.y + sin(uTime) * 0.1);
     gl_FragColor = vec4(color, 1.0);
   }`
);
extend({ GradientMaterial });
```

## Best Practices

| Do | Avoid |
|----|-------|
| Use React Three Fiber for React apps | Creating geometries/materials in render loops |
| Dispose geometries, materials, textures on unmount | Too many dynamic lights (limit to 3-4) |
| Use instancing for many identical objects | Skipping frustum culling in large scenes |
| Implement LOD for complex scenes | Uncompressed high-resolution textures |
| Cap pixel ratio at 2: `Math.min(window.devicePixelRatio, 2)` | Transparent materials unless necessary |
| Use compressed textures (KTX2, Basis) | Forgetting to update instanceMatrix after changes |
