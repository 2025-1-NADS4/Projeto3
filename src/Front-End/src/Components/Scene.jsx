import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'

function Scene() {
  return (
    <Canvas>
      {/* Renderizando um cubo 3D */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Conteúdo HTML sobre a cena 3D */}
      <Html position={[0, 1.5, 0]}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '10px' }}>
          <p>Texto sobre a cena 3D</p>
        </div>
      </Html>
    </Canvas>
  )
}

export default Scene

