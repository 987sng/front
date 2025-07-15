// src/components/InteractiveDottedGlobe.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import worldGeoJSON from '../assets/world_countries.json';

function convertLatLonToSphereCoords(lat, lon, radius = 2.01) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

function CountryMesh({ feature, radius = 2.01 }) {
    const shapePoints = useMemo(() => {
        const coords = feature.geometry.coordinates;
        const allPoints = [];

        const convert = ([lon, lat]) => convertLatLonToSphereCoords(lat, lon, radius);

        if (feature.geometry.type === 'Polygon') {
            coords.forEach(ring => {
                const points = ring.map(convert);
                allPoints.push(points);
            });
        } else if (feature.geometry.type === 'MultiPolygon') {
            coords.forEach(polygon => {
                polygon.forEach(ring => {
                    const points = ring.map(convert);
                    allPoints.push(points);
                });
            });
        }

        return allPoints;
    }, [feature]);

    return shapePoints.map((points, idx) => (
        <line key={idx}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                    count={points.length}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="skyblue" />
        </line>
    ));
}

function DotSphere() {
    const ref = useRef();
    const positions = useMemo(() => {
        const positions = [];
        const radius = 2;
        const latSteps = 100;
        const lonSteps = 100;

        for (let i = 0; i <= latSteps; i++) {
            const lat = (i / latSteps) * Math.PI;
            const y = Math.cos(lat);
            const ringRadius = Math.sin(lat);
            const density = 1 + 2 * Math.sin(lat);

            for (let j = 0; j <= lonSteps * density; j++) {
                const lon = (j / (lonSteps * density)) * 2 * Math.PI;
                const x = ringRadius * Math.cos(lon);
                const z = ringRadius * Math.sin(lon);
                positions.push(x * radius, y * radius, z * radius);
            }
        }
        return new Float32Array(positions);
    }, []);

    useFrame(() => {
        if (ref.current) ref.current.rotation.y += 0.0002;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={positions}
                    count={positions.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#ffffff"
                size={0.015}
                sizeAttenuation
                transparent
                opacity={0.7}
            />
        </points>
    );
}

const InteractiveDottedGlobe = () => {
    return (
        <div style={{ width: '100%', height: '700px', position: 'relative' }}>
            <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.8} />
                <DotSphere />
                {worldGeoJSON.features.map((feature, idx) => (
                    <CountryMesh key={idx} feature={feature} />
                ))}
                <OrbitControls autoRotate enableZoom={true} enablePan={false} />
            </Canvas>
        </div>
    );
};

export default InteractiveDottedGlobe;
