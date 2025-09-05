// IFCViewer.js
import React, { useEffect, useRef } from 'react';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const IFC = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(8, 13, 15);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // IFC Loader
    const ifcLoader = new IFCLoader();
    ifcLoader.ifcManager.setWasmPath("https://unpkg.com/web-ifc@0.0.42/");

    const loadIFC = async () => {
      const model = await ifcLoader.loadAsync('/models/sample.ifc'); // put your IFC file here
      scene.add(model);
    };

    loadIFC();

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default IFC;
