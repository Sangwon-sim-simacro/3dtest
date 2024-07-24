import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows } from '@react-three/drei';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { LeftMenu } from './components/Controls';

import { TemperatureProvider } from './components/TemperatureContext';
import { ModelColumn2 } from './components/modelComponents/Column2_61Stages';
import { ModelColumn2Thermo } from './components/modelComponents/Column2_Thermo';


function App() {
  const [isLoading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState();
  const [isTransparent, updateTransparent] = useState(false);
  const [isWire, updateWire] = useState(false);

  const controlsRef = useRef();

  const gridConfig = {
    cellSize: 1,
    cellThickness: 1,
    cellColor: '#3b3b3b',
    sectionSize: 10,
    sectionThickness: 1,
    sectionColor: '#e62424',
    fadeDistance: 100,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true
  }

  useEffect(() => {
    const loader = new GLTFLoader();

    const GltfModels = [
      './3D/Column2_61Stages/Column2_61Stages.gltf',
      './3D/Column2_Thermo/Column2_Thermo.gltf',
    ]
    const loadModelPromises = GltfModels.map(pathForGltf => {
      return loader.loadAsync(pathForGltf)
        .then(response => {
          response.parser.json.meshes.map(meshGroup => {
            setLoadingMessage(`Loading ${meshGroup.name}...`);
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    });

    Promise.all(loadModelPromises).then(() => {
      setLoading(false);
    });
  }, []);

  // const [visibility, setVisibility] = useState({
  //   '01': true,
  //   '02': true,
  //   '03': true,
  //   '04': true,
  //   '05': true,
  //   '06': true,
  //   '07': true,
  // });

  // const handleVisibility = (buttonName) => {
  //   setVisibility((prevVisibility) => {
  //     const areAllButtonsPressed = Object.values(prevVisibility).every((value) => value === true);
  //     const updatedVisibility = {};
  //
  //     if (areAllButtonsPressed) {
  //       // Hide all meshes on the first interaction
  //       Object.keys(prevVisibility).forEach((key) => {
  //         updatedVisibility[key] = key === buttonName;
  //       })
  //
  //     } else {
  //       // Toggle the visibility of the corresponding mesh without affecting others
  //       Object.keys(prevVisibility).forEach((key) => {
  //         updatedVisibility[key] = key === buttonName ? !prevVisibility[key] : prevVisibility[key];
  //       });
  //     }
  //
  //     return updatedVisibility;
  //   });
  // };

  return (
    <>
      <TemperatureProvider>
        {isLoading ? (
          <>
            <div className='loader'>
            </div>
            <span className="loadingMessage">{loadingMessage}</span>
          </>
        ) : (
          <Canvas shadows camera={{ fov: 45, position: [0, 15, 30] }} style={{ width: '100vw', height: '100vh' }}>
            <OrbitControls ref={controlsRef} target={[0, 5, 0]} minPolarAngle={0} maxPolarAngle={Math.PI / 1.9} makeDefault zoomToCursor={true} />
            {/*<Environment files='./images/environment.hdr' background blur={0.5} />*/}
            <ContactShadows position={[0, -0.4, 0]} opacity={1} scale={50} blur={0.2} far={3} resolution={256} color="#000000" />
            <ModelColumn2 />
            {/*<ModelColumn2Thermo />*/}
            <Grid position={[0, -0.3, 0]} args={[10.5, 10.5]} {...gridConfig} />
          </Canvas>
        )}
        <LeftMenu />
      </TemperatureProvider>
    </>
  );
}

export default App;
