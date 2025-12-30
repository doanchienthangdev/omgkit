---
name: threejs
description: Three.js 3D graphics. Use for 3D scenes, WebGL, animations.
---

# Three.js Skill

## Basic Setup
```javascript
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
```

## React Three Fiber
```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Scene() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
```

## Animation
```tsx
import { useFrame } from '@react-three/fiber';

function Box() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta;
  });

  return <mesh ref={ref}>...</mesh>;
}
```

## Best Practices
- Use React Three Fiber for React
- Dispose resources
- Optimize draw calls
- Use instances for repeated objects
