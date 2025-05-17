import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

// Componente responsável pelo globo
const GlobeMesh = ({ origin, destination }) => {
    const globeRef = useRef();
    const texture = useTexture("https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg");

    // Animação de aproximação ao destino
    useEffect(() => {
        gsap.to(globeRef.current.position, {
            z: 1.5, // Aproximação
            duration: 3,
            ease: "power2.out",
        });

        gsap.to(globeRef.current.rotation, {
            x: -destination.lat * (Math.PI / 180),
            y: destination.lon * (Math.PI / 180),
            duration: 3,
            ease: "power2.out",
        });
    }, [destination]);

    return (
        <mesh ref={globeRef} rotation={[0, 0, 0]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
};

// Componente principal do globo
const Globe = ({ origin, destination }) => {
    return (
        <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Stars radius={100} depth={50} count={5000} factor={4} />
            <GlobeMesh origin={origin} destination={destination} />
            <OrbitControls enableZoom={true} />
        </Canvas>
    );
};

export default Globe;