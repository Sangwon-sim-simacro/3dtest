import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

import { useTemperatures } from '../TemperatureContext';

export function ModelColumn2Thermo() {
  const { nodes, materials } = useGLTF('./3D/Column2_Thermo/Column2_Thermo.gltf');

  // Use context temperatures
  const { temperatures } = useTemperatures();

  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const size = temperatures.length * 4; // Increase the size for smoother transitions
    canvas.width = 1;
    canvas.height = size;
    const context = canvas.getContext('2d');

    const sortedTemps = [...temperatures].sort((a, b) => a - b);
    const minTemp = sortedTemps[0];
    const maxTemp = sortedTemps[sortedTemps.length - 1];

    const segmentHeight = size / temperatures.length;

    const coldColor = '#008aff'; // Blue color
    const midColor = '#ffde00'; // Yellowcolor
    const hotColor = '#ff0000'; // Red color

    temperatures.forEach((temp, index) => {
      const normalizedTemp = (temp - minTemp) / (maxTemp - minTemp);
      let color;
      if (normalizedTemp < 0.5) {
        // Interpolate between blue and orange for the first half of the temperatures
        color = new THREE.Color().lerpColors(
          new THREE.Color(coldColor), // blue
          new THREE.Color(midColor), // orange
          normalizedTemp * 2 // Double the normalizedTemp to map it from [0, 0.5] to [0, 1]
        );
      } else {
        // Interpolate between orange and red for the second half of the temperatures
        color = new THREE.Color().lerpColors(
          new THREE.Color(midColor), // orange
          new THREE.Color(hotColor), // red
          (normalizedTemp - 0.5) * 2 // Subtract 0.5 from normalizedTemp to map it from [0.5, 1] to [0, 1]
        );
      }

      // Create a gradient for each segment
      const gradient = context.createLinearGradient(0, index * segmentHeight, 0, (index + 1) * segmentHeight);
      gradient.addColorStop(0, `#${color.getHexString()}`);
      gradient.addColorStop(1, temperatures[index + 1] ? `#${new THREE.Color().lerpColors(
        new THREE.Color(normalizedTemp < 0.5 ? coldColor : midColor),
        new THREE.Color(normalizedTemp < 0.5 ? midColor : hotColor),
        ((temperatures[index + 1] - minTemp) / (maxTemp - minTemp) - (normalizedTemp < 0.5 ? 0 : 0.5)) * 2
      ).getHexString()}` : `#${color.getHexString()}`);

      context.fillStyle = gradient;
      context.fillRect(0, index * segmentHeight, 1, segmentHeight);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.wrapS = THREE.RepeatWrapping;

    return texture;
  }, [temperatures]);

  return (
    <group dispose={null} scale={0.2}>
      <mesh
        geometry={nodes.Thermo_1.geometry}
        position={[0, 24.08, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.752}>
        {temperatures.length > 0 ? (
          <meshStandardMaterial attach="material" map={gradientTexture} transparent opacity={0.85} />
        ) : (
          <primitive object={materials.Simacro_Shell_Thermo} attach="material" />
        )}
      </mesh>

    </group>
  );
}

useGLTF.preload('./3D/Column2_Thermo/Column2_Thermo.gltf');
